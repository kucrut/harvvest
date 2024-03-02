<script>
	import { applyAction, enhance } from '$app/forms';
	import { create_data_uri, generate_file_id, remove_file_extension } from '$lib/utils.js';
	import { get_error_message } from '@kucrut/wp-api-helpers/utils';
	import { page } from '$app/stores';
	import { retrieve_pwa_shared_file } from '$lib/utils.client.js';
	import pretty_bytes from 'pretty-bytes';
	import Alert from '$lib/components/alert.svelte';
	import CopyButton from '$lib/components/copy-button.svelte';
	import Main from '$lib/components/main.svelte';
	import TextField from '$lib/components/text-field.svelte';
	import TermsField from '$lib/components/terms-field.svelte';
	import VideoIcon from 'lucide-svelte/icons/file-video';

	const { data, form } = $props();

	/** @type {import('$types').Alert|null} */
	let alert = $state( null );
	/** @type {'image'|'video'|undefined} */
	let file_type = $state( undefined );
	/** @type {FileList|undefined} */
	let files = $state( undefined );
	let has_title_touched = $state( false );
	let is_submitting = $state( false );
	let last_selected_file = $state( '' );
	let preview_src = $state( '' );
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
				last_selected_file = '';
				preview_src = '';
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

	$effect( () => {
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

		( async () => {
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
				alert = {
					message: get_error_message( error, 'Failed to create preview image.', false ),
					type: 'error',
				};
			} finally {
				last_selected_file = file_id;
			}
		} )();
	} );
</script>

<Main>
	<form enctype="multipart/form-data" method="POST" use:enhance={handle_submit}>
		<div>
			{#if file_type === 'image' && preview_src}
				<img alt="" src={preview_src} />
			{:else if file_type === 'video'}
				<div><VideoIcon size="72" /></div>
			{/if}
			<!-- NOTE: A hack on the required attribute is needed so that we can re-use the file shared to our PWA. -->
			<input
				required={! files?.length}
				accept="image/*,video/*"
				disabled={is_submitting}
				name="file"
				type="file"
				bind:files
			/>
			<small>
				Click to select an image/video. Maximum file size is <em>{max_file_size_formatted}</em>.
			</small>
		</div>
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

<style>
	img {
		max-width: 100%;
		height: auto;
		border-radius: var( --pico-border-radius );
		display: block;
		margin-block-end: var( --pico-spacing );
	}
</style>
