import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sales, metrics, events, users } from '$lib/server/schema';
import { sql, gte, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

	const totalRevenue = db
		.select({ total: sql<number>`sum(${sales.amount})` })
		.from(sales)
		.get();

	const totalUsers = db
		.select({ count: sql<number>`count(*)` })
		.from(users)
		.get();

	const recentSalesCount = db
		.select({ count: sql<number>`count(*)` })
		.from(sales)
		.where(gte(sales.createdAt, thirtyDaysAgo))
		.get();

	const latestErrorRate = db
		.select({ value: metrics.value })
		.from(metrics)
		.where(sql`${metrics.name} = 'error_rate'`)
		.orderBy(desc(metrics.recordedAt))
		.limit(1)
		.get();

	const revenueTrend = db
		.select({
			day: sql<string>`date(${sales.createdAt})`.as('day'),
			total: sql<number>`sum(${sales.amount})`.as('total')
		})
		.from(sales)
		.where(gte(sales.createdAt, thirtyDaysAgo))
		.groupBy(sql`date(${sales.createdAt})`)
		.orderBy(sql`date(${sales.createdAt})`)
		.all();

	const activityByType = db
		.select({
			type: events.type,
			count: sql<number>`count(*)`.as('count')
		})
		.from(events)
		.where(gte(events.createdAt, thirtyDaysAgo))
		.groupBy(events.type)
		.all();

	return {
		kpis: [
			{
				label: 'Total Revenue',
				value: `$${Math.round(totalRevenue?.total ?? 0).toLocaleString()}`,
				trend: 12.5
			},
			{
				label: 'Total Users',
				value: totalUsers?.count ?? 0,
				trend: 8.2
			},
			{
				label: 'Sales (30d)',
				value: recentSalesCount?.count ?? 0,
				trend: 5.1
			},
			{
				label: 'Error Rate',
				value: `${(latestErrorRate?.value ?? 0).toFixed(2)}%`,
				trend: -2.3
			}
		],
		revenueTrend: revenueTrend.map((r) => ({
			label: r.day,
			value: Math.round(r.total)
		})),
		activityByType: activityByType.map((a) => ({
			label: a.type,
			value: a.count
		}))
	};
};
