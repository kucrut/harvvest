<script>
	import { AppBar, AppShell, Drawer, Toast, getDrawerStore, initializeStores } from '@skeletonlabs/skeleton';
	import AppMenu from '$lib/components/app-menu.svelte';
	import AppMenuButton from '$lib/components/app-menu-button.svelte';
	import '../app.postcss';

	initializeStores();

	const drawer_store = getDrawerStore();
</script>

<Drawer>
	{#if $drawer_store.id === 'app-menu'}
		<AppMenu />
	{/if}
</Drawer>

<AppShell>
	<Toast />
	<AppBar
		gridColumns="grid-cols-[1fr_auto_1fr]"
		slot="header"
		slotDefault="place-self-center"
		slotTrail="place-content-end"
	>
		<svelte:fragment slot="lead"><AppMenuButton /></svelte:fragment>
		<h1 class="h2">Photo Harvest</h1>
		<svelte:fragment slot="trail"><span /></svelte:fragment>
	</AppBar>

	<slot />
</AppShell>
