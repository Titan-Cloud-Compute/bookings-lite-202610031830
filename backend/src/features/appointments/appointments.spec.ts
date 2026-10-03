import { ConflictException } from '@nestjs/common';
import type { Request } from 'express';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService, generateSlots } from './appointments.service';

const DAY = '2999-01-15';

function makeDeps() {
  const appointments: Array<Record<string, any>> = [];
  const overlaps = (a: Record<string, any>, where: any) =>
    a.providerId === where.providerId && a.status === where.status &&
    a.startsAt < where.startsAt.lt && a.endsAt > where.endsAt.gt;
  const prisma: any = {
    service: {
      findUnique: jest.fn(async ({ where }: any) =>
        where.id === 'svc1' ? { id: 'svc1', providerId: 'prov1', name: 'Haircut', durationMinutes: 60, active: true } : null),
    },
    appointment: {
      findMany: jest.fn(async ({ where }: any) =>
        where.customerId ? appointments.filter((a) => a.customerId === where.customerId) : appointments.filter((a) => overlaps(a, where))),
      findFirst: jest.fn(async ({ where }: any) => appointments.find((a) => overlaps(a, where)) ?? null),
      create: jest.fn(async ({ data }: any) => {
        const row = { id: `a${appointments.length + 1}`, createdAt: new Date(), ...data };
        appointments.push(row);
        return row;
      }),
    },
    user: {
      findMany: jest.fn(async () => [
        { id: 'cust1', email: 'c1@example.com' },
        { id: 'cust2', email: 'c2@example.com' },
        { id: 'prov1', email: 'p@example.com' },
      ]),
    },
  };
  prisma.$transaction = jest.fn(async (fn: any) => fn(prisma));
  const mailer = { sendNotification: jest.fn(async () => undefined) };
  const audit = { record: jest.fn(async () => undefined) };
  const service = new AppointmentsService(prisma, mailer as any, audit as any);
  return { prisma, mailer, audit, ctrl: new AppointmentsController(service), appointments };
}

const reqFor = (userId: string) => ({ session: { userId, role: 'USER', firmId: null } }) as unknown as Request;

describe('book-appointment', () => {
  it('generates slots from the service duration', () => {
    expect(generateSlots(DAY, 60)).toHaveLength(8);
    expect(generateSlots(DAY, 30)[1].startsAt).toBe(`${DAY}T09:30:00.000Z`);
  });

  it('books a slot, removes it from availability and notifies both parties', async () => {
    const { ctrl, mailer, audit } = makeDeps();
    const before = await ctrl.slots('svc1', DAY);
    expect(before).toHaveLength(8);
    const slot = before[0];

    const appt = await ctrl.book(reqFor('cust1'), { serviceId: 'svc1', startsAt: slot.startsAt });
    expect(appt).toMatchObject({ serviceId: 'svc1', customerId: 'cust1', providerId: 'prov1', status: 'BOOKED' });

    const after = await ctrl.slots('svc1', DAY);
    expect(after.map((s) => s.startsAt)).not.toContain(slot.startsAt);
    expect(after).toHaveLength(7);

    const recipients = mailer.sendNotification.mock.calls.map((c: unknown[]) => c[0]);
    expect(recipients).toEqual(expect.arrayContaining(['c1@example.com', 'p@example.com']));
    expect(audit.record).toHaveBeenCalledWith(expect.objectContaining({ action: 'appointment.booked' }));

    expect((await ctrl.mine(reqFor('cust1'))).map((a) => a.id)).toEqual([appt.id]);
  });

  it('rejects a second booking of the same slot with SLOT_UNAVAILABLE', async () => {
    const { ctrl } = makeDeps();
    const startsAt = `${DAY}T10:00:00.000Z`;
    await ctrl.book(reqFor('cust1'), { serviceId: 'svc1', startsAt });
    const err = await ctrl.book(reqFor('cust2'), { serviceId: 'svc1', startsAt }).catch((e) => e);
    expect(err).toBeInstanceOf(ConflictException);
    expect(err.getStatus()).toBe(409);
    expect(err.getResponse()).toMatchObject({ code: 'SLOT_UNAVAILABLE' });
  });

  it('maps a unique-constraint race (P2002) to SLOT_UNAVAILABLE', async () => {
    const { ctrl, prisma } = makeDeps();
    const { Prisma } = await import('@prisma/client');
    prisma.$transaction.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('unique', { code: 'P2002', clientVersion: 'test' }),
    );
    const err = await ctrl.book(reqFor('cust2'), { serviceId: 'svc1', startsAt: `${DAY}T11:00:00.000Z` }).catch((e) => e);
    expect(err).toBeInstanceOf(ConflictException);
    expect(err.getResponse()).toMatchObject({ code: 'SLOT_UNAVAILABLE' });
  });

  it('rejects a start time that is not a generated slot', async () => {
    const { ctrl } = makeDeps();
    await expect(ctrl.book(reqFor('cust1'), { serviceId: 'svc1', startsAt: `${DAY}T09:17:00.000Z` })).rejects.toBeInstanceOf(ConflictException);
  });
});
