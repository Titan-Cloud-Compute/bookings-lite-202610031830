/**
 * Foundation role model: the client must accept every backend UserRole
 * (ADMIN | MANAGER | USER). A MANAGER session used to fail the stored-user
 * shape check, so a reload wiped it and bounced the manager to /login.
 * Hermetic: static SPA, every /api/** call mocked.
 */
import { test, expect, type Page } from '@playwright/test';

async function mockApi(page: Page, role: string): Promise<void> {
  const store: { user: { id: string; email: string; role: string } | null } = { user: null };
  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const method = req.method().toUpperCase();
    const apiPath = new URL(req.url()).pathname
      .replace(/^.*\/api\//, '').replace(/^api\//, '').replace(/^\//, '');
    const json = (body: unknown, status = 200) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

    if (method === 'POST' && apiPath === 'auth/login') {
      store.user = { id: '2', email: 'manager@example.com', role };
      return json(store.user);
    }
    if (method === 'GET' && apiPath === 'users/me') {
      return store.user ? json(store.user) : json({ message: 'Unauthorized' }, 401);
    }
    if (method === 'GET') return json([]);
    return json({ ok: true });
  });
}

test.use({ serviceWorkers: 'block' });

test('a MANAGER signs in, keeps the MANAGER role, and survives a reload of /dashboard', async ({ page }) => {
  await mockApi(page, 'MANAGER');
  await page.goto('/#/login');
  await page.locator('#email').fill('manager@example.com');
  await page.locator('#password').fill('password1234');
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/#\/dashboard/, { timeout: 10_000 });

  const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('user') || 'null')?.role);
  expect(await stored()).toBe('MANAGER');

  await page.reload();
  await page.waitForLoadState('networkidle');
  expect(page.url()).not.toMatch(/#\/login/);
  expect(await stored()).toBe('MANAGER');
});

test('a stored MANAGER session is restored on a direct load of /dashboard', async ({ page }) => {
  await mockApi(page, 'MANAGER');
  await page.addInitScript(() => {
    if (!localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify({
        id: '2', email: 'manager@example.com', name: 'manager', role: 'MANAGER',
      }));
      localStorage.setItem('isAuthenticated', 'true');
    }
  });
  await page.goto('/#/dashboard');
  await page.waitForLoadState('networkidle');
  expect(page.url()).not.toMatch(/#\/login/);
  const role = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || 'null')?.role);
  expect(role).toBe('MANAGER');
});
