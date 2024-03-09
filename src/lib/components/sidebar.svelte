<script>
	import { click_outside, handle_escape, trap_focus } from '@kucrut/svelte-stuff/actions';
	import { page } from '$app/stores';
	import { sidebar } from '$lib/runes/sidebar.svelte.js';
	import IconButton from './icon-button.svelte';
	import Nav from './nav.svelte';
	import UserInfo from './user-info.svelte';
</script>

<aside
	tabindex="-1"
	class:is-open={sidebar.is_open}
	use:click_outside={{ active: sidebar.is_open, callback: () => sidebar.close() }}
	use:handle_escape={{ active: sidebar.is_open, callback: () => sidebar.close() }}
	use:trap_focus={{ active: sidebar.is_open }}
>
	<IconButton class="close" icon="x" label="Close sidebar" onclick={() => sidebar.toggle()} />

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
		transition: transform 0.5s;
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
