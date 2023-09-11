<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
    <title>Photo Harvest</title>
</svelte:head>

<h1>Hello {$page.data.user.name}!</h1>
