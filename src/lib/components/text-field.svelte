<script>
	/** @type {string} */
	export let label;
	export let multiline = false;
	export let value = '';

	$: label_class = 'required' in $$restProps ? `after:content-['_*'] after:font-semibold after:text-error-400` : null;
</script>

<label class="label">
	<span class={label_class}>{label}</span>
	{#if multiline}
		<textarea {value} class="textarea" {...$$restProps} />
	{:else}
		<input {value} class="input" {...$$restProps} />
	{/if}
</label>
