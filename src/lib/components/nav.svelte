<script>
	import Icon from '$lib/components/icon.svelte';
</script>

<nav>
	<ul>
		<li>
			<a href="/upload">
				<Icon name="file-up" />Upload
			</a>
		</li>
		<li>
			<a href="https://gitlab.com/kucrut/photo-harvest">
				<Icon name="code" /><span>Source Code</span>
			</a>
		</li>
	</ul>
</nav>

<style>
	a {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>
