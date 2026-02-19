import { test, expect } from '@playwright/test';

test.describe('CSV Export', () => {
	test('export endpoint returns CSV data', async ({ request }) => {
		const response = await request.get('/api/export?type=sales');
		expect(response.status()).toBe(200);
		const contentType = response.headers()['content-type'];
		expect(contentType).toContain('text/csv');

		const body = await response.text();
		const lines = body.split('\n');
		expect(lines.length).toBeGreaterThan(1);
		expect(lines[0]).toContain('product');
		expect(lines[0]).toContain('amount');
	});

	test('export endpoint supports metrics type', async ({ request }) => {
		const response = await request.get('/api/export?type=metrics');
		expect(response.status()).toBe(200);
		const body = await response.text();
		expect(body).toContain('name');
		expect(body).toContain('value');
	});
});
