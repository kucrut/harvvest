<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Icon from './icon.svelte';

	interface Props extends HTMLButtonAttributes {
		height?: number;
		icon: string;
		label: string
		width?: number;
	}

	const { class: cls, height, icon, label, width, ...rest }: Props = $props();
</script>

<button class={[ 'outline', cls ]} aria-label={label} {...rest}><Icon {height} name={icon} {width} /></button>

<style>
	button {
		block-size: fit-content;
		inline-size: fit-content;
		border: unset;
		padding: unset;
	}
</style>
