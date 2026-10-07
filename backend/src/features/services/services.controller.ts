import { BadRequestException, Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '../../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RequireManager, RolesGuard } from '../../auth/roles.guard';
import { CreateServiceSchema } from './services.schema';
import { ServicesService, ServiceView } from './services.service';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  /** Bookable services (anonymous-readable — consumed by public service cards). */
  @Get()
  @Public()
  listBookable(): Promise<ServiceView[]> {
    return this.services.listBookable();
  }

  /** The signed-in provider's own services. */
  @Get('mine')
  @RequireManager()
  listMine(@Req() req: Request): Promise<ServiceView[]> {
    return this.services.listMine(providerIdOf(req));
  }

  /** Create a service owned by the signed-in provider. */
  @Post()
  @RequireManager()
  create(@Req() req: Request, @Body() body: unknown): Promise<ServiceView> {
    const parsed = CreateServiceSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Invalid service: name, durationMinutes (> 0) and priceCents (>= 0) are required',
        issues: parsed.error.issues,
      });
    }
    return this.services.create(providerIdOf(req), parsed.data);
  }
}

function providerIdOf(req: Request): string {
  const userId = req.session?.userId;
  if (!userId) throw new UnauthorizedException('not authenticated');
  return userId;
}
