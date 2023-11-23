import { fail, redirect } from '@sveltejs/kit';
import { get_error_message } from '@kucrut/wp-api-helpers/utils';
import { get_session_cookie_options, wp_login } from '$lib/utils.server.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ( { parent } ) => {
	const layout_data = await parent();

	// Redirect to homepage as we already have a valid session.
	if ( layout_data.user ) {
		throw redirect( 302, '/' );
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ( { cookies, request } ) => {
		const data = await request.formData();

		const password = data.get( 'password' );
		const url = data.get( 'url' );
		const username = data.get( 'username' );

		if (
			typeof password !== 'string' ||
			! password ||
			typeof url !== 'string' ||
			! url ||
			typeof username !== 'string' ||
			! username
		) {
			return fail( 400, {
				error: true,
				message: 'All fields are required.',
			} );
		}

		try {
			const auth = await wp_login( url, username, password );

			cookies.set( 'session', JSON.stringify( auth ), get_session_cookie_options() );
		} catch ( error ) {
			const message = get_error_message(
				error,
				'Unexpected upload result from server. Please consult the logs.',
				true,
			);

			return fail( 500, {
				message,
				error: true,
			} );
		}

		throw redirect( 302, '/' );
	},
};
