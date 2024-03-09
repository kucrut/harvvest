<script>
	import { click_outside, handle_escape, trap_focus } from '@kucrut/svelte-stuff/actions';
	import { page } from '$app/stores';
	import IconButton from './icon-button.svelte';
	import Nav from './nav.svelte';
	import UserInfo from './user-info.svelte';

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
</script>

<aside
	tabindex="-1"
	class:is-open={is_open}
	use:click_outside={{ active: is_open, callback: close }}
	use:handle_escape={{ active: is_open, callback: close }}
	use:trap_focus={{ active: is_open }}
>
	<IconButton class="close" icon="x" label="Close sidebar" onclick={close} />

	<Nav />

	{#if $page.data.user}
		<UserInfo user={$page.data.user} />
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
