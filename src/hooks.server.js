import { delete_session_cookies, get_session, get_wp_auth_endpoint_from_env } from '$lib/utils.server.js';
import { env } from '$env/dynamic/private';
import { get_current_app_password } from '@kucrut/wp-api-helpers';
import { sequence } from '@sveltejs/kit/hooks';
import { set_fetch } from '@kucrut/wp-api-helpers/utils';
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
		if ( error instanceof ZodError ) {
			delete_session_cookies( event.cookies );
		} else {
			event.locals.session_error = `Unable to validate session. Please check you can access your WordPress site.`;
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

	if ( ! request.url.startsWith( wp_url.origin ) ) {
		return fetch( request );
	}

	const auth = request.headers.get( 'Authorization' );

	return fetch(
		new Request( request.url.replace( wp_url.origin, env.WP_INTERNAL_URL ), {
			...request,
			headers: {
				...request.headers,
				...( auth ? { Authorization: auth } : {} ),
			},
		} ),
	);
}
