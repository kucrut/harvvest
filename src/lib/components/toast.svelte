<script>
	import { get_toast_store } from '$lib/stores/toast';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	/** @type {import("$types").Toast}*/
	export let item;

	const store = get_toast_store();
	const remove = () => store.remove( item.id );

	/** @type {number} */
	let removal_delay;

	const schedule_removal = () => {
		if ( removal_delay ) {
			window.setTimeout( remove, removal_delay );
		}
	};

	onMount( () => {
		if ( ! item.autohide || ( typeof item.autohide === 'number' && item.autohide < 0 ) ) {
			return;
		}

		removal_delay = typeof item.autohide === 'number' ? item.autohide : 10000;
		schedule_removal();
	} );
</script>

<div role="alertdialog" aria-live="polite" transition:slide|local={{ duration: 200 }}>
	<div
		class="toast flex justify-between items-center pointer-events-auto max-w-[640px] p-4 space-x-4 rounded-container-token shadow-lg variant-ghost-{item.type}"
	>
		<div class="text-base">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html item.message}
		</div>
		<div class="toast-actions flex items-center space-x-2">
			<button class="btn-icon btn-icon-sm variant-filled" aria-label="Dismiss" on:click={remove}>✕</button>
		</div>
	</div>
</div>
