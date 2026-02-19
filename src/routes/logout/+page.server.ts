import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { destroySession } from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const token = cookies.get('session');
		if (token) {
			destroySession(token);
		}
		cookies.delete('session', { path: '/' });
		redirect(303, '/login');
	}
};
