<script>
	import { afterUpdate } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import { create_data_uri, generate_file_id, remove_file_extension } from '$lib/utils.js';
	import { get_toast_store } from '$lib/stores/toast';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { retrieve_pwa_shared_file } from '$lib/utils.client.js';
	import ContentWrap from '$lib/components/content-wrap.svelte';
	import FormWrap from '$lib/components/form-wrap.svelte';
	import SubmitField from '$lib/components/submit-field.svelte';
	import TextField from '$lib/components/text-field.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	const toast_store = get_toast_store();
	const toast_error_id = 'upload-error';
	const toast_success_id = 'upload-success';

	/** @type {FileList|undefined} */
	let files;
	let is_submitting = false;
	let last_selected_file = '';
	let preview_src = '';

	let has_title_touched = false;
	let title = '';

	/** @type {import('./$types').SubmitFunction} */
	const handle_submit = ( { formElement, formData } ) => {
		// Re-use file shared to our PWA.
		if ( files?.length ) {
			formData.set( 'file', files[ 0 ] );
		}

		toast_store.remove( toast_error_id );
		toast_store.remove( toast_success_id );
		is_submitting = true;

		return async ( { result } ) => {
			await applyAction( result );
			is_submitting = false;

			if ( result.type === 'success' ) {
				formElement.reset();
				files = undefined;
			}
		};
	};

	const intercept_shared_file = async () => {
		if ( ! $page.url.searchParams.has( 'share-target' ) ) {
			return;
		}

		const shared_file = await retrieve_pwa_shared_file();
		const container = new DataTransfer();
		container.items.add( shared_file );
		files = container.files;

		// Clear `search-target` param.
		history.replaceState( '', '', '/' );
	};

	const update_preview_src = async () => {
		if ( ! files?.length ) {
			last_selected_file = '';
			preview_src = '';

			return;
		}

		const file = files[ 0 ];
		const file_id = generate_file_id( file );
		const toast_id = 'upload-preview-error';

		if ( last_selected_file === file_id ) {
			return;
		}

		if ( ! has_title_touched ) {
			title = remove_file_extension( file.name );
		}

		toast_store.remove( toast_id );

		try {
			const uri = await create_data_uri( file );
			preview_src = uri;
		} catch ( error ) {
			preview_src = '';

			toast_store.add( {
				id: toast_id,
				message: error instanceof Error ? error.message : 'Failed to create preview image.',
				type: 'error',
			} );
		} finally {
			last_selected_file = file_id;
		}
	};

	$: {
		if ( form?.success ) {
			toast_store.add( {
				id: toast_success_id,
				message: `File uploaded to <a class="after:content-['_↗']" href="${ form.image_link }" rel="external" target="_blank"><span class="underline">${ form.image_link }</span></a>`,
				type: 'success',
			} );
		} else if ( form?.error && form.message ) {
			toast_store.add( {
				id: toast_error_id,
				message: form.message,
				type: 'error',
			} );
		}
	}

	afterUpdate( async () => {
		await intercept_shared_file();
		await update_preview_src();
	} );
</script>

<svelte:head>
	<title>Photo Harvest</title>
</svelte:head>

{#if $page.data.user}
	<ContentWrap>
		<!-- TODO: Add intro text -->
		<form enctype="multipart/form-data" method="POST" use:enhance={handle_submit}>
			<FormWrap>
				<!-- NOTE: A hack on the required attribute is needed so that we can re-use the file shared to our PWA. -->
				<FileDropzone
					required={! files?.length}
					accept="image/*"
					disabled={is_submitting}
					name="file"
					slotLead="mb-4 empty:mb-0"
					type="file"
					bind:files
				>
					<svelte:fragment slot="lead">
						{#if preview_src}
							<div class="gap-y-4 grid max-w-md place-items-center">
								<img alt="" class="block rounded" src={preview_src} />
							</div>
						{/if}
					</svelte:fragment>
					<p slot="message">Click to select an image or drag and drop it here.</p>
				</FileDropzone>
				<TextField multiline required disabled={is_submitting} label="Alternative text" name="alt_text" />
				<TextField required disabled={is_submitting} label="Caption" name="caption" />
				<TextField
					disabled={is_submitting}
					label="Title"
					name="title"
					bind:value={title}
					on:focus={() => ( has_title_touched = true )}
				/>
				<TextField multiline disabled={is_submitting} label="Description" name="description" />
				<SubmitField {is_submitting} label="Upload"></SubmitField>
			</FormWrap>
		</form>
	</ContentWrap>
{/if}
