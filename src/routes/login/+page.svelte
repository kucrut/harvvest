<script>
	import { applyAction, enhance } from '$app/forms';
	// import { create_error_alert } from '$lib/utils.client';
	import { afterNavigate, goto } from '$app/navigation';
	import ContentWrap from '$lib/components/content-wrap.svelte';
	import FormWrap from '$lib/components/form-wrap.svelte';
	import SubmitField from '$lib/components/submit-field.svelte';
	import TextField from '$lib/components/text-field.svelte';

	/** @type {import('./$types').ActionData}*/
	export let form;
	/** @type {import('./$types').PageData} */
	export let data;

	let client_id = '';
	let is_submitting = false;
	/** @type {HTMLElement} */
	let message_el;

	/** @type {import('@sveltejs/kit').SubmitFunction}*/
	const handle_submit = () => {
		is_submitting = true;

		return async ( { result } ) => {
			await applyAction( result );
			is_submitting = false;
		};
	};

	afterNavigate( async () => {
		if ( data.has_auth ) {
			await goto( '/', { invalidateAll: true } );
		}

		client_id = navigator.userAgent;

		if ( message_el ) {
			setTimeout( () => message_el.parentElement?.removeChild( message_el ), 5000 );
		}
	} );

	$: {
		if ( form?.error && form?.message ) {
			// TODO: create alert
		}
	}
</script>

<svelte:head>
	<title>Log In - Photo Harvest</title>
</svelte:head>

<ContentWrap>
	<h1>Log In</h1>

	<form method="POST" use:enhance={handle_submit}>
		<FormWrap>
			{#if data.require_wp_url}
				<TextField autocomplete="url" required disabled={is_submitting} label="WordPress URL" name="url" type="url" />
			{/if}
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
			<input type="hidden" name="client_id" value={client_id} />
			<SubmitField {is_submitting} label="Get Authorization" />
		</FormWrap>
	</form>

	{#if data.auth_rejected}
		<aside bind:this={message_el}>
			<div>
				<p>Authorization request was rejected. Please try again.</p>
			</div>
		</aside>
	{/if}
</ContentWrap>
