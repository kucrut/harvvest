import { APP_NAME } from '$env/static/private';
import { create_basic_auth_string, get_error_message } from '@kucrut/wp-api-helpers/utils';
import {
	discover,
	get_app_password_auth_endpoint,
	get_current_app_password,
	get_single_user,
} from '@kucrut/wp-api-helpers';
import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import {
	generate_client_id,
	get_session_cookie_options,
	get_wp_auth_endpoint_from_env,
	set_session_cookies,
} from '$lib/utils.server.js';
import { is_valid_http_url } from '$lib/utils';

function get_access_keys() {
	if ( ! env.ACCESS_KEYS ) {
		return [];
	}

	const keys = env.ACCESS_KEYS.split( ',' ).filter( k => typeof k === 'string' && k !== '' );

	return keys;
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
	const { app_id, uuid } = await get_current_app_password( api_url, auth );

	const avatar_size = Object.keys( avatar_urls )
		.map( s => Number( s ) )
		.sort( ( a, b ) => b - a )[ 0 ]
		.toString();

	return {
		api_url,
		app_id,
		name,
		wp_url,
		auth,
		auth_uuid: uuid,
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

	/** @type {import('$lib/schema').Session|undefined} */
	let new_session;

	try {
		new_session = await handle_wp_auth( url );
	} catch {
		// This could be caused by manually setting URL params, so let's clean it up.
		redirect( 302, '/login' );
	}

	if ( new_session ) {
		set_session_cookies( cookies, new_session );
		redirect( 302, '/' );
	}

	const session_error = cookies.get( 'session_error' );
	cookies.delete( 'session_error', get_session_cookie_options() );

	return {
		session_error,
		auth_rejected: url.searchParams.get( 'success' ) === 'false',
		hide_title: true,
		needs_net: true,
		require_access_key: get_access_keys().length > 0,
		require_wp_url: ! get_wp_auth_endpoint_from_env(),
		meta: {
			title: 'Log In',
		},
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ( { request } ) => {
		const data = await request.formData();

		if ( ! is_access_key_valid( data.get( 'access_key' ) ) ) {
			return fail( 400, {
				error: true,
				message: 'Please provide a valid access key.',
			} );
		}

		let endpoint = get_wp_auth_endpoint_from_env();

		if ( ! endpoint ) {
			const url = data.get( 'url' );

			if ( typeof url !== 'string' || ! is_valid_http_url( url ) ) {
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
					message: get_error_message(
						error,
						'Unexpected result from server. Please consult the logs.',
						true,
					),
				} );
			}
		}

		const app_id = crypto.randomUUID();
		const auth_url = new URL( endpoint );

		auth_url.searchParams.append( 'app_id', app_id );
		auth_url.searchParams.append(
			'app_name',
			`${ APP_NAME } - ${ generate_client_id( request.headers.get( 'user-agent' ) ) }`,
		);
		auth_url.searchParams.append( 'success_url', request.url );

		redirect( 303, auth_url );
	},
};
