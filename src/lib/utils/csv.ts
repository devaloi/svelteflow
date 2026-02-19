export function toCSV(rows: Record<string, unknown>[]): string {
	if (rows.length === 0) return '';

	const headers = Object.keys(rows[0]);
	const lines = [headers.map(escapeField).join(',')];

	for (const row of rows) {
		lines.push(headers.map((h) => escapeField(String(row[h] ?? ''))).join(','));
	}

	return lines.join('\n');
}

function escapeField(value: string): string {
	if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

export function downloadCSV(content: string, filename: string): void {
	const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
