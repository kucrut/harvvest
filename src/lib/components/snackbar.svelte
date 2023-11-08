<script>
	import { slide } from 'svelte/transition';

	let cls = 'variant-ghost';
	export { cls as class };
</script>

<div
	class="snackbar-wrapper flex fixed top-0 left-0 right-0 bottom-0 pointer-events-none justify-center items-end z-[888]"
>
	<div class="snackbar flex flex-col gap-y-2 items-center p-4">
		<div role="alertdialog" aria-live="polite" transition:slide|local={{ duration: 200 }}>
			<div
				class="toast flex justify-between items-center pointer-events-auto max-w-[640px] p-4 space-x-4 rounded-container-token shadow-lg {cls}"
			>
				<div class="text-base">
					<slot />
				</div>
				<div class="toast-actions flex items-center space-x-2">
					<slot name="buttons">
						<button class="btn-icon btn-icon-sm variant-filled" aria-label="Dismiss" on:click>✕</button>
					</slot>
				</div>
			</div>
		</div>
	</div>
</div>
