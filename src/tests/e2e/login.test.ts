import { test, expect } from '@playwright/test';

test.describe('Login', () => {
	test('shows login page', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toHaveText('SvelteFlow');
		await expect(page.locator('input[name="email"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
	});

	test('rejects invalid credentials', async ({ page }) => {
		await page.goto('/login');
		await page.fill('input[name="email"]', 'wrong@test.com');
		await page.fill('input[name="password"]', 'wrongpass');
		await page.click('button[type="submit"]');
		await expect(page.locator('text=Invalid email or password')).toBeVisible();
	});

	test('logs in with valid credentials and redirects to dashboard', async ({ page }) => {
		await page.goto('/login');
		await page.fill('input[name="email"]', 'admin@demo.com');
		await page.fill('input[name="password"]', 'password');
		await page.click('button[type="submit"]');
		await expect(page).toHaveURL('/');
		await expect(page.locator('text=Overview')).toBeVisible();
	});
});
