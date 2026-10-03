import { Controller, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RequireUser, RolesGuard } from '../../auth/roles.guard';
import { RemindersService, ReminderView } from './reminders.service';

@Controller('reminders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RemindersController {
  constructor(private readonly reminders: RemindersService) {}

  /** Reminders sent to the signed-in customer, newest first. */
  @Get('mine')
  @RequireUser()
  mine(@Req() req: Request): Promise<ReminderView[]> {
    const userId = req.session?.userId;
    if (!userId) throw new UnauthorizedException('not authenticated');
    return this.reminders.listMine(userId);
  }
}
