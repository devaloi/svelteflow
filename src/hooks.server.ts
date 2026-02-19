import type { Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');

	if (token) {
		event.locals.user = validateSession(token);
	} else {
		event.locals.user = null;
	}

	const theme = event.cookies.get('theme') ?? '';
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%theme%', theme)
	});

	return response;
};
