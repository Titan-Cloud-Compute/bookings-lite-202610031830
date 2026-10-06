import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public.decorator';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { CreateServiceSchema } from './services.schema';

function makePrisma() {
  const rows: Array<Record<string, unknown>> = [];
  return {
    rows,
    service: {
      create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
        const row = { id: `s${rows.length + 1}`, createdAt: new Date(), ...data };
        rows.push(row);
        return row;
      }),
      findMany: jest.fn(async ({ where }: { where: Record<string, unknown> }) =>
        rows.filter((r) => Object.entries(where).every(([k, v]) => r[k] === v)),
      ),
    },
  };
}

const reqFor = (userId: string) => ({ session: { userId, role: 'MANAGER', firmId: null } }) as unknown as Request;

describe('ServicesController', () => {
  it('creates a service for the session provider; it appears in mine and bookable lists', async () => {
    const prisma = makePrisma();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctrl = new ServicesController(new ServicesService(prisma as any));
    const created = await ctrl.create(reqFor('p1'), { name: 'Haircut', durationMinutes: 30, priceCents: 2500, providerId: 'evil' });
    expect(created).toMatchObject({ name: 'Haircut', durationMinutes: 30, priceCents: 2500, providerId: 'p1', active: true });

    expect((await ctrl.listMine(reqFor('p1'))).map((s) => s.name)).toEqual(['Haircut']);
    expect(await ctrl.listMine(reqFor('p2'))).toEqual([]);
    expect((await ctrl.listBookable()).map((s) => s.name)).toEqual(['Haircut']);
  });

  it('rejects invalid input', async () => {
    const prisma = makePrisma();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctrl = new ServicesController(new ServicesService(prisma as any));
    await expect(async () => ctrl.create(reqFor('p1'), { name: '', durationMinutes: 30, priceCents: 0 })).rejects.toBeInstanceOf(BadRequestException);
    await expect(async () => ctrl.create(reqFor('p1'), { name: 'X', durationMinutes: 0, priceCents: 0 })).rejects.toBeInstanceOf(BadRequestException);
    await expect(async () => ctrl.create(reqFor('p1'), { name: 'X', durationMinutes: 10, priceCents: -1 })).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.service.create).not.toHaveBeenCalled();
  });

  it('schema accepts a valid payload', () => {
    expect(CreateServiceSchema.safeParse({ name: 'Massage', durationMinutes: '60', priceCents: 5000 }).success).toBe(true);
  });

  it('listBookable is decorated @Public(); listMine and create are not', () => {
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, ServicesController.prototype.listBookable)).toBe(true);
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, ServicesController.prototype.listMine)).toBeFalsy();
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, ServicesController.prototype.create)).toBeFalsy();
  });
});
