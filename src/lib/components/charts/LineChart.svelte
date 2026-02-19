<script lang="ts">
	import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { baseLineOptions, getChartColors } from '$lib/utils/chart-options';
	import type { ChartData, ChartOptions } from 'chart.js';

	Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

	let {
		data,
		options = {}
	}: {
		data: ChartData<'line'>;
		options?: ChartOptions<'line'>;
	} = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart<'line'> | undefined;

	$effect(() => {
		const isDark = themeStore.isDark;
		const merged = { ...baseLineOptions(isDark), ...options };

		if (chart) {
			chart.data = data;
			chart.options = merged;
			chart.update('none');
		} else if (canvas) {
			chart = new Chart(canvas, { type: 'line', data, options: merged });
		}
	});

	$effect(() => {
		return () => {
			chart?.destroy();
		};
	});
</script>

<canvas bind:this={canvas}></canvas>
