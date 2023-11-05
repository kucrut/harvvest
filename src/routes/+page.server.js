import { fail, redirect } from '@sveltejs/kit';
import { logout, wp_upload } from '$lib/utils';
import { session_schema } from '$lib/schema';

/** @type {import('./$types').PageServerLoad} */
export const load = async ( { locals } ) => {
	if ( ! locals.user ) {
		throw redirect( 302, '/login' );
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ( { cookies, request } ) => {
		const force_logout = () => {
			logout( cookies );
		};

		const session_str = cookies.get( 'session' );

		if ( typeof session_str !== 'string' || session_str === '' ) {
			force_logout();
			return;
		}

		const session = session_schema.safeParse( JSON.parse( session_str ) );

		if ( ! session.success ) {
			force_logout();
			return;
		}

		const data = await request.formData();
		const file = data.get( 'file' );

		if ( ! ( file instanceof File ) ) {
			return fail( 400, { error: true, message: 'Please provide an image to upload.' } );
		}

		const alt_text = data.get( 'alt_text' );

		if ( typeof alt_text !== 'string' || alt_text === '' ) {
			return fail( 400, { error: true, message: 'Please provide an alt text for the image.' } );
		}

		const caption = data.get( 'caption' );

		if ( typeof caption !== 'string' || caption === '' ) {
			return fail( 400, { error: true, message: 'Please provide a caption for the image.' } );
		}

		const { token, api_url } = session.data;
		const result = await wp_upload( api_url, token, data );

		if ( typeof result === 'string' ) {
			return { success: true, image_link: result };
		}

		return fail( 500, {
			error: true,
			message: result.message,
		} );
	},
};
