import { redirect } from '@sveltejs/kit';

export const load = async ( { locals } ) => {
	const next_path = locals.user ? '/upload' : '/login';

	throw redirect( 302, next_path );
};
