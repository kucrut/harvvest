<script>
	/** @type {import('./$types').ActionData}*/
	export let form;
</script>

<svelte:head>
	<title>Log In - Photo Harvest</title>
</svelte:head>

<div class="p-4 md:p-10 space-y-4">
	<h1 class="h3 text-center">Log In</h1>

	{#if form?.invalid}
		<p class="error">Username and password is required.</p>
	{/if}

	{#if form?.error}
		<p class="error">{ form?.message || 'You have entered the wrong credentials.'}</p>
	{/if}

	<form action="?/login" method="POST">
		<div class="flex justify-center items-center mx-auto transition-[width] duration-200 w-full">
			<div class="card p-4 w-full text-token space-y-4">
				<label class="label">
					<span>URL</span>
					<input required class="input" id="url" name="url" type="url" />
				</label>

				<label class="label">
					<span>Username</span>
					<input required class="input" id="username" name="username" type="text" />
				</label>

				<label class="label">
					<span>Password</span>
					<input required class="input" id="password" name="password" type="password" />
				</label>

				<p><button class="btn variant-filled" type="submit">Log In</button></p>
			</div>
		</div>
	</form>
</div>
