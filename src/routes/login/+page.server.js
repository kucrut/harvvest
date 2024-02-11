import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import { get_error_message } from '@kucrut/wp-api-helpers/utils';
import { get_session_cookie_options, wp_login } from '$lib/utils.server.js';
import { discover, get_app_password_auth_endpoint } from '@kucrut/wp-api-helpers';
import { APP_ID, APP_NAME } from '$env/static/private';

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
	default: async ( { request } ) => {
		const require_access_key = is_access_key_required();
		const data = await request.formData();

		const access_key = data.get( 'access_key' );
		const url = data.get( 'url' );

		if (
			( require_access_key && ( typeof access_key !== 'string' || ! access_key ) ) ||
			typeof url !== 'string' ||
			! url
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

		let endpoint;

		try {
			const api_url = await discover( url );
			endpoint = await get_app_password_auth_endpoint( api_url );
		} catch ( error ) {
			const message = get_error_message( error, 'Unexpected result from server. Please consult the logs.', true );
			return fail( 500, {
				message,
				error: true,
			} );
		}

		const auth_url = new URL( endpoint );
		auth_url.searchParams.append( 'app_id', APP_ID );
		auth_url.searchParams.append( 'app_name', APP_NAME );
		auth_url.searchParams.append( 'success_url', request.url );

		redirect( 303, auth_url );
	},
};
