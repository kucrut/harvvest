<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Drawer, getDrawerStore, initializeStores } from '@skeletonlabs/skeleton';
	import Alert from '$lib/components/alert.svelte';
	import AppMenu from '$lib/components/app-menu.svelte';
	import '../app.postcss';

	initializeStores();

	const drawer_store = getDrawerStore();

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

<Drawer>
	{#if $drawer_store.id === 'app-menu'}
		<AppMenu />
	{:else if $drawer_store.id === 'alert'}
		<Alert meta={$drawer_store.meta} on:dismiss={() => drawer_store.close()} />
	{/if}
</Drawer>

<div class="app-shell">
	<div class="app-bar">
		<button>Menu</button>
		<h1 class="h2">Photo Harvest</h1>
	</div>

	<slot />
</div>
