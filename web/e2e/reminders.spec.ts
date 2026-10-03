/**
 * Story: reminder-notifications — the customer sees reminders (service, date/time,
 * provider) on /#/reminders, or an empty state. Hermetic: every /api/** call mocked.
 */
import { test, expect, type Page } from '@playwright/test';

async function mockApi(page: Page, reminders: unknown[]): Promise<void> {
  const user = { id: '3', email: 'user@example.com', name: 'user', role: 'USER' };
  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const method = req.method().toUpperCase();
    const apiPath = new URL(req.url()).pathname
      .replace(/^.*\/api\//, '').replace(/^api\//, '').replace(/^\//, '');
    const json = (body: unknown, status = 200) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (method === 'GET' && apiPath === 'users/me') return json(user);
    if (method === 'GET' && apiPath === 'reminders/mine') return json(reminders);
    if (method === 'GET') return json([]);
    return json({ ok: true });
  });
  await page.addInitScript((u) => {
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('isAuthenticated', 'true');
  }, user);
}

test.use({ serviceWorkers: 'block' });

test('a customer sees a reminder naming the service, time and provider', async ({ page }) => {
  await mockApi(page, [{
    id: 'r1', appointmentId: 'a1', kind: '24H', subject: 'Appointment reminder',
    message: 'Reminder: your Haircut appointment with Pat Provider is on 2999-01-15 at 09:00 UTC.',
    serviceName: 'Haircut', providerName: 'Pat Provider',
    startsAt: '2999-01-15T09:00:00.000Z', sentAt: '2999-01-14T09:00:00.000Z',
  }]);
  await page.goto('/#/reminders');
  await expect(page.locator('h1')).toContainText('Reminders', { timeout: 10_000 });
  await expect(page.getByTestId('reminders-list')).toBeVisible();
  await expect(page.getByTestId('reminder-item')).toHaveCount(1);
  await expect(page.getByTestId('reminder-service')).toHaveText('Haircut');
  await expect(page.getByTestId('reminder-provider')).toContainText('Pat Provider');
  await expect(page.getByTestId('reminder-item')).toContainText('2999-01-15');
  await expect(page.locator('body')).not.toContainText('Your content will appear here');
  await expect(page.locator('aside.sidebar nav.sidebar-nav')).toContainText('Reminders');
});

test('with no reminders the empty state is shown', async ({ page }) => {
  await mockApi(page, []);
  await page.goto('/#/reminders');
  await expect(page.locator('h1')).toContainText('Reminders', { timeout: 10_000 });
  await expect(page.getByTestId('reminders-empty')).toContainText('No reminders yet');
});
