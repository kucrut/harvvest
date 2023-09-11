<script>
	/** @type {import('./$types').ActionData}*/
	export let form;
</script>

<svelte:head>
	<title>Log In - Photo Harvest</title>
</svelte:head>

<h1>Log In</h1>

<form action="?/login" method="POST">
	<div>
		<label for="url">URL</label>
		<input required id="url" name="url" type="url" />
	</div>

	<div>
		<label for="username">Username</label>
		<input required id="username" name="username" type="text" />
	</div>

	<div>
		<label for="password">Password</label>
		<input required id="password" name="password" type="password" />
	</div>

	{#if form?.invalid}
		<p class="error">Username and password is required.</p>
	{/if}

	{#if form?.error}
		<p class="error">{ form?.message || 'You have entered the wrong credentials.'}</p>
	{/if}

	<button type="submit">Log in</button>
</form>

