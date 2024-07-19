import { AUTH_ROUTE } from '$lib/constants';
import { delete_session_cookies, get_session, get_wp_auth_endpoint_from_env } from '$lib/utils.server.js';
import { env } from '$env/dynamic/private';
import { get_current_app_password } from '@kucrut/wp-api-helpers';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { set_fetch, WP_REST_Error } from '@kucrut/wp-api-helpers/utils';
import { ZodError } from 'zod';
import svg_sprite from '$lib/components/svg-sprite.svg?raw';

/** @type {import('@sveltejs/kit').Handle} */
function set_wp_api_fetcher( { event, resolve } ) {
	set_fetch( event.fetch );

	return resolve( event );
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
	if ( event.url.pathname !== AUTH_ROUTE ) {
		return resolve( event );
	}

	if ( event.url.searchParams.get( 'success' ) === 'false' ) {
		event.locals.session_error = 'Authentication request was rejected.';
		redirect( 302, '/login' );
	}

	redirect( 302, '/' );
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
			event.locals.session_error = 'Error: Invalid cookie.';
		} else if ( error instanceof WP_REST_Error ) {
			event.locals.session_error = error.data.status === 401
				? 'Your previous authorization has been revoked.'
				: `Error: ${ error.message } (${ error.code })`;
		} else if ( error instanceof ZodError ) {
			event.locals.session_error = error.message;
		} else if ( error instanceof Error ) {
			event.locals.session_error = `Error: ${ error.message }`;
		} else {
			event.locals.session_error =
				'Error: Unable to validate session. Please check that your WordPress site is accessible.';
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
