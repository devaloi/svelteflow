import type { RequestHandler } from './$types';
import { createSSEStream, sleep } from '$lib/server/sse';

const METRICS = [
	{ name: 'cpu_usage', unit: '%', base: 45, variance: 5 },
	{ name: 'memory_usage', unit: '%', base: 62, variance: 2 },
	{ name: 'error_rate', unit: '%', base: 0.5, variance: 0.3 },
	{ name: 'active_users', unit: 'count', base: 1500, variance: 100 }
];

export const GET: RequestHandler = async ({ request }) => {
	let lastValues: Record<string, number> = {};
	for (const m of METRICS) {
		lastValues[m.name] = m.base;
	}

	const stream = createSSEStream(request.signal, async function* () {
		let tick = 0;

		while (!request.signal.aborted) {
			for (const m of METRICS) {
				const prev = lastValues[m.name];
				const delta = (Math.random() - 0.5) * 2 * m.variance;
				const value = Math.max(0, Math.min(m.base * 2, prev + delta));
				lastValues[m.name] = value;

				yield {
					event: 'metric',
					data: JSON.stringify({
						name: m.name,
						value: Math.round(value * 100) / 100,
						unit: m.unit,
						timestamp: new Date().toISOString()
					})
				};
			}

			tick++;
			if (tick % 7 === 0) {
				yield { event: 'heartbeat', data: '{}' };
			}

			await sleep(2000);
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
