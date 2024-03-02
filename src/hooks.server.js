import { delete_session_cookies, get_session } from '$lib/utils.server.js';
import { get_current_app_password } from '@kucrut/wp-api-helpers';
import { sequence } from '@sveltejs/kit/hooks';

/** @type {import('@sveltejs/kit').Handle} */
async function check_session( { event, resolve } ) {
	try {
		const session = get_session( event.cookies );

		if ( ! session ) {
			return await resolve( event );
		}

		await get_current_app_password( session.api_url, session.auth );
		event.locals.session = session;
	} catch {
		delete_session_cookies( event.cookies );
	}

	return await resolve( event );
}

export const handle = sequence( check_session );
