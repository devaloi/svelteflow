import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sales, users } from '$lib/server/schema';
import { sql } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const signupsByMonth = db
		.select({
			month: sql<string>`strftime('%Y-%m', ${users.createdAt})`.as('month'),
			count: sql<number>`count(*)`.as('count')
		})
		.from(users)
		.groupBy(sql`strftime('%Y-%m', ${users.createdAt})`)
		.orderBy(sql`strftime('%Y-%m', ${users.createdAt})`)
		.all();

	const roleBreakdown = db
		.select({
			role: users.role,
			count: sql<number>`count(*)`.as('count')
		})
		.from(users)
		.groupBy(users.role)
		.all();

	const regionBreakdown = db
		.select({
			region: sales.region,
			count: sql<number>`count(distinct ${sales.customer})`.as('count')
		})
		.from(sales)
		.groupBy(sales.region)
		.all();

	const customerGrowth = db
		.select({
			month: sql<string>`strftime('%Y-%m', ${sales.createdAt})`.as('month'),
			customers: sql<number>`count(distinct ${sales.customer})`.as('customers'),
			revenue: sql<number>`sum(${sales.amount})`.as('revenue')
		})
		.from(sales)
		.groupBy(sql`strftime('%Y-%m', ${sales.createdAt})`)
		.orderBy(sql`strftime('%Y-%m', ${sales.createdAt})`)
		.all();

	return {
		signupsByMonth: signupsByMonth.map((s) => ({
			label: s.month,
			value: s.count
		})),
		roleBreakdown: roleBreakdown.map((r) => ({
			label: r.role,
			value: r.count
		})),
		regionBreakdown: regionBreakdown.map((r) => ({
			label: r.region,
			value: r.count
		})),
		customerGrowth: customerGrowth.map((c) => ({
			month: c.month,
			customers: c.customers,
			revenue: Math.round(c.revenue)
		}))
	};
};
