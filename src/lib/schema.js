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
	auth: z.string(),
} );

/** @typedef {z.infer<session_schema>} Session */
