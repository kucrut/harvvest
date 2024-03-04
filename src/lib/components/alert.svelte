<script>
	import IconButton from './icon-button.svelte';

	/**
	 * @type {{
	 *   children: import('svelte').Snippet;
	 *   persisent?: boolean;
	 *   timeout?: number;
	 *   type: import('$types').Alert['type'];
	 *   onexpire: () => void;
	 * }}
	 */
	const { children, onexpire, persisent = false, timeout = 5000, type = 'message' } = $props();

	/** @type {ReturnType<typeof setTimeout>|undefined} */
	let timeout_id = $state( undefined );

	function start() {
		if ( persisent || timeout < 500 ) {
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

<aside class={type} onmouseenter={stop} onmouseleave={start} onpointerenter={stop} onpointerleave={start}>
	{@render children()}
	{#if persisent}
		<IconButton class="dismiss" height={20} icon="x" label="Dismiss" width={20} onclick={onexpire} />
	{/if}
</aside>

<style lang="scss">
	aside {
		position: fixed;
		inset-block-end: 0;
		block-size: fit-content;
		inline-size: calc( 100dvw - ( var( --pico-spacing ) * 2 ) );
		display: flex;
		flex-direction: column;
		gap: var( --pico-spacing );
		margin: var( --pico-spacing );
		padding: var( --pico-spacing );
		background-color: var( --pico-form-element-background-color );
		border: var( --pico-border-width ) solid var( --pico-muted-border-color );
		border-radius: var( --pico-border-radius );
		text-wrap: balance;

		& > :global( * ) {
			margin-block-end: unset;
		}

		:global( .dismiss ) {
			--distance: 0.35rem;

			position: absolute;
			inset-block-start: var( --distance );
			inset-inline-end: var( --distance );
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
