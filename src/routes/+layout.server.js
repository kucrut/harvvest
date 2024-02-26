import { env } from '$env/dynamic/private';

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ( { locals } ) => {
	const data = {
		app_name: env.APP_NAME,
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
};
