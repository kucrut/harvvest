<script>
	import Spinner from './spinner.svelte';

	export let is_submitting = false;
	export let label = 'Submit';
</script>

<p>
	<button disabled={is_submitting} type="submit">{label}</button>
	{#if is_submitting}
		<!-- TODO: Use pico's loading -->
		<Spinner />
	{/if}
</p>
