<script>
	import '../app.scss';

	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import IconButton from '$lib/components/icon-button.svelte';
	import Main from '$lib/components/main.svelte';
	import Nav from '$lib/components/nav.svelte';
	import Offline from '$lib/components/offline.svelte';
	import Sidebar from '$lib/components/sidebar.svelte';
	import UserInfo from '$lib/components/user-info.svelte';

	const { data: page_data } = $page;
	const { children, data } = $props();

	let is_online = $state( true );
	/** @type {Sidebar|undefined} */
	let sidebar = $state();

	const doc_title = $derived.by( () => {
		const suffix = data.app_name;

		return page_data.meta.title ? `${ page_data.meta?.title } — ${ suffix }` : suffix;
	} );

	const page_title = $derived( page_data.meta.title || data.app_name );

	beforeNavigate( () => {
		sidebar?.close();
	} );
</script>

<svelte:window bind:online={is_online} />

<svelte:head>
	<title>{doc_title}</title>
</svelte:head>

{#if data.user}
	<a class="screen-reader-shortcut" href="#content" role="button">Skip to main content</a>
{/if}

<div class="app" class:has-sidebar={data.user !== undefined}>
	<hgroup class="container-fluid">
		<h1 class:visually-hidden={page_data.hide_title}>{page_title}</h1>
		{#if data.user}
			<IconButton icon="menu" label="Menu" onclick={() => sidebar?.toggle()} />
		{/if}
	</hgroup>

	{#if data.user}
		<!-- TODO: Get close_at from a constant or something. -->
		<Sidebar bind:this={sidebar} close_at={1024}>
			<IconButton class="close" icon="x" label="Close sidebar" onclick={sidebar?.close} />
			<Nav />
			<UserInfo user={data.user} />
		</Sidebar>
	{/if}

	{#if ! page_data.needs_net || ( page_data.needs_net && is_online )}
		{@render children()}
	{:else}
		<Main center_content>
			<Offline />
		</Main>
	{/if}
</div>

<style lang="scss">
	.app {
		--sidebar-size: 20rem;

		min-block-size: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr;

		@media ( min-width: $br-lg ) {
			&.has-sidebar {
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
