<script>
	import { page } from '$app/stores';
	import Icon from './icon.svelte';

	const { url } = $page;
	/** @type {{icon: string; href:string; label: string}} */
	const { icon, href, label } = $props();
</script>

<li>
	<a aria-current={url.pathname === href ? 'page' : null} {href}>
		<Icon height="20" name={icon} width="20" />{label}
	</a>
</li>

<style>
	a {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>
