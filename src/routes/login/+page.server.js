import { fail, redirect } from '@sveltejs/kit';
import { get_error_message } from '@kucrut/wp-api-helpers/utils';
import { get_session_cookie_options, wp_login } from '$lib/utils.server.js';
import { env } from '$env/dynamic/private';

function get_access_keys() {
	if ( ! env.ACCESS_KEYS ) {
		return undefined;
	}

	const keys = env.ACCESS_KEYS.split( ',' ).filter( k => typeof k === 'string' && k !== '' );

	return keys;
}

function is_access_key_required() {
	const access_keys = get_access_keys();

	return Array.isArray( access_keys ) && access_keys.length > 0;
}

/** @type {import('./$types').PageServerLoad} */
export const load = async ( { parent } ) => {
	const layout_data = await parent();

	// Redirect to homepage as we already have a valid session.
	if ( layout_data.user ) {
		redirect( 302, '/' );
	}

	return {
		require_access_key: is_access_key_required(),
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ( { cookies, request } ) => {
		const require_access_key = is_access_key_required();
		const data = await request.formData();

		const access_key = data.get( 'access_key' );
		const password = data.get( 'password' );
		const url = data.get( 'url' );
		const username = data.get( 'username' );

		if (
			( require_access_key && ( typeof access_key !== 'string' || ! access_key ) ) ||
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

		const access_keys = get_access_keys();
		if (
			require_access_key &&
			( typeof access_key !== 'string' || ( Array.isArray( access_keys ) && ! access_keys.includes( access_key ) ) )
		) {
			return fail( 400, {
				error: true,
				message: 'Invalid access key.',
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

		redirect( 302, '/' );
	},
};
