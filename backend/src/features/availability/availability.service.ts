import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BlockDto, WindowDto } from './availability.schema';
import { BookableSlot, computeBookableSlots, parseDay } from './availability.slots';

export interface WindowView {
  id: string;
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
}

export interface BlockView {
  id: string;
  startsAt: Date;
  endsAt: Date;
}

const WINDOW_SELECT = { id: true, dayOfWeek: true, startMinute: true, endMinute: true } as const;
const BLOCK_SELECT = { id: true, startsAt: true, endsAt: true } as const;

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  getWeekly(providerId: string): Promise<WindowView[]> {
    return this.prisma.availabilityWindow.findMany({
      where: { providerId },
      orderBy: [{ dayOfWeek: 'asc' }, { startMinute: 'asc' }],
      select: WINDOW_SELECT,
    });
  }

  async setWeekly(providerId: string, windows: WindowDto[]): Promise<WindowView[]> {
    await this.prisma.$transaction([
      this.prisma.availabilityWindow.deleteMany({ where: { providerId } }),
      this.prisma.availabilityWindow.createMany({ data: windows.map((w) => ({ ...w, providerId })) }),
    ]);
    return this.getWeekly(providerId);
  }

  listBlocks(providerId: string): Promise<BlockView[]> {
    return this.prisma.availabilityBlock.findMany({
      where: { providerId },
      orderBy: { startsAt: 'asc' },
      select: BLOCK_SELECT,
    });
  }

  addBlock(providerId: string, dto: BlockDto): Promise<BlockView> {
    return this.prisma.availabilityBlock.create({
      data: { providerId, startsAt: dto.startsAt, endsAt: dto.endsAt },
      select: BLOCK_SELECT,
    });
  }

  async removeBlock(providerId: string, id: string): Promise<{ ok: true }> {
    const res = await this.prisma.availabilityBlock.deleteMany({ where: { id, providerId } });
    if (!res.count) throw new NotFoundException('block not found');
    return { ok: true };
  }

  async slots(serviceId: string, date: string): Promise<BookableSlot[]> {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, active: true },
      select: { providerId: true, durationMinutes: true },
    });
    if (!service) throw new NotFoundException('service not found');
    const day = parseDay(date);
    if (!day) return [];
    const dayEnd = new Date(day.getTime() + 24 * 60 * 60_000);
    const [windows, blocks, booked] = await Promise.all([
      this.prisma.availabilityWindow.findMany({
        where: { providerId: service.providerId, dayOfWeek: day.getUTCDay() },
        select: WINDOW_SELECT,
      }),
      this.prisma.availabilityBlock.findMany({
        where: { providerId: service.providerId, startsAt: { lt: dayEnd }, endsAt: { gt: day } },
        select: BLOCK_SELECT,
      }),
      this.prisma.appointment.findMany({
        where: { providerId: service.providerId, status: 'BOOKED', startsAt: { lt: dayEnd }, endsAt: { gt: day } },
        select: { startsAt: true, endsAt: true },
      }),
    ]);
    // A booked appointment removes its slot from availability.
    return computeBookableSlots(windows, blocks, service.durationMinutes, date).filter((slot) => {
      const s = Date.parse(slot.startsAt);
      const e = Date.parse(slot.endsAt);
      return !booked.some((b) => b.startsAt.getTime() < e && b.endsAt.getTime() > s);
    });
  }
}
