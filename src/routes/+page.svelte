<script>
	import { afterUpdate } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import { create_alert, create_error_alert, retrieve_pwa_shared_file } from '$lib/utils.client.js';
	import { create_data_uri, generate_file_id, remove_file_extension } from '$lib/utils.js';
	import { FileDropzone, getDrawerStore } from '@skeletonlabs/skeleton';
	import { get_error_message } from '@kucrut/wp-api-helpers/utils';
	import { page } from '$app/stores';
	import pretty_bytes from 'pretty-bytes';
	import ContentWrap from '$lib/components/content-wrap.svelte';
	import SubmitField from '$lib/components/submit-field.svelte';
	import TextField from '$lib/components/text-field.svelte';
	import TermsField from '$lib/components/terms-field.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	const drawer_store = getDrawerStore();

	/** @type {'image'|'video'|undefined} */
	let file_type;
	/** @type {FileList|undefined} */
	let files;
	let is_submitting = false;
	let last_selected_file = '';
	let preview_src = '';

	let has_title_touched = false;
	let title = '';

	$: max_file_size_formatted = pretty_bytes( $page.data.max_file_size );

	const check_file_size = async () => {
		if ( ! files?.length ) {
			return;
		}

		if ( files[ 0 ].size <= $page.data.max_file_size ) {
			return;
		}

		files = undefined;
		create_error_alert( drawer_store, `Maximum allowed file size is ${ max_file_size_formatted }.` );
	};

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
			if ( file.type.startsWith( 'image/' ) ) {
				const uri = await create_data_uri( file );
				preview_src = uri;
				file_type = 'image';
			} else if ( file.type.startsWith( 'video/' ) ) {
				file_type = 'video';
			} else {
				file_type = undefined;
			}
		} catch ( error ) {
			preview_src = '';
			const message = get_error_message( error, 'Failed to create preview image.', false );

			create_error_alert( drawer_store, message );
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
		await check_file_size();
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
			<fieldset>
				<!-- NOTE: A hack on the required attribute is needed so that we can re-use the file shared to our PWA. -->
				<FileDropzone
					required={! files?.length}
					accept="image/*,video/*"
					disabled={is_submitting}
					name="file"
					type="file"
					bind:files
				>
					<svelte:fragment slot="lead">
						{#if file_type === 'image' && preview_src}
							<div>
								<img alt="" src={preview_src} />
							</div>
						{:else if file_type === 'video'}
							<div class="gap-y-4 grid max-w-md place-items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-14"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									stroke="currentColor"
									viewBox="0 0 24 24"
									><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><rect
										width="8"
										height="6"
										x="2"
										y="12"
										rx="1"
									/><path d="m10 15.5 4 2.5v-6l-4 2.5" /></svg
								>
							</div>
						{/if}
					</svelte:fragment>
					<p slot="message">
						Click to select an image/video or drag and drop it here.<br />Maximum file size is
						<em>{max_file_size_formatted}</em>.
					</p>
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
			</fieldset>
		</form>
	</ContentWrap>
{/if}
