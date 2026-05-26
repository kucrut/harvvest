<script lang="ts">
	import type { User } from '$lib/schema.js';
	import { resolve } from '$app/paths';

	const { user }: { user: User } = $props();
</script>

<div>
	<img alt="User avatar" height="64" loading="lazy" src={user.avatar_url} width="64" />
	<span>{user.name}</span>
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href={user.wp_url} rel="noopener noreferrer" target="_blank">{user.wp_url}</a>
	<a class="logout" data-sveltekit-reload href={resolve( '/logout' )} role="button">Log Out</a>
</div>

<style>
	div {
		block-size: fit-content;
		align-self: self-end;
		display: grid;
		column-gap: var( --pico-spacing );
		grid-template-columns: max-content 1fr;
	}

	img {
		inline-size: 64px;
		grid-row: 1/3;
		border-radius: var( --pico-border-radius );
	}

	.logout {
		margin-block-start: var( --pico-spacing );
		grid-column: 1/3;
	}
</style>
