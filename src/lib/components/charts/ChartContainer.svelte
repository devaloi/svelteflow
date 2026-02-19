<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		loading = false,
		children
	}: { title: string; loading?: boolean; children: Snippet } = $props();
</script>

<div
	class="rounded-xl border p-4"
	style="background-color: var(--color-surface); border-color: var(--color-border)"
>
	<h3 class="mb-3 text-sm font-semibold" style="color: var(--color-text)">{title}</h3>
	{#if loading}
		<div class="flex h-64 items-center justify-center">
			<div
				class="h-64 w-full animate-pulse rounded-lg"
				style="background-color: var(--color-surface-alt)"
			></div>
		</div>
	{:else}
		<div class="relative h-64">
			{@render children()}
		</div>
	{/if}
</div>
