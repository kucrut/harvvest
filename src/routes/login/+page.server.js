import { wp_login } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';

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

		// TODO: Validate URL

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
