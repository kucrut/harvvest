<script>
	import { goto } from '$app/navigation';
	import ContentWrap from '$lib/components/content-wrap.svelte';
</script>

<svelte:head>
	<title>Photo Harvest</title>
</svelte:head>

<ContentWrap>
	<div class="grid place-content-center gap-5">
		<svg
			class="w-16"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><line x1="2" x2="22" y1="2" y2="22" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><path
				d="M2 8.82a15 15 0 0 1 4.17-2.65"
			/><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" /><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" /><path
				d="M5 13a10 10 0 0 1 5.24-2.76"
			/><line x1="12" x2="12.01" y1="20" y2="20" /></svg
		>
		<p>You are offline.</p>
		<button class="btn variant-filled" type="button" on:click={() => goto( '/' )}>Refresh</button>
	</div>
</ContentWrap>
