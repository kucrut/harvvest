<script>
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import Toast from '$lib/components/toast.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	/** @type {string} */
	let alt_text = '';
	/** @type {string} */
	let caption = '';
	/** @type {string} */
	let description = '';
	/** @type {string|undefined} */
	let src;
	/** @type {HTMLInputElement} */
	let input;
	/** @type {string} */
	let title = '';

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

	async function handle_input_change() {
		if ( ! input.value || ! input.files ) {
			src = undefined;

			return;
		}

		src = await create_data_uri( input.files[ 0 ] );
	}

	function clear_file() {
		input.value = '';
		handle_input_change();
	}
</script>

<svelte:head>
	<title>Photo Harvest</title>
</svelte:head>

<div class="p-4 md:p-10 space-y-4">
	<h1 class="h3 italic text-center">Hello, <strong>{$page.data.user.name}!</strong></h1>

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
		<div class="flex justify-center items-center mx-auto transition-[width] duration-200 w-full">
			<div class="card p-4 w-full text-token space-y-4">
			{#if src}
				<div class="thumbnail">
					<img alt={alt_text} {src} />
				</div>
				<button type="button" on:click={clear_file}>Remove</button>
			{/if}
			<input required accept="image/*" type="file" id="file" name="file" on:change={handle_input_change} bind:this={input} />
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
			</div>
		</div>
	</form>
</div>

<style>
	.thumbnail {
		width: 25rem;
		max-width: 99%;
	}

	img {
		max-width: 100%;
		height: auto !important;
	}
</style>
