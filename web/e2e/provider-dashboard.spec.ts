/**
 * Story: provider-dashboard — a provider opens the dashboard and sees every
 * upcoming appointment soonest-first. Hermetic: static SPA, every /api/** call mocked.
 */
import { test, expect, type Page } from '@playwright/test';

// Deliberately returned out of order: the page must still render soonest-first.
const UPCOMING = [
  { id: 'a3', serviceId: 'svc1', serviceName: 'Haircut', customerId: 'c1', customerName: 'Alice', customerEmail: 'a@example.com', startsAt: '2999-01-20T10:00:00.000Z', endsAt: '2999-01-20T11:00:00.000Z', status: 'BOOKED' },
  { id: 'a1', serviceId: 'svc2', serviceName: 'Shave', customerId: 'c2', customerName: 'Bob', customerEmail: 'b@example.com', startsAt: '2999-01-11T09:00:00.000Z', endsAt: '2999-01-11T10:00:00.000Z', status: 'BOOKED' },
  { id: 'a2', serviceId: 'svc1', serviceName: 'Haircut', customerId: 'c1', customerName: 'Alice', customerEmail: 'a@example.com', startsAt: '2999-01-15T14:00:00.000Z', endsAt: '2999-01-15T15:00:00.000Z', status: 'BOOKED' },
];

async function mockApi(page: Page, upcoming: unknown[]): Promise<void> {
  const user = { id: '2', email: 'provider@example.com', name: 'provider', role: 'USER' };
  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const method = req.method().toUpperCase();
    const apiPath = new URL(req.url()).pathname
      .replace(/^.*\/api\//, '').replace(/^api\//, '').replace(/^\//, '');
    const json = (body: unknown, status = 200) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (method === 'GET' && apiPath === 'users/me') return json(user);
    if (method === 'GET' && apiPath === 'provider/appointments/upcoming') return json(upcoming);
    if (method === 'GET') return json([]);
    return json({ ok: true });
  });
  await page.addInitScript((u) => {
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('isAuthenticated', 'true');
  }, user);
}

test.use({ serviceWorkers: 'block' });

test('a provider sees all upcoming appointments in chronological order', async ({ page }) => {
  await mockApi(page, UPCOMING);
  await page.goto('/#/provider-dashboard');
  await expect(page.getByTestId('upcoming-list')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('body')).not.toContainText('Your content will appear here');
  const items = page.getByTestId('upcoming-item');
  await expect(items).toHaveCount(3);
  const starts = await items.evaluateAll((els) => els.map((e) => e.getAttribute('data-starts-at')));
  expect(starts).toEqual(['2999-01-11T09:00:00.000Z', '2999-01-15T14:00:00.000Z', '2999-01-20T10:00:00.000Z']);
  await expect(items.first()).toContainText('Shave');
  await expect(items.first()).toContainText('Bob');
  await expect(page.locator('a[href*="provider-dashboard"]').first()).toBeAttached();
});

test('a provider with no upcoming appointments sees the empty state', async ({ page }) => {
  await mockApi(page, []);
  await page.goto('/#/provider-dashboard');
  await expect(page.getByTestId('upcoming-empty')).toContainText('No upcoming appointments');
});
