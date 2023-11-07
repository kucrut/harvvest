<script>
	import { AppBar, AppShell, Toast, initializeStores, storePopup } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { page } from '$app/stores';
	import UserMenu from '$lib/components/user-menu.svelte';
	import '../app.postcss';
	import MenuButton from '$lib/components/menu-button.svelte';

	initializeStores();
	storePopup.set( { computePosition, autoUpdate, offset, shift, flip, arrow } );
</script>

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
