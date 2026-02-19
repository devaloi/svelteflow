import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/login');
		await page.fill('input[name="email"]', 'admin@demo.com');
		await page.fill('input[name="password"]', 'password');
		await page.click('button[type="submit"]');
		await expect(page).toHaveURL('/');
	});

	test('overview page loads with KPI cards', async ({ page }) => {
		await expect(page.locator('text=Total Revenue')).toBeVisible();
		await expect(page.locator('text=Total Users')).toBeVisible();
	});

	test('navigates to sales page', async ({ page }) => {
		await page.click('a[href="/sales"]');
		await expect(page).toHaveURL('/sales');
		await expect(page.locator('text=Sales Analytics')).toBeVisible();
	});

	test('navigates to users page', async ({ page }) => {
		await page.click('a[href="/users"]');
		await expect(page).toHaveURL('/users');
		await expect(page.locator('text=User Metrics')).toBeVisible();
	});

	test('navigates to system page', async ({ page }) => {
		await page.click('a[href="/system"]');
		await expect(page).toHaveURL('/system');
		await expect(page.locator('text=System Health')).toBeVisible();
	});

	test('dark mode toggle works', async ({ page }) => {
		const html = page.locator('html');
		await page.click('text=Dark mode');
		await expect(html).toHaveClass(/dark/);
		await page.click('text=Light mode');
		await expect(html).not.toHaveClass(/dark/);
	});
});
