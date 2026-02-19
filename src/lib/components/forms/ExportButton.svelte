<script lang="ts">
	let {
		type = 'sales',
		from = '',
		to = ''
	}: {
		type?: string;
		from?: string;
		to?: string;
	} = $props();

	function handleExport() {
		const params = new URLSearchParams({ type });
		if (from) params.set('from', from);
		if (to) params.set('to', to);
		window.open(`/api/export?${params}`, '_blank');
	}
</script>

<button
	onclick={handleExport}
	class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
	style="background-color: var(--color-surface-alt); color: var(--color-text-muted)"
>
	📥 Export CSV
</button>
