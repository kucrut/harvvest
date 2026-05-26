<script lang="ts">
	import { page } from '$app/state';
	import Icon from './icon.svelte';

	interface Props {
		href: string;
		icon: string;
		label: string
	}

	const { icon, href, label }: Props = $props();
</script>

<li>
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a aria-current={page.url.pathname === href ? 'page' : null} {href}>
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
