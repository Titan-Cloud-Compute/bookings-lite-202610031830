import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { MailerService } from '../../auth/mailer.service';

export const REMINDER_KIND = '24H';
export const REMINDER_LEAD_MS = 24 * 60 * 60 * 1000;
export const REMINDER_POLL_MS = 60 * 1000;
/** Slots are spaced by service duration, so the nearest slot to "24h out" can start a bit later. */
export const REMINDER_GRACE_MS = 60 * 60 * 1000;
export const REMINDER_SUBJECT = 'Appointment reminder';

export interface ReminderView {
  id: string;
  appointmentId: string;
  kind: string;
  subject: string;
  message: string;
  serviceName: string;
  providerName: string;
  startsAt: Date;
  sentAt: Date;
}

/**
 * Story: reminder-notifications. Once a minute, finds BOOKED appointments that
 * start within the next 24 hours and have not been reminded yet, records the
 * reminder (unique per appointment+kind) and notifies the customer.
 */
@Injectable()
export class RemindersService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('RemindersService');
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
  ) {}

  onModuleInit(): void {
    if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) return;
    this.timer = setInterval(() => void this.poll(), REMINDER_POLL_MS);
    this.timer.unref?.();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private async poll(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      await this.sendDueReminders(new Date());
    } catch (err) {
      this.logger.warn(`reminder scan failed: ${(err as Error).message}`);
    } finally {
      this.running = false;
    }
  }

  /** Send every due reminder as of `now`. Returns the number sent. */
  async sendDueReminders(now: Date, customerId?: string): Promise<number> {
    const horizon = new Date(now.getTime() + REMINDER_LEAD_MS + REMINDER_GRACE_MS);
    const due = await this.prisma.appointment.findMany({
      where: {
        status: 'BOOKED',
        startsAt: { gt: now, lte: horizon },
        ...(customerId ? { customerId } : {}),
      },
      orderBy: { startsAt: 'asc' },
    });
    if (due.length === 0) return 0;

    const already = await this.prisma.appointmentReminder.findMany({
      where: { appointmentId: { in: due.map((a) => a.id) }, kind: REMINDER_KIND },
      select: { appointmentId: true },
    });
    const done = new Set(already.map((r) => r.appointmentId));
    const pending = due.filter((a) => !done.has(a.id));
    if (pending.length === 0) return 0;

    const services = await this.prisma.service.findMany({
      where: { id: { in: [...new Set(pending.map((a) => a.serviceId))] } },
      select: { id: true, name: true },
    });
    const users = await this.prisma.user.findMany({
      where: { id: { in: [...new Set(pending.flatMap((a) => [a.customerId, a.providerId]))] } },
      select: { id: true, email: true, name: true },
    });

    let sent = 0;
    for (const appt of pending) {
      const customer = users.find((u) => u.id === appt.customerId);
      if (!customer) continue;
      const provider = users.find((u) => u.id === appt.providerId);
      const serviceName = services.find((s) => s.id === appt.serviceId)?.name ?? 'your service';
      const providerName = provider?.name || provider?.email || 'your provider';
      const when = appt.startsAt.toISOString();
      const message = `Reminder: your ${serviceName} appointment with ${providerName} is on ${when.slice(0, 10)} at ${when.slice(11, 16)} UTC.`;
      try {
        await this.prisma.appointmentReminder.create({
          data: {
            appointmentId: appt.id,
            customerId: appt.customerId,
            kind: REMINDER_KIND,
            subject: REMINDER_SUBJECT,
            message,
            serviceName,
            providerName,
            startsAt: appt.startsAt,
            sentAt: now,
          },
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') continue;
        throw err;
      }
      try {
        await this.mailer.sendNotification(customer.email, REMINDER_SUBJECT, message);
      } catch (err) {
        this.logger.warn(`reminder email failed for ${appt.id}: ${(err as Error).message}`);
      }
      sent += 1;
    }
    return sent;
  }

  async listMine(customerId: string): Promise<ReminderView[]> {
    try {
      await this.sendDueReminders(new Date(), customerId);
    } catch (err) {
      this.logger.warn(`on-read reminder sweep failed: ${(err as Error).message}`);
    }
    return this.prisma.appointmentReminder.findMany({
      where: { customerId },
      orderBy: { sentAt: 'desc' },
      select: {
        id: true, appointmentId: true, kind: true, subject: true, message: true,
        serviceName: true, providerName: true, startsAt: true, sentAt: true,
      },
    });
  }
}
