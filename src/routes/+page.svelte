<script>
	import { page } from '$app/stores';

	/** @type {string} */
	let alt = '';
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

	<form action="?/upload" method="POST">
		{#if src}
			<div class="thumbnail">
				<img {alt} {src} />
			</div>
			<button type="button" on:click={clear_file}>Remove</button>
		{/if}
		<p><input required type="file" id="file" accept="image/*" on:change={handle_input_change} bind:this={input} /></p>
		<p><label>Title <input required type="text" name="title" bind:value={title} /></label></p>
		<p><label>Alt text <input required type="text" name="alt" bind:value={alt} /></label></p>
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
