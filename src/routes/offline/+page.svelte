<script>
	import ContentWrap from '$lib/components/content-wrap.svelte';
	import { onMount } from 'svelte';

	function redirect() {
		window.location.replace( '/' );
	}

	onMount( () => {
		window.addEventListener( 'online', redirect );
	} );
</script>

<svelte:head>
	<title>Photo Harvest</title>
</svelte:head>

<ContentWrap>
	<div class="grid place-content-center gap-5">
		<p>You are offline.</p>
		<button class="btn variant-filled" type="button" on:click={redirect}>Refresh</button>
	</div>
</ContentWrap>
