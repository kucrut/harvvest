<script>
	import { applyAction, enhance } from '$app/forms';
	import Alert from '$lib/components/alert.svelte';
	import Icon from '$lib/components/icon.svelte';
	import Main from '$lib/components/main.svelte';
	import TextField from '$lib/components/text-field.svelte';

	const { data, form } = $props();

	/** @type {import('$types').Alert|null} */
	let alert = $state( null );

	/** @type {import('@sveltejs/kit').SubmitFunction}*/
	const handle_submit = () => {
		return async ( { result } ) => {
			await applyAction( result );

			// @ts-expect-error Special case.
			if ( ! result.type && result.message ) {
				alert = {
					// @ts-expect-error Special case.
					message: result.message,
					type: 'error',
				};
			}
		};
	};

	$effect.pre( () => {
		if ( data.session_error ) {
			alert = {
				message: data.session_error,
				type: 'error',
			};
		}
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
		}
	} );
</script>

<Main>
	<div>
		<Icon name="tent" width="80" height="80" />

		<form method="POST" use:enhance={handle_submit}>
			{#if data.require_wp_url}
				<TextField autocomplete="url" required label="WordPress URL" name="url" type="url" />
			{/if}
			{#if data.require_access_key}
				<TextField autocomplete="on" required label="Access Key" name="access_key" type="text" />
			{/if}
			<button type="submit">Get Authorization</button>
		</form>
	</div>
</Main>

{#if alert}
	<Alert type={alert.type} onexpire={() => ( alert = null )}>
		<p>{alert.message}</p>
	</Alert>
{/if}

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: calc( 2 * var( --pico-spacing ) );
		align-items: center;
		max-inline-size: max-content;
		margin-inline: auto;
	}

	form {
		padding: var( --pico-spacing );
		border: 1px solid var( --pico-muted-border-color );
		border-radius: var( --pico-border-radius );
	}
</style>
