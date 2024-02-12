import { create_media, get_taxonomies, get_terms } from '@kucrut/wp-api-helpers';
import { env } from '$env/dynamic/public';
import { fail } from '@sveltejs/kit';
import { get_error_message } from '@kucrut/wp-api-helpers/utils';
import { logout } from '$lib/utils.server';
import pretty_bytes from 'pretty-bytes';

function get_max_file_size() {
	return +( env.PUBLIC_MAX_FILE_SIZE ?? '512' );
}

/**
 * Bail because of invalid field value
 *
 * @param {string} message Error message.
 */
function invalid_value( message ) {
	return fail( 400, { error: true, message } );
}

/** @type {import('./$types').PageServerLoad} */
export const load = async ( { cookies, locals } ) => {
	if ( ! locals.session ) {
		logout( cookies );
		return;
	}

	const auth = locals.session.auth;

	try {
		const taxonomies = await get_taxonomies( locals.session.api_url, auth, 'view', { type: 'attachment' } );
		/** @type {import('$types').Taxonomy_Terms_Option[]} */
		const terms = [];

		for ( const tax of taxonomies ) {
			try {
				const tax_terms = await get_terms( locals.session.api_url, tax.rest_base, auth, 'view', { hide_empty: false } );

				terms.push( {
					name: tax.name,
					slug: tax.rest_base,
					terms: tax_terms.map( ( { id, name } ) => ( { id, name } ) ),
				} );
			} catch ( err ) {
				// eslint-disable-next-line no-console
				console.log( err );
				continue;
			}
		}

		return {
			terms,
			max_file_size: get_max_file_size(),
		};
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.log( error );
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ( { cookies, locals, request } ) => {
		if ( ! locals.session ) {
			logout( cookies );
			return;
		}

		const data = await request.formData();
		const file = data.get( 'file' );

		if ( ! ( file instanceof File ) ) {
			return invalid_value( 'Please provide an image or video to upload.' );
		}

		const max_file_size = get_max_file_size();

		if ( file.size > max_file_size ) {
			return invalid_value( `Upload file size exceeded limit (${ pretty_bytes( max_file_size ) }).` );
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
			const result = await create_media( locals.session.api_url, locals.session.auth, data );

			return {
				success: true,
				image_link: result.source_url, // TODO: Maybe return the whole object.
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
