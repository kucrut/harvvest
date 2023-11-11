/** @type {import('./$types').LayoutServerLoad} */
export const load = async ( { locals } ) => {
	if ( locals.session ) {
		return {
			user: {
				avatar_url: locals.session.avatar_url,
				name: locals.session.name,
				wp_url: locals.session.wp_url,
			},
		};
	}
};
