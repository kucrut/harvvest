<script>
	import { click_outside, handle_escape, trap_focus } from '@kucrut/svelte-stuff/actions';

	/** @type {{children?: import('svelte').Snippet; close_at?: number; close_button?: import('svelte').Snippet}} */
	const { children, close_at, close_button } = $props();

	let is_open = $state( false );

	export function close() {
		is_open = false;
	}

	export function open() {
		is_open = true;
	}

	export function toggle() {
		is_open = ! is_open;
	}

	/**
	 * Close sidebar when window size is above the large breakpoint
	 *
	 * @param {Event} event Event.
	 */
	function handle_window_resize( event ) {
		if (
			typeof close_at === 'number' &&
			close_at > 0 &&
			event.type === 'resize' &&
			event.target instanceof Window &&
			event.target.innerWidth > close_at
		) {
			close();
		}
	}
</script>

<svelte:window onresize={handle_window_resize} />

<aside
	class:is-open={is_open}
	tabindex="-1"
	use:click_outside={{ active: is_open, callback: close }}
	use:handle_escape={{ active: is_open, callback: close }}
	use:trap_focus={{ active: is_open }}
>
	{#if close_button}
		{@render close_button()}
	{/if}

	{#if children}
		{@render children()}
	{/if}
</aside>

<style lang="scss">
	aside {
		position: fixed;
		z-index: 100;
		inset: 0;
		block-size: 100dvh;
		inline-size: var( --sidebar-size );
		max-inline-size: 20rem;
		padding: var( --pico-spacing );
		background-color: var( --pico-form-element-background-color );
		display: grid;
		transform: translate3d( -100%, 0, 0 );
		transition: transform 0.3s;
		visibility: hidden;

		&.is-open {
			transform: translateZ( 0 );
			visibility: visible;
		}

		@media ( min-width: $br-lg ) {
			visibility: visible;
			z-index: initial;
			transform: unset;
			grid-row: 1/-1;
		}

		> :global( .close ) {
			position: absolute;
			inset-block-start: var( --pico-spacing );
			inset-inline-end: var( --pico-spacing );

			@media ( min-width: $br-lg ) {
				display: none;
			}
		}
	}
</style>
