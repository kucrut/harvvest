<script>
	import { sidebar } from './sidebar.svelte.js';
	import Icon from './icon.svelte';

	/** @type {{icon: string; href:string; label: string}} */
	const { icon, href, label } = $props();

	function handle_click() {
		if ( href.startsWith( '/' ) ) {
			sidebar.toggle();
		}
	}
</script>

<li>
	<a {href} onclick={handle_click}>
		<Icon name={icon} height="20" width="20" />{label}
	</a>
</li>

<style>
	a {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>
