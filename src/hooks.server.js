import { delete_session_cookies, validate_session } from '$lib/utils.server.js';
import { get_jwt_validate_token } from '@kucrut/wp-api-helpers';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ( { event, resolve } ) => {
	const session_cookie = event.cookies.get( 'session' );

	if ( ! session_cookie ) {
		return await resolve( event );
	}

	/** @type {import('./lib/schema').Session} */
	let session;

	try {
		session = validate_session( session_cookie );
		await get_jwt_validate_token( session.api_url, session.token );
		event.locals.session = session;
	} catch {
		delete_session_cookies( event.cookies );
	}

	return await resolve( event );
};
