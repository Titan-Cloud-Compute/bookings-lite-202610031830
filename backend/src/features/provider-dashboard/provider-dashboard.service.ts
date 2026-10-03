import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface UpcomingAppointmentView {
  id: string;
  serviceId: string;
  serviceName: string | null;
  customerId: string;
  customerName: string | null;
  customerEmail: string | null;
  providerId: string;
  startsAt: Date;
  endsAt: Date;
  status: string;
}

const BOOKED = 'BOOKED';

/** Story: provider-dashboard — reads the book-appointment Appointment table (no schema change). */
@Injectable()
export class ProviderDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /** The provider's BOOKED appointments starting at/after `now`, soonest first. */
  async listUpcoming(providerId: string, now: Date = new Date()): Promise<UpcomingAppointmentView[]> {
    const rows = await this.prisma.appointment.findMany({
      where: { providerId, status: BOOKED, startsAt: { gte: now } },
      orderBy: { startsAt: 'asc' },
    });
    if (rows.length === 0) return [];
    const serviceIds = [...new Set(rows.map((r) => r.serviceId))];
    const customerIds = [...new Set(rows.map((r) => r.customerId))];
    const [services, customers] = await Promise.all([
      this.prisma.service.findMany({ where: { id: { in: serviceIds } }, select: { id: true, name: true } }),
      this.prisma.user.findMany({ where: { id: { in: customerIds } }, select: { id: true, name: true, email: true } }),
    ]);
    return rows
      .filter((r) => r.providerId === providerId && r.status === BOOKED && r.startsAt.getTime() >= now.getTime())
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
      .map((r) => {
        const svc = services.find((s) => s.id === r.serviceId);
        const cust = customers.find((c) => c.id === r.customerId);
        return {
          id: r.id,
          serviceId: r.serviceId,
          serviceName: svc?.name ?? null,
          customerId: r.customerId,
          customerName: cust?.name ?? null,
          customerEmail: cust?.email ?? null,
          providerId: r.providerId,
          startsAt: r.startsAt,
          endsAt: r.endsAt,
          status: r.status,
        };
      });
  }
}
