<script>
	import { page } from '$app/stores';
	import Nav from './nav.svelte';

	/** @type {() => void } */
	export let close;
	export let is_open = false;
</script>

<aside class:is-open={is_open}>
	<button class="close" on:click={close}
		><svg
			xmlns="http://www.w3.org/2000/svg"
			class="icon icon-tabler icon-tabler-x"
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
		<div class="user-info">
			<img alt="User avatar" src={$page.data.user.avatar_url} />
			<span>{$page.data.user.name}</span>
			<a href={$page.data.user.wp_url} target="_blank">{$page.data.user.wp_url}</a>
			<form action="/logout" method="POST">
				<button type="submit">Log Out</button>
			</form>
		</div>
	{/if}
</aside>

<style lang="scss">
	aside {
		position: fixed;
		inset: 0;
		block-size: 100dvh;
		max-inline-size: unset;
		inline-size: min( 35ch, 100vw );
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

	.close {
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

	.user-info {
		block-size: fit-content;
		align-self: self-end;
		display: grid;
		column-gap: var( --pico-spacing );
		grid-template-columns: max-content 1fr;
	}

	img {
		width: 48px;
		grid-row: 1/3;
		border-radius: var( --pico-border-radius );
	}

	form {
		margin-block-start: var( --pico-spacing );
		grid-column: 1/3;
	}
</style>
