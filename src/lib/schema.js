import { z } from 'zod';

export const user_schema = z.object( {
	avatar_url: z.string().url(),
	email: z.string().email().optional(),
	name: z.string(),
	wp_url: z.string().url(),
} );

/** @typedef {z.infer<user_schema>} User */

export const session_schema = user_schema.extend( {
	api_url: z.string().url(),
	token: z.string(),
} );

/** @typedef {z.infer<session_schema>} Session */

const wp_item_string = z.object( {
	raw: z.string(),
	rendered: z.string(),
} );

export const wp_media_item_schema = z.object( {
	id: z.number(),
	date: z.string(),
	date_gmt: z.string(),
	caption: wp_item_string,
	description: wp_item_string,
	guid: z.object( {
		raw: z.string().url(),
		rendered: z.string().url(),
	} ),
	link: z.string().url(),
	slug: z.string(),
	source_url: z.string().url(),
	title: wp_item_string,
	// TODO: Add more?
} );

/** @typedef {z.infer<wp_media_item_schema>} WP_Media_Item */

export const wp_rest_error_schema = z.object( {
	code: z.string(),
	message: z.string(),
	data: z.object( {
		status: z.number(),
	} ),
} );

/** @typedef {z.infer<wp_rest_error_schema>} WP_Rest_Error */

const wp_link_item_schema = z.array( z.object( { href: z.string().url() } ) );

const wp_links_schema = z.object( {
	self: wp_link_item_schema,
	collection: wp_link_item_schema,
} );

export const wp_term_schema = z.object( {
	id: z.number().min( 1 ),
	count: z.number(),
	description: z.string(),
	link: z.string(),
	name: z.string(),
	slug: z.string(),
	taxonomy: z.string(),
	parent: z.number(),
	_links: wp_links_schema.extend( {
		about: wp_link_item_schema,
	} ),
} );

/** @typedef {z.infer<wp_term_schema>} WP_Term */

export const wp_taxonomy_terms_schema = wp_term_schema.array();

/** @typedef {z.infer<wp_taxonomy_terms_schema>} WP_Taxonomy_Terms */
