import { delete_session_cookies, get_session } from '$lib/utils.server.js';
import { get_current_app_password } from '@kucrut/wp-api-helpers';
import { sequence } from '@sveltejs/kit/hooks';
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
function transform_html( { event, resolve } ) {
	return resolve( event, {
		transformPageChunk: ( { html } ) => {
			return html.replace( '%svg_sprite%', `<div class="svg-sprite">${ svg_sprite }</div>` );
		},
	} );
}

export const handle = sequence( check_session, transform_html );
