<script>
	import { page } from '$app/stores';
	import Nav from './nav.svelte';
	import UserInfo from './user-info.svelte';

	/** @type {{ close: () => void; is_open?: boolean }} */
	const { close, is_open = false } = $props();
</script>

<aside class:is-open={is_open}>
	<button on:click={close}
		><svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
			><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg
		></button
	>

	<Nav />

	{#if $page.data.user}
		<UserInfo user={$page.data.user} />
	{/if}
</aside>

<style lang="scss">
	aside {
		position: fixed;
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
			transform: unset;
			grid-row: 1/-1;
		}
	}

	button {
		position: absolute;
		inset-block-start: var( --pico-spacing );
		inset-inline-end: var( --pico-spacing );
		background: unset;
		border: unset;
		padding: unset;
		color: inherit;

		@media ( min-width: $br-lg ) {
			display: none;
		}
	}
</style>
