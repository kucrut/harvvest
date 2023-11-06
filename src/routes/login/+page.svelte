<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import FormWrap from '$lib/components/form-wrap.svelte';
	import Toast from '$lib/components/toast.svelte';

	/** @type {import('./$types').ActionData}*/
	export let form;
	let error_message = form?.error || '';

	/** @type {import('@sveltejs/kit').SubmitFunction}*/
	const handle_submit = () => {
		return ( { result } ) => {
			if ( result.type === 'redirect' ) {
				goto( result.location, { invalidateAll: true } );
				return;
			}

			if ( result.type === 'failure' ) {
				error_message = result.data?.message;
			}
		};
	};
</script>

<svelte:head>
	<title>Log In - Photo Harvest</title>
</svelte:head>

<div class="p-4 md:p-10 space-y-4">
	<h1 class="h3 text-center">Log In</h1>

	{#if error_message}
		<Toast type="error" on:click={() => ( error_message = '' )}>
			<h2 class="h3" slot="title">Error</h2>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<p slot="message">{@html error_message}</p>
		</Toast>
	{/if}

	<form method="POST" use:enhance={handle_submit}>
		<FormWrap>
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
		</FormWrap>
	</form>
</div>
