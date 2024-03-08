<script>
	import '../app.scss';

	import { page } from '$app/stores';
	import IconButton from '$lib/components/icon-button.svelte';
	import Main from '$lib/components/main.svelte';
	import Offline from '$lib/components/offline.svelte';
	import Sidebar from '$lib/components/sidebar.svelte';

	const { children, data } = $props();

	let is_online = $state( true );
	let is_sidebar_open = $state( false );

	const doc_title = $derived.by( () => {
		const suffix = data.app_name;

		return $page.data.meta.title ? `${ $page.data.meta?.title } — ${ suffix }` : suffix;
	} );

	const page_title = $derived( $page.data.meta.title || data.app_name );

	$effect.pre( () => {
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

<svelte:head>
	<title>{doc_title}</title>
</svelte:head>

{#if data.user}
	<a class="screen-reader-shortcut" href="#content" role="button">Skip to main content</a>
{/if}

<div class="app" class:has-sidebar={data.user !== undefined}>
	<hgroup class="container-fluid">
		<h1 class:visually-hidden={$page.data.hide_title}>{page_title}</h1>
		{#if data.user}
			<IconButton icon="menu" label="Menu" onclick={() => ( is_sidebar_open = ! is_sidebar_open )} />
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
	.app {
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
		margin-block-start: var( --pico-spacing );

		@media ( min-width: $br-lg ) {
			grid-column: 2/-1;
			grid-row: 1/2;
		}

		:global( button ) {
			grid-column: 1/1;
			grid-row: 1/1;

			@media ( min-width: $br-lg ) {
				display: none;
			}
		}
	}

	h1 {
		grid-column: 1/1;
		grid-row: 1/1;
		text-align: center;
		font-size: 1.5rem;
	}
</style>
