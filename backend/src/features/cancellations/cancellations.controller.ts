import { Controller, HttpCode, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RequireUser, RolesGuard } from '../../auth/roles.guard';
import { CancellationsService, CancellationView } from './cancellations.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CancellationsController {
  constructor(private readonly cancellations: CancellationsService) {}

  /** Cancel the signed-in customer's appointment. 404 if not theirs, 409 if not BOOKED. */
  @Post('appointments/:id/cancel')
  @HttpCode(200)
  @RequireUser()
  cancel(@Req() req: Request, @Param('id') id: string): Promise<CancellationView> {
    const userId = req.session?.userId;
    if (!userId) throw new UnauthorizedException('not authenticated');
    return this.cancellations.cancel(userId, id);
  }
}
