<script>
	import { applyAction, enhance } from '$app/forms';
	import { remove_file_extension } from '$lib/utils.js';
	import { get_error_message } from '@kucrut/wp-api-helpers/utils';
	import { page } from '$app/stores';
	import { retrieve_pwa_shared_file } from '$lib/utils.client.js';
	import pretty_bytes from 'pretty-bytes';
	import Alert from '$lib/components/alert.svelte';
	import CopyButton from '$lib/components/copy-button.svelte';
	import Main from '$lib/components/main.svelte';
	import TextField from '$lib/components/text-field.svelte';
	import TermsField from '$lib/components/terms-field.svelte';
	import MediaUploadField from '$lib/components/media-upload-field.svelte';

	const { data, form } = $props();

	/** @type {import('$types').Alert|null} */
	let alert = $state( null );
	/** @type {'image'|'video'|undefined} */
	/** @type {FileList|undefined} */
	let files = $state( undefined );
	let has_title_touched = $state( false );
	let is_submitting = $state( false );
	let title = $state( '' );

	const max_file_size_formatted = $derived( pretty_bytes( data.max_file_size || 0 ) );

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
			}
		};
	};

	$effect( () => {
		if ( form?.success ) {
			alert = {
				message: 'File was successfully uploaded.',
				type: 'success',
			};
		} else if ( form?.error && form?.message ) {
			alert = {
				message: form.message,
				type: 'error',
			};
		}
	} );

	$effect( () => {
		if ( ! has_title_touched && files?.length ) {
			title = remove_file_extension( files[ 0 ].name );
		}
	} );

	$effect( () => {
		if ( ! files?.length ) {
			return;
		}

		if ( files[ 0 ].size <= ( data.max_file_size || 0 ) ) {
			return;
		}

		files = undefined;
		alert = {
			message: `Maximum allowed file size is ${ max_file_size_formatted }.`,
			type: 'error',
		};
	} );

	$effect( () => {
		if ( ! $page.url.searchParams.has( 'share-target' ) ) {
			return;
		}

		( async () => {
			const shared_file = await retrieve_pwa_shared_file();
			const container = new DataTransfer();
			container.items.add( shared_file );
			files = container.files;

			// Clear `search-target` param.
			history.replaceState( '', '', '/' );
		} )();
	} );
</script>

<Main>
	<form enctype="multipart/form-data" method="POST" use:enhance={handle_submit}>
		<MediaUploadField
			bind:files
			disabled={is_submitting}
			max_file_size={data.max_file_size || 0}
			name="file"
			onpreviewerror={error => {
				alert = {
					message: get_error_message( error, 'Failed to create preview image.', false ),
					type: 'error',
				};
			}}
		/>
		<TextField multiline required label="Alternative text" name="alt_text" />
		<TextField required label="Caption" name="caption" />
		<TextField label="Title" name="title" bind:value={title} on:focus={() => ( has_title_touched = true )} />
		<TextField multiline label="Description" name="description" />
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
	<Alert type={alert.type} onexpire={() => ( alert = null )}>
		<p>{alert.message}</p>
		{#if form?.success && form?.image_link}
			<div>
				<a class="button" href={form.image_link}>View</a>
				<CopyButton data={form.image_link}>Copy URL</CopyButton>
			</div>
		{/if}
	</Alert>
{/if}
