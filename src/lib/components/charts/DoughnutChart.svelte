<script lang="ts">
	import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { baseDoughnutOptions } from '$lib/utils/chart-options';
	import type { ChartData, ChartOptions } from 'chart.js';

	Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

	let {
		data,
		options = {}
	}: {
		data: ChartData<'doughnut'>;
		options?: ChartOptions<'doughnut'>;
	} = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart<'doughnut'> | undefined;

	$effect(() => {
		const isDark = themeStore.isDark;
		const merged = { ...baseDoughnutOptions(isDark), ...options };

		if (chart) {
			chart.data = data;
			chart.options = merged;
			chart.update('none');
		} else if (canvas) {
			chart = new Chart(canvas, { type: 'doughnut', data, options: merged });
		}
	});

	$effect(() => {
		return () => {
			chart?.destroy();
		};
	});
</script>

<canvas bind:this={canvas}></canvas>
