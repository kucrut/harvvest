import { delete_session_cookies, validate_session } from '$lib/utils.server.js';
import { sequence } from '@sveltejs/kit/hooks';

/** @type {import('@sveltejs/kit').Handle} */
async function check_session( { event, resolve } ) {
	const session_cookie = event.cookies.get( 'session' );

	if ( ! session_cookie ) {
		return await resolve( event );
	}

	try {
		const session = validate_session( session_cookie );
		event.locals.session = session;
	} catch {
		delete_session_cookies( event.cookies );
	}

	return await resolve( event );
}

export const handle = sequence( check_session );
