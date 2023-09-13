<script>
	import Toast from '$lib/components/toast.svelte';

	/** @type {import('./$types').ActionData}*/
	export let form;

	export let should_show_error_message = true;
</script>

<svelte:head>
	<title>Log In - Photo Harvest</title>
</svelte:head>

<div class="p-4 md:p-10 space-y-4">
	<h1 class="h3 text-center">Log In</h1>

	{#if form?.invalid && should_show_error_message}
		<Toast type="error" on:click={() => ( should_show_error_message = false )}>
			<h2 class="h3" slot="title">Error</h2>
			<p slot="message">All fields are required.</p>
		</Toast>
	{/if}

	{#if form?.error}
		<p class="error">{ form?.message || 'You have entered the wrong credentials.'}</p>
	{/if}

	<form method="POST">
		<div class="flex justify-center items-center mx-auto transition-[width] duration-200 w-full">
			<div class="card p-4 w-full text-token space-y-4">
				<label class="label">
					<span>WordPress URL</span>
					<input required class="input" id="url" name="url" type="url" />
				</label>

				<label class="label">
					<span>Username or email</span>
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
