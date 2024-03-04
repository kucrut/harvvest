<script>
	import { page } from '$app/stores';
	import IconButton from '$lib/components/icon-button.svelte';
	import Nav from './nav.svelte';
	import UserInfo from './user-info.svelte';

	/** @type {{ close: () => void; is_open?: boolean }} */
	const { close, is_open = false } = $props();
</script>

<aside class:is-open={is_open}>
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
		max-inline-size: unset;
		inline-size: var( --sidebar-size );
		padding: var( --pico-spacing );
		background-color: var( --pico-form-element-background-color );
		display: grid;
		transform: translate3d( -100%, 0, 0 );
		transition: transform 0.5s;

		&.is-open {
			transform: translateZ( 0 );
		}

		@media ( min-width: $br-lg ) {
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
