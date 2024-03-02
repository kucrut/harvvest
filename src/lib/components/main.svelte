<script>
	/** @type {{center_content?: boolean; children: import('svelte').Snippet}} */
	const { center_content = false, children } = $props();
</script>

<main class="container-fluid" class:centered={center_content} id="content">
	{@render children()}
</main>

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
