<script>
	import { createEventDispatcher } from 'svelte';

	/** @type {import('$types').Alert} */
	export let meta;

	const dispatch = createEventDispatcher();

	/** @param {string} text */
	const copy_to_clipboard = async text => {
		try {
			if ( navigator?.clipboard?.writeText ) {
				await navigator.clipboard.writeText( text );
			}
		} catch ( err ) {
			// eslint-disable-next-line no-console
			console.error( err );
		}
	};
</script>

<aside class="alert variant-ghost-{meta.type}">
	<div class="alert-message">
		<h3 class="h3">{meta.title}</h3>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<p>{@html meta.message}</p>
	</div>
	<div class="alert-actions">
		{#if meta.links?.length}
			{#each meta.links as item}
				<a class="btn variant-ghost" href={item.url} target={! item.url.startsWith( '/' ) ? '_blank' : null}
					>{item.label}</a
				>
			{/each}
		{/if}
		{#if meta.data_to_copy?.length}
			{#each meta.data_to_copy as item}
				<button
					aria-label={item.label || 'Copy'}
					class="btn-icon btn-icon-sm variant-ghost"
					on:click={() => copy_to_clipboard( item.content )}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-4 h-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
						/>
					</svg>
				</button>
			{/each}
		{/if}
		<button class="btn-icon btn-icon-sm variant-filled" aria-label="Dismiss" on:click={() => dispatch( 'dismiss' )}
			>✕</button
		>
	</div>
</aside>
