<script>
	import { afterUpdate } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import { create_data_uri } from '$lib/utils.js';
	import { FileDropzone, getToastStore } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import FormWrap from '$lib/components/form-wrap.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	const toast_store = getToastStore();

	/** @type {string} */
	let alt_text = '';
	/** @type {string} */
	let caption = '';
	/** @type {string} */
	let description = '';
	/** @type {string} */
	let title = '';

	/** @type {FileList|undefined} */
	let files;
	/** @type {string|undefined} */
	let preview_src;
	let last_selected_file = '';

	/** @param {File} file */
	const generate_file_id = file => {
		return `${ file.name }${ file.name }${ file.size }${ file.lastModified }`;
	};

	/** @type {import('./$types').SubmitFunction}*/
	const handle_submit = () => {
		return async ( { result } ) => {
			await applyAction( result );

			if ( result.type === 'success' ) {
				files = undefined;
			}
		};
	};

	$: {
		if ( form?.success ) {
			toast_store.trigger( {
				background: 'variant-ghost-success',
				hoverable: true,
				message: `File uploaded to ${ form.image_link }`,
			} );
		}

		if ( form?.error && form?.message ) {
			toast_store.trigger( {
				background: 'variant-ghost-error',
				hoverable: true,
				message: form.message,
			} );
		}
	}

	afterUpdate( async () => {
		if ( ! files?.length ) {
			last_selected_file = '';
			preview_src = undefined;

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
			preview_src = undefined;

			const message = error instanceof Error ? error.message : 'Failed to create preview image.';
			toast_store.trigger( {
				message,
				background: 'variant-ghost-error',
				hoverable: true,
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
	<div class="p-4 md:p-10 space-y-4">
		<h1 class="h3 italic text-center">Hello, <strong>{$page.data.user.name}!</strong></h1>
		<p class="text-center">
			You are logged in to
			<a class="underline hover:no-underline" href={$page.data.user.url} target="_blank">{$page.data.user.url}</a>.
		</p>

		<form enctype="multipart/form-data" method="POST" use:enhance={handle_submit}>
			<FormWrap>
				<FileDropzone required type="file" accept="image/*" id="file" name="file" slotLead="mb-4 empty:mb-0" bind:files>
					<svelte:fragment slot="lead">
						{#if preview_src}
							<div class="gap-y-4 grid max-w-md place-items-center">
								<img src={preview_src} alt={alt_text} class="block rounded" />
							</div>
						{/if}
					</svelte:fragment>
					<p slot="message">Click to upload an image or drag and drop it here.</p>
				</FileDropzone>
				<label class="label">
					<span>Alternative text</span>
					<textarea required class="textarea" name="alt_text" bind:value={alt_text} />
				</label>
				<label class="label">
					<span>Title</span>
					<input class="input" type="text" name="title" bind:value={title} />
				</label>
				<label class="label">
					<span>Caption</span>
					<input required class="input" type="text" name="caption" bind:value={caption} />
				</label>
				<label class="label">
					<span>Description</span>
					<textarea class="textarea" name="description" bind:value={description} />
				</label>
				<p><button class="btn variant-filled" type="submit">Upload</button></p>
			</FormWrap>
		</form>
	</div>
{/if}
