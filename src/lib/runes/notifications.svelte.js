/* eslint-disable svelte/prefer-destructured-store-props */

/**
 * @typedef {{
 *   children?: import('svelte').Snippet;
 *   id: string;
 *   message?: string;
 *   timeout?: number;
 *   type: 'error' | 'message' | 'success';
 * }} Notification
 */

export class Notifications {
	/** @type {Readonly<Notification[]>} */
	#items = $state.frozen( [] );

	get items() {
		return this.#items;
	}

	/** @param {Notification} item */
	add( item ) {
		this.#items = [ ...this.#items, item ];
	}

	clear() {
		this.#items = [];
	}

	/** @param {Notification['id']} id */
	remove( id ) {
		this.#items = this.#items.filter( item => item.id !== id );
	}
}

export const notifications = new Notifications();
