<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import IconButton from './icon-button.svelte';
	import type { Notification, Notifications } from '$lib/runes/notifications.svelte';

	interface Props extends Notification {
		notifications: Notifications;
	}

	const { notifications, ...item }: Props = $props();

	let timeout_id = $state<number | undefined>( undefined );

	export function remove() {
		notifications.remove( item.id );
	}

	function start_expiring() {
		if ( item.timeout ) {
			timeout_id = window.setTimeout( remove, item.timeout );
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
	class={item.type}
	onmouseenter={stop_expiring}
	onmouseleave={start_expiring}
	onpointerenter={stop_expiring}
	onpointerleave={start_expiring}
>
	{#if item.message}
		<p>{item.message}</p>
	{/if}
	{#if item.children}
		{@render item.children( item.data )}
	{/if}

	<IconButton class="dismiss" height={20} icon="x" label="Dismiss" width={20} onclick={remove} />
</aside>

<style lang="scss">
	aside {
		position: relative;
		block-size: fit-content;
		display: flex;
		flex-direction: column;
		gap: var( --pico-spacing );
		padding-block: var( --pico-spacing );
		padding-inline: var( --pico-spacing ) calc( var( --pico-spacing ) * 2.5 );
		background-color: var( --pico-form-element-background-color );
		border: var( --pico-border-width ) solid var( --pico-muted-border-color );
		border-radius: var( --pico-border-radius );
		text-wrap: balance;

		& > :global(*) {
			margin-block-end: unset;
		}

		:global(.dismiss) {
			position: absolute;
			inset-block-start: calc( var( --pico-spacing ) * 1.2 );
			inset-inline-end: calc( var( --pico-spacing ) / 2 );
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
