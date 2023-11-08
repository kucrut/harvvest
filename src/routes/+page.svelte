<script>
	import { afterUpdate } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import { create_data_uri, generate_file_id } from '$lib/utils.js';
	import { get_toast_store } from '$lib/stores/toast';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import ContentWrap from '$lib/components/content-wrap.svelte';
	import FormWrap from '$lib/components/form-wrap.svelte';
	import SubmitField from '$lib/components/submit-field.svelte';
	import TextField from '$lib/components/text-field.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	const toast_store = get_toast_store();

	/** @type {FileList|undefined} */
	let files;
	let is_submitting = false;
	let last_selected_file = '';
	let preview_src = '';

	/** @type {import('./$types').SubmitFunction} */
	const handle_submit = ( { formElement } ) => {
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

	$: {
		if ( form?.success ) {
			toast_store.add( {
				id: 'upload-success',
				message: `File uploaded to ${ form.image_link }`,
				type: 'success',
			} );
		} else if ( form?.error && form.message ) {
			toast_store.add( {
				id: 'upload-error',
				message: form.message,
				type: 'error',
			} );
		}
	}

	afterUpdate( async () => {
		if ( ! files?.length ) {
			last_selected_file = '';
			preview_src = '';

			return;
		}

		const file_id = generate_file_id( files[ 0 ] );

		if ( last_selected_file === file_id ) {
			return;
		}

		try {
			const uri = await create_data_uri( files[ 0 ] );
			preview_src = uri;
		} catch ( error ) {
			preview_src = '';

			toast_store.add( {
				id: 'upload-preview-error',
				message: error instanceof Error ? error.message : 'Failed to create preview image.',
				type: 'error',
			} );
		} finally {
			last_selected_file = file_id;
		}
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
				<FileDropzone
					required
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
				<TextField disabled={is_submitting} label="Title" name="title" />
				<TextField required disabled={is_submitting} label="Caption" name="caption" />
				<TextField multiline disabled={is_submitting} label="Description" name="description" />
				<SubmitField {is_submitting} label="Upload"></SubmitField>
			</FormWrap>
		</form>
	</ContentWrap>
{/if}
