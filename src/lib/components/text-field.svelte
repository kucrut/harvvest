<script lang="ts">
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';

	type Props = {
		label: string;
		multiline?: boolean;
		value?: string;
	} & HTMLInputAttributes & HTMLTextareaAttributes;

	let { label, multiline = false, value = $bindable( '' ), ...rest }: Props = $props();
</script>

<label>
	<span>{label}</span>
	{#if multiline}
		<textarea class="textarea" bind:value {...rest}></textarea>
	{:else}
		<input class="input" bind:value {...rest} />
	{/if}
</label>

<style>
	label:has([required]) span::after {
		content: '\00a0\*';
		color: var( --pico-form-element-invalid-border-color );
	}
</style>
