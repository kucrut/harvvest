import { clear_cookies } from '$lib/utils.server.js';
import { delete_app_password, get_app_passwords } from '@kucrut/wp-api-helpers';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = () => {
	redirect( 307, '/' );
};

/** @type {import('./$types').Actions} */
export const actions = {
	async default( { cookies, locals } ) {
		if ( ! locals.session ) {
			clear_cookies( cookies );
			redirect( 302, '/login' );
		}

		const app_id = cookies.get( 'app_id' );

		if ( ! app_id ) {
			// eslint-disable-next-line no-console
			console.warn( '[FIXME] Logout action: `app_id` not found in cookies.' );
			clear_cookies( cookies );
			redirect( 302, '/login' );
		}

		// Wrapped in try/catch to prevent errors from leaking in case (for example) the app password
		// has been manually deleted.
		try {
			const all_app_pass = await get_app_passwords( locals.session.api_url, locals.session.auth, 'me', 'edit' );
			const app_pass = all_app_pass.find( item => item.app_id === app_id );

			if ( app_pass ) {
				await delete_app_password( locals.session.api_url, locals.session.auth, 'me', app_pass.uuid );
			}
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Logout action: ', error );
		} finally {
			clear_cookies( cookies );
			redirect( 302, '/login' );
		}
	},
};
