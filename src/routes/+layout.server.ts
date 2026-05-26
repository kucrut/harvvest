import { APP_NAME } from '$env/static/private';
import type { LayoutServerLoad } from './$types';

export const load = ( ( { locals } ) => {
	const data = {
		app_name: APP_NAME,
	};

	if ( ! locals.session ) {
		return data;
	}

	return {
		...data,
		user: {
			avatar_url: locals.session.avatar_url,
			name: locals.session.name,
			wp_url: locals.session.wp_url,
		},
	};
} ) satisfies LayoutServerLoad;
