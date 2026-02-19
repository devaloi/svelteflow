import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import pkg from 'bcryptjs';
const { hashSync } = pkg;
import { users, sales, metrics, events } from './schema';

const sqlite = new Database('data.db');
sqlite.pragma('journal_mode = WAL');
const db = drizzle(sqlite);

const PRODUCTS = [
	'Analytics Pro',
	'Dashboard Suite',
	'Data Connector',
	'Report Builder',
	'API Gateway'
];
const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
const CUSTOMERS = [
	'Acme Corp',
	'Globex Inc',
	'Initech',
	'Umbrella Co',
	'Stark Industries',
	'Wayne Enterprises',
	'Oscorp',
	'LexCorp',
	'Cyberdyne',
	'Soylent Corp',
	'Tyrell Corp',
	'Weyland-Yutani',
	'Massive Dynamic',
	'Hooli',
	'Pied Piper',
	'Aperture Science',
	'Black Mesa',
	'Wonka Industries',
	'Dunder Mifflin',
	'Sterling Cooper'
];
const EVENT_TYPES = ['page_view', 'api_call', 'login', 'error', 'deployment'];
const EVENT_SOURCES = ['web', 'mobile', 'api', 'cron', 'webhook'];
const METRIC_NAMES = [
	{ name: 'cpu_usage', unit: '%', base: 45, variance: 30 },
	{ name: 'memory_usage', unit: '%', base: 62, variance: 15 },
	{ name: 'error_rate', unit: '%', base: 0.5, variance: 1.5 },
	{ name: 'active_users', unit: 'count', base: 1500, variance: 800 }
];

function randomBetween(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

function randomItem<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number): string {
	const now = Date.now();
	const past = now - daysAgo * 24 * 60 * 60 * 1000;
	return new Date(past + Math.random() * (now - past)).toISOString();
}

async function seed() {
	console.log('Seeding database...');

	sqlite.exec('DELETE FROM events');
	sqlite.exec('DELETE FROM metrics');
	sqlite.exec('DELETE FROM sales');
	sqlite.exec('DELETE FROM sessions');
	sqlite.exec('DELETE FROM users');

	db.insert(users)
		.values({
			email: 'admin@demo.com',
			passwordHash: hashSync('password', 10),
			name: 'Admin User',
			role: 'admin'
		})
		.run();
	console.log('  ✓ Admin user created (admin@demo.com / password)');

	const salesData = Array.from({ length: 500 }, () => ({
		product: randomItem(PRODUCTS),
		amount: Math.round(randomBetween(50, 5000) * 100) / 100,
		customer: randomItem(CUSTOMERS),
		region: randomItem(REGIONS),
		createdAt: randomDate(365)
	}));

	for (let i = 0; i < salesData.length; i += 50) {
		db.insert(sales)
			.values(salesData.slice(i, i + 50))
			.run();
	}
	console.log('  ✓ 500 sales records created');

	const metricsData: Array<{ name: string; value: number; unit: string; recordedAt: string }> = [];
	const now = Date.now();
	for (let i = 0; i < 30; i++) {
		for (let h = 0; h < 24; h++) {
			const timestamp = new Date(now - (30 - i) * 24 * 60 * 60 * 1000 + h * 60 * 60 * 1000);
			for (const m of METRIC_NAMES) {
				const hourFactor = Math.sin((h / 24) * Math.PI) * 0.3;
				const value = Math.max(
					0,
					m.base + (Math.random() - 0.5) * m.variance + m.base * hourFactor
				);
				metricsData.push({
					name: m.name,
					value: Math.round(value * 100) / 100,
					unit: m.unit,
					recordedAt: timestamp.toISOString()
				});
			}
		}
	}

	for (let i = 0; i < metricsData.length; i += 100) {
		db.insert(metrics)
			.values(metricsData.slice(i, i + 100))
			.run();
	}
	console.log(`  ✓ ${metricsData.length} metric data points created`);

	const eventsData = Array.from({ length: 100 }, () => ({
		type: randomItem(EVENT_TYPES),
		source: randomItem(EVENT_SOURCES),
		payload: JSON.stringify({
			statusCode: randomItem([200, 200, 200, 201, 400, 404, 500]),
			duration: Math.round(randomBetween(10, 2000)),
			path: randomItem(['/api/users', '/api/sales', '/dashboard', '/login', '/api/metrics'])
		}),
		createdAt: randomDate(30)
	}));

	for (let i = 0; i < eventsData.length; i += 50) {
		db.insert(events)
			.values(eventsData.slice(i, i + 50))
			.run();
	}
	console.log('  ✓ 100 system events created');

	console.log('Seed complete!');
}

seed();
