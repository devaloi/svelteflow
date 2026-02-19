<script lang="ts">
	type Row = Record<string, string | number>;

	let {
		columns,
		rows,
		pageSize = 10,
		onExport
	}: {
		columns: { key: string; label: string; sortable?: boolean }[];
		rows: Row[];
		pageSize?: number;
		onExport?: () => void;
	} = $props();

	let sortKey = $state('');
	let sortDir = $state<'asc' | 'desc'>('asc');
	let currentPage = $state(0);
	let pageSizeOption = $state(pageSize);

	const sortedRows = $derived.by(() => {
		if (!sortKey) return rows;
		return [...rows].sort((a, b) => {
			const av = a[sortKey];
			const bv = b[sortKey];
			if (typeof av === 'number' && typeof bv === 'number') {
				return sortDir === 'asc' ? av - bv : bv - av;
			}
			const cmp = String(av).localeCompare(String(bv));
			return sortDir === 'asc' ? cmp : -cmp;
		});
	});

	const totalPages = $derived(Math.max(1, Math.ceil(sortedRows.length / pageSizeOption)));
	const pagedRows = $derived(
		sortedRows.slice(currentPage * pageSizeOption, (currentPage + 1) * pageSizeOption)
	);

	function toggleSort(key: string) {
		if (sortKey === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDir = 'asc';
		}
		currentPage = 0;
	}
</script>

<div
	class="overflow-hidden rounded-xl border"
	style="background-color: var(--color-surface); border-color: var(--color-border)"
>
	{#if onExport}
		<div class="flex justify-end border-b p-3" style="border-color: var(--color-border)">
			<button
				onclick={onExport}
				class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
				style="background-color: var(--color-surface-alt); color: var(--color-text-muted)"
			>
				📥 Export CSV
			</button>
		</div>
	{/if}

	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr style="border-bottom: 1px solid var(--color-border)">
					{#each columns as col}
						<th class="px-4 py-3 text-left font-medium" style="color: var(--color-text-muted)">
							{#if col.sortable !== false}
								<button
									class="flex items-center gap-1"
									onclick={() => toggleSort(col.key)}
								>
									{col.label}
									{#if sortKey === col.key}
										<span class="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>
									{/if}
								</button>
							{:else}
								{col.label}
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each pagedRows as row}
					<tr
						class="transition-colors"
						style="border-bottom: 1px solid var(--color-border)"
					>
						{#each columns as col}
							<td class="px-4 py-3" style="color: var(--color-text)">{row[col.key]}</td>
						{/each}
					</tr>
				{/each}
				{#if pagedRows.length === 0}
					<tr>
						<td
							colspan={columns.length}
							class="px-4 py-8 text-center"
							style="color: var(--color-text-muted)"
						>
							No data available
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	<div
		class="flex items-center justify-between border-t px-4 py-3"
		style="border-color: var(--color-border)"
	>
		<div class="flex items-center gap-2">
			<span class="text-xs" style="color: var(--color-text-muted)">Rows per page:</span>
			<select
				class="rounded border px-2 py-1 text-xs"
				style="background-color: var(--color-bg); border-color: var(--color-border); color: var(--color-text)"
				bind:value={pageSizeOption}
				onchange={() => (currentPage = 0)}
			>
				<option value={10}>10</option>
				<option value={25}>25</option>
				<option value={50}>50</option>
			</select>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-xs" style="color: var(--color-text-muted)">
				{currentPage * pageSizeOption + 1}–{Math.min(
					(currentPage + 1) * pageSizeOption,
					sortedRows.length
				)} of {sortedRows.length}
			</span>
			<button
				class="rounded px-2 py-1 text-xs disabled:opacity-30"
				style="color: var(--color-text-muted)"
				disabled={currentPage === 0}
				onclick={() => currentPage--}
			>
				‹ Prev
			</button>
			<button
				class="rounded px-2 py-1 text-xs disabled:opacity-30"
				style="color: var(--color-text-muted)"
				disabled={currentPage >= totalPages - 1}
				onclick={() => currentPage++}
			>
				Next ›
			</button>
		</div>
	</div>
</div>
