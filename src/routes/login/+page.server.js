import { wp_login } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import { ZodError } from 'zod';

/** @type {import('./$types').PageServerLoad} */
export const load = async ( { locals } ) => {
	if ( locals.user ) {
		throw redirect( 302, '/' );
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ( { cookies, request } ) => {
		const data = await request.formData();

		const password = data.get( 'password' );
		const url = data.get( 'url' );
		const username = data.get( 'username' );

		if (
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

		try {
			const auth = await wp_login( url, username, password );

			cookies.set( 'session', JSON.stringify( auth ), {
				httpOnly: true,
				maxAge: 60 * 60 * 24 * 7,
				path: '/',
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
			} );
		} catch ( error ) {
			/** @type {string} */
			let message;

			if ( error instanceof Error || error instanceof ZodError ) {
				message = error.message;
			} else {
				message = 'Unknown error occured while trying to log in.';
				// eslint-disable-next-line no-console
				console.error( error );
			}

			return fail( 500, { error: true, message } );
		}

		throw redirect( 302, '/' );
	},
};
