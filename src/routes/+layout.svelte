<script>
	import { AppBar, AppShell, Avatar, Toast, initializeStores } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import '../app.postcss';

	initializeStores();
</script>

<AppShell>
	<Toast />
	<AppBar
		gridColumns="grid-cols-[1fr_auto_1fr]"
		slot="header"
		slotDefault="place-self-center"
		slotTrail="place-content-end"
	>
		<!-- TODO: App icon -->
		<svelte:fragment slot="lead"><span /></svelte:fragment>
		<h1 class="h2">Photo Harvest</h1>
		<svelte:fragment slot="trail">
			{#if $page.data.user}
				<Avatar src={$page.data.user.avatar_url} rounded="rounded-md" width="w-8" />
				<!--form action="/logout" method="POST">
					<button class="btn variant-ghost" type="submit">Log Out</button>
				</form-->
			{/if}
		</svelte:fragment>
	</AppBar>

	<slot />
</AppShell>
