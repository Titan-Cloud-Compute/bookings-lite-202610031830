import { ConflictException, Injectable, Logger, NotFoundException, Optional } from '@nestjs/common';
import { AuditActor, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { MailerService } from '../../auth/mailer.service';
import { AuditService } from '../../audit/audit.service';
import { AvailabilityService } from '../availability/availability.service';
import { BookAppointmentDto, SLOT_UNAVAILABLE } from './appointments.schema';

export interface SlotView {
  startsAt: string;
  endsAt: string;
}

export interface AppointmentView {
  id: string;
  serviceId: string;
  customerId: string;
  providerId: string;
  startsAt: Date;
  endsAt: Date;
  status: string;
  createdAt: Date;
}

/**
 * Default bookable window (UTC) used until the set-availability card (38eb0ae0)
 * lands provider availability tables. Slots are generated from the service's
 * durationMinutes inside this window.
 */
export const DAY_START_HOUR_UTC = 9;
export const DAY_END_HOUR_UTC = 17;

const BOOKED = 'BOOKED';

function slotUnavailable(): ConflictException {
  return new ConflictException({
    code: SLOT_UNAVAILABLE,
    error: SLOT_UNAVAILABLE,
    message: 'That time slot is no longer available. Please pick another slot.',
  });
}

/** All candidate slots for `day` (YYYY-MM-DD, UTC) at `durationMinutes` steps. */
export function generateSlots(day: string, durationMinutes: number): SlotView[] {
  const start = Date.parse(`${day}T${String(DAY_START_HOUR_UTC).padStart(2, '0')}:00:00.000Z`);
  const end = Date.parse(`${day}T${String(DAY_END_HOUR_UTC).padStart(2, '0')}:00:00.000Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || durationMinutes <= 0) return [];
  const step = durationMinutes * 60_000;
  const slots: SlotView[] = [];
  for (let t = start; t + step <= end; t += step) {
    slots.push({ startsAt: new Date(t).toISOString(), endsAt: new Date(t + step).toISOString() });
  }
  return slots;
}

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger('AppointmentsService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
    private readonly audit: AuditService,
    @Optional() private readonly availability?: AvailabilityService,
  ) {}

  /**
   * Candidate slots for the day: the provider's real availability (windows minus
   * blocks, from the set-availability card). Falls back to the default
   * DAY_START/END grid only when the provider has no availability windows at all.
   */
  private async candidateSlots(service: { id: string; providerId: string; durationMinutes: number }, day: string): Promise<SlotView[]> {
    if (this.availability) {
      const windowCount = await this.prisma.availabilityWindow.count({ where: { providerId: service.providerId } });
      if (windowCount > 0) {
        const slots = await this.availability.slots(service.id, day);
        return slots.map((s) => ({ startsAt: s.startsAt, endsAt: s.endsAt }));
      }
    }
    return generateSlots(day, service.durationMinutes);
  }

  private async activeService(serviceId: string) {
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || !service.active) throw new NotFoundException('service not found');
    return service;
  }

  async availableSlots(serviceId: string, day: string, now: Date = new Date()): Promise<SlotView[]> {
    const service = await this.activeService(serviceId);
    const candidates = await this.candidateSlots(service, day);
    if (candidates.length === 0) return [];
    const dayStart = new Date(Math.min(...candidates.map((c) => Date.parse(c.startsAt))));
    const dayEnd = new Date(Math.max(...candidates.map((c) => Date.parse(c.endsAt))));
    const booked = await this.prisma.appointment.findMany({
      where: { providerId: service.providerId, status: BOOKED, startsAt: { lt: dayEnd }, endsAt: { gt: dayStart } },
      select: { startsAt: true, endsAt: true },
    });
    return candidates.filter((slot) => {
      const s = Date.parse(slot.startsAt);
      const e = Date.parse(slot.endsAt);
      if (s <= now.getTime()) return false;
      return !booked.some((b) => b.startsAt.getTime() < e && b.endsAt.getTime() > s);
    });
  }

  async book(customerId: string, dto: BookAppointmentDto, now: Date = new Date()): Promise<AppointmentView> {
    const service = await this.activeService(dto.serviceId);
    const startsAt = dto.startsAt;
    const day = startsAt.toISOString().slice(0, 10);
    const isSlot = (await this.candidateSlots(service, day)).some((s) => Date.parse(s.startsAt) === startsAt.getTime());
    if (!isSlot || startsAt.getTime() <= now.getTime()) throw slotUnavailable();
    const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60_000);

    let appointment: AppointmentView;
    try {
      appointment = await this.prisma.$transaction(async (tx) => {
        const clash = await tx.appointment.findFirst({
          where: { providerId: service.providerId, status: BOOKED, startsAt: { lt: endsAt }, endsAt: { gt: startsAt } },
          select: { id: true },
        });
        if (clash) throw slotUnavailable();
        return tx.appointment.create({
          data: { serviceId: service.id, customerId, providerId: service.providerId, startsAt, endsAt, status: BOOKED },
        });
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw slotUnavailable();
      throw err;
    }

    await this.notify(appointment, service.name);
    return appointment;
  }

  listMine(customerId: string): Promise<AppointmentView[]> {
    return this.prisma.appointment.findMany({
      where: { customerId },
      orderBy: { startsAt: 'asc' },
    });
  }

  /** Notify customer and provider; never fails the booking. */
  private async notify(appt: AppointmentView, serviceName: string): Promise<void> {
    try {
      const users = await this.prisma.user.findMany({
        where: { id: { in: [appt.customerId, appt.providerId] } },
        select: { id: true, email: true },
      });
      const when = appt.startsAt.toISOString();
      const customer = users.find((u) => u.id === appt.customerId);
      const provider = users.find((u) => u.id === appt.providerId);
      if (customer) {
        await this.mailer.sendNotification(customer.email, 'Appointment confirmed', `Your ${serviceName} appointment is booked for ${when}.`);
      }
      if (provider) {
        await this.mailer.sendNotification(provider.email, 'New appointment', `A customer booked ${serviceName} for ${when}.`);
      }
      await this.audit.record({
        actor: AuditActor.USER,
        actorUserId: appt.customerId,
        action: 'appointment.booked',
        payload: { appointmentId: appt.id, serviceId: appt.serviceId, providerId: appt.providerId, startsAt: when },
      });
    } catch (err) {
      this.logger.warn(`booking notification failed for ${appt.id}: ${(err as Error).message}`);
    }
  }
}
