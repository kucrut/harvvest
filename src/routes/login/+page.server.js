import { create_basic_auth_string, get_error_message } from '@kucrut/wp-api-helpers/utils';
import { discover, get_app_password_auth_endpoint, get_user } from '@kucrut/wp-api-helpers';
import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import { get_session_cookie_options } from '$lib/utils.server.js';

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

function is_wp_url_required() {
	if ( typeof env.WP_URL !== 'string' || ! env.WP_URL ) {
		return true;
	}

	try {
		const url = new URL( env.WP_URL );
		return ! [ 'http:', 'https:' ].includes( url.protocol );
	} catch {
		return true;
	}
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
	const { avatar_urls, name } = await get_user( api_url, 'me', auth );

	const avatar_size = Object.keys( avatar_urls )
		.map( s => Number( s ) )
		.sort( ( a, b ) => b - a )[ 0 ]
		.toString();

	return {
		api_url,
		auth, // TODO: Encrypt!
		name,
		wp_url,
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
		cookies.set( 'session', JSON.stringify( new_session ), get_session_cookie_options() );
		redirect( 302, '/' );
	}

	return {
		auth_rejected: url.searchParams.get( 'success' ) === 'false',
		has_auth: new_session !== undefined, // Work-around for Firefox. Aaaaaargh!!!111
		require_access_key: is_access_key_required(),
		require_wp_url: is_wp_url_required(),
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ( { cookies, request } ) => {
		const require_access_key = is_access_key_required();
		const require_wp_url = is_wp_url_required();
		const data = await request.formData();

		const access_key = data.get( 'access_key' );
		const client_id = data.get( 'client_id' );
		const url = require_wp_url ? data.get( 'url' ) : env.WP_URL;

		if (
			( require_access_key && ( typeof access_key !== 'string' || ! access_key ) ) ||
			typeof client_id !== 'string' ||
			! client_id ||
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
