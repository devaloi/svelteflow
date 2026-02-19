import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { sales } from '$lib/server/schema';
import { sql, gte, lte, and, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const from = url.searchParams.get('from') ?? '';
	const to = url.searchParams.get('to') ?? '';

	const conditions = [];
	if (from) conditions.push(gte(sales.createdAt, new Date(from).toISOString()));
	if (to) conditions.push(lte(sales.createdAt, new Date(to).toISOString()));

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const byProduct = db
		.select({
			product: sales.product,
			total: sql<number>`sum(${sales.amount})`.as('total')
		})
		.from(sales)
		.where(where)
		.groupBy(sales.product)
		.orderBy(desc(sql`sum(${sales.amount})`))
		.all();

	const monthlyTrend = db
		.select({
			month: sql<string>`strftime('%Y-%m', ${sales.createdAt})`.as('month'),
			total: sql<number>`sum(${sales.amount})`.as('total')
		})
		.from(sales)
		.where(where)
		.groupBy(sql`strftime('%Y-%m', ${sales.createdAt})`)
		.orderBy(sql`strftime('%Y-%m', ${sales.createdAt})`)
		.all();

	const topCustomers = db
		.select({
			customer: sales.customer,
			total: sql<number>`sum(${sales.amount})`.as('total'),
			count: sql<number>`count(*)`.as('count')
		})
		.from(sales)
		.where(where)
		.groupBy(sales.customer)
		.orderBy(desc(sql`sum(${sales.amount})`))
		.limit(10)
		.all();

	return {
		byProduct: byProduct.map((p) => ({
			label: p.product,
			value: Math.round(p.total)
		})),
		monthlyTrend: monthlyTrend.map((m) => ({
			label: m.month,
			value: Math.round(m.total)
		})),
		topCustomers: topCustomers.map((c) => ({
			customer: c.customer,
			revenue: Math.round(c.total),
			orders: c.count
		})),
		filters: { from, to }
	};
};

export const actions: Actions = {
	filter: async ({ request }) => {
		const data = await request.formData();
		const from = data.get('from')?.toString() ?? '';
		const to = data.get('to')?.toString() ?? '';
		const params = new URLSearchParams();
		if (from) params.set('from', from);
		if (to) params.set('to', to);
		return { from, to };
	}
};
