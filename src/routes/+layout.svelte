<script>
	import '../app.scss';

	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	onMount( () => {
		const offline_path = '/offline';

		window.addEventListener( 'offline', () => {
			if ( $page.url.pathname !== offline_path ) {
				goto( offline_path );
			}
		} );

		window.addEventListener( 'online', () => {
			if ( $page.url.pathname === offline_path ) {
				goto( '/' );
			}
		} );
	} );
</script>

<!-- Alert component -->

<div class="app-shell">
	<div class="app-bar">
		<button>Menu</button>
		<h1 class="h2">Photo Harvest</h1>
	</div>

	<slot />
</div>
