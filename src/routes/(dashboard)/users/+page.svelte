<script lang="ts">
	import ChartContainer from '$lib/components/charts/ChartContainer.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import PieChart from '$lib/components/charts/PieChart.svelte';
	import DoughnutChart from '$lib/components/charts/DoughnutChart.svelte';
	import DataTable from '$lib/components/layout/DataTable.svelte';
	import { getChartColors } from '$lib/utils/chart-options';
	import { themeStore } from '$lib/stores/theme.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const signupsChartData = $derived({
		labels: data.signupsByMonth.map((s) => s.label),
		datasets: [
			{
				label: 'Signups',
				data: data.signupsByMonth.map((s) => s.value),
				borderColor: getChartColors(themeStore.isDark).datasets[1],
				backgroundColor: getChartColors(themeStore.isDark).datasets[1] + '20',
				fill: true,
				tension: 0.3
			}
		]
	});

	const demographicsChartData = $derived({
		labels: data.regionBreakdown.map((r) => r.label),
		datasets: [
			{
				data: data.regionBreakdown.map((r) => r.value),
				backgroundColor: getChartColors(themeStore.isDark).datasets
			}
		]
	});

	const retentionChartData = $derived({
		labels: data.roleBreakdown.map((r) => r.label),
		datasets: [
			{
				data: data.roleBreakdown.map((r) => r.value),
				backgroundColor: getChartColors(themeStore.isDark).datasets.slice(
					0,
					data.roleBreakdown.length
				)
			}
		]
	});

	const growthColumns = [
		{ key: 'month', label: 'Month' },
		{ key: 'customers', label: 'Customers' },
		{ key: 'revenue', label: 'Revenue ($)' }
	];
</script>

<svelte:head>
	<title>User Metrics — SvelteFlow</title>
</svelte:head>

<div class="space-y-6">
	<h1 class="text-2xl font-bold" style="color: var(--color-text)">User Metrics</h1>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<ChartContainer title="Signups Over Time">
			<LineChart data={signupsChartData} />
		</ChartContainer>

		<ChartContainer title="Demographics (Region)">
			<PieChart data={demographicsChartData} />
		</ChartContainer>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<ChartContainer title="Retention (Roles)">
			<DoughnutChart data={retentionChartData} />
		</ChartContainer>

		<div>
			<h2 class="mb-3 text-lg font-semibold" style="color: var(--color-text)">Customer Growth</h2>
			<DataTable columns={growthColumns} rows={data.customerGrowth} />
		</div>
	</div>
</div>
