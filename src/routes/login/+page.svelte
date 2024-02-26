<script>
	import { applyAction, enhance } from '$app/forms';
	import { afterNavigate, goto } from '$app/navigation';
	import Alert from '$lib/components/alert.svelte';
	import ContentWrap from '$lib/components/content-wrap.svelte';
	import TextField from '$lib/components/text-field.svelte';

	/** @type {import('./$types').ActionData}*/
	export let form;
	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('$types').Alert|null} */
	let alert = null;
	let client_id = '';

	/** @type {import('@sveltejs/kit').SubmitFunction}*/
	const handle_submit = () => {
		return async ( { result } ) => {
			await applyAction( result );
		};
	};

	afterNavigate( async () => {
		if ( data.has_auth ) {
			await goto( '/', { invalidateAll: true } );
		}

		client_id = navigator.userAgent;
	} );

	$: {
		if ( data.auth_rejected ) {
			alert = {
				message: 'Authorization request was rejected. Please try again.',
				type: 'error',
			};
		} else if ( form?.error && form?.message ) {
			alert = {
				message: form.message,
				type: 'error',
			};
		} else {
			alert = null;
		}
	}
</script>

<svelte:head>
	<title>Log In - Photo Harvest</title>
</svelte:head>

<ContentWrap>
	<!-- Replace with logo -->
	<h1>Log In</h1>

	<form method="POST" use:enhance={handle_submit}>
		{#if data.require_wp_url}
			<TextField autocomplete="url" required label="WordPress URL" name="url" type="url" />
		{/if}
		{#if data.require_access_key}
			<TextField autocomplete="on" required label="Access Key" name="access_key" type="text" />
		{/if}
		<input type="hidden" name="client_id" value={client_id} />
		<button type="submit">Get Authorization</button>
	</form>
</ContentWrap>

{#if alert}
	<Alert type={alert.type} on:expire={() => ( alert = null )}>
		<p>{alert.message}</p>
	</Alert>
{/if}

<style>
	h1 {
		text-align: center;
		margin-block: calc( var( --pico-spacing ) * 2 );
	}

	form {
		padding: var( --pico-spacing );
		border: 1px solid var( --pico-muted-border-color );
		border-radius: var( --pico-border-radius );
	}
</style>
