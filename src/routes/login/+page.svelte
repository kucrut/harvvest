<script>
	import { applyAction, enhance } from '$app/forms';
	import Alert from '$lib/components/alert.svelte';
	import Icon from '$lib/components/icon.svelte';
	import Main from '$lib/components/main.svelte';
	import TextField from '$lib/components/text-field.svelte';

	const { data, form } = $props();

	/** @type {import('$types').Alert|null} */
	let alert = $state( null );
	let client_id = $state( '' );
	let session_error = $state( data.session_error );

	/** @type {import('@sveltejs/kit').SubmitFunction}*/
	const handle_submit = () => {
		return async ( { result } ) => {
			await applyAction( result );
		};
	};

	$effect( () => {
		client_id = navigator.userAgent;
	} );

	$effect( () => {
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
	} );
</script>

<Main>
	<div><Icon name="tent" width="80" height="80" /></div>

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
</Main>

<!-- Can't set this in the alert state as somehow it got immediately erased on render. -->
{#if session_error}
	<Alert timeout={3000} type="error" onexpire={() => ( session_error = '' )}>
		<p>{data.session_error}</p>
	</Alert>
{/if}

{#if alert}
	<Alert type={alert.type} onexpire={() => ( alert = null )}>
		<p>{alert.message}</p>
	</Alert>
{/if}

<style>
	div {
		text-align: center;
	}

	form {
		padding: var( --pico-spacing );
		border: 1px solid var( --pico-muted-border-color );
		border-radius: var( --pico-border-radius );
	}
</style>
