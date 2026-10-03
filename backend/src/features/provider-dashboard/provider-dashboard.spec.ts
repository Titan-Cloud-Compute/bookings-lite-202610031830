import type { Request } from 'express';
import { ProviderDashboardController } from './provider-dashboard.controller';
import { ProviderDashboardService } from './provider-dashboard.service';

const NOW = new Date('2999-01-10T00:00:00.000Z');
const at = (iso: string) => new Date(iso);

function makeDeps() {
  const appointments = [
    { id: 'late', serviceId: 'svc1', customerId: 'cust1', providerId: 'prov1', startsAt: at('2999-01-20T10:00:00.000Z'), endsAt: at('2999-01-20T11:00:00.000Z'), status: 'BOOKED' },
    { id: 'early', serviceId: 'svc1', customerId: 'cust2', providerId: 'prov1', startsAt: at('2999-01-11T09:00:00.000Z'), endsAt: at('2999-01-11T10:00:00.000Z'), status: 'BOOKED' },
    { id: 'mid', serviceId: 'svc2', customerId: 'cust1', providerId: 'prov1', startsAt: at('2999-01-15T14:00:00.000Z'), endsAt: at('2999-01-15T15:00:00.000Z'), status: 'BOOKED' },
    { id: 'past', serviceId: 'svc1', customerId: 'cust1', providerId: 'prov1', startsAt: at('2999-01-01T09:00:00.000Z'), endsAt: at('2999-01-01T10:00:00.000Z'), status: 'BOOKED' },
    { id: 'cancelled', serviceId: 'svc1', customerId: 'cust1', providerId: 'prov1', startsAt: at('2999-01-12T09:00:00.000Z'), endsAt: at('2999-01-12T10:00:00.000Z'), status: 'CANCELLED' },
    { id: 'other', serviceId: 'svc3', customerId: 'cust1', providerId: 'prov2', startsAt: at('2999-01-13T09:00:00.000Z'), endsAt: at('2999-01-13T10:00:00.000Z'), status: 'BOOKED' },
  ];
  const prisma: any = {
    appointment: {
      findMany: jest.fn(async ({ where }: any) =>
        appointments
          .filter((a) => a.providerId === where.providerId && a.status === where.status && a.startsAt >= where.startsAt.gte)
          .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())),
    },
    service: {
      findMany: jest.fn(async () => [
        { id: 'svc1', name: 'Haircut' },
        { id: 'svc2', name: 'Shave' },
      ]),
    },
    user: {
      findMany: jest.fn(async () => [
        { id: 'cust1', name: 'Alice', email: 'a@example.com' },
        { id: 'cust2', name: 'Bob', email: 'b@example.com' },
      ]),
    },
  };
  const service = new ProviderDashboardService(prisma);
  return { prisma, service, ctrl: new ProviderDashboardController(service) };
}

const reqFor = (userId: string) => ({ session: { userId, role: 'USER', firmId: null } }) as unknown as Request;

describe('provider-dashboard', () => {
  it('lists every upcoming appointment in chronological order, excluding past and cancelled', async () => {
    const { service } = makeDeps();
    const list = await service.listUpcoming('prov1', NOW);
    expect(list.map((a) => a.id)).toEqual(['early', 'mid', 'late']);
    expect(list[0]).toMatchObject({ serviceName: 'Haircut', customerName: 'Bob' });
    expect(list[1]).toMatchObject({ serviceName: 'Shave', customerName: 'Alice' });
  });

  it('scopes to the signed-in provider via the controller', async () => {
    const { ctrl, prisma } = makeDeps();
    const list = await ctrl.upcoming(reqFor('prov2'));
    expect(prisma.appointment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ providerId: 'prov2', status: 'BOOKED' }), orderBy: { startsAt: 'asc' } }),
    );
    expect(list.every((a) => a.providerId === 'prov2')).toBe(true);
  });

  it('rejects an unauthenticated request', async () => {
    const { ctrl } = makeDeps();
    await expect(ctrl.upcoming({ session: {} } as unknown as Request)).rejects.toThrow('not authenticated');
  });
});
