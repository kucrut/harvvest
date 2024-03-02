import { Encryption } from '@adonisjs/encryption';
import { env } from '$env/dynamic/private';
import { session_schema } from './schema';

const SESSION_COOKIE_NAME = 'session';

/**
 * Delete session cookies
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Coooooookiiiiieeees.
 */
export function delete_session_cookies( cookies ) {
	cookies.delete( SESSION_COOKIE_NAME, get_session_cookie_options() );
}

/**
 * Get session cookie options
 *
 * @return {import('cookie').CookieSerializeOptions & {path: string}} Cookie options.
 */
export function get_session_cookie_options() {
	return {
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 7,
		path: '/',
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
	};
}

/**
 * Clear all cookies ;(
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Coooooookiiiiieeees.
 */
export function clear_cookies( cookies ) {
	delete_session_cookies( cookies );
	cookies.delete( 'app_id', get_session_cookie_options() );
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
	const session = session_schema.parse( {
		...json,
		auth: new Encryption( { secret: env.APP_SECRET } ).decrypt( json.auth ),
	} );

	return session;
}

/**
 * Set session cookies
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Cookies.
 * @param {import('./schema').Session} data Session data.
 */
export function set_session_cookies( cookies, data ) {
	const session = JSON.stringify( {
		...data,
		auth: new Encryption( { secret: env.APP_SECRET } ).encrypt( data.auth ),
	} );

	cookies.set( SESSION_COOKIE_NAME, session, get_session_cookie_options() );
}
