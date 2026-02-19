<script lang="ts">
	import StatCard from '$lib/components/layout/StatCard.svelte';
	import ChartContainer from '$lib/components/charts/ChartContainer.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import { getChartColors } from '$lib/utils/chart-options';
	import { themeStore } from '$lib/stores/theme.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const revenueChartData = $derived({
		labels: data.revenueTrend.map((p) => p.label.slice(5)),
		datasets: [
			{
				label: 'Revenue',
				data: data.revenueTrend.map((p) => p.value),
				borderColor: getChartColors(themeStore.isDark).datasets[0],
				backgroundColor: getChartColors(themeStore.isDark).datasets[0] + '20',
				fill: true,
				tension: 0.3
			}
		]
	});

	const activityChartData = $derived({
		labels: data.activityByType.map((a) => a.label),
		datasets: [
			{
				label: 'Events',
				data: data.activityByType.map((a) => a.value),
				backgroundColor: getChartColors(themeStore.isDark).datasets
			}
		]
	});
</script>

<svelte:head>
	<title>Overview — SvelteFlow</title>
</svelte:head>

<div class="space-y-6">
	<h1 class="text-2xl font-bold" style="color: var(--color-text)">Overview</h1>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each data.kpis as kpi (kpi.label)}
			<StatCard label={kpi.label} value={kpi.value} trend={kpi.trend} />
		{/each}
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<ChartContainer title="Revenue Trend (30 days)">
			<LineChart data={revenueChartData} />
		</ChartContainer>

		<ChartContainer title="Activity by Type">
			<BarChart data={activityChartData} />
		</ChartContainer>
	</div>
</div>
