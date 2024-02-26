<script>
	import { createEventDispatcher, onMount } from 'svelte';

	export let timeout = 2000;
	/** @type { 'error' | 'message' | 'success' } */
	export let type = 'message';

	const dispatch = createEventDispatcher();

	onMount( () => {
		if ( timeout < 500 ) {
			return;
		}

		setTimeout( () => {
			dispatch( 'expire' );
		}, timeout );
	} );
</script>

<aside class={type}>
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
