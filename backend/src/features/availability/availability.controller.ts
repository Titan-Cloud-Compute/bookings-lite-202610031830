import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RequireManager, RequireUser, RolesGuard } from '../../auth/roles.guard';
import { BlockSchema, SlotsQuerySchema, WeeklySchema } from './availability.schema';
import { AvailabilityService, BlockView, WindowView } from './availability.service';
import { BookableSlot } from './availability.slots';

@Controller('availability')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AvailabilityController {
  constructor(private readonly availability: AvailabilityService) {}

  @Get('weekly')
  @RequireManager()
  getWeekly(@Req() req: Request): Promise<WindowView[]> {
    return this.availability.getWeekly(providerIdOf(req));
  }

  @Put('weekly')
  @RequireManager()
  setWeekly(@Req() req: Request, @Body() body: unknown): Promise<WindowView[]> {
    const parsed = WeeklySchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({ message: 'Invalid weekly availability', issues: parsed.error.issues });
    }
    return this.availability.setWeekly(providerIdOf(req), parsed.data.windows);
  }

  @Get('blocks')
  @RequireManager()
  listBlocks(@Req() req: Request): Promise<BlockView[]> {
    return this.availability.listBlocks(providerIdOf(req));
  }

  @Post('blocks')
  @RequireManager()
  addBlock(@Req() req: Request, @Body() body: unknown): Promise<BlockView> {
    const parsed = BlockSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({ message: 'Invalid block: startsAt must be before endsAt', issues: parsed.error.issues });
    }
    return this.availability.addBlock(providerIdOf(req), parsed.data);
  }

  @Delete('blocks/:id')
  @RequireManager()
  removeBlock(@Req() req: Request, @Param('id') id: string): Promise<{ ok: true }> {
    return this.availability.removeBlock(providerIdOf(req), id);
  }

  /** Bookable slots for a service on a date (any signed-in user — consumed by book-appointment). */
  @Get('slots')
  @RequireUser()
  slots(@Query() query: unknown): Promise<BookableSlot[]> {
    const parsed = SlotsQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException({ message: 'serviceId and date (YYYY-MM-DD) are required', issues: parsed.error.issues });
    }
    return this.availability.slots(parsed.data.serviceId, parsed.data.date);
  }
}

function providerIdOf(req: Request): string {
  const userId = req.session?.userId;
  if (!userId) throw new UnauthorizedException('not authenticated');
  return userId;
}
