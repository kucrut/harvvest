<script>
	import { afterUpdate } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import { create_alert, create_error_alert, retrieve_pwa_shared_file } from '$lib/utils.client.js';
	import { create_data_uri, generate_file_id, remove_file_extension } from '$lib/utils.js';
	import { FileDropzone, getDrawerStore } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import ContentWrap from '$lib/components/content-wrap.svelte';
	import FormWrap from '$lib/components/form-wrap.svelte';
	import SubmitField from '$lib/components/submit-field.svelte';
	import TextField from '$lib/components/text-field.svelte';
	import TermsField from '$lib/components/terms-field.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	const drawer_store = getDrawerStore();

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

		is_submitting = true;

		return async ( { result } ) => {
			await applyAction( result );
			is_submitting = false;

			if ( result.type === 'success' ) {
				formElement.reset();
				files = undefined;
				has_title_touched = false;
				last_selected_file = '';
				preview_src = '';
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

		if ( last_selected_file === file_id ) {
			return;
		}

		try {
			const uri = await create_data_uri( file );
			preview_src = uri;
		} catch ( error ) {
			preview_src = '';

			create_error_alert( drawer_store, error instanceof Error ? error.message : 'Failed to create preview image.' );
		} finally {
			last_selected_file = file_id;
		}
	};

	const update_title = () => {
		if ( ! has_title_touched && files?.length ) {
			title = remove_file_extension( files[ 0 ].name );
		}
	};

	$: {
		if ( form?.success ) {
			create_alert( drawer_store, {
				message: `File was successfully uploaded.`,
				title: 'Success!',
				type: 'success',
				data_to_copy: [ { label: 'Copy URL', content: form.image_link } ],
				links: [ { label: 'View ↗', url: form.image_link } ],
			} );
		} else if ( form?.error && form.message ) {
			create_error_alert( drawer_store, form.message );
		}
	}

	afterUpdate( async () => {
		await intercept_shared_file();
		await update_preview_src();
		update_title();
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
					accept="image/*,video/*"
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
					<p slot="message">Click to select an image/video or drag and drop it here.</p>
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
				{#if $page.data.terms?.length}
					<!-- eslint-disable-next-line space-in-parens -->
					{#each $page.data.terms as taxonomy (`${ taxonomy.name }-${ taxonomy.slug }`)}
						<TermsField {taxonomy} />
					{/each}
				{/if}
				<SubmitField {is_submitting} label="Upload"></SubmitField>
			</FormWrap>
		</form>
	</ContentWrap>
{/if}
