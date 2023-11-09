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
	/** @type {number|undefined} */
	let timeout_id;

	const cancel_removal = () => {
		if ( removal_delay ) {
			window.clearTimeout( timeout_id );
		}
	};

	const schedule_removal = () => {
		if ( removal_delay ) {
			timeout_id = window.setTimeout( remove, removal_delay );
		}
	};

	onMount( () => {
		if ( ! item.autohide || ( typeof item.autohide === 'number' && item.autohide < 0 ) ) {
			return;
		}

		removal_delay = typeof item.autohide === 'number' ? item.autohide : 3000;
		schedule_removal();
	} );
</script>

<div
	aria-live="polite"
	role="alertdialog"
	transition:slide|local={{ duration: 200 }}
	on:mouseenter={cancel_removal}
	on:mouseleave={schedule_removal}
>
	<div
		class="toast flex justify-between items-center pointer-events-auto max-w-[640px] p-4 space-x-4 rounded-container-token shadow-lg variant-soft-{item.type}"
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
