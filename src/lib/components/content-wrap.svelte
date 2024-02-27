<script>
	export let center_content = false;
</script>

<main class="container-fluid" class:centered={center_content}><slot /></main>

<style lang="scss">
	main {
		padding-block: var( --pico-block-spacing-vertical );

		@media ( min-width: $br-lg ) {
			grid-column: 2/-1;
		}
	}

	.centered {
		display: flex;
		flex-direction: column;
		place-content: center;
	}
</style>
