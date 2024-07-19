import { APP_NAME } from '$env/static/private';
import { AUTH_ROUTE, COOKIE_SESSION_ERROR } from '$lib/constants';
import { discover, get_app_password_auth_endpoint } from '@kucrut/wp-api-helpers';
import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import { generate_client_id, get_wp_auth_endpoint_from_env } from '$lib/utils.server.js';
import { get_error_message } from '@kucrut/wp-api-helpers/utils';
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

/** @type {import('./$types').PageServerLoad} */
export async function load( { cookies, locals } ) {
	// Redirect to homepage as we already have a valid session.
	if ( locals.session ) {
		// TODO: Check if we have file to upload from PWA.
		redirect( 302, '/' );
	}

	const session_error = cookies.get( COOKIE_SESSION_ERROR );

	if ( session_error ) {
		cookies.delete( COOKIE_SESSION_ERROR, { path: '/login' } );
	}

	return {
		session_error,
		// auth_rejected: url.searchParams.get( 'success' ) === 'false',
		hide_title: true,
		needs_net: true,
		require_access_key: get_access_keys().length > 0,
		require_wp_url: ! get_wp_auth_endpoint_from_env(),
		meta: {
			title: 'Log In',
		},
	};
}

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
		const success_url = new URL( request.url );
		success_url.pathname = AUTH_ROUTE;

		auth_url.searchParams.append( 'success_url', success_url.toString() );
		auth_url.searchParams.append( 'app_id', app_id );
		auth_url.searchParams.append(
			'app_name',
			`${ APP_NAME } - ${ generate_client_id( request.headers.get( 'user-agent' ) ) }`,
		);

		redirect( 303, auth_url );
	},
};
