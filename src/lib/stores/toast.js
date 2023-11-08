import { writable } from 'svelte/store';

/**
 * @typedef {{
 *   add: (item: import('$types').Toast) => void;
 *   clear: () => void;
 *   remove: (id: string) => void;
 * } & import('svelte/store').Readable<import('$types').Toast[]>} Store
 */

/** @type {Store} */
let store;

/**
 * Get toast store
 *
 * @return {Store} Toast store.
 */
export function get_toast_store() {
	return store;
}

/**
 * Init toast store
 */
export function init_toast_store() {
	/** @type {Partial<import('$types').Toast>} */
	const item_defaults = {
		autohide: true,
	};

	/** @type {import('svelte/store').Writable<import('$types').Toast[]>} */
	const { update, ...rest } = writable( [] );

	store = {
		...rest,

		add( item ) {
			const merged = {
				...item_defaults,
				...item,
			};

			update( value => [ ...value, merged ] );
		},

		clear() {
			update( () => [] );
		},

		remove( id ) {
			update( value => value.filter( item => item.id !== id ) );
		},
	};
}
