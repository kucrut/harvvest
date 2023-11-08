<script>
	/** @type {string} */
	export let label;
	export let multiline = false;

	$: label_class = 'required' in $$restProps ? 'font-semibold' : '';
</script>

<label class="label">
	<span class={label_class}>{label}</span>
	{#if multiline}
		<textarea class="textarea" {...$$restProps} />
	{:else}
		<input class="input" {...$$restProps} />
	{/if}
</label>
