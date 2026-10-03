import { Controller, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RequireManager, RolesGuard } from '../../auth/roles.guard';
import { ProviderDashboardService, UpcomingAppointmentView } from './provider-dashboard.service';

@Controller('provider')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProviderDashboardController {
  constructor(private readonly dashboard: ProviderDashboardService) {}

  /** Upcoming appointments where the signed-in user is the provider, soonest first. */
  @Get('appointments/upcoming')
  @RequireManager()
  async upcoming(@Req() req: Request): Promise<UpcomingAppointmentView[]> {
    const userId = req.session?.userId;
    if (!userId) throw new UnauthorizedException('not authenticated');
    return this.dashboard.listUpcoming(userId);
  }
}
