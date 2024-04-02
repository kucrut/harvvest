import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export function load( { locals } ) {
	if ( ! locals.session ) {
		redirect( 301, '/login' );
	}

	return {
		hide_title: true,
		meta: {
			title: '',
		},
	};
}
