import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AuditActor } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { MailerService } from '../../auth/mailer.service';
import { AuditService } from '../../audit/audit.service';
import { isLateCancellation } from './cancellation-policy';

export const CANCELLED = 'CANCELLED';
const BOOKED = 'BOOKED';

export interface CancellationView {
  appointmentId: string;
  status: string;
  late: boolean;
  cancelledAt: Date;
}

@Injectable()
export class CancellationsService {
  private readonly logger = new Logger('CancellationsService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Cancel the customer's own BOOKED appointment. Setting status CANCELLED frees
   * the slot (availability and clash checks only count BOOKED). Within 24h of the
   * start the late-cancellation policy applies: the cancellation is flagged late.
   */
  async cancel(customerId: string, appointmentId: string, now: Date = new Date()): Promise<CancellationView> {
    const appt = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appt || appt.customerId !== customerId) throw new NotFoundException('appointment not found');
    if (appt.status !== BOOKED) {
      throw new ConflictException({ code: 'NOT_CANCELLABLE', message: 'This appointment is not active and cannot be cancelled.' });
    }
    const late = isLateCancellation(appt.startsAt, now);

    const record = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.updateMany({
        where: { id: appt.id, customerId, status: BOOKED },
        data: { status: CANCELLED },
      });
      if (updated.count === 0) {
        throw new ConflictException({ code: 'NOT_CANCELLABLE', message: 'This appointment is not active and cannot be cancelled.' });
      }
      return tx.appointmentCancellation.create({
        data: { appointmentId: appt.id, cancelledById: customerId, late, cancelledAt: now },
      });
    });

    await this.notifyProvider(appt, late, customerId);
    return { appointmentId: appt.id, status: CANCELLED, late: record.late, cancelledAt: record.cancelledAt };
  }

  /** Notify the provider and audit; never fails the cancellation. */
  private async notifyProvider(
    appt: { id: string; serviceId: string; providerId: string; startsAt: Date },
    late: boolean,
    customerId: string,
  ): Promise<void> {
    const when = appt.startsAt.toISOString();
    try {
      const provider = await this.prisma.user.findUnique({ where: { id: appt.providerId }, select: { email: true } });
      if (provider) {
        const subject = late ? 'Late appointment cancellation' : 'Appointment cancelled';
        const body = late
          ? `A customer cancelled their appointment for ${when} less than 24 hours in advance (late cancellation). The slot is open again.`
          : `A customer cancelled their appointment for ${when}. The slot is open again.`;
        await this.mailer.sendNotification(provider.email, subject, body);
      }
      await this.audit.record({
        actor: AuditActor.USER,
        actorUserId: customerId,
        action: late ? 'appointment.cancelled_late' : 'appointment.cancelled',
        payload: { appointmentId: appt.id, serviceId: appt.serviceId, providerId: appt.providerId, startsAt: when, late },
      });
    } catch (err) {
      this.logger.warn(`cancellation notification failed for ${appt.id}: ${(err as Error).message}`);
    }
  }
}
