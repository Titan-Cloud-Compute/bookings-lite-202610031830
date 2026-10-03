/**
 * Story: cancel-appointment — a customer cancels from My appointments; a
 * cancellation within 24 hours shows the late-cancellation warning first.
 * Hermetic: static SPA, every /api/** call mocked.
 */
import { test, expect, type Page } from '@playwright/test';

const FAR = '2999-01-15T09:00:00.000Z';

async function mockApi(page: Page, soonIso: string): Promise<{ cancels: string[] }> {
  const user = { id: '3', email: 'user@example.com', name: 'user', role: 'USER' };
  const appts = [
    { id: 'far1', serviceId: 'svc1', customerId: '3', providerId: '2', startsAt: FAR, endsAt: '2999-01-15T10:00:00.000Z', status: 'BOOKED' },
    { id: 'soon1', serviceId: 'svc1', customerId: '3', providerId: '2', startsAt: soonIso, endsAt: soonIso, status: 'BOOKED' },
  ];
  const cancels: string[] = [];
  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const method = req.method().toUpperCase();
    const apiPath = new URL(req.url()).pathname
      .replace(/^.*\/api\//, '').replace(/^api\//, '').replace(/^\//, '');
    const json = (body: unknown, status = 200) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

    if (method === 'GET' && apiPath === 'users/me') return json(user);
    if (method === 'GET' && apiPath === 'appointments/mine') return json(appts);
    const m = /^appointments\/([^/]+)\/cancel$/.exec(apiPath);
    if (method === 'POST' && m) {
      cancels.push(m[1]);
      const a = appts.find((x) => x.id === m[1]);
      if (!a || a.status !== 'BOOKED') return json({ code: 'NOT_CANCELLABLE' }, 409);
      a.status = 'CANCELLED';
      return json({ appointmentId: a.id, status: 'CANCELLED', late: a.id === 'soon1' });
    }
    if (method === 'GET') return json([]);
    return json({ ok: true });
  });
  await page.addInitScript((u) => {
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('isAuthenticated', 'true');
  }, user);
  return { cancels };
}

test.use({ serviceWorkers: 'block' });

test('a customer cancels an appointment more than 24h away', async ({ page }) => {
  const { cancels } = await mockApi(page, new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString());
  await page.goto('/#/appointments');
  await expect(page.getByTestId('my-appointments-list')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('h1')).toContainText('My appointments');
  await expect(page.locator('body')).not.toContainText('Your content will appear here');
  await expect(page.getByTestId('appointment-item')).toHaveCount(2);

  await page.getByTestId('appointment-item').first().getByTestId('cancel-appointment').click();
  await expect(page.getByTestId('cancel-notice')).toContainText('slot is available again');
  await expect(page.getByTestId('appointment-item').first().getByTestId('appointment-status')).toHaveText('Cancelled');
  expect(cancels).toEqual(['far1']);
});

test('cancelling within 24h warns first and is flagged late', async ({ page }) => {
  const { cancels } = await mockApi(page, new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString());
  await page.goto('/#/appointments');
  await expect(page.getByTestId('appointment-item')).toHaveCount(2, { timeout: 10_000 });

  const soon = page.getByTestId('appointment-item').nth(1);
  await soon.getByTestId('cancel-appointment').click();
  await expect(soon.getByTestId('late-cancel-warning')).toBeVisible();
  expect(cancels).toEqual([]);
  await soon.getByTestId('confirm-late-cancel').click();

  await expect(page.getByTestId('cancel-notice')).toContainText('late cancellation');
  await expect(soon.getByTestId('appointment-status')).toHaveText('Cancelled (late)');
  expect(cancels).toEqual(['soon1']);
});
