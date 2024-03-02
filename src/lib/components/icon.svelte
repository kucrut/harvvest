<script>
	/** @type {{name: string} & import("svelte/elements").SVGAttributes<EventTarget>} */
	const { name, 'aria-hidden': ah = true, height = '24', role = 'presentation', width = '24', ...rest } = $props();
</script>

<svg aria-hidden={ah} {height} {role} {width} {...rest}>
	<use href="#icon-{name}" />
</svg>
