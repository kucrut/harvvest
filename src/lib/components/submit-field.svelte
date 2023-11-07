<script>
	import Spinner from './spinner.svelte';

	export let is_submitting = false;
</script>

<p class="flex items-center gap-4">
	<button class="btn variant-filled" disabled={is_submitting} type="submit"><slot /></button>
	{#if is_submitting}
		<Spinner />
	{/if}
</p>
