<script>
	import { page } from '$app/stores';
	import Icon from '$lib/components/icon.svelte';

	const { data } = $page;
</script>

<div>
	<Icon height="100" name="wifi-off" width="100" />
	<p>
		You appear to be offline.<br />
		You can't use {data.app_name} until you're connected to the internet.
	</p>
</div>

<style lang="scss">
	div {
		text-align: center;

		:global( svg ) {
			color: var( --pico-muted-color );
			margin-block-end: var( --pico-spacing );
		}
	}
</style>
