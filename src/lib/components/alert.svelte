<script>
	import { createEventDispatcher, onMount } from 'svelte';

	export let timeout = 2000;

	const dispatch = createEventDispatcher();

	onMount( () => {
		if ( timeout < 500 ) {
			return;
		}

		setTimeout( () => {
			dispatch( 'expire' );
		}, timeout );
	} );
</script>

<aside>
	<slot />
</aside>
