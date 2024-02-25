<script>
	/** @type {string} */
	export let label;
	export let multiline = false;
	export let value = '';
</script>

<label>
	<span>{label}</span>
	{#if multiline}
		<textarea {value} class="textarea" {...$$restProps} on:blur on:change on:focus on:input />
	{:else}
		<input {value} class="input" {...$$restProps} on:blur on:change on:focus on:input />
	{/if}
</label>
