<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div class="flex min-h-screen">
	<Sidebar />
	<div class="flex flex-1 flex-col md:ml-64">
		<Header userName={data.user?.name} />
		<main class="flex-1 p-6" style="background-color: var(--color-bg)">
			{@render children()}
		</main>
	</div>
</div>
