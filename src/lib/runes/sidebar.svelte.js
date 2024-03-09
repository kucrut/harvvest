// TODO: Remove this when svelte 5 is out.
// eslint-disable-next-line no-undef
let is_open = $state( false );

export const sidebar = {
	get is_open() {
		return is_open;
	},

	close: () => ( is_open = false ),
	toggle: () => ( is_open = ! is_open ),
};
