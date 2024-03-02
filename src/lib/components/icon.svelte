<script>
	/** @type {{name: string} & import("svelte/elements").SVGAttributes<EventTarget>} */
	const { name, ...rest } = $props();
</script>

<svg {...rest}>
	<use href="#icon-{name}" />
</svg>
