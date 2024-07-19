<script>
	import {
		PWA_SHARE_TARGET_SEARCH_PARAM,
		PWA_SHARE_TARGET_UPLOAD_MEDIA_PARAM_NAME,
		PWA_SHARE_TARGET_UPLOAD_MEDIA_ROUTE,
	} from '$lib/constants.js';
	import { applyAction, enhance } from '$app/forms';
	import { handle_pwa_share } from '$lib/utils.client.js';
	import { notifications } from '$lib/runes/notifications.svelte.js';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Upload } from '$lib/runes/upload.svelte.js';
	// import { remove_file_extension } from '$lib/utils.js';
	import CopyButton from '$lib/components/copy-button.svelte';
	import Main from '$lib/components/main.svelte';
	import MediaUploadField from '$lib/components/media-upload-field.svelte';
	import TermsField from '$lib/components/terms-field.svelte';
	import TextField from '$lib/components/text-field.svelte';

	const { data, form } = $props();

	const upload = new Upload( {
		// TODO: Get this from config or something.
		allowed_types: [ 'image/*', 'video/*' ],
		max_size: data.max_file_size,
	} );

	let is_submitting = $state( false );

	function handle_file_change() {
		notifications.clear();

		if ( upload.has_invalid_size ) {
			notifications.add( {
				id: 'upload-error-size',
				message: 'This file exceeds the maximum upload size.',
				type: 'error',
			} );
		}

		if ( upload.has_invalid_type ) {
			notifications.add( {
				id: 'upload-error-type',
				message: 'This file type is not allowed.',
				type: 'error',
			} );
		}
	}

	/** @type {import('./$types').SubmitFunction} */
	const handle_submit = ( { formElement, formData } ) => {
		notifications.clear();

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
				notifications.add( {
					children: info,
					id: 'upload-success',
					message: 'File was successfully uploaded.',
					type: 'success',
					data: form?.image_link,
				} );
			} else if ( result.type === 'failure' ) {
				notifications.add( {
					id: 'upload-error',
					message: result.data?.message,
					type: 'error',
				} );
			}
		};
	};

	onMount( async () => {
		if ( $page.url.searchParams.has( PWA_SHARE_TARGET_SEARCH_PARAM ) ) {
			upload.files = await handle_pwa_share();
			// Clear PWA share target search param.
			history.replaceState( '', '', PWA_SHARE_TARGET_UPLOAD_MEDIA_ROUTE );
		}
	} );
</script>

{#snippet info( image_link )}
	<div>
		<a class="button" href={image_link}>View</a>
		<CopyButton data={image_link}>Copy URL</CopyButton>
	</div>
{/snippet}

<Main>
	<form enctype="multipart/form-data" method="POST" use:enhance={handle_submit}>
		<MediaUploadField
			disabled={is_submitting}
			max_file_size={data.max_file_size || 0}
			name="file"
			{upload}
			onchange={handle_file_change}
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
