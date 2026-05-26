import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = ( ( { locals } ) => {
	if ( ! locals.session ) {
		redirect( 302, '/login' );
	}

	return {
		hide_title: true,
		meta: {
			title: '',
		},
	};
} ) satisfies PageServerLoad;
