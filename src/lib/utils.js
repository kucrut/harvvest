import { redirect } from '@sveltejs/kit';

/**
 * Log out
 *
 * @param {import('@sveltejs/kit').Cookies} cookies Coooooookiiiiieeees.
 */
export function logout( cookies ) {
	cookies.set( 'session', '', {
		path: '/',
		expires: new Date( 0 ),
	} );

	throw redirect( 302, '/login' );
}

/**
 * Log in to WordPress via REST API
 *
 * @param {string} url      WordPress URL.
 * @param {string} username Username or email.
 * @param {string} password Password.
 *
 * @return {Promise<import('$types').Session>} User object.
 */
export async function wp_login( url, username, password ) {
	const head_response = await fetch( url, {
		method: 'HEAD',
	} );

	if ( ! head_response.ok ) {
		throw new Error( head_response.statusText );
	}

	const link_header = head_response.headers.get( 'Link' );

	if ( ! link_header ) {
		throw new Error( 'Link header not found.' );
	}

	const match = link_header.match( /^<(.*)>; rel="https:\/\/api.w.org\/"/ );

	if ( ! match ) {
		throw new Error( 'Could not find REST API URL from Link header.' );
	}

	const api_url = match[ 1 ].replace( /\/$/, '' );

	const login_response = await fetch( `${ api_url }/jwt-auth/v1/token`, {
		method: 'POST',
		body: JSON.stringify( {
			username,
			password,
		} ),
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
	} );

	if ( ! login_response.ok ) {
		/** @type {string} */
		let message;

		if ( login_response.status === 403 ) {
			const result = await login_response.json();
			message = result.message;
		} else {
			message = login_response.statusText;
		}

		throw new Error( message );
	}

	// TODO: Validate.
	const data = await login_response.json();

	return {
		api_url,
		url,
		email: data.user_email,
		name: data.user_display_name || data.user_nicename,
		token: data.token,
	};
}

/**
 * Upload image to WordPress
 *
 * @param {string}   api_url WordPress API URL.
 * @param {string}   token   Auth token.
 * @param {FormData} data    Form data.
 *
 * @return {Promise<string|Error>} Uploaded image link or error object.
 */
export async function wp_upload( api_url, token, data ) {
	try {
		const response = await fetch( `${ api_url }/wp/v2/media`, {
			body: data,
			method: 'POST',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		} );

		if ( response.ok ) {
			const result = await response.json();
			return result.guid.rendered;
		}

		const content_type = response.headers.get( 'Content-Type' );

		if ( content_type?.startsWith( 'text/' ) ) {
			throw new Error( await response.text() );
		}

		// TODO: Validate.
		const json = await response.json();
		throw new Error( json.message );
	} catch ( err ) {
		if ( err instanceof Error ) {
			return err;
		}

		return new Error( 'Unknown error occured.' );
	}
}
