/**
 * Foundation contract: JwtAuthGuard + RolesGuard.
 *   - no session cookie on a guarded route        → 401
 *   - valid session, role not in the allowed set  → 403
 *   - valid session, allowed role                 → 200
 *   - @Public() routes need no session at all     → 200
 * Hermetic: a tiny controller in a test module, no DB, no Redis.
 */
import { Controller, Get, INestApplication, UseGuards } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import request = require('supertest');
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequireAdmin, RequireManager, RequireUser, RolesGuard } from './roles.guard';
import { Public } from './decorators/public.decorator';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser');

const SECRET = 'foundation-guards-test-secret';

@Controller('probe')
@UseGuards(JwtAuthGuard, RolesGuard)
class ProbeController {
  @Public()
  @Get('public')
  open(): { ok: true } {
    return { ok: true };
  }

  @RequireUser()
  @Get('user')
  user(): { ok: true } {
    return { ok: true };
  }

  @RequireManager()
  @Get('manager')
  manager(): { ok: true } {
    return { ok: true };
  }

  @RequireAdmin()
  @Get('admin')
  admin(): { ok: true } {
    return { ok: true };
  }
}

describe('foundation auth/role guards', () => {
  let app: INestApplication;
  let jwt: JwtService;
  const cookieName = process.env.SESSION_COOKIE_NAME ?? 'session';

  const cookieFor = async (role: 'USER' | 'MANAGER' | 'ADMIN'): Promise<string> =>
    `${cookieName}=${await jwt.signAsync({ userId: `u-${role}`, role, firmId: null })}`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: SECRET, signOptions: { expiresIn: '1h' } })],
      controllers: [ProbeController],
      providers: [JwtAuthGuard, RolesGuard],
    }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();
    jwt = moduleRef.get(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('public route needs no session', async () => {
    await request(app.getHttpServer()).get('/probe/public').expect(200);
  });

  it.each(['user', 'manager', 'admin'])('unauthenticated /probe/%s → 401', async (path) => {
    await request(app.getHttpServer()).get(`/probe/${path}`).expect(401);
  });

  it('invalid token → 401', async () => {
    await request(app.getHttpServer())
      .get('/probe/user')
      .set('Cookie', `${cookieName}=not-a-jwt`)
      .expect(401);
  });

  const matrix: Array<['USER' | 'MANAGER' | 'ADMIN', string, number]> = [
    ['USER', 'user', 200],
    ['USER', 'manager', 403],
    ['USER', 'admin', 403],
    ['MANAGER', 'user', 200],
    ['MANAGER', 'manager', 200],
    ['MANAGER', 'admin', 403],
    ['ADMIN', 'user', 200],
    ['ADMIN', 'manager', 200],
    ['ADMIN', 'admin', 200],
  ];

  it.each(matrix)('%s on /probe/%s → %d', async (role, path, status) => {
    await request(app.getHttpServer())
      .get(`/probe/${path}`)
      .set('Cookie', await cookieFor(role))
      .expect(status);
  });
});
