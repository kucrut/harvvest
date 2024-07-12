<script>
	import {
		PWA_SHARE_TARGET_SEARCH_PARAM,
		PWA_SHARE_TARGET_UPLOAD_MEDIA_PARAM_NAME,
		PWA_SHARE_TARGET_UPLOAD_MEDIA_ROUTE,
	} from '$lib/constants.js';
	import { applyAction, enhance } from '$app/forms';
	import { handle_pwa_share } from '$lib/utils.client.js';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Upload } from '$lib/runes/upload.svelte.js';
	// import { remove_file_extension } from '$lib/utils.js';
	import Alert from '$lib/components/alert.svelte';
	import CopyButton from '$lib/components/copy-button.svelte';
	import Main from '$lib/components/main.svelte';
	import MediaUploadField from '$lib/components/media-upload-field.svelte';
	import TermsField from '$lib/components/terms-field.svelte';
	import TextField from '$lib/components/text-field.svelte';

	const { data, form } = $props();

	const upload = new Upload( {
		allowed_types: [ 'image/*', 'video/*' ],
		max_size: data.max_file_size,
	} );

	/** @type {import('$types').Alert|null} */
	let alert = $state( null );
	let is_submitting = $state( false );

	/** @type {import('./$types').SubmitFunction} */
	const handle_submit = ( { formElement, formData } ) => {
		// Re-use file shared to our PWA.
		if ( upload.file ) {
			formData.set( PWA_SHARE_TARGET_UPLOAD_MEDIA_PARAM_NAME, upload.file );
		}

		is_submitting = true;

		return async ( { result } ) => {
			await applyAction( result );
			is_submitting = false;

			if ( result.type === 'success' ) {
				formElement.reset();
				upload.files = null;
			}
		};
	};

	// TODO: Handle size & type errors.

	/**
	 * Set alert
	 *
	 * @param {string} message Alert message.
	 * @param {import('$types').Alert['type']} type Alert type.
	 */
	const set_alert = ( message, type = 'error' ) => {
		alert = { message, type };
	};

	onMount( async () => {
		if ( $page.url.searchParams.has( PWA_SHARE_TARGET_SEARCH_PARAM ) ) {
			upload.files = await handle_pwa_share();
			// Clear PWA share target search param.
			history.replaceState( '', '', PWA_SHARE_TARGET_UPLOAD_MEDIA_ROUTE );
		}
	} );

	// TODO: Get rid of these effects.

	$effect( () => {
		if ( form?.success ) {
			set_alert( 'File was successfully uploaded.', 'success' );
		} else if ( form?.error && form?.message ) {
			set_alert( form.message );
		}
	} );
</script>

<Main>
	<form enctype="multipart/form-data" method="POST" use:enhance={handle_submit}>
		<MediaUploadField
			disabled={is_submitting}
			max_file_size={data.max_file_size || 0}
			name="file"
			{upload}
		/>
		<TextField disabled={is_submitting} label="Alternative text" multiline name="alt_text" required />
		<TextField disabled={is_submitting} label="Caption" name="caption" required />
		<TextField disabled={is_submitting} label="Title" name="title" />
		<TextField disabled={is_submitting} label="Description" multiline name="description" />
		{#if data.terms?.length}
			{#each data.terms as taxonomy ( `${ taxonomy.name }-${ taxonomy.slug }` )}
				<TermsField {taxonomy} />
			{/each}
		{/if}
		<button aria-busy={is_submitting} type="submit">
			{is_submitting ? 'Uploading…' : 'Upload'}
		</button>
	</form>
</Main>

{#if alert}
	<Alert
		persisent={form?.success && form?.image_link ? true : false}
		timeout={form?.success && form?.image_link ? 0 : undefined}
		type={alert.type}
		onexpire={() => ( alert = null )}
	>
		<p>{alert.message}</p>
		{#if form?.success && form?.image_link}
			<div>
				<a class="button" href={form.image_link}>View</a>
				<CopyButton data={form.image_link}>Copy URL</CopyButton>
			</div>
		{/if}
	</Alert>
{/if}
