<script>
	/**
	 * @type {{
	 *   label: string;
	 *   multiline?: boolean;
	 *   value?: string;
	 * } & import("svelte/elements").HTMLInputAttributes & import("svelte/elements").HTMLTextareaAttributes }
	 */
	const { label, multiline = false, value = $bindable( '' ), ...rest } = $props();
</script>

<label>
	<span>{label}</span>
	{#if multiline}
		<textarea {value} class="textarea" {...rest}></textarea>
	{:else}
		<input {value} class="input" {...rest} />
	{/if}
</label>

<style>
	label:has( [required] ) span::after {
		content: '\00a0\*';
		color: var( --pico-form-element-invalid-border-color );
	}
</style>
