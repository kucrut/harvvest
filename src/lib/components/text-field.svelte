<script>
	/** @type {{label: string; multiline?: boolean; value?: string} & Record<string,string|boolean>} */
	const { label, multiline = false, value = '', ...rest } = $props();
</script>

<label>
	<span>{label}</span>
	{#if multiline}
		<textarea {value} class="textarea" {...rest} on:blur on:change on:focus on:input />
	{:else}
		<input {value} class="input" {...rest} on:blur on:change on:focus on:input />
	{/if}
</label>

<style>
	label:has( [required] ) span::after {
		content: '\00a0\*';
		color: var( --pico-form-element-invalid-border-color );
	}
</style>
