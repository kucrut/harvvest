import { discover, get_jwt_auth, get_me } from '@kucrut/wp-api-helpers';
import { handle_wp_rest_response } from './utils';
import { redirect } from '@sveltejs/kit';
import { session_schema, wp_media_item_schema, wp_taxonomies_schema, wp_taxonomy_terms_schema } from './schema';

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
 * Get attachment taxonomies
 *
 * @throws {Error|typeof import('zod').ZodError} Error object.
 *
 * @param {string} api_url WordPress API URL.
 * @param {string} token   Auth token.
 *
 * @return {Promise<import('./schema').WP_Taxonomies>} Taxonomies object.
 */
export async function wp_get_attachment_taxonomies( api_url, token ) {
	const url = new URL( `${ api_url }/wp/v2/taxonomies` );
	url.searchParams.append( 'type', 'attachment' );

	const response = await fetch( url, {
		headers: {
			Authorization: `Bearer ${ token }`,
		},
	} );

	/** @type {import('$types').HandleResponse<import('./schema').WP_Taxonomies>} */
	const handler = async json => wp_taxonomies_schema.parse( json );

	return handle_wp_rest_response( response, handler );
}

/**
 * Get taxonomy terms
 *
 * @throws {Error|typeof import('zod').ZodError} Error object.
 *
 * @param {string} endpoint Taxonomy rest endpoint.
 * @param {string} token Auth token.
 * @param {Record<string,string>=} params Parameters.
 *
 * @return {Promise<import('./schema').WP_Taxonomy_Terms>} Taxonomy terms
 */
export async function wp_get_taxonomy_terms( endpoint, token, params = undefined ) {
	const url = new URL( endpoint );

	if ( params ) {
		Object.entries( params ).forEach( ( [ key, value ] ) => {
			url.searchParams.append( key, value );
		} );
	}

	const response = await fetch( url, {
		headers: {
			Authorization: `Bearer ${ token }`,
		},
	} );

	/** @type {import('$types').HandleResponse<import('./schema').WP_Taxonomy_Terms>} */
	const handler = async json => wp_taxonomy_terms_schema.parse( json );

	return handle_wp_rest_response( response, handler );
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
	const auth = await get_jwt_auth( {
		username,
		password,
		url: api_url,
	} );
	const { avatar_urls, name } = await get_me( api_url, `Bearer ${ auth.token }` );

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
