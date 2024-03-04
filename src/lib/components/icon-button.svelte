<script>
	import clsx from 'clsx/lite';
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

<button aria-label={label} class={clsx( 'outline', cls )} {...rest}><Icon {height} {width} name={icon} /></button>

<style>
	button {
		block-size: fit-content;
		inline-size: fit-content;
		border: unset;
		padding: unset;
	}
</style>
