<script lang="ts">
	import { page } from '$app/stores';
	import { themeStore } from '$lib/stores/theme.svelte';

	let sidebarOpen = $state(false);

	const navItems = [
		{ href: '/', label: 'Overview', icon: '📊' },
		{ href: '/sales', label: 'Sales', icon: '💰' },
		{ href: '/users', label: 'Users', icon: '👥' },
		{ href: '/system', label: 'System', icon: '⚙️' }
	];

	function isActive(href: string, pathname: string): boolean {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}

	function closeSidebar() {
		sidebarOpen = false;
	}
</script>

<!-- Mobile overlay -->
{#if sidebarOpen}
	<button
		class="fixed inset-0 z-30 bg-black/50 md:hidden"
		onclick={closeSidebar}
		aria-label="Close sidebar"
	></button>
{/if}

<!-- Hamburger button -->
<button
	class="fixed top-4 left-4 z-50 rounded-lg p-2 md:hidden"
	style="background-color: var(--color-surface); border: 1px solid var(--color-border)"
	onclick={() => (sidebarOpen = !sidebarOpen)}
	aria-label="Toggle sidebar"
>
	<span class="text-xl">{sidebarOpen ? '✕' : '☰'}</span>
</button>

<aside
	class="fixed top-0 left-0 z-40 flex h-full w-64 flex-col border-r transition-transform duration-200 md:translate-x-0"
	class:max-md:-translate-x-full={!sidebarOpen}
	class:max-md:translate-x-0={sidebarOpen}
	style="background-color: var(--color-surface); border-color: var(--color-border)"
>
	<div class="flex h-16 items-center px-6">
		<a href="/" class="text-xl font-bold" style="color: var(--color-primary)"> 📈 SvelteFlow </a>
	</div>

	<nav class="flex-1 px-3 py-4">
		{#each navItems as item (item.href)}
			{@const active = isActive(item.href, $page.url.pathname)}
			<a
				href={item.href}
				onclick={closeSidebar}
				class="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
				style={active
					? `background-color: color-mix(in srgb, var(--color-primary) 15%, transparent); color: var(--color-primary)`
					: `color: var(--color-text-muted)`}
			>
				<span class="text-lg">{item.icon}</span>
				{item.label}
			</a>
		{/each}
	</nav>

	<div class="border-t p-4" style="border-color: var(--color-border)">
		<button
			onclick={themeStore.toggle}
			class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
			style="color: var(--color-text-muted)"
		>
			<span class="text-lg">{themeStore.isDark ? '☀️' : '🌙'}</span>
			{themeStore.isDark ? 'Light mode' : 'Dark mode'}
		</button>
	</div>
</aside>
