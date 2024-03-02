import { delete_session_cookies, get_session } from '$lib/utils.server.js';
import { sequence } from '@sveltejs/kit/hooks';

/** @type {import('@sveltejs/kit').Handle} */
async function check_session( { event, resolve } ) {
	try {
		event.locals.session = get_session( event.cookies );
	} catch {
		delete_session_cookies( event.cookies );
	}

	return await resolve( event );
}

export const handle = sequence( check_session );
