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
 * TODO: https://developer.wordpress.org/rest-api/using-the-rest-api/discovery/
 *
 * @param {string} url      WordPress URL.
 * @param {string} username Username or email.
 * @param {string} password Password.
 *
 * @return {Promise<import('$types').Session|Error>} User or error object.
 */
export async function wp_login( url, username, password ) {
	try {
		const response = await fetch( `${ url }/wp-json/jwt-auth/v1/token`, {
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

		if ( ! response.ok ) {
			/** @type {string} */
			let message;

			if ( response.status === 403 ) {
				const result = await response.json();
				message = result.message;
			} else {
				message = response.statusText;
			}

			throw new Error( message );
		}

		// TODO: Validate.
		const data = await response.json();

		return {
			email: data.user_email,
			name: data.user_display_name || data.user_nicename,
			token: data.token,
			url: `${ url }/wp-json`,
		};
	} catch ( err ) {
		if ( err instanceof Error ) {
			return err;
		}

		return new Error( 'Unknown error occured.' );
	}
}


/**
 * Upload image to WordPress
 *
 * @param {string}   url   WordPress URL.
 * @param {string}   token Auth token.
 * @param {FormData} data  Form data.
 *
 * @return {Promise<string|Error>} Uploaded image link or error object.
 */
export async function wp_upload( url, token, data ) {
	try {
		const response = await fetch( `${ url }/wp/v2/media`, {
			body: data,
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${ token }`,
			},
		} );

		const result = await response.json();

		if ( ! response.ok ) {
			throw new Error( result?.message || response.statusText );
		}

		return result.guid.rendered;
	} catch ( err ) {
		if ( err instanceof Error ) {
			return err;
		}

		return new Error( 'Unknown error occured.' );
	}
}
