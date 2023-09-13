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
			<button class="btn-icon variant-filled" on:click><i class="fa-solid fa-xmark"></i></button>
		</slot>
	</div>
</aside>
