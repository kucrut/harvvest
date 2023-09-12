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

