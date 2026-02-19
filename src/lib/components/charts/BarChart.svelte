<script lang="ts">
	import {
		Chart,
		BarController,
		BarElement,
		LinearScale,
		CategoryScale,
		Tooltip,
		Legend
	} from 'chart.js';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { baseBarOptions } from '$lib/utils/chart-options';
	import type { ChartData, ChartOptions } from 'chart.js';

	Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

	let {
		data,
		options = {}
	}: {
		data: ChartData<'bar'>;
		options?: ChartOptions<'bar'>;
	} = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart<'bar'> | undefined;

	$effect(() => {
		const isDark = themeStore.isDark;
		const merged = { ...baseBarOptions(isDark), ...options };

		if (chart) {
			chart.data = data;
			chart.options = merged;
			chart.update('none');
		} else if (canvas) {
			chart = new Chart(canvas, { type: 'bar', data, options: merged });
		}
	});

	$effect(() => {
		return () => {
			chart?.destroy();
		};
	});
</script>

<canvas bind:this={canvas}></canvas>
