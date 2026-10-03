import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from './services.schema';

export interface ServiceView {
  id: string;
  providerId: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
  active: boolean;
  createdAt: Date;
}

const SELECT = {
  id: true,
  providerId: true,
  name: true,
  durationMinutes: true,
  priceCents: true,
  active: true,
  createdAt: true,
} as const;

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(providerId: string, dto: CreateServiceDto): Promise<ServiceView> {
    return this.prisma.service.create({
      data: { ...dto, providerId, active: true },
      select: SELECT,
    });
  }

  listMine(providerId: string): Promise<ServiceView[]> {
    return this.prisma.service.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
      select: SELECT,
    });
  }

  listBookable(): Promise<ServiceView[]> {
    return this.prisma.service.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      select: SELECT,
    });
  }
}
