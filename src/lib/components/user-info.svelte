<script>
	/** @type {{ user: import('$lib/schema.js').User }} */
	const { user } = $props();
</script>

<div>
	<img alt="User avatar" height="64" loading="lazy" src={user.avatar_url} width="64" />
	<span>{user.name}</span>
	<a href={user.wp_url} rel="noopener noreferrer" target="_blank">{user.wp_url}</a>
	<form action="/logout" method="POST">
		<button type="submit">Log Out</button>
	</form>
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

	form {
		margin-block-start: var( --pico-spacing );
		grid-column: 1/3;
	}
</style>
