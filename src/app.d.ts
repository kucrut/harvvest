/* eslint-disable space-in-parens */

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: import('./lib/schema').Session;
			terms?: Array< import('$types').Taxonomy_Terms_Option >;
			user?: import('./lib/schema.js').User;
		}
		interface PageData {
			terms?: Array< import('$types').Taxonomy_Terms_Option >;
			user?: import('./lib/schema.js').User;
		}
		// interface Platform {}
	}
}

export {};
