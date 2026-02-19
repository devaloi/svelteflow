import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { sales, metrics } from '$lib/server/schema';
import { gte, lte, and } from 'drizzle-orm';
import { toCSV } from '$lib/utils/csv';

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type') ?? 'sales';
	const from = url.searchParams.get('from');
	const to = url.searchParams.get('to');

	let csv: string;
	let filename: string;

	if (type === 'metrics') {
		const conditions = [];
		if (from) conditions.push(gte(metrics.recordedAt, new Date(from).toISOString()));
		if (to) conditions.push(lte(metrics.recordedAt, new Date(to).toISOString()));
		const where = conditions.length > 0 ? and(...conditions) : undefined;

		const rows = db.select().from(metrics).where(where).all();
		csv = toCSV(rows);
		filename = `metrics-${new Date().toISOString().slice(0, 10)}.csv`;
	} else {
		const conditions = [];
		if (from) conditions.push(gte(sales.createdAt, new Date(from).toISOString()));
		if (to) conditions.push(lte(sales.createdAt, new Date(to).toISOString()));
		const where = conditions.length > 0 ? and(...conditions) : undefined;

		const rows = db.select().from(sales).where(where).all();
		csv = toCSV(rows);
		filename = `sales-${new Date().toISOString().slice(0, 10)}.csv`;
	}

	return new Response(csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
};
