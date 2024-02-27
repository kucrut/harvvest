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

<style>
	label:has( [required] ) span::after {
		content: '\00a0\*';
		color: var( --pico-form-element-invalid-border-color );
	}
</style>
