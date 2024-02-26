<script>
	import { page } from '$app/stores';
</script>

<aside>
	<nav>
		<h1>Photo Harvest</h1>
		<ul>
			<li>
				<a href="https://gitlab.com/kucrut/photo-harvest">
					<span
						><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zm4.03 6.28a.75.75 0 00-1.06-1.06L4.97 9.47a.75.75 0 000 1.06l2.25 2.25a.75.75 0 001.06-1.06L6.56 10l1.72-1.72zm4.5-1.06a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z"
								clip-rule="evenodd"
							/>
						</svg>
					</span>
					<span>Source Code</span></a
				>
			</li>
		</ul>
	</nav>

	{#if $page.data.user}
		<div class="user-info">
			<img alt="User avatar" src={$page.data.user.avatar_url} />
			<span>{$page.data.user.name}</span><br />
			<a class="username" href={$page.data.user.wp_url} target="_blank">
				<span class="underline">{$page.data.user.wp_url}</span>
			</a>
			<form action="/logout" method="POST">
				<button type="submit">Log Out</button>
			</form>
		</div>
	{/if}
</aside>

<style>
	.user-info a::after {
		content: '_↗';
	}
</style>
