<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	let { userName = 'User' }: { userName?: string } = $props();

	const breadcrumbs = $derived.by(() => {
		const pathname = $page.url.pathname;
		if (pathname === '/') return [{ label: 'Overview' }];
		const segments = pathname.split('/').filter(Boolean);
		return segments.map((s) => ({
			label: s.charAt(0).toUpperCase() + s.slice(1)
		}));
	});
</script>

<header
	class="flex h-16 items-center justify-between border-b px-6"
	style="background-color: var(--color-surface); border-color: var(--color-border)"
>
	<div class="flex items-center gap-2 pl-10 md:pl-0">
		{#each breadcrumbs as crumb, i}
			{#if i > 0}
				<span style="color: var(--color-text-muted)">/</span>
			{/if}
			<span class="text-sm font-medium" style="color: var(--color-text)">{crumb.label}</span>
		{/each}
	</div>

	<div class="flex items-center gap-4">
		<span class="text-sm" style="color: var(--color-text-muted)">{userName}</span>
		<form method="POST" action="/logout" use:enhance>
			<button
				type="submit"
				class="rounded-lg px-3 py-1.5 text-sm transition-colors"
				style="color: var(--color-text-muted); background-color: var(--color-surface-alt)"
			>
				Logout
			</button>
		</form>
	</div>
</header>
