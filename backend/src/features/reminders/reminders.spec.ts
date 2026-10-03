import type { Request } from 'express';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';

const NOW = new Date('2999-01-14T09:00:00.000Z');
const H = 60 * 60 * 1000;

function makeDeps(appts: Array<Record<string, any>>) {
  const reminders: Array<Record<string, any>> = [];
  const prisma: any = {
    appointment: {
      findMany: jest.fn(async ({ where }: any) =>
        appts.filter((a) => a.status === where.status && a.startsAt > where.startsAt.gt && a.startsAt <= where.startsAt.lte)),
    },
    appointmentReminder: {
      findMany: jest.fn(async ({ where }: any) =>
        where.customerId
          ? reminders.filter((r) => r.customerId === where.customerId)
          : reminders.filter((r) => where.appointmentId.in.includes(r.appointmentId) && r.kind === where.kind)),
      create: jest.fn(async ({ data }: any) => {
        const row = { id: `r${reminders.length + 1}`, ...data };
        reminders.push(row);
        return row;
      }),
    },
    service: { findMany: jest.fn(async () => [{ id: 'svc1', name: 'Haircut' }]) },
    user: {
      findMany: jest.fn(async () => [
        { id: 'cust1', email: 'c1@example.com', name: 'Cara' },
        { id: 'prov1', email: 'p@example.com', name: 'Pat Provider' },
      ]),
    },
  };
  const mailer = { sendNotification: jest.fn(async () => undefined) };
  const service = new RemindersService(prisma, mailer as any);
  return { service, mailer, reminders };
}

const appt = (id: string, startsAt: Date, status = 'BOOKED') => ({
  id, serviceId: 'svc1', customerId: 'cust1', providerId: 'prov1', startsAt, endsAt: new Date(startsAt.getTime() + H), status,
});

describe('reminder-notifications', () => {
  it('sends one reminder for an appointment 24h out naming service, date/time and provider', async () => {
    const start = new Date(NOW.getTime() + 24 * H);
    const { service, mailer } = makeDeps([appt('a1', start)]);
    expect(await service.sendDueReminders(NOW)).toBe(1);
    expect(mailer.sendNotification).toHaveBeenCalledTimes(1);
    const [to, subject, body] = (mailer.sendNotification.mock.calls[0] as unknown) as string[];
    expect(to).toBe('c1@example.com');
    expect(subject).toBe('Appointment reminder');
    expect(body).toContain('Haircut');
    expect(body).toContain('Pat Provider');
    expect(body).toContain('2999-01-15');
    expect(body).toContain('09:00');
  });

  it('never sends the same reminder twice', async () => {
    const { service, mailer } = makeDeps([appt('a1', new Date(NOW.getTime() + 23 * H))]);
    await service.sendDueReminders(NOW);
    expect(await service.sendDueReminders(new Date(NOW.getTime() + 60_000))).toBe(0);
    expect(mailer.sendNotification).toHaveBeenCalledTimes(1);
  });

  it('skips cancelled and far-future appointments', async () => {
    const { service, mailer } = makeDeps([
      appt('a1', new Date(NOW.getTime() + 2 * H), 'CANCELLED'),
      appt('a2', new Date(NOW.getTime() + 72 * H)),
    ]);
    expect(await service.sendDueReminders(NOW)).toBe(0);
    expect(mailer.sendNotification).not.toHaveBeenCalled();
  });

  it('GET /reminders/mine lists the customer reminders', async () => {
    const { service } = makeDeps([appt('a1', new Date(NOW.getTime() + 24 * H))]);
    await service.sendDueReminders(NOW);
    const ctrl = new RemindersController(service);
    const req = { session: { userId: 'cust1', role: 'USER', firmId: null } } as unknown as Request;
    const rows = await ctrl.mine(req);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ appointmentId: 'a1', serviceName: 'Haircut', providerName: 'Pat Provider' });
  });
});
