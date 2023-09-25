<script>
	import { afterUpdate } from 'svelte';
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
	let src;

	let should_show_success_message = true;

	/**
	 * Create data URI for image source
	 *
	 * @param {File} file File object.
	 * @return {Promise<string>} Data URI.
	 */
	function create_data_uri( file ) {
		const reader = new FileReader();

		return new Promise( ( resolve, reject ) => {
			reader.onload = e => {
				if ( typeof e.target?.result === 'string' ) {
					resolve( e.target?.result );
				} else {
					reject( 'Moo' );
				}
			};

			reader.readAsDataURL( file );
		} );
	}

	afterUpdate( async () => {
		src = files?.length ? await create_data_uri( files[ 0 ] ) : undefined;
	} );
</script>

<svelte:head>
	<title>Photo Harvest</title>
</svelte:head>

<div class="p-4 md:p-10 space-y-4">
	<h1 class="h3 italic text-center">Hello, <strong>{$page.data.user.name}!</strong></h1>
	<p class="text-center">You are logged in to <a class="underline hover:no-underline" href={$page.data.user.url} target="_blank">{$page.data.user.url}</a>.</p>

	{#if form?.error}
		<!-- TODO: Toast -->
		<p><strong>Error:</strong> {form.message}</p>
	{/if}

	{#if form?.success && form?.image_link && should_show_success_message }
		<Toast on:click={() => ( should_show_success_message = false )}>
			<h2 class="h3" slot="title">Success!</h2>
			<p slot="message">File uploaded to <a class="underline hover:no-underline" href={form.image_link} target="_blank">{form.image_link}</a></p>
		</Toast>
	{/if}

	<form enctype="multipart/form-data" method="POST">
		<FormWrap>
			<FileDropzone required accept="image/*" type="file" id="file" name="file" slotLead="mb-4 empty:mb-0" bind:files>
				<svelte:fragment slot="lead">
					{#if src}
						<div class="gap-y-4 grid max-w-md place-items-center">
							<img {src} alt={alt_text} class="block rounded" />
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
