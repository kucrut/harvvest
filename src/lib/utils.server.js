import { discover, get_jwt_auth, get_user } from '@kucrut/wp-api-helpers';
import { redirect } from '@sveltejs/kit';
import { session_schema } from './schema';

/**
 * Delete session cookies
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Coooooookiiiiieeees.
 */
export function delete_session_cookies( cookies ) {
	cookies.delete( 'session', get_session_cookie_options() );
}

/**
 * Get session cookie options
 *
 * @return {import('cookie').CookieSerializeOptions} Cookie options.
 */
export function get_session_cookie_options() {
	return {
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 7,
		path: '/',
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
	};
}

/**
 * Log out
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Coooooookiiiiieeees.
 */
export function logout( cookies ) {
	delete_session_cookies( cookies );
	redirect( 302, '/login' );
}

/**
 * Validate session
 *
 * @param {string} session_cookie Session cookie value.
 * @throws {typeof import('zod').ZodError} Zod error.
 * @return {import('./schema').Session} Session object.
 */
export function validate_session( session_cookie ) {
	const json = JSON.parse( session_cookie );
	const session = session_schema.parse( json );

	return session;
}

/**
 * Log in to WordPress via REST API
 *
 * @param {string} wp_url   WordPress URL.
 * @param {string} username Username or email.
 * @param {string} password Password.
 *
 * @return {Promise<import('./schema').Session>} User object.
 */
export async function wp_login( wp_url, username, password ) {
	const api_url = await discover( wp_url );
	const auth = await get_jwt_auth( api_url, username, password );
	const { avatar_urls, name } = await get_user( api_url, 'me', `Bearer ${ auth.token }` );

	const avatar_size = Object.keys( avatar_urls )
		.map( s => Number( s ) )
		.sort( ( a, b ) => b - a )[ 0 ]
		.toString();

	return {
		api_url,
		name,
		wp_url,
		avatar_url: avatar_urls[ avatar_size ],
		token: auth.token,
	};
}
