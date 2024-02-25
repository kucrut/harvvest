<script>
	export let center = false;
</script>

<main class="container" class:centered={center}><slot /></main>

<style>
	main {
		padding-block: var( --pico-block-spacing-vertical );
		min-height: 100dvh;

		&.centered {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
	}
</style>
