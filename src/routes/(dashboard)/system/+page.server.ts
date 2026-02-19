import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { metrics } from '$lib/server/schema';
import { sql, desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

	const latestCpu = db
		.select({ value: metrics.value, recordedAt: metrics.recordedAt })
		.from(metrics)
		.where(eq(metrics.name, 'cpu_usage'))
		.orderBy(desc(metrics.recordedAt))
		.limit(1)
		.get();

	const latestMemory = db
		.select({ value: metrics.value, recordedAt: metrics.recordedAt })
		.from(metrics)
		.where(eq(metrics.name, 'memory_usage'))
		.orderBy(desc(metrics.recordedAt))
		.limit(1)
		.get();

	const latestErrorRate = db
		.select({ value: metrics.value, recordedAt: metrics.recordedAt })
		.from(metrics)
		.where(eq(metrics.name, 'error_rate'))
		.orderBy(desc(metrics.recordedAt))
		.limit(1)
		.get();

	const latestActiveUsers = db
		.select({ value: metrics.value, recordedAt: metrics.recordedAt })
		.from(metrics)
		.where(eq(metrics.name, 'active_users'))
		.orderBy(desc(metrics.recordedAt))
		.limit(1)
		.get();

	const cpuHistory = db
		.select({
			hour: sql<string>`strftime('%H:%M', ${metrics.recordedAt})`.as('hour'),
			value: metrics.value
		})
		.from(metrics)
		.where(sql`${metrics.name} = 'cpu_usage' AND ${metrics.recordedAt} >= ${oneDayAgo}`)
		.orderBy(metrics.recordedAt)
		.all();

	const memoryHistory = db
		.select({
			hour: sql<string>`strftime('%H:%M', ${metrics.recordedAt})`.as('hour'),
			value: metrics.value
		})
		.from(metrics)
		.where(sql`${metrics.name} = 'memory_usage' AND ${metrics.recordedAt} >= ${oneDayAgo}`)
		.orderBy(metrics.recordedAt)
		.all();

	const errorHistory = db
		.select({
			hour: sql<string>`strftime('%H:00', ${metrics.recordedAt})`.as('hour'),
			avg: sql<number>`avg(${metrics.value})`.as('avg')
		})
		.from(metrics)
		.where(sql`${metrics.name} = 'error_rate' AND ${metrics.recordedAt} >= ${oneDayAgo}`)
		.groupBy(sql`strftime('%H:00', ${metrics.recordedAt})`)
		.orderBy(sql`strftime('%H:00', ${metrics.recordedAt})`)
		.all();

	return {
		current: {
			cpu: latestCpu?.value ?? 0,
			memory: latestMemory?.value ?? 0,
			errorRate: latestErrorRate?.value ?? 0,
			activeUsers: latestActiveUsers?.value ?? 0
		},
		cpuHistory: cpuHistory.map((h) => ({ label: h.hour, value: h.value })),
		memoryHistory: memoryHistory.map((h) => ({ label: h.hour, value: h.value })),
		errorHistory: errorHistory.map((h) => ({ label: h.hour, value: Math.round(h.avg * 100) / 100 }))
	};
};
