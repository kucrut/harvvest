<script>
	import { onDestroy, onMount } from 'svelte';
	import IconButton from './icon-button.svelte';

	/**
	 * @type {{
	 *   notifications: import('$lib/runes/notifications.svelte').Notifications
	 * } & import('$lib/runes/notifications.svelte').Notification }
	 */
	const { notifications, ...item } = $props();
	const { children, data, id, message, timeout, type = 'message' } = item;

	/** @type {ReturnType<typeof setTimeout>|undefined} */
	let timeout_id = $state( undefined );

	export function remove() {
		notifications.remove( id );
	}

	function start_expiring() {
		if ( timeout ) {
			timeout_id = setTimeout( remove, timeout );
		}
	}

	function stop_expiring() {
		if ( timeout_id ) {
			clearTimeout( timeout_id );
		}
	}

	onMount( start_expiring );
	onDestroy( stop_expiring );
</script>

<aside
	class={type}
	onmouseenter={stop_expiring}
	onmouseleave={start_expiring}
	onpointerenter={stop_expiring}
	onpointerleave={start_expiring}
>
	{#if message}
		<p>{message}</p>
	{/if}
	{#if children}
		{@render children( data )}
	{/if}

	<IconButton class="dismiss" height={20} icon="x" label="Dismiss" width={20} onclick={remove} />
</aside>

<style lang="scss">
	/** TODO: FIXME **/
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
