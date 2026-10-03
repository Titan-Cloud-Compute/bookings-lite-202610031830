/**
 * Story: create-service — a MANAGER creates a service and it appears in the list.
 * Hermetic: static SPA, every /api/** call mocked.
 */
import { test, expect, type Page } from '@playwright/test';

async function mockApi(page: Page): Promise<void> {
  const user = { id: '2', email: 'manager@example.com', name: 'manager', role: 'MANAGER' };
  const services: Array<Record<string, unknown>> = [];
  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const method = req.method().toUpperCase();
    const apiPath = new URL(req.url()).pathname
      .replace(/^.*\/api\//, '').replace(/^api\//, '').replace(/^\//, '');
    const json = (body: unknown, status = 200) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

    if (method === 'GET' && apiPath === 'users/me') return json(user);
    if (method === 'GET' && (apiPath === 'services/mine' || apiPath === 'services')) return json(services);
    if (method === 'POST' && apiPath === 'services') {
      const body = req.postDataJSON() as Record<string, unknown>;
      const row = { id: `s${services.length + 1}`, active: true, providerId: user.id, ...body };
      services.unshift(row);
      return json(row, 201);
    }
    if (method === 'GET') return json([]);
    return json({ ok: true });
  });
  await page.addInitScript((u) => {
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('isAuthenticated', 'true');
  }, user);
}

test.use({ serviceWorkers: 'block' });

test('a provider creates a service and it appears in their service list', async ({ page }) => {
  await mockApi(page);
  await page.goto('/#/services');
  await expect(page.getByTestId('service-form')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId('service-list')).toBeVisible();
  expect(await page.locator('#password').count()).toBe(0);
  await expect(page.locator('body')).not.toContainText('Your content will appear here');

  await page.getByTestId('service-name').fill('Haircut');
  await page.getByTestId('service-duration').fill('45');
  await page.getByTestId('service-price').fill('25');
  const posted = page.waitForRequest((r) => r.method() === 'POST' && /\/api\/services$/.test(new URL(r.url()).pathname));
  await page.getByTestId('service-submit').click();
  const body = (await posted).postDataJSON();
  expect(body).toEqual({ name: 'Haircut', durationMinutes: 45, priceCents: 2500 });

  const item = page.getByTestId('service-item');
  await expect(item).toHaveCount(1);
  await expect(item).toContainText('Haircut');
  await expect(item).toContainText('45 min');
  await expect(item).toContainText('$25.00');
});
