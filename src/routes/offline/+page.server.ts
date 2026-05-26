import type { PageServerLoad } from './$types';

export const prerender = true;

export const load = ( () => {
	return {
		meta: {
			title: 'Offline',
		},
	};
} ) satisfies PageServerLoad;
