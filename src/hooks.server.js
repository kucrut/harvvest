import { delete_session_cookies, validate_session, validate_token } from '$lib/utils.server.js';

export const handle = async ( { event, resolve } ) => {
	const session_cookie = event.cookies.get( 'session' );

	if ( ! session_cookie ) {
		return await resolve( event );
	}

	try {
		const session = validate_session( session_cookie );
		await validate_token( session );
		const { email, name, url } = session;
		event.locals.user = { email, name, url };
	} catch {
		delete_session_cookies( event.cookies );
	}

	return await resolve( event );
};
