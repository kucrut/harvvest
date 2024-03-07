<script>
	import { create_data_uri } from '$lib/utils.js';
	import pretty_bytes from 'pretty-bytes';
	import Icon from './icon.svelte';

	/**
	 * @type {{
	 *   files: FileList|null;
	 *   max_file_size: number;
	 *   onpreviewerror?: (error: unknown, file: File) => void;
	 *   onsizeerror?: (file: File) => void;
	 *   ontypeerror?: (file: File) => void;
	 * } & Omit<import('svelte/elements').HTMLInputAttributes, 'accept' | 'class' | 'multiple' | 'required' | 'type' > }
	 */
	let { files, max_file_size, onpreviewerror, onsizeerror, ontypeerror, ...rest } = $props();

	/** @type {HTMLInputElement} */
	let input;
	/** @type {unknown} */
	let preview_error = $state();
	let preview_src = $state( '' );

	const clear_file = () => ( files = null );

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
			return;
		}

		( async () => {
			try {
				preview_src = await create_data_uri( current_file );
				preview_error = null;
			} catch ( error ) {
				preview_src = '';
				preview_error = error;
			}
		} )();
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
		if ( current_file && preview_error && onpreviewerror ) {
			onpreviewerror( preview_error, current_file );
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
		{#if file_type === 'image' && preview_src}
			<img alt="" src={preview_src} />
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
