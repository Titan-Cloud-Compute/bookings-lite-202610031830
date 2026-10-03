/**
 * Story: set-availability — a MANAGER sets weekly hours, blocks a slot and
 * previews bookable slots. Hermetic: static SPA, every /api/** call mocked.
 */
import { test, expect, type Page } from '@playwright/test';

async function mockApi(page: Page): Promise<{ weekly: unknown[]; blocks: Array<Record<string, unknown>> }> {
  const user = { id: '2', email: 'manager@example.com', name: 'manager', role: 'MANAGER' };
  const state = { weekly: [] as unknown[], blocks: [] as Array<Record<string, unknown>> };
  const services = [{ id: 's1', name: 'Haircut', durationMinutes: 30, priceCents: 2500, active: true, providerId: '2' }];
  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const method = req.method().toUpperCase();
    const url = new URL(req.url());
    const apiPath = url.pathname.replace(/^.*\/api\//, '').replace(/^api\//, '').replace(/^\//, '');
    const json = (body: unknown, status = 200) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

    if (method === 'GET' && apiPath === 'users/me') return json(user);
    if (method === 'GET' && (apiPath === 'services/mine' || apiPath === 'services')) return json(services);
    if (method === 'GET' && apiPath === 'availability/weekly') return json(state.weekly);
    if (method === 'PUT' && apiPath === 'availability/weekly') {
      state.weekly = (req.postDataJSON() as { windows: unknown[] }).windows;
      return json(state.weekly);
    }
    if (method === 'GET' && apiPath === 'availability/blocks') return json(state.blocks);
    if (method === 'POST' && apiPath === 'availability/blocks') {
      const row = { id: `b${state.blocks.length + 1}`, ...(req.postDataJSON() as Record<string, unknown>) };
      state.blocks.push(row);
      return json(row, 201);
    }
    if (method === 'DELETE' && apiPath.startsWith('availability/blocks/')) {
      const id = apiPath.split('/').pop();
      state.blocks = state.blocks.filter((b) => b['id'] !== id);
      return json({ ok: true });
    }
    if (method === 'GET' && apiPath === 'availability/slots') {
      const date = url.searchParams.get('date');
      return json(['09:00', '09:30', '10:30', '11:00', '11:30'].map((t) => ({ time: t, startsAt: `${date}T${t}:00.000Z`, endsAt: `${date}T${t}:00.000Z` })));
    }
    if (method === 'GET') return json([]);
    return json({ ok: true });
  });
  await page.addInitScript((u) => {
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('isAuthenticated', 'true');
  }, user);
  return state;
}

test.use({ serviceWorkers: 'block' });

test('a provider sets weekly hours, blocks a slot and previews bookable slots', async ({ page }) => {
  await mockApi(page);
  await page.goto('/#/availability');
  const rows = page.getByTestId('availability-day-row');
  await expect(rows).toHaveCount(7, { timeout: 10_000 });
  await expect(page.getByTestId('availability-block-form')).toBeVisible();
  await expect(page.getByTestId('availability-block-list')).toBeVisible();
  await expect(page.getByTestId('availability-slot-preview')).toBeVisible();
  expect(await page.locator('#password').count()).toBe(0);
  await expect(page.locator('body')).not.toContainText('Your content will appear here');

  // Monday 09:00-12:00
  const monday = rows.nth(1);
  await monday.getByTestId('availability-day-enabled').check();
  await monday.getByTestId('availability-day-start').fill('09:00');
  await monday.getByTestId('availability-day-end').fill('12:00');
  const put = page.waitForRequest((r) => r.method() === 'PUT' && /\/api\/availability\/weekly$/.test(new URL(r.url()).pathname));
  await page.getByTestId('availability-save').click();
  expect((await put).postDataJSON()).toEqual({ windows: [{ dayOfWeek: 1, startMinute: 540, endMinute: 720 }] });

  // Block Monday 10:00-10:30
  await page.getByTestId('availability-block-date').fill('2026-10-05');
  await page.getByTestId('availability-block-start').fill('10:00');
  await page.getByTestId('availability-block-end').fill('10:30');
  const post = page.waitForRequest((r) => r.method() === 'POST' && /\/api\/availability\/blocks$/.test(new URL(r.url()).pathname));
  await page.getByTestId('availability-block-submit').click();
  expect((await post).postDataJSON()).toEqual({ startsAt: '2026-10-05T10:00:00.000Z', endsAt: '2026-10-05T10:30:00.000Z' });
  await expect(page.getByTestId('availability-block-item')).toHaveCount(1);

  // Preview
  await page.getByTestId('availability-preview-service').selectOption('s1');
  await page.getByTestId('availability-preview-date').fill('2026-10-05');
  await page.getByTestId('availability-preview-submit').click();
  await expect(page.getByTestId('availability-slot-item')).toHaveText(['09:00', '09:30', '10:30', '11:00', '11:30']);

  // Remove the block
  await page.getByTestId('availability-block-remove').click();
  await expect(page.getByTestId('availability-block-item')).toHaveCount(0);
});
