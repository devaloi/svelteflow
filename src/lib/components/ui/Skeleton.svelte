<script lang="ts">
	let { loading = false }: { loading?: boolean } = $props();
</script>

{#if loading}
	<div class="animate-pulse space-y-3">
		<div class="h-4 w-3/4 rounded" style="background-color: var(--color-surface-alt)"></div>
		<div class="h-4 w-1/2 rounded" style="background-color: var(--color-surface-alt)"></div>
		<div class="h-4 w-5/6 rounded" style="background-color: var(--color-surface-alt)"></div>
		<div class="h-4 w-2/3 rounded" style="background-color: var(--color-surface-alt)"></div>
	</div>
{/if}
