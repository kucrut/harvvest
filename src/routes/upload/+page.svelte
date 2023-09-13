<script>
	import { page } from '$app/stores';

	/** @type {import('./$types').ActionData} */
	export let form;

	/** @type {string} */
	let alt_text = '';
	/** @type {string} */
	let caption = '';
	/** @type {string|undefined} */
	let src;
	/** @type {HTMLInputElement} */
	let input;
	/** @type {string} */
	let title = '';

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

<div class="wrap">
	<h1>Hello, {$page.data.user.name}!</h1>

	{#if form?.error}
		<p><strong>Error:</strong> {form.message}</p>
	{/if}

	{#if form?.success && form?.image_link}
		<p><strong>Success!</strong> File uploaded to {form.image_link}</p>
	{/if}

	<form enctype="multipart/form-data" method="POST">
		{#if src}
			<div class="thumbnail">
				<img alt={alt_text} {src} />
			</div>
			<button type="button" on:click={clear_file}>Remove</button>
		{/if}
		<p><input required accept="image/*" type="file" id="file" name="file" on:change={handle_input_change} bind:this={input} /></p>
		<p><label>Title <input type="text" name="title" bind:value={title} /></label></p>
		<p><label>Alt text <input required type="text" name="alt_text" bind:value={alt_text} /></label></p>
		<p><label>Caption <input required type="text" name="caption" bind:value={caption} /></label></p>
		<p><button type="submit">Upload</button></p>
	</form>
</div>

<style>
	.wrap {
		display: grid;
		place-items: center;
	}

	.thumbnail {
		width: 25rem;
		max-width: 99%;
	}

	img {
		max-width: 100%;
		height: auto !important;
	}
</style>