<script lang="ts">
	import ChartContainer from '$lib/components/charts/ChartContainer.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import DataTable from '$lib/components/layout/DataTable.svelte';
	import { getChartColors } from '$lib/utils/chart-options';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let fromDate = $state(data.filters.from);
	let toDate = $state(data.filters.to);

	const productChartData = $derived({
		labels: data.byProduct.map((p) => p.label),
		datasets: [
			{
				label: 'Revenue',
				data: data.byProduct.map((p) => p.value),
				backgroundColor: getChartColors(themeStore.isDark).datasets
			}
		]
	});

	const trendChartData = $derived({
		labels: data.monthlyTrend.map((m) => m.label),
		datasets: [
			{
				label: 'Monthly Revenue',
				data: data.monthlyTrend.map((m) => m.value),
				borderColor: getChartColors(themeStore.isDark).datasets[0],
				backgroundColor: getChartColors(themeStore.isDark).datasets[0] + '20',
				fill: true,
				tension: 0.3
			}
		]
	});

	const tableColumns = [
		{ key: 'customer', label: 'Customer' },
		{ key: 'revenue', label: 'Revenue ($)' },
		{ key: 'orders', label: 'Orders' }
	];

	function handleExport() {
		const parts = ['type=sales'];
		if (fromDate) parts.push(`from=${encodeURIComponent(fromDate)}`);
		if (toDate) parts.push(`to=${encodeURIComponent(toDate)}`);
		window.open(`/api/export?${parts.join('&')}`, '_blank');
	}
</script>

<svelte:head>
	<title>Sales Analytics — SvelteFlow</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<h1 class="text-2xl font-bold" style="color: var(--color-text)">Sales Analytics</h1>

		<form
			method="POST"
			action="?/filter"
			class="flex flex-wrap items-center gap-3"
			use:enhance={() => {
				return async () => {
					const parts: string[] = [];
					if (fromDate) parts.push(`from=${encodeURIComponent(fromDate)}`);
					if (toDate) parts.push(`to=${encodeURIComponent(toDate)}`);
					const qs = parts.length ? `?${parts.join('&')}` : '';
					await goto(`/sales${qs}`, { invalidateAll: true });
				};
			}}
		>
			<input
				type="date"
				name="from"
				bind:value={fromDate}
				class="rounded-lg border px-3 py-1.5 text-sm"
				style="background-color: var(--color-bg); border-color: var(--color-border); color: var(--color-text)"
			/>
			<input
				type="date"
				name="to"
				bind:value={toDate}
				class="rounded-lg border px-3 py-1.5 text-sm"
				style="background-color: var(--color-bg); border-color: var(--color-border); color: var(--color-text)"
			/>
			<button
				type="submit"
				class="rounded-lg px-4 py-1.5 text-sm font-medium text-white"
				style="background-color: var(--color-primary)"
			>
				Filter
			</button>
		</form>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<ChartContainer title="Revenue by Product">
			<BarChart data={productChartData} />
		</ChartContainer>

		<ChartContainer title="Monthly Trend">
			<LineChart data={trendChartData} />
		</ChartContainer>
	</div>

	<div>
		<h2 class="mb-3 text-lg font-semibold" style="color: var(--color-text)">Top Customers</h2>
		<DataTable columns={tableColumns} rows={data.topCustomers} onExport={handleExport} />
	</div>
</div>
