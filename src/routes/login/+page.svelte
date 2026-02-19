<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Login — SvelteFlow</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center" style="background-color: var(--color-bg)">
	<div
		class="w-full max-w-md rounded-xl p-8 shadow-lg"
		style="background-color: var(--color-surface); border: 1px solid var(--color-border)"
	>
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-bold" style="color: var(--color-text)">SvelteFlow</h1>
			<p class="mt-2" style="color: var(--color-text-muted)">Sign in to your analytics dashboard</p>
		</div>

		{#if form?.error}
			<div
				class="mb-4 rounded-lg px-4 py-3 text-sm"
				style="background-color: color-mix(in srgb, var(--color-danger) 15%, transparent); color: var(--color-danger)"
			>
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			<div class="mb-4">
				<label
					for="email"
					class="mb-1 block text-sm font-medium"
					style="color: var(--color-text)"
				>
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					value={form?.email ?? ''}
					class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
					style="background-color: var(--color-bg); border-color: var(--color-border); color: var(--color-text); --tw-ring-color: var(--color-primary)"
					placeholder="admin@demo.com"
				/>
			</div>

			<div class="mb-6">
				<label
					for="password"
					class="mb-1 block text-sm font-medium"
					style="color: var(--color-text)"
				>
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
					style="background-color: var(--color-bg); border-color: var(--color-border); color: var(--color-text); --tw-ring-color: var(--color-primary)"
					placeholder="••••••••"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
				style="background-color: var(--color-primary)"
			>
				{loading ? 'Signing in...' : 'Sign in'}
			</button>
		</form>

		<p class="mt-6 text-center text-xs" style="color: var(--color-text-muted)">
			Demo: admin@demo.com / password
		</p>
	</div>
</div>
