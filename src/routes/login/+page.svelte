<script>
	import { applyAction, enhance } from '$app/forms';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import ContentWrap from '$lib/components/content-wrap.svelte';
	import FormWrap from '$lib/components/form-wrap.svelte';
	import SubmitField from '$lib/components/submit-field.svelte';
	import TextField from '$lib/components/text-field.svelte';

	/** @type {import('./$types').ActionData}*/
	export let form;

	const toast_store = getToastStore();
	let is_submitting = false;

	/** @type {import('@sveltejs/kit').SubmitFunction}*/
	const handle_submit = () => {
		is_submitting = true;
		return async ( { result } ) => {
			if ( result.type === 'redirect' ) {
				await goto( result.location, { invalidateAll: true } );
			}

			await applyAction( result );
			is_submitting = false;
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

<ContentWrap>
	<h1 class="h3 text-center">Log In</h1>

	<form method="POST" use:enhance={handle_submit}>
		<FormWrap>
			<TextField required disabled={is_submitting} id="url" label="WordPress URL" name="url" type="url" />
			<TextField required disabled={is_submitting} label="Username or email" name="username" type="text" />
			<TextField required disabled={is_submitting} label="Password" name="password" type="password" />
			<SubmitField {is_submitting}>Log In</SubmitField>
		</FormWrap>
	</form>
</ContentWrap>
