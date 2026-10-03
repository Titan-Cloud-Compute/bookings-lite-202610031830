import { ConflictException, NotFoundException } from '@nestjs/common';
import type { Request } from 'express';
import { AppointmentsController } from '../appointments/appointments.controller';
import { AppointmentsService } from '../appointments/appointments.service';
import { CancellationsController } from './cancellations.controller';
import { CancellationsService } from './cancellations.service';
import { isLateCancellation } from './cancellation-policy';

const DAY = '2999-01-15';
const HOUR = 60 * 60 * 1000;

function makeDeps() {
  const appointments: Array<Record<string, any>> = [];
  const cancellations: Array<Record<string, any>> = [];
  const overlaps = (a: Record<string, any>, where: any) =>
    a.providerId === where.providerId && a.status === where.status &&
    a.startsAt < where.startsAt.lt && a.endsAt > where.endsAt.gt;
  const prisma: any = {
    service: {
      findUnique: jest.fn(async ({ where }: any) =>
        where.id === 'svc1' ? { id: 'svc1', providerId: 'prov1', name: 'Haircut', durationMinutes: 60, active: true } : null),
    },
    appointment: {
      findUnique: jest.fn(async ({ where }: any) => appointments.find((a) => a.id === where.id) ?? null),
      findMany: jest.fn(async ({ where }: any) =>
        where.customerId ? appointments.filter((a) => a.customerId === where.customerId) : appointments.filter((a) => overlaps(a, where))),
      findFirst: jest.fn(async ({ where }: any) => appointments.find((a) => overlaps(a, where)) ?? null),
      create: jest.fn(async ({ data }: any) => {
        const row = { id: `a${appointments.length + 1}`, createdAt: new Date(), ...data };
        appointments.push(row);
        return row;
      }),
      updateMany: jest.fn(async ({ where, data }: any) => {
        const rows = appointments.filter((a) => a.id === where.id && a.customerId === where.customerId && a.status === where.status);
        rows.forEach((r) => Object.assign(r, data));
        return { count: rows.length };
      }),
    },
    appointmentCancellation: {
      create: jest.fn(async ({ data }: any) => {
        const row = { id: `c${cancellations.length + 1}`, ...data };
        cancellations.push(row);
        return row;
      }),
    },
    user: {
      findUnique: jest.fn(async ({ where }: any) => (where.id === 'prov1' ? { email: 'p@example.com' } : null)),
      findMany: jest.fn(async () => [
        { id: 'cust1', email: 'c1@example.com' },
        { id: 'prov1', email: 'p@example.com' },
      ]),
    },
  };
  prisma.$transaction = jest.fn(async (fn: any) => fn(prisma));
  const mailer = { sendNotification: jest.fn(async () => undefined) };
  const audit = { record: jest.fn(async () => undefined) };
  const appts = new AppointmentsController(new AppointmentsService(prisma, mailer as any, audit as any));
  const service = new CancellationsService(prisma, mailer as any, audit as any);
  return { prisma, mailer, audit, appts, service, ctrl: new CancellationsController(service), appointments, cancellations };
}

const reqFor = (userId: string) => ({ session: { userId, role: 'USER', firmId: null } }) as unknown as Request;

describe('cancel-appointment', () => {
  it('flags cancellations within 24 hours as late', () => {
    const now = new Date('2999-01-14T09:00:00.000Z');
    expect(isLateCancellation(new Date(now.getTime() + 25 * HOUR), now)).toBe(false);
    expect(isLateCancellation(new Date(now.getTime() + 23 * HOUR), now)).toBe(true);
  });

  it('customer cancels in time: cancelled, slot reopens, provider notified', async () => {
    const { appts, ctrl, mailer, audit, cancellations } = makeDeps();
    const startsAt = `${DAY}T09:00:00.000Z`;
    const appt = await appts.book(reqFor('cust1'), { serviceId: 'svc1', startsAt });
    expect(await appts.slots('svc1', DAY)).toHaveLength(7);
    mailer.sendNotification.mockClear();

    const res = await ctrl.cancel(reqFor('cust1'), appt.id);
    expect(res).toMatchObject({ appointmentId: appt.id, status: 'CANCELLED', late: false });
    expect(cancellations).toHaveLength(1);
    expect((await appts.slots('svc1', DAY)).map((s) => s.startsAt)).toContain(startsAt);
    expect((await appts.mine(reqFor('cust1')))[0].status).toBe('CANCELLED');
    expect(mailer.sendNotification).toHaveBeenCalledWith('p@example.com', 'Appointment cancelled', expect.any(String));
    expect(audit.record).toHaveBeenCalledWith(expect.objectContaining({ action: 'appointment.cancelled' }));
  });

  it('late cancellation is flagged and the provider is told', async () => {
    const { appts, service, mailer, audit } = makeDeps();
    const startsAt = `${DAY}T10:00:00.000Z`;
    const appt = await appts.book(reqFor('cust1'), { serviceId: 'svc1', startsAt });
    const now = new Date(Date.parse(startsAt) - 3 * HOUR);

    const res = await service.cancel('cust1', appt.id, now);
    expect(res).toMatchObject({ status: 'CANCELLED', late: true });
    expect(mailer.sendNotification).toHaveBeenCalledWith('p@example.com', 'Late appointment cancellation', expect.stringContaining('late cancellation'));
    expect(audit.record).toHaveBeenCalledWith(expect.objectContaining({ action: 'appointment.cancelled_late' }));
  });

  it('rejects other customers (404) and already-cancelled appointments (409)', async () => {
    const { appts, ctrl } = makeDeps();
    const appt = await appts.book(reqFor('cust1'), { serviceId: 'svc1', startsAt: `${DAY}T11:00:00.000Z` });
    await expect(ctrl.cancel(reqFor('cust2'), appt.id)).rejects.toBeInstanceOf(NotFoundException);
    await expect(ctrl.cancel(reqFor('cust1'), 'missing')).rejects.toBeInstanceOf(NotFoundException);
    await ctrl.cancel(reqFor('cust1'), appt.id);
    await expect(ctrl.cancel(reqFor('cust1'), appt.id)).rejects.toBeInstanceOf(ConflictException);
  });
});
