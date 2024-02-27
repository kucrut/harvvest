<script>
	import '../app.scss';

	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/sidebar.svelte';

	const { children, data } = $props();

	let is_sidebar_open = $state( false );
	let sidebar_size = $state( '0' );

	onMount( () => {
		// TODO: Move this to individual page.
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

	$effect( () => {
		sidebar_size = data.user ? 'min( 35ch, 100vw )' : '0';
	} );
</script>

<div style="--sidebar-size:{sidebar_size}">
	<hgroup class="container-fluid">
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

	{#if data.user}
		<Sidebar
			close={() => {
				is_sidebar_open = false;
			}}
			is_open={is_sidebar_open}
		/>
	{/if}

	{@render children()}
</div>

<style lang="scss">
	div {
		@media ( min-width: $br-lg ) {
			display: grid;
			grid-template-columns: var( --sidebar-size ) 1fr;
		}
	}

	hgroup {
		display: grid;
		align-items: center;
		padding-block: var( --pico-spacing );

		@media ( min-width: $br-lg ) {
			grid-column: 2/-1;
			grid-row: 1/2;
		}
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

		@media ( min-width: $br-lg ) {
			display: none;
		}
	}

	svg {
		display: inline-block;
		vertical-align: middle;
	}
</style>
