<script>
	import { goto } from '$app/navigation';
	import ContentWrap from '$lib/components/content-wrap.svelte';
</script>

<svelte:head>
	<title>Photo Harvest</title>
</svelte:head>

<ContentWrap>
	<div class="grid place-content-center gap-5">
		<p>You are offline.</p>
		<button class="btn variant-filled" type="button" on:click={() => goto( '/' )}>Refresh</button>
	</div>
</ContentWrap>
