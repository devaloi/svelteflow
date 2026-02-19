<script lang="ts">
	import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { basePieOptions } from '$lib/utils/chart-options';
	import type { ChartData, ChartOptions } from 'chart.js';

	Chart.register(PieController, ArcElement, Tooltip, Legend);

	let {
		data,
		options = {}
	}: {
		data: ChartData<'pie'>;
		options?: ChartOptions<'pie'>;
	} = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart<'pie'> | undefined;

	$effect(() => {
		const isDark = themeStore.isDark;
		const merged = { ...basePieOptions(isDark), ...options };

		if (chart) {
			chart.data = data;
			chart.options = merged;
			chart.update('none');
		} else if (canvas) {
			chart = new Chart(canvas, { type: 'pie', data, options: merged });
		}
	});

	$effect(() => {
		return () => {
			chart?.destroy();
		};
	});
</script>

<canvas bind:this={canvas}></canvas>
