<script>
	import { Avatar, popup } from '@skeletonlabs/skeleton';

	/** @type {import("$lib/schema").User}*/
	export let user;

	/** @type {import('@skeletonlabs/skeleton').PopupSettings}*/
	const user_menu_settings = {
		closeQuery: 'li',
		event: 'focus-click',
		placement: 'bottom',
		target: 'user_menu',
	};
</script>

<button use:popup={user_menu_settings}>
	<Avatar src={user.avatar_url} rounded="rounded-md" width="w-8" />
</button>

<div class="card p-2 rounded-md shadow-xl space-y-2 w-48 !mx-0" data-popup="user_menu">
	<p class="px-4 py-2">
		Hello, <span class="font-semibold">{user.name}</span>!<br />
		<a class="italic text-xs underline" href={user.wp_url} target="_blank">{user.wp_url}</a>
	</p>
	<hr />
	<ul class="list-nav">
		<li>
			<form action="/logout" method="POST">
				<button class="h-full w-full" type="submit">Log Out</button>
			</form>
		</li>
	</ul>
	<div class="arrow bg-surface-100-800-token" />
</div>
