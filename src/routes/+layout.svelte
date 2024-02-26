<script>
	import '../app.scss';

	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import AppMenu from '$lib/components/app-menu.svelte';

	export let data;

	let is_sidebar_open = false;

	onMount( () => {
		const offline_path = '/offline';

		window.addEventListener( 'offline', () => {
			if ( $page.url.pathname !== offline_path ) {
				goto( offline_path );
			}
		} );

		window.addEventListener( 'online', () => {
			if ( $page.url.pathname === offline_path ) {
				goto( '/' );
			}
		} );
	} );
</script>

<!-- Alert component -->

<div>
	<hgroup class="container">
		<h1>{data.app_name}</h1>
		<button class="outline" on:click={() => ( is_sidebar_open = ! is_sidebar_open )}
			><svg
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path
					d="M4 18l16 0"
				/></svg
			></button
		>
	</hgroup>
	<AppMenu
		close={() => {
			is_sidebar_open = false;
		}}
		is_open={is_sidebar_open}
	/>
	<slot />
</div>

<style>
	hgroup {
		display: grid;
		align-items: center;
		padding-block: var( --pico-spacing );
	}

	h1,
	button {
		grid-column: 1/1;
		grid-row: 1/1;
	}

	h1 {
		text-align: center;
		font-size: 1.5rem;
	}

	button {
		align-self: self-start;
		inline-size: fit-content;
		border: unset;
		padding: unset;
	}

	svg {
		display: inline-block;
		vertical-align: middle;
	}
</style>
