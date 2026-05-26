import { clear_cookies } from '$lib/utils.server.js';
import { delete_app_password } from '@kucrut/wp-api-helpers';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = ( async ( { cookies, locals } ) => {
	if ( locals.session ) {
		// Wrapped in try/catch to prevent errors from leaking in case
		// (for example) the app password has been manually deleted.
		try {
			await delete_app_password(
				locals.session.api_url,
				locals.session.auth,
				'me',
				locals.session.auth_uuid,
			);
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Logout action:', error );
		}
	}

	clear_cookies( cookies );
	redirect( 302, '/login' );
} ) satisfies PageServerLoad;
