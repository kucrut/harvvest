<script>
	import Icon from './icon.svelte';

	/**
	 * @type {{
	 *   height?: number;
	 *   icon: string;
	 *   label: string
	 *   width?: number;
	 * } & import('svelte/elements').HTMLAttributes<HTMLButtonElement> }
	 */
	const { class: cls = '', height, icon, label, width, ...rest } = $props();
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
