<script>
	import Offline from './offline.svelte';

	/**
	 * @type {{
	 *   center_content?: boolean;
	 *   children: import('svelte').Snippet;
	 *   needs_net?: boolean;
	 * }}
	 */
	const { center_content = false, children, needs_net = false } = $props();

	let is_online = $state( true );

	$effect( () => {
		is_online = navigator.onLine;
	} );

	$effect( () => {
		const set_offline = () => {
			is_online = false;
		};

		const set_online = () => {
			is_online = true;
		};

		window.addEventListener( 'offline', set_offline );
		window.addEventListener( 'online', set_online );

		return () => {
			window.removeEventListener( 'offline', set_offline );
			window.removeEventListener( 'online', set_online );
		};
	} );
</script>

<main class="container-fluid" class:centered={center_content}>
	{#if ! needs_net || ( needs_net && is_online )}
		{@render children()}
	{:else}
		<Offline />
	{/if}
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
