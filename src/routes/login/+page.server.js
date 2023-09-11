import { fail, redirect } from '@sveltejs/kit';

/**
 * Log in to WordPress via REST API
 *
 * @param {string} url      WordPress URL.
 * @param {string} username Username or email.
 * @param {string} password Password.
 *
 * @return {Promise<import('$types').Session|Error>} User or error object.
 */
async function wp_login( url, username, password ) {
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

export const load = async ( { locals } ) => {
	if ( locals.user ) {
		throw redirect( 302, '/' );
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	login: async ( { cookies, request } ) => {
		const data = await request.formData();

		const password = data.get( 'password' );
		const url = data.get( 'url' );
		const username = data.get( 'username' );

		if (
			typeof password !== 'string' ||
			typeof url !== 'string' ||
			typeof username !== 'string' ||
			! url ||
			! username ||
			! password
		) {
			return fail( 400, { invalid: true } );
		}

		const auth = await wp_login( url, username, password );

		if ( auth instanceof Error ) {
			return fail( 500, {
				error: true,
				message: auth.message,
			} );
		}

		cookies.set( 'session', JSON.stringify( auth ), {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7,
			path: '/',
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
		} );

		throw redirect( 302, '/' );
	},
};
