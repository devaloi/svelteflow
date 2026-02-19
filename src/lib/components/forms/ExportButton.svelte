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
		const parts = [`type=${encodeURIComponent(type)}`];
		if (from) parts.push(`from=${encodeURIComponent(from)}`);
		if (to) parts.push(`to=${encodeURIComponent(to)}`);
		window.open(`/api/export?${parts.join('&')}`, '_blank');
	}
</script>

<button
	onclick={handleExport}
	class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
	style="background-color: var(--color-surface-alt); color: var(--color-text-muted)"
>
	📥 Export CSV
</button>
