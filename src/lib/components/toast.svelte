<script>
	import { fade } from 'svelte/transition';

	/** @type {'error' | 'success'}*/
	export let type = 'success';
</script>

<aside class="alert variant-soft-{type}" transition:fade|local={{ duration: 200 }}>
	<div class="alert-message">
		<slot name="title" />
		<slot name="message" />
	</div>
	<div class="alert-actions">
		<slot name="actions">
			<button class="btn variant-soft" on:click>Dismiss</button>
		</slot>
	</div>
</aside>
