import type { ChartOptions } from 'chart.js';

export function getChartColors(isDark: boolean) {
	return {
		grid: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(15, 23, 42, 0.06)',
		text: isDark ? '#94a3b8' : '#64748b',
		datasets: isDark
			? ['#60a5fa', '#4ade80', '#fbbf24', '#f87171', '#a78bfa']
			: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']
	};
}

export function baseLineOptions(isDark: boolean): ChartOptions<'line'> {
	const colors = getChartColors(isDark);
	return {
		responsive: true,
		maintainAspectRatio: false,
		interaction: { intersect: false, mode: 'index' },
		plugins: {
			legend: { labels: { color: colors.text } },
			tooltip: {
				backgroundColor: isDark ? '#1e293b' : '#ffffff',
				titleColor: isDark ? '#f1f5f9' : '#0f172a',
				bodyColor: isDark ? '#cbd5e1' : '#334155',
				borderColor: isDark ? '#475569' : '#e2e8f0',
				borderWidth: 1
			}
		},
		scales: {
			x: { grid: { color: colors.grid }, ticks: { color: colors.text } },
			y: { grid: { color: colors.grid }, ticks: { color: colors.text } }
		}
	};
}

export function baseBarOptions(isDark: boolean): ChartOptions<'bar'> {
	const colors = getChartColors(isDark);
	return {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { labels: { color: colors.text } },
			tooltip: {
				backgroundColor: isDark ? '#1e293b' : '#ffffff',
				titleColor: isDark ? '#f1f5f9' : '#0f172a',
				bodyColor: isDark ? '#cbd5e1' : '#334155',
				borderColor: isDark ? '#475569' : '#e2e8f0',
				borderWidth: 1
			}
		},
		scales: {
			x: { grid: { color: colors.grid }, ticks: { color: colors.text } },
			y: { grid: { color: colors.grid }, ticks: { color: colors.text } }
		}
	};
}

export function basePieOptions(isDark: boolean): ChartOptions<'pie'> {
	const colors = getChartColors(isDark);
	return {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { position: 'bottom', labels: { color: colors.text, padding: 16 } },
			tooltip: {
				backgroundColor: isDark ? '#1e293b' : '#ffffff',
				titleColor: isDark ? '#f1f5f9' : '#0f172a',
				bodyColor: isDark ? '#cbd5e1' : '#334155',
				borderColor: isDark ? '#475569' : '#e2e8f0',
				borderWidth: 1
			}
		}
	};
}

export function baseDoughnutOptions(isDark: boolean): ChartOptions<'doughnut'> {
	const colors = getChartColors(isDark);
	return {
		responsive: true,
		maintainAspectRatio: false,
		cutout: '60%',
		plugins: {
			legend: { position: 'bottom', labels: { color: colors.text, padding: 16 } },
			tooltip: {
				backgroundColor: isDark ? '#1e293b' : '#ffffff',
				titleColor: isDark ? '#f1f5f9' : '#0f172a',
				bodyColor: isDark ? '#cbd5e1' : '#334155',
				borderColor: isDark ? '#475569' : '#e2e8f0',
				borderWidth: 1
			}
		}
	};
}
