import { browser } from '$app/environment';

function createThemeStore() {
	let theme = $state<'light' | 'dark'>('light');

	if (browser) {
		const saved = document.cookie
			.split('; ')
			.find((c) => c.startsWith('theme='))
			?.split('=')[1];
		if (saved === 'dark' || saved === 'light') {
			theme = saved;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			theme = 'dark';
		}
	}

	function toggle() {
		theme = theme === 'dark' ? 'light' : 'dark';
		if (browser) {
			document.documentElement.className = theme;
			document.cookie = `theme=${theme};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
		}
	}

	return {
		get current() {
			return theme;
		},
		get isDark() {
			return theme === 'dark';
		},
		toggle
	};
}

export const themeStore = createThemeStore();
