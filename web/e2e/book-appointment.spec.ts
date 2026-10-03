/**
 * Story: book-appointment — a customer picks a service and day, sees open
 * slots, confirms one, and a second booking of a taken slot shows the
 * slot-unavailable error. Hermetic: static SPA, every /api/** call mocked.
 */
import { test, expect, type Page } from '@playwright/test';

const SLOTS = [
  { startsAt: '2999-01-15T09:00:00.000Z', endsAt: '2999-01-15T10:00:00.000Z' },
  { startsAt: '2999-01-15T10:00:00.000Z', endsAt: '2999-01-15T11:00:00.000Z' },
];

async function mockApi(page: Page, opts: { takenByOther?: string } = {}): Promise<{ posts: unknown[] }> {
  const user = { id: '3', email: 'user@example.com', name: 'user', role: 'USER' };
  const services = [{ id: 'svc1', name: 'Haircut', durationMinutes: 60, priceCents: 2500, active: true, providerId: '2' }];
  const booked = new Set<string>();
  const posts: unknown[] = [];
  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const method = req.method().toUpperCase();
    const apiPath = new URL(req.url()).pathname
      .replace(/^.*\/api\//, '').replace(/^api\//, '').replace(/^\//, '');
    const json = (body: unknown, status = 200) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

    if (method === 'GET' && apiPath === 'users/me') return json(user);
    if (method === 'GET' && apiPath === 'services') return json(services);
    if (method === 'GET' && apiPath === 'services/svc1/slots') return json(SLOTS.filter((s) => !booked.has(s.startsAt)));
    if (method === 'POST' && apiPath === 'appointments') {
      const body = req.postDataJSON() as { serviceId: string; startsAt: string };
      posts.push(body);
      if (booked.has(body.startsAt) || body.startsAt === opts.takenByOther) {
        booked.add(body.startsAt);
        return json({ code: 'SLOT_UNAVAILABLE', message: 'That time slot is no longer available.' }, 409);
      }
      booked.add(body.startsAt);
      return json({ id: 'a1', status: 'BOOKED', customerId: user.id, ...body }, 201);
    }
    if (method === 'GET') return json([]);
    return json({ ok: true });
  });
  await page.addInitScript((u) => {
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('isAuthenticated', 'true');
  }, user);
  return { posts };
}

test.use({ serviceWorkers: 'block' });

test('a customer books an open slot and it leaves the availability list', async ({ page }) => {
  const { posts } = await mockApi(page);
  await page.goto('/#/book');
  await expect(page.getByTestId('book-service')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId('slot-list')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Your content will appear here');

  await page.getByTestId('book-date').fill('2999-01-15');
  await expect(page.getByTestId('slot-item')).toHaveCount(2);
  await page.getByTestId('slot-item').first().click();
  await page.getByTestId('confirm-booking').click();

  await expect(page.getByTestId('booking-success')).toBeVisible();
  expect(posts).toEqual([{ serviceId: 'svc1', startsAt: SLOTS[0].startsAt }]);
  await expect(page.getByTestId('slot-item')).toHaveCount(1);
});

test('booking a slot someone else just took shows slot-unavailable', async ({ page }) => {
  await mockApi(page, { takenByOther: SLOTS[1].startsAt });
  await page.goto('/#/book');
  await expect(page.getByTestId('book-service')).toBeVisible({ timeout: 10_000 });
  await page.getByTestId('book-date').fill('2999-01-15');
  await expect(page.getByTestId('slot-item')).toHaveCount(2);
  await page.getByTestId('slot-item').nth(1).click();
  await page.getByTestId('confirm-booking').click();

  await expect(page.getByTestId('booking-error')).toContainText('no longer available');
  await expect(page.getByTestId('slot-item')).toHaveCount(1);
});
