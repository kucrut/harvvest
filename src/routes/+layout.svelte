<script>
	import '../app.scss';

	import { page } from '$app/stores';
	import Main from '$lib/components/main.svelte';
	import Offline from '$lib/components/offline.svelte';
	import Sidebar from '$lib/components/sidebar.svelte';

	const { children, data } = $props();

	let is_online = $state( true );
	let is_sidebar_open = $state( false );

	$effect( () => {
		is_online = navigator.onLine;
	} );

	$effect( () => {
		const set_offline = () => {
			is_online = false;
		};

		const set_online = () => {
			is_online = true;
		};

		window.addEventListener( 'offline', set_offline );
		window.addEventListener( 'online', set_online );

		return () => {
			window.removeEventListener( 'offline', set_offline );
			window.removeEventListener( 'online', set_online );
		};
	} );
</script>

<div class:has-sidebar={data.user !== undefined}>
	<hgroup class="container-fluid">
		<h1>{data.app_name}</h1>
		{#if data.user}
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
		{/if}
	</hgroup>

	{#if data.user}
		<Sidebar
			close={() => {
				is_sidebar_open = false;
			}}
			is_open={is_sidebar_open}
		/>
	{/if}

	{#if ! $page.data.needs_net || ( $page.data.needs_net && is_online )}
		{@render children()}
	{:else}
		<Main center_content>
			<Offline />
		</Main>
	{/if}
</div>

<style lang="scss">
	div {
		min-block-size: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr;

		@media ( min-width: $br-lg ) {
			--sidebar-size: 0;

			&.has-sidebar {
				--sidebar-size: min( 20rem, 100vw );
				grid-template-columns: var( --sidebar-size ) 1fr;
			}
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
