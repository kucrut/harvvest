<script>
	import { createEventDispatcher } from 'svelte';

	/** @type {import('$types').Alert} */
	export let meta;

	const dispatch = createEventDispatcher();
</script>

<aside class="alert variant-ghost-{meta.type}">
	<div class="alert-message">
		<h3 class="h3">{meta.title}</h3>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<p>{@html meta.message}</p>
	</div>
	<div class="alert-actions">
		<button class="btn-icon btn-icon-sm variant-filled" aria-label="Dismiss" on:click={() => dispatch( 'dismiss' )}
			>✕</button
		>
	</div>
</aside>
