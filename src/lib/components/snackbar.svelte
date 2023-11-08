<script>
	import { get_toast_store } from '$lib/stores/toast';
	import Toast from './toast.svelte';

	const store = get_toast_store();
</script>

{#if $store.length}
	<div
		class="snackbar-wrapper flex fixed top-0 left-0 right-0 bottom-0 pointer-events-none justify-center items-end z-[888]"
	>
		<div class="snackbar flex flex-col gap-y-2 items-center p-4">
			<!-- eslint-disable-next-line space-in-parens -->
			{#each $store as item (item.id)}
				<Toast {item} />
			{/each}
		</div>
	</div>
{/if}
