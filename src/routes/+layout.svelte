<script>
	import {
		AppBar,
		AppShell,
		Drawer,
		Toast,
		getDrawerStore,
		initializeStores,
		storePopup,
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { page } from '$app/stores';
	import AppMenu from '$lib/components/app-menu.svelte';
	import MenuButton from '$lib/components/menu-button.svelte';
	import UserMenu from '$lib/components/user-menu.svelte';
	import '../app.postcss';

	initializeStores();
	storePopup.set( { computePosition, autoUpdate, offset, shift, flip, arrow } );

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
		<svelte:fragment slot="lead">
			<MenuButton />
		</svelte:fragment>
		<h1 class="h2">Photo Harvest</h1>
		<svelte:fragment slot="trail">
			{#if $page.data.user}
				<UserMenu user={$page.data.user} />
			{/if}
		</svelte:fragment>
	</AppBar>

	<slot />
</AppShell>
