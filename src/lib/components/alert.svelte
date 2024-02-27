<script>
	/** @type {{ children: import('svelte').Snippet; timeout?: number; type: import('$types').Alert['type']; onexpire: () => void }} */
	const { children, timeout = 2000, type = 'message', onexpire } = $props();

	/** @type {ReturnType<typeof setTimeout>|undefined} */
	let timeout_id = $state( undefined );

	function start() {
		if ( timeout < 500 ) {
			return;
		}

		timeout_id = setTimeout( onexpire, timeout );
	}

	function stop() {
		if ( timeout_id ) {
			clearTimeout( timeout_id );
		}
	}

	$effect( () => {
		start();
		return stop;
	} );
</script>

<aside class={type} on:mouseenter={stop} on:mouseleave={start} on:pointerenter={stop} on:pointerleave={start}>
	{@render children()}
</aside>

<style lang="scss">
	aside {
		position: fixed;
		inset-block-end: 0;
		block-size: fit-content;
		inline-size: calc( 100dvw - ( var( --pico-spacing ) * 2 ) );
		margin: var( --pico-spacing );
		padding: var( --pico-spacing );
		background-color: var( --pico-form-element-background-color );
		border: var( --pico-border-width ) solid var( --pico-muted-border-color );
		border-radius: var( --pico-border-radius );

		& > :global( :last-child ) {
			margin-block-end: unset;
		}

		@media ( min-width: $br-lg ) {
			inset-inline-end: 0;
			inline-size: fit-content;
		}
	}

	.error {
		border-inline-start: 5px solid var( --pico-form-element-invalid-border-color );
	}

	.success {
		border-inline-start: 5px solid var( --pico-form-element-valid-border-color );
	}
</style>
