<script>
	import { page } from '$app/stores';
	import Icon from './icon.svelte';

	/** @type {{icon: string; href:string; label: string}} */
	const { icon, href, label } = $props();
</script>

<li>
	<a {href} aria-current={$page.url.pathname === href ? 'page' : null}>
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
