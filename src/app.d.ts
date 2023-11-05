/* eslint-disable space-in-parens */

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: import('./lib/schema.js').User;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
