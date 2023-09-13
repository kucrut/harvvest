// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: import( './types' ).User;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
