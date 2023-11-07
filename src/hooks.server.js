import { delete_session_cookies, validate_session, validate_token } from '$lib/utils.server.js';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ( { event, resolve } ) => {
	const session_cookie = event.cookies.get( 'session' );

	if ( ! session_cookie ) {
		return await resolve( event );
	}

	try {
		const session = validate_session( session_cookie );
		await validate_token( session );
		const { avatar_url, email, name, wp_url } = session;
		event.locals.user = { avatar_url, email, name, wp_url };
	} catch {
		delete_session_cookies( event.cookies );
	}

	return await resolve( event );
};
