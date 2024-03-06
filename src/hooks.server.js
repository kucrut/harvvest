import { delete_session_cookies, get_session, get_wp_auth_endpoint_from_env } from '$lib/utils.server.js';
import { env } from '$env/dynamic/private';
import { get_current_app_password } from '@kucrut/wp-api-helpers';
import { sequence } from '@sveltejs/kit/hooks';
import { set_fetch, WP_REST_Error } from '@kucrut/wp-api-helpers/utils';
import { ZodError } from 'zod';
import svg_sprite from '$lib/components/svg-sprite.svg?raw';

/** @type {import('@sveltejs/kit').Handle} */
async function check_session( { event, resolve } ) {
	try {
		const session = get_session( event.cookies );

		if ( ! session ) {
			return await resolve( event );
		}

		await get_current_app_password( session.api_url, session.auth );
		event.locals.session = session;
	} catch ( error ) {
		let session_error = '';

		// The cookie is messed up.
		if ( error instanceof ZodError ) {
			delete_session_cookies( event.cookies );
		} else if ( error instanceof WP_REST_Error ) {
			session_error =
				error.data.status === 401
					? 'Your previous authorization has been revoked.'
					: `Error: ${ error.message } (${ error.code })`;
			delete_session_cookies( event.cookies );
		} else {
			session_error =
				error instanceof Error
					? `Error: ${ error.message }`
					: `Error: Unable to validate session. Please check you can access your WordPress site.`;
		}

		if ( session_error ) {
			event.cookies.set( 'session_error', session_error, { path: '/' } );
		}
	}

	return await resolve( event );
}

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

export const handle = sequence( set_wp_api_fetcher, check_session, transform_html );

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
