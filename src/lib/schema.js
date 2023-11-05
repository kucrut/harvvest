import { z } from 'zod';

export const user_schema = z.object( {
	email: z.string().email().optional(),
	name: z.string(),
	url: z.string().url(),
} );

/** @typedef {z.infer<user_schema>} User */
