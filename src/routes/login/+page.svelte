<script>
	import { applyAction, enhance } from '$app/forms';
	import { notifications } from '$lib/runes/notifications.svelte.js';
	import Icon from '$lib/components/icon.svelte';
	import Main from '$lib/components/main.svelte';
	import TextField from '$lib/components/text-field.svelte';

	const { data, form } = $props();

	/**
	 * @param {string} id
	 * @param {string} message
	 */
	function add_notification( id, message ) {
		notifications.add( {
			id,
			message,
			timeout: 3333,
			type: 'error',
		} );
	}

	if ( data.session_error ) {
		add_notification( 'session-error', data.session_error );
	} else if ( form?.error && form?.message ) {
		add_notification( 'login-failure', form.message );
	}

	/** @type {import('@sveltejs/kit').SubmitFunction} */
	const handle_submit = () => {
		notifications.clear();

		return async ( { result } ) => {
			await applyAction( result );

			if ( result.type === 'failure' && result.data?.message ) {
				add_notification( 'login-failure', result.data.message );
			// @ts-expect-error Special case (eg. WP fatal error).
			} else if ( ! result.type && typeof result.message === 'string' ) {
				// @ts-expect-error
				add_notification( 'login-failure', result.message );
			}
		};
	};
</script>

<Main>
	<div>
		<Icon height="80" name="tent" width="80" />

		<form method="POST" use:enhance={handle_submit}>
			{#if data.require_wp_url}
				<TextField autocomplete="url" label="WordPress URL" name="url" required type="url" />
			{/if}
			{#if data.require_access_key}
				<TextField autocomplete="on" label="Access Key" name="access_key" required type="text" />
			{/if}
			<button type="submit">Get Authorization</button>
		</form>
	</div>
</Main>

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
