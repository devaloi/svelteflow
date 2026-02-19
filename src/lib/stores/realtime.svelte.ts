import { browser } from '$app/environment';

function createRealtimeStore() {
	let connected = $state(false);
	let latestMetrics = $state<Record<string, number>>({});
	let eventSource: EventSource | null = null;

	function connect() {
		if (!browser || eventSource) return;

		eventSource = new EventSource('/api/metrics/stream');

		eventSource.addEventListener('metric', (event) => {
			const data = JSON.parse(event.data);
			latestMetrics = { ...latestMetrics, [data.name]: data.value };
		});

		eventSource.onopen = () => {
			connected = true;
		};

		eventSource.onerror = () => {
			connected = false;
			disconnect();
			setTimeout(connect, 5000);
		};
	}

	function disconnect() {
		if (eventSource) {
			eventSource.close();
			eventSource = null;
			connected = false;
		}
	}

	return {
		get connected() {
			return connected;
		},
		get latestMetrics() {
			return latestMetrics;
		},
		connect,
		disconnect
	};
}

export const realtimeStore = createRealtimeStore();
