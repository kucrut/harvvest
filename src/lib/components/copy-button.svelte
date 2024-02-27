<script>
	import { copy_to_clipboard } from '$lib/utils.client';

	/** @type {{ children: import('svelte').Snippet; data: string }} */
	const { children, data } = $props();
</script>

<button on:click={() => copy_to_clipboard( data )}>{@render children()}</button>

<style>
	/* TODO: Move this to reusable class? */
	button {
		padding: unset;
		border: unset;
		background: unset;
		color: var( --pico-primary );
		text-decoration: underline;
		text-decoration-color: var( --pico-primary-underline );
		text-underline-offset: 0.125em;

		&:hover,
		&:active,
		&:focus {
			color: var( --pico-primary-hover );
			text-decoration-color: var( --pico-primary-hover-underline );
		}
	}
</style>
