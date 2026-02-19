<script lang="ts">
	let {
		label,
		value,
		trend = 0,
		unit = ''
	}: {
		label: string;
		value: string | number;
		trend?: number;
		unit?: string;
	} = $props();

	const trendIcon = $derived(trend > 0 ? '↑' : trend < 0 ? '↓' : '→');
	const trendColor = $derived(
		trend > 0
			? 'var(--color-success)'
			: trend < 0
				? 'var(--color-danger)'
				: 'var(--color-text-muted)'
	);
</script>

<div
	class="rounded-xl border p-5"
	style="background-color: var(--color-surface); border-color: var(--color-border)"
>
	<p class="text-sm font-medium" style="color: var(--color-text-muted)">{label}</p>
	<div class="mt-2 flex items-baseline gap-2">
		<span class="text-2xl font-bold" style="color: var(--color-text)">{value}{unit}</span>
		{#if trend !== 0}
			<span class="text-sm font-medium" style="color: {trendColor}">
				{trendIcon}
				{Math.abs(trend).toFixed(1)}%
			</span>
		{/if}
	</div>
</div>
