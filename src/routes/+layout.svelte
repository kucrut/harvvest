<script>
	import { page } from '$app/stores';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import '../app.postcss';
</script>


<AppShell>
	<AppBar slot="header" slotDefault="place-self-center" slotTrail="place-content-end">
		<svelte:fragment slot="lead">(icon)</svelte:fragment>
		<h1 class="h2">Photo Harvest</h1>
		<svelte:fragment slot="trail">
			{#if $page.data.user}
				<form action="/logout" method="POST">
					<button type="submit">Log Out</button>
				</form>
			{/if}
		</svelte:fragment>
	</AppBar>

	<slot />
</AppShell>

