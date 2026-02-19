<script lang="ts">
	import StatCard from '$lib/components/layout/StatCard.svelte';
	import ChartContainer from '$lib/components/charts/ChartContainer.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import { getChartColors } from '$lib/utils/chart-options';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { realtimeStore } from '$lib/stores/realtime.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let cpuHistory = $state(data.cpuHistory);
	let memoryHistory = $state(data.memoryHistory);

	$effect(() => {
		realtimeStore.connect();
		return () => {
			realtimeStore.disconnect();
		};
	});

	$effect(() => {
		const latest = realtimeStore.latestMetrics;
		if (latest.cpu_usage !== undefined) {
			const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
			cpuHistory = [...cpuHistory.slice(-47), { label: now, value: latest.cpu_usage }];
		}
		if (latest.memory_usage !== undefined) {
			const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
			memoryHistory = [...memoryHistory.slice(-47), { label: now, value: latest.memory_usage }];
		}
	});

	const currentCpu = $derived(realtimeStore.latestMetrics.cpu_usage ?? data.current.cpu);
	const currentMemory = $derived(realtimeStore.latestMetrics.memory_usage ?? data.current.memory);
	const currentErrorRate = $derived(realtimeStore.latestMetrics.error_rate ?? data.current.errorRate);
	const currentActiveUsers = $derived(realtimeStore.latestMetrics.active_users ?? data.current.activeUsers);

	const cpuChartData = $derived({
		labels: cpuHistory.map((h) => h.label),
		datasets: [
			{
				label: 'CPU %',
				data: cpuHistory.map((h) => h.value),
				borderColor: getChartColors(themeStore.isDark).datasets[3],
				backgroundColor: getChartColors(themeStore.isDark).datasets[3] + '20',
				fill: true,
				tension: 0.3,
				pointRadius: 0
			}
		]
	});

	const memoryChartData = $derived({
		labels: memoryHistory.map((h) => h.label),
		datasets: [
			{
				label: 'Memory %',
				data: memoryHistory.map((h) => h.value),
				borderColor: getChartColors(themeStore.isDark).datasets[4],
				backgroundColor: getChartColors(themeStore.isDark).datasets[4] + '20',
				fill: true,
				tension: 0.3,
				pointRadius: 0
			}
		]
	});

	const errorChartData = $derived({
		labels: data.errorHistory.map((h) => h.label),
		datasets: [
			{
				label: 'Error Rate %',
				data: data.errorHistory.map((h) => h.value),
				backgroundColor: getChartColors(themeStore.isDark).datasets[3]
			}
		]
	});
</script>

<svelte:head>
	<title>System Health — SvelteFlow</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<h1 class="text-2xl font-bold" style="color: var(--color-text)">System Health</h1>
		{#if realtimeStore.connected}
			<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
				style="background-color: color-mix(in srgb, var(--color-success) 15%, transparent); color: var(--color-success)">
				<span class="h-1.5 w-1.5 rounded-full" style="background-color: var(--color-success)"></span>
				Live
			</span>
		{/if}
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<StatCard label="CPU Usage" value="{currentCpu.toFixed(1)}" unit="%" trend={0} />
		<StatCard label="Memory Usage" value="{currentMemory.toFixed(1)}" unit="%" trend={0} />
		<StatCard label="Error Rate" value="{currentErrorRate.toFixed(2)}" unit="%" trend={-2.3} />
		<StatCard label="Active Users" value="{Math.round(currentActiveUsers)}" trend={5.1} />
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<ChartContainer title="CPU Usage (24h)">
			<LineChart data={cpuChartData} />
		</ChartContainer>

		<ChartContainer title="Memory Usage (24h)">
			<LineChart data={memoryChartData} />
		</ChartContainer>
	</div>

	<ChartContainer title="Error Rate (Hourly Average)">
		<BarChart data={errorChartData} />
	</ChartContainer>
</div>
