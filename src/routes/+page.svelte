<script>
	import { afterUpdate } from 'svelte';
	import { create_data_uri } from '$lib/utils.js';
	import { applyAction, enhance } from '$app/forms';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import FormWrap from '$lib/components/form-wrap.svelte';
	import Toast from '$lib/components/toast.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

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

	$: error_message = form?.error ? form.message : undefined;
	let last_selected_file = '';
	let should_show_success_message = true;

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
			error_message = error instanceof Error ? error.message : 'Failed to create preview image.';
			preview_src = undefined;
		} finally {
			last_selected_file = file_id;
		}
	} );
</script>

<svelte:head>
	<title>Photo Harvest</title>
</svelte:head>

<div class="p-4 md:p-10 space-y-4">
	<h1 class="h3 italic text-center">Hello, <strong>{$page.data.user.name}!</strong></h1>
	<p class="text-center">
		You are logged in to <a class="underline hover:no-underline" href={$page.data.user.url} target="_blank"
			>{$page.data.user.url}</a
		>.
	</p>

	{#if error_message}
		<Toast on:click={() => ( error_message = undefined )}>
			<h2 class="h3" slot="title">Error</h2>
			<p slot="message">{error_message}</p>
		</Toast>
	{/if}

	{#if form?.success && form?.image_link && should_show_success_message}
		<!-- TODO: a11y announce? -->
		<Toast on:click={() => ( should_show_success_message = false )}>
			<h2 class="h3" slot="title">Success!</h2>
			<p slot="message" class="success-message">
				File uploaded to <a class="underline hover:no-underline" href={form.image_link} target="_blank"
					>{form.image_link}</a
				>
			</p>
		</Toast>
	{/if}

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

<style>
	.success-message a::after {
		content: '\00a0\2b00';
	}
</style>
