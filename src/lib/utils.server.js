import { handle_wp_rest_response } from './utils';
import { redirect } from '@sveltejs/kit';
import {
	session_schema,
	valid_token_response_schema,
	wp_media_item_schema,
	wp_rest_error_schema,
	wp_user_schema,
} from './schema';

/**
 * Delete session cookies
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Coooooookiiiiieeees.
 */
export function delete_session_cookies( cookies ) {
	cookies.set( 'session', '', {
		path: '/',
		expires: new Date( 0 ),
	} );
}

/**
 * Log out
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Coooooookiiiiieeees.
 */
export function logout( cookies ) {
	delete_session_cookies( cookies );
	throw redirect( 302, '/login' );
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
 * Validate token
 *
 * @param {import('./schema').Session} session Session object.
 * @throws {Error|typeof import('zod').ZodError}
 * @return {Promise<import('./schema').ValidToken>} Valid token response.
 */
export async function validate_token( session ) {
	const response = await fetch( `${ session.api_url }/jwt-auth/v1/token/validate`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${ session.token }`,
		},
	} );

	if ( ! response.ok ) {
		const json = await response.json();
		const wp_error = wp_rest_error_schema.safeParse( json );

		throw new Error( wp_error.success ? wp_error.data.message : response.statusText );
	}

	const data = await response.json();
	const result = valid_token_response_schema.parse( data );

	return result;
}

/**
 * Log in to WordPress via REST API
 *
 * @param {string} url      WordPress URL.
 * @param {string} username Username or email.
 * @param {string} password Password.
 *
 * @return {Promise<import('./schema').Session>} User object.
 */
export async function wp_login( url, username, password ) {
	const head_response = await fetch( url, {
		method: 'HEAD',
	} );

	if ( ! head_response.ok ) {
		throw new Error( `HEAD request failed: ${ head_response.statusText }` );
	}

	const link_header = head_response.headers.get( 'Link' );

	if ( ! link_header ) {
		throw new Error( `Link header not found` );
	}

	const match = link_header.match( /^<(.*)>; rel="https:\/\/api.w.org\/"/ );

	if ( ! match ) {
		throw new Error( `Could not find WP REST API URL from Link header. Are you sure it's a WordPress site?` );
	}

	const api_url = match[ 1 ].replace( /\/$/, '' );

	const login_response = await fetch( `${ api_url }/jwt-auth/v1/token`, {
		method: 'POST',
		body: JSON.stringify( {
			username,
			password,
		} ),
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
	} );

	/** @type {import('$types').HandleResponse<import('./schema').Session>} */
	const handle = async data => {
		const user = await wp_user_schema.parseAsync( data );

		return {
			api_url,
			url,
			email: user.user_email,
			name: user.user_display_name || user.user_nicename,
			token: user.token,
		};
	};

	return handle_wp_rest_response( login_response, handle );
}

/**
 * Upload image to WordPress
 *
 * @todo Handle video uploads.
 *
 * @throws {Error|typeof import('zod').ZodError} Error object.
 *
 * @param {string}   api_url WordPress API URL.
 * @param {string}   token   Auth token.
 * @param {FormData} data    Form data.
 *
 * @return {Promise<string>} Uploaded image link.
 */
export async function wp_upload( api_url, token, data ) {
	const response = await fetch( `${ api_url }/wp/v2/media`, {
		body: data,
		method: 'POST',
		headers: {
			Authorization: `Bearer ${ token }`,
		},
	} );

	/** @type {import('$types').HandleResponse<string>} */
	const handler = async json => {
		const media = wp_media_item_schema.parse( json );

		return media.source_url;
	};

	return handle_wp_rest_response( response, handler );
}
