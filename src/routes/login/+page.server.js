import { create_basic_auth_string, get_error_message } from '@kucrut/wp-api-helpers/utils';
import { discover, get_app_password_auth_endpoint, get_single_user } from '@kucrut/wp-api-helpers';
import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import { get_session_cookie_options, set_session_cookies } from '$lib/utils.server.js';
import { is_valid_http_url } from '$lib/utils';

function get_access_keys() {
	if ( ! env.ACCESS_KEYS ) {
		return [];
	}

	const keys = env.ACCESS_KEYS.split( ',' ).filter( k => typeof k === 'string' && k !== '' );

	return keys;
}

function get_wp_auth_endpoint_from_env() {
	if ( typeof env.WP_AUTH_ENDPOINT !== 'string' || ! env.WP_AUTH_ENDPOINT ) {
		return undefined;
	}

	if ( is_valid_http_url( env.WP_AUTH_ENDPOINT ) ) {
		return env.WP_AUTH_ENDPOINT;
	}

	return undefined;
}

/**
 * Check if access key is valid
 *
 * @param {ReturnType<FormData['get']>} key Access key.
 * @return {boolean} Whether the provided access key is valid.
 */
function is_access_key_valid( key ) {
	const keys = get_access_keys();

	if ( ! keys.length ) {
		return true;
	}

	if ( ! key || typeof key !== 'string' ) {
		return false;
	}

	return keys.includes( key );
}

/**
 * Handle WP application password authorization flow
 *
 * @param {URL} url URL object.
 * @return {Promise<import('$lib/schema').Session|undefined>};
 */
async function handle_wp_auth( url ) {
	const password = url.searchParams.get( 'password' );
	const username = url.searchParams.get( 'user_login' );
	const wp_url = url.searchParams.get( 'site_url' );

	if ( ! password || ! wp_url || ! username ) {
		return;
	}

	const api_url = await discover( wp_url );
	const auth = create_basic_auth_string( username, password );
	const { avatar_urls, name } = await get_single_user( 'me', api_url, auth );

	const avatar_size = Object.keys( avatar_urls )
		.map( s => Number( s ) )
		.sort( ( a, b ) => b - a )[ 0 ]
		.toString();

	return {
		api_url,
		name,
		wp_url,
		auth,
		avatar_url: avatar_urls[ avatar_size ],
	};
}

/** @type {import('./$types').PageServerLoad} */
export const load = async ( { cookies, locals, url } ) => {
	// Redirect to homepage as we already have a valid session.
	if ( locals.session ) {
		// TODO: Check if we have file to upload from PWA.
		redirect( 302, '/' );
	}

	const new_session = await handle_wp_auth( url );

	if ( new_session ) {
		set_session_cookies( cookies, new_session );
		redirect( 302, '/' );
	}

	return {
		auth_rejected: url.searchParams.get( 'success' ) === 'false',
		has_auth: new_session !== undefined, // Work-around for Firefox. Aaaaaargh!!!111
		require_access_key: get_access_keys().length > 0,
		require_wp_url: ! get_wp_auth_endpoint_from_env(),
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ( { cookies, request } ) => {
		const data = await request.formData();

		if ( ! is_access_key_valid( data.get( 'access_key' ) ) ) {
			return fail( 400, {
				error: true,
				message: 'Please provide a valid access key.',
			} );
		}

		const client_id = data.get( 'client_id' );
		if ( typeof client_id !== 'string' || ! client_id ) {
			return fail( 400, {
				error: true,
				message: 'All fields are required.',
			} );
		}

		let endpoint = get_wp_auth_endpoint_from_env();

		if ( ! endpoint ) {
			const url = data.get( 'url' );

			// TODO: Validate URL.
			if ( typeof url !== 'string' || ! url ) {
				return fail( 400, {
					error: true,
					message: 'Please provide a valid WordPress URL.',
				} );
			}

			try {
				const api_url = await discover( url );
				endpoint = await get_app_password_auth_endpoint( api_url );
			} catch ( error ) {
				return fail( 500, {
					error: true,
					message: get_error_message( error, 'Unexpected result from server. Please consult the logs.', true ),
				} );
			}
		}

		const app_id = crypto.randomUUID();
		const auth_url = new URL( endpoint );

		// This will be used when revoking the app password on logout.
		cookies.set( 'app_id', app_id, get_session_cookie_options() );

		auth_url.searchParams.append( 'app_id', app_id );
		auth_url.searchParams.append( 'app_name', `${ env.APP_NAME } - ${ client_id }` );
		auth_url.searchParams.append( 'success_url', request.url );

		redirect( 303, auth_url );
	},
};
