<script>
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawer_store = getDrawerStore();
	/** @type {import('@skeletonlabs/skeleton').DrawerSettings} */
	const drawer_settings = {
		bgDrawer: 'bg-surface-50',
		id: 'app-menu',
		rounded: 'rounded-tr-md rounded-br-md rounded-bl-none rounded-tl-none',
		regionDrawer: 'sm:w-11/12 md:w-auto',
	};
</script>

<button on:click={() => drawer_store.open( drawer_settings )}
	><svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-6 h-6"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
		/>
	</svg>
</button>
