<script>
	import { createEventDispatcher, onMount } from 'svelte';

	export let timeout = 2000;
	/** @type { 'error' | 'message' | 'success' } */
	export let type = 'message';

	const dispatch = createEventDispatcher();

	/** @type {ReturnType<typeof setTimeout>} */
	let timeout_id;

	function start() {
		if ( timeout < 500 ) {
			return;
		}

		timeout_id = setTimeout( () => {
			dispatch( 'expire' );
		}, timeout );
	}

	function stop() {
		if ( timeout_id ) {
			clearTimeout( timeout_id );
		}
	}

	onMount( () => {
		start();
	} );
</script>

<aside class={type} on:mouseenter={stop} on:mouseleave={start} on:pointerenter={stop} on:pointerleave={start}>
	<slot />
</aside>

<style>
	aside {
		position: fixed;
		bottom: 0;
		block-size: fit-content;
		inline-size: calc( 100dvw - ( var( --pico-spacing ) * 2 ) );
		margin: var( --pico-spacing );
		padding: var( --pico-spacing );
		border: var( --pico-border-width ) solid var( --pico-muted-border-color );
		border-radius: var( --pico-border-radius );

		& > :last-child {
			margin-block-end: unset;
		}
	}

	.error {
		border-left: 5px solid var( --pico-form-element-invalid-border-color );
	}

	.success {
		border-left: 5px solid var( --pico-form-element-valid-border-color );
	}
</style>
