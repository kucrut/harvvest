<script>
	import pretty_bytes from 'pretty-bytes';
	import Icon from './icon.svelte';

	/**
	 * @type {{
	 *   files: FileList|null;
	 *   max_file_size: number;
	 *   onsizeerror?: (file: File) => void;
	 *   ontypeerror?: (file: File) => void;
	 * } & Omit<import('svelte/elements').HTMLInputAttributes, 'accept' | 'class' | 'multiple' | 'required' | 'type' > }
	 */
	let { files, max_file_size, onsizeerror, ontypeerror, ...rest } = $props();

	/** @type {HTMLInputElement} */
	let input;
	let preview_src = $state( '' );

	const clear_file = () => ( files = null );

	const clear_preview = () => {
		if ( preview_src ) {
			URL.revokeObjectURL( preview_src );
		}
	};

	const current_file = $derived.by( () => ( files?.length ? files[ 0 ] : undefined ) );

	const file_type = $derived.by( () => {
		if ( ! current_file ) {
			return undefined;
		}

		if ( current_file.type.startsWith( 'image/' ) ) {
			return 'image';
		}

		if ( current_file.type.startsWith( 'video/' ) ) {
			return 'video';
		}

		return undefined;
	} );

	$effect( () => {
		if ( ! current_file || file_type !== 'image' ) {
			clear_preview();
			return;
		}

		// Only create preview for images smaller than 512kb.
		if ( current_file.size > 524288 ) {
			preview_src = '';
			return;
		}

		preview_src = URL.createObjectURL( current_file );
	} );

	$effect( () => {
		if ( ! current_file ) {
			input.value = '';
		}
	} );

	$effect( () => {
		if ( current_file && ! file_type ) {
			if ( ontypeerror ) {
				ontypeerror( current_file );
			}

			clear_file();
		}
	} );

	$effect( () => {
		if ( current_file && current_file.size > max_file_size ) {
			if ( onsizeerror ) {
				onsizeerror( current_file );
			}

			clear_file();
		}
	} );
</script>

<div>
	<label for="file">Choose file to upload (max. {pretty_bytes( max_file_size )})</label>

	<!-- NOTE: A hack on the required attribute is needed so that we can re-use the file shared to our PWA. -->
	<input
		{...rest}
		accept="image/*,video/*"
		bind:files
		bind:this={input}
		id="file"
		required={! files?.length}
		type="file"
	/>
	<span>
		{#if file_type === 'image'}
			{#if preview_src}
				<img alt="" src={preview_src} />
			{:else}
				<Icon name="file-image" width="125" height="125" />
				<small>No preview for files bigger than 512kb.</small>
			{/if}
		{:else if file_type === 'video'}
			<Icon name="file-video" width="125" height="125" />
		{/if}
	</span>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
	}

	input {
		appearance: none;
	}

	span:not( :empty ) {
		block-size: 125px;
		overflow: clip;
		margin-block-end: var( --pico-spacing );
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		& :global( svg ) {
			color: var( --pico-form-element-border-color );
		}
	}

	img {
		object-fit: contain;
		border-radius: var( --pico-border-radius );
		margin: unset;
		max-block-size: 100%;
		max-inline-size: 100%;
	}

	input.visually-hidden {
		inset: 0;
		margin: unset;
		block-size: 100%;
		z-index: -1;
	}
</style>
