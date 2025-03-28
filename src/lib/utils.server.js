import { Encryption } from '@adonisjs/encryption';
import { env } from '$env/dynamic/private';
import { is_valid_http_url } from './utils';
import { session_schema } from './schema';
import { UAParser } from 'ua-parser-js';

const ERROR_COOKIE_NAME = 'error';
const SESSION_COOKIE_NAME = 'session';

/**
 * Clear all cookies ;(
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Coooooookiiiiieeees.
 */
export function clear_cookies( cookies ) {
	delete_session_cookie( cookies );
}

/**
 * Delete error cookie
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Coooooookiiiiieeees.
 */
export function delete_error_cookie( cookies ) {
	cookies.delete( ERROR_COOKIE_NAME, get_cookie_options() );
}

/**
 * Delete session cookie
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Coooooookiiiiieeees.
 */
export function delete_session_cookie( cookies ) {
	cookies.delete( SESSION_COOKIE_NAME, get_cookie_options() );
}

/**
 * Generate client ID
 *
 * @param {string|null=} user_agent User agent.
 */
export function generate_client_id( user_agent ) {
	if ( typeof user_agent !== 'string' || user_agent === '' ) {
		return 'Unknown Browser';
	}

	const parsed = new UAParser( user_agent );
	const result = parsed.getResult();

	const parts = [
		result.browser.name,
		result.browser.major || result.browser.version,
		'on',
		result.os.name,
		result.os.version,
	];

	return parts.filter( p => p !== '' ).join( ' ' );
}

/**
 * Get allowed file types.
 *
 * @return {string[]} Array of allowed file types.
 */
export function get_allowed_filetypes() {
	const types = env.ALLOWED_FILE_TYPES.split( ',' ).map( type => type.trim() ).filter( type => type !== '' );

	return types.length ? types : [ 'image/*' ];
}

/**
 * Get session from cookie
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Coooooookiiiiieeees.
 * @throws {typeof import('zod').ZodError} Zod error.
 * @return {import('./schema').Session|undefined} Session object.
 */
export function get_session_from_cookie( cookies ) {
	const raw = cookies.get( SESSION_COOKIE_NAME );

	if ( ! raw ) {
		return undefined;
	}

	const json = JSON.parse( raw );
	const session = session_schema.parse( {
		...json,
		auth: new Encryption( { secret: env.APP_SECRET } ).decrypt( json.auth ),
	} );

	return session;
}

/**
 * Get session from cookie
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Coooooookiiiiieeees.
 * @return {ReturnType<import('@sveltejs/kit').Cookies['get']>} Cookie value.
 */
export function get_error_from_cookie( cookies ) {
	return cookies.get( ERROR_COOKIE_NAME );
}

/**
 * Get cookie options
 *
 * @param {number=} maxAge Max age.
 *
 * @return {Parameters<import('@sveltejs/kit').Cookies['set']>[2]} Cookie options.
 */
export function get_cookie_options( maxAge ) {
	return {
		maxAge,
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
	};
}

/**
 * Set error cookie
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Coooookiiiies.
 * @param {string} message Error message.
 */
export function set_error_cookie( cookies, message ) {
	cookies.set( ERROR_COOKIE_NAME, message, get_cookie_options() );
}

/**
 * Set session cookie
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Cookies.
 * @param {import('./schema').Session} data Session data.
 */
export function set_session_cookie( cookies, data ) {
	const session = JSON.stringify( {
		...data,
		auth: new Encryption( { secret: env.APP_SECRET } ).encrypt( data.auth ),
	} );

	cookies.set( SESSION_COOKIE_NAME, session, get_cookie_options( 60 * 60 * 24 * 7 ) );
}

/**
 * Get WP auth endpoint as set in environment variables as WP_AUTH_ENDPOINT
 *
 * @return {string|undefined} WP auth endpoint URL or undefined.
 */
export function get_wp_auth_endpoint_from_env() {
	if ( typeof env.WP_AUTH_ENDPOINT !== 'string' || ! env.WP_AUTH_ENDPOINT ) {
		return undefined;
	}

	if ( is_valid_http_url( env.WP_AUTH_ENDPOINT ) ) {
		return env.WP_AUTH_ENDPOINT;
	}

	return undefined;
}
