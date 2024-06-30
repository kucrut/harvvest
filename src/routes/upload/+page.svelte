<script>
	import {
		PWA_SHARE_TARGET_SEARCH_PARAM,
		PWA_SHARE_TARGET_UPLOAD_MEDIA_PARAM_NAME,
		PWA_SHARE_TARGET_UPLOAD_MEDIA_ROUTE,
	} from '$lib/constants.js';
	import { applyAction, enhance } from '$app/forms';
	import { handle_pwa_share } from '$lib/utils.client.js';
	import { page } from '$app/stores';
	import { remove_file_extension } from '$lib/utils.js';
	import pretty_bytes from 'pretty-bytes';
	import Alert from '$lib/components/alert.svelte';
	import CopyButton from '$lib/components/copy-button.svelte';
	import Main from '$lib/components/main.svelte';
	import MediaUploadField from '$lib/components/media-upload-field.svelte';
	import TermsField from '$lib/components/terms-field.svelte';
	import TextField from '$lib/components/text-field.svelte';

	const { data, form } = $props();
	const max_file_size_formatted = $derived( pretty_bytes( data.max_file_size || 0 ) );

	/** @type {import('$types').Alert|null} */
	let alert = $state( null );
	/** @type {'image'|'video'|undefined} */
	/** @type {FileList|null} */
	let files = $state( null );
	let has_title_touched = $state( false );
	let is_submitting = $state( false );
	let title = $state( '' );

	/** @type {import('./$types').SubmitFunction} */
	const handle_submit = ( { formElement, formData } ) => {
		// Re-use file shared to our PWA.
		if ( files?.length ) {
			formData.set( PWA_SHARE_TARGET_UPLOAD_MEDIA_PARAM_NAME, files[ 0 ] );
		}

		is_submitting = true;

		return async ( { result } ) => {
			await applyAction( result );
			is_submitting = false;

			if ( result.type === 'success' ) {
				formElement.reset();
				files = null;
				has_title_touched = false;
			}
		};
	};

	/**
	 * Set alert
	 *
	 * @param {string} message Alert message.
	 * @param {import('$types').Alert['type']} type Alert type.
	 */
	const set_alert = ( message, type = 'error' ) => {
		alert = { message, type };
	};

	// TODO: Get rid of these effects.

	$effect.pre( () => {
		if ( $page.url.searchParams.has( PWA_SHARE_TARGET_SEARCH_PARAM ) ) {
			( async () => {
				files = await handle_pwa_share();
				// Clear PWA share target search param.
				history.replaceState( '', '', PWA_SHARE_TARGET_UPLOAD_MEDIA_ROUTE );
			} )();
		}
	} );

	$effect( () => {
		if ( form?.success ) {
			set_alert( 'File was successfully uploaded.', 'success' );
		} else if ( form?.error && form?.message ) {
			set_alert( form.message );
		}
	} );

	$effect( () => {
		if ( ! has_title_touched && files?.length ) {
			title = remove_file_extension( files[ 0 ].name );
		}
	} );
</script>

<Main>
	<form enctype="multipart/form-data" method="POST" use:enhance={handle_submit}>
		<MediaUploadField
			bind:files
			disabled={is_submitting}
			max_file_size={data.max_file_size || 0}
			name="file"
			onsizeerror={() => set_alert( `Maximum allowed file size is ${ max_file_size_formatted }.` )}
			ontypeerror={() => set_alert( 'Only images and videos are allowed.' )}
		/>
		<TextField multiline required disabled={is_submitting} label="Alternative text" name="alt_text" />
		<TextField required disabled={is_submitting} label="Caption" name="caption" />
		<TextField
			bind:value={title}
			disabled={is_submitting}
			label="Title"
			name="title"
			onfocus={() => ( has_title_touched = true )}
		/>
		<TextField multiline disabled={is_submitting} label="Description" name="description" />
		{#if data.terms?.length}
			<!-- eslint-disable-next-line space-in-parens -->
			{#each data.terms as taxonomy (`${ taxonomy.name }-${ taxonomy.slug }`)}
				<TermsField {taxonomy} />
			{/each}
		{/if}
		<button aria-busy={is_submitting} type="submit">{is_submitting ? 'Uploading…' : 'Upload'}</button>
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
