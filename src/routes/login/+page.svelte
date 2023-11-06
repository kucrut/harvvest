<script>
	import { applyAction, enhance } from '$app/forms';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import FormWrap from '$lib/components/form-wrap.svelte';

	/** @type {import('./$types').ActionData}*/
	export let form;

	const toast_store = getToastStore();

	/** @type {import('@sveltejs/kit').SubmitFunction}*/
	const handle_submit = () => {
		return async ( { result } ) => {
			if ( result.type === 'redirect' ) {
				goto( result.location, { invalidateAll: true } );
			}

			await applyAction( result );
		};
	};

	$: {
		if ( form?.error && form?.message ) {
			toast_store.trigger( {
				background: 'variant-ghost-error',
				hoverable: true,
				message: form.message,
			} );
		}
	}
</script>

<svelte:head>
	<title>Log In - Photo Harvest</title>
</svelte:head>

<div class="p-4 md:p-10 space-y-4">
	<h1 class="h3 text-center">Log In</h1>

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
