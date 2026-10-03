import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RequireUser, RolesGuard } from '../../auth/roles.guard';
import { BookAppointmentSchema, SlotDateSchema } from './appointments.schema';
import { AppointmentsService, AppointmentView, SlotView } from './appointments.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointments: AppointmentsService) {}

  /** Open (not yet booked, not in the past) slots of a service for one UTC day. */
  @Get('services/:id/slots')
  @RequireUser()
  slots(@Param('id') serviceId: string, @Query('date') date?: string): Promise<SlotView[]> {
    const day = date ?? new Date().toISOString().slice(0, 10);
    if (!SlotDateSchema.safeParse(day).success) {
      throw new BadRequestException({ message: 'date must be YYYY-MM-DD' });
    }
    return this.appointments.availableSlots(serviceId, day);
  }

  /** Book a slot for the signed-in customer. 409 SLOT_UNAVAILABLE if taken. */
  @Post('appointments')
  @RequireUser()
  book(@Req() req: Request, @Body() body: unknown): Promise<AppointmentView> {
    const parsed = BookAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({ message: 'serviceId and startsAt are required', issues: parsed.error.issues });
    }
    return this.appointments.book(customerIdOf(req), parsed.data);
  }

  /** The signed-in customer's appointments. */
  @Get('appointments/mine')
  @RequireUser()
  mine(@Req() req: Request): Promise<AppointmentView[]> {
    return this.appointments.listMine(customerIdOf(req));
  }
}

function customerIdOf(req: Request): string {
  const userId = req.session?.userId;
  if (!userId) throw new UnauthorizedException('not authenticated');
  return userId;
}
