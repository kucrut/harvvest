<script>
	import { notifications } from '$lib/runes/notifications.svelte.js';
	import Notification from '$lib/components/notification.svelte';
</script>

<div aria-live="assertive">
	{#if notifications.items.length}
		{#each notifications.items as item ( item.id )}
			<Notification {...item} {notifications} />
		{/each}
	{/if}
</div>

<style lang="scss">
	div {
		position: fixed;
		inset-block-end: var( --pico-spacing );
		inline-size: calc( 100dvw - ( var( --pico-spacing ) * 2 ) );
		inset-inline: var( --pico-spacing );
		display: grid;
		justify-items: center;
		gap: var( --pico-spacing );

		@media ( min-width: $br-lg ) {
			justify-items: end;
		}
	}
</style>
