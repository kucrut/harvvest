import { AUTH_ROUTE, COOKIE_SESSION_ERROR } from '$lib/constants';
import {
	delete_session_cookies,
	get_session,
	get_wp_auth_endpoint_from_env,
	set_session_cookies,
} from '$lib/utils.server.js';
import { discover, get_current_app_password, get_single_user } from '@kucrut/wp-api-helpers';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { create_basic_auth_string, set_fetch, WP_REST_Error } from '@kucrut/wp-api-helpers/utils';
import { ZodError } from 'zod';
import svg_sprite from '$lib/components/svg-sprite.svg?raw';

/** @type {import('@sveltejs/kit').Handle} */
function set_wp_api_fetcher( { event, resolve } ) {
	set_fetch( event.fetch );

	return resolve( event );
}

/**
 * Store error in cookies
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Cooooookiiiiiiees.
 * @param {string} message Error message.
 */
function store_error( cookies, message ) {
	cookies.set( COOKIE_SESSION_ERROR, message, {
		httpOnly: true,
		path: '/login',
	} );
}

/** @type {import('@sveltejs/kit').Handle} */
function transform_html( { event, resolve } ) {
	return resolve( event, {
		transformPageChunk: ( { html } ) => {
			return html.replace( '%svg_sprite%', `<div class="svg-sprite">${ svg_sprite }</div>` );
		},
	} );
}

/** @type {import('@sveltejs/kit').Handle} */
async function catch_auth( { event, resolve } ) {
	if ( event.url.pathname !== AUTH_ROUTE || event.url.search === '' ) {
		return resolve( event );
	}

	// The existence of `success` param _always_ indicate failure, no matter the value.
	if ( event.url.searchParams.has( 'success' ) ) {
		store_error( event.cookies, 'Authentication request was rejected.' );
		redirect( 302, '/login' );
	}

	const param_keys = [ 'password', 'site_url', 'user_login' ];
	const params_found = param_keys
		.map( key => event.url.searchParams.has( key ) )
		.filter( exists => exists );

	// Required params not found but searchParams is not empty.
	if ( ! params_found.length ) {
		redirect( 302, '/login' );
	}

	// Missing one or more required params.
	if ( params_found.length < param_keys.length ) {
		store_error( event.cookies, 'Invalid authentication result.' );
		redirect( 302, '/login' );
	}

	const password = event.url.searchParams.get( 'password' );
	const username = event.url.searchParams.get( 'user_login' );
	const wp_url = event.url.searchParams.get( 'site_url' );

	// One or more params are empty.
	if ( ! password || ! wp_url || ! username ) {
		store_error( event.cookies, 'Invalid authentication result.' );
		redirect( 302, '/login' );
	}

	let has_auth = false;

	try {
		const api_url = await discover( wp_url );
		const auth = create_basic_auth_string( username, password );
		const { avatar_urls, name } = await get_single_user( 'me', api_url, auth );
		const { app_id, uuid } = await get_current_app_password( api_url, auth );

		const avatar_size = Object.keys( avatar_urls )
			.map( s => Number( s ) )
			.sort( ( a, b ) => b - a )[ 0 ]
			.toString();

		has_auth = true;
		set_session_cookies( event.cookies, {
			api_url,
			app_id,
			name,
			wp_url,
			auth,
			auth_uuid: uuid,
			avatar_url: avatar_urls[ avatar_size ],
		} );
	} catch ( error ) {
		store_error(
			event.cookies,
			error instanceof Error ? error.message : 'Invalid authentication result.',
		);
	}

	redirect( 302, has_auth ? '/' : '/login' );
}

/** @type {import('@sveltejs/kit').Handle} */
async function validate_session( { event, resolve } ) {
	try {
		const session = get_session( event.cookies );

		if ( session ) {
			await get_current_app_password( session.api_url, session.auth );
			event.locals.session = session;
		}
	} catch ( error ) {
		// JSON error.
		if ( error instanceof SyntaxError ) {
			store_error( event.cookies, 'Error: Invalid session cookie.' );
		} else if ( error instanceof WP_REST_Error ) {
			store_error(
				event.cookies,
				error.data.status === 401
					? 'Your previous authorization has been revoked.'
					: `Error: ${ error.message } (${ error.code })`,
			);
		} else if ( error instanceof ZodError ) {
			store_error( event.cookies, error.message );
		} else if ( error instanceof Error ) {
			store_error( event.cookies, `Error: ${ error.message }` );
		} else {
			store_error(
				event.cookies,
				'Error: Unable to validate session. Please check that your WordPress site is accessible.',
			);
		}

		delete_session_cookies( event.cookies );
	}

	return resolve( event );
}

export const handle = sequence( set_wp_api_fetcher, catch_auth, validate_session, transform_html );

/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch( { request, fetch } ) {
	if ( ! env.WP_INTERNAL_URL ) {
		return fetch( request );
	}

	const wp_auth_endpoint = get_wp_auth_endpoint_from_env();

	if ( ! wp_auth_endpoint ) {
		return fetch( request );
	}

	const wp_url = new URL( wp_auth_endpoint );

	return request.url.startsWith( wp_url.origin )
		? fetch( new Request( request.url.replace( wp_url.origin, env.WP_INTERNAL_URL ), request ) )
		: fetch( request );
}
