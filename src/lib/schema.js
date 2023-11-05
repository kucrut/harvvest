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

export const wp_user_schema = z.object( {
	user_email: z.string().email(),
	user_display_name: z.string(),
	user_nicename: z.string(),
	token: z.string(),
} );

/** @typedef {z.infer<wp_user_schema>} WP_User */
