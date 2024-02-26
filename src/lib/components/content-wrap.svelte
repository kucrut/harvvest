<script>
	export let center_content = false;
</script>

<main class="container" class:centered={center_content}><slot /></main>

<style>
	main {
		padding-block: var( --pico-block-spacing-vertical );
		min-height: 100dvh;
	}

	.centered {
		display: flex;
		flex-direction: column;
		place-content: center;
	}
</style>
