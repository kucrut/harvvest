/** @type {import('./$types').LayoutServerLoad} */
export const load = async ( { locals } ) => {
	if ( locals.user ) {
		return {
			user: locals.user,
		};
	}
};
