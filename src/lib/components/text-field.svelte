<script>
	/** @type {string} */
	export let label;
	export let multiline = false;
</script>

<label class="label">
	<span>{label}</span>
	{#if multiline}
		<textarea class="textarea" {...$$restProps} />
	{:else}
		<input class="input" {...$$restProps} />
	{/if}
</label>
