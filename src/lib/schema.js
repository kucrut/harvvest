import { z } from 'zod';

export const user_schema = z.object( {
	email: z.string().email().optional(),
	name: z.string(),
	url: z.string().url(),
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

export const wp_user_schema = z.object( {
	user_email: z.string().email(),
	user_display_name: z.string(),
	user_nicename: z.string(),
	token: z.string(),
} );

/** @typedef {z.infer<wp_user_schema>} WP_User */
