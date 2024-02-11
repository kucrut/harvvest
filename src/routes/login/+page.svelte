<script>
	import { applyAction, enhance } from '$app/forms';
	import { create_error_alert } from '$lib/utils.client';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import ContentWrap from '$lib/components/content-wrap.svelte';
	import FormWrap from '$lib/components/form-wrap.svelte';
	import SubmitField from '$lib/components/submit-field.svelte';
	import TextField from '$lib/components/text-field.svelte';

	/** @type {import('./$types').ActionData}*/
	export let form;
	/** @type {import('./$types').PageData} */
	export let data;

	const drawer_store = getDrawerStore();
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
			create_error_alert( drawer_store, form.message );
		}
	}
</script>

<svelte:head>
	<title>Log In - Photo Harvest</title>
</svelte:head>

<ContentWrap>
	<h1 class="h3 text-center">Log In</h1>

	<form action="?/auth" method="POST" use:enhance={handle_submit}>
		<FormWrap>
			<TextField autocomplete="url" required disabled={is_submitting} label="WordPress URL" name="url" type="url" />
			{#if data.require_access_key}
				<TextField
					autocomplete="on"
					required
					disabled={is_submitting}
					label="Access Key"
					name="access_key"
					type="text"
				/>
			{/if}
			<SubmitField {is_submitting} label="Get Authorization" />
			<!-- TODO: Add info about auth flow. -->
		</FormWrap>
	</form>
</ContentWrap>
