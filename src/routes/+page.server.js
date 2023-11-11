import { fail, redirect } from '@sveltejs/kit';
import { get_error_message } from '$lib/utils';
import { logout, wp_get_attachment_taxonomies, wp_get_taxonomy_terms, wp_upload } from '$lib/utils.server.js';
import { session_schema } from '$lib/schema';

/**
 * Bail because of invalid field value
 *
 * @param {string} message Error message.
 */
function invalid_value( message ) {
	return fail( 400, { error: true, message } );
}

/** @type {import('./$types').PageServerLoad} */
export const load = async ( { locals, parent } ) => {
	const layout_data = await parent();

	if ( ! locals.session || ! layout_data.user ) {
		throw redirect( 302, '/login' );
	}

	try {
		const taxonomies = await wp_get_attachment_taxonomies( locals.session.api_url, locals.session.token );
		/** @type {import('$types').Taxonomy_Terms_Option[]} */
		const terms = [];

		for ( const tax of Object.values( taxonomies ) ) {
			try {
				const tax_terms = await wp_get_taxonomy_terms( tax._links[ 'wp:items' ][ 0 ].href, locals.session.token );

				terms.push( {
					name: tax.name,
					slug: tax.slug,
					terms: tax_terms.map( ( { id, name } ) => ( { id, name } ) ),
				} );
			} catch ( err ) {
				// eslint-disable-next-line no-console
				console.log( err );
				continue;
			}
		}

		return { terms };
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.log( error );
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
			return invalid_value( 'Please provide an image to upload.' );
		}

		const alt_text = data.get( 'alt_text' );

		if ( typeof alt_text !== 'string' || alt_text === '' ) {
			return invalid_value( 'Please provide an alt text for the image.' );
		}

		const caption = data.get( 'caption' );

		if ( typeof caption !== 'string' || caption === '' ) {
			return invalid_value( 'Please provide a caption for the image.' );
		}

		try {
			const result = await wp_upload( session.data.api_url, session.data.token, data );

			return {
				success: true,
				image_link: result,
			};
		} catch ( error ) {
			const message = get_error_message(
				error,
				'Unexpected upload result from server. Please consult the logs.',
				true,
			);

			return fail( 500, {
				message,
				error: true,
			} );
		}
	},
};
