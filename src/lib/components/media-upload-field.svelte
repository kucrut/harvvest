<script>
	import { create_data_uri, generate_file_id } from '$lib/utils.js';
	import pretty_bytes from 'pretty-bytes';
	import Icon from './icon.svelte';

	/**
	 * @type {{
	 *   files?: FileList;
	 *   max_file_size: number;
	 *   onpreviewerror?: (error: unknown, file: File) => void;
	 *   onsizeerror?: (file: File) => void;
	 *   ontypeerror?: (file: File) => void;
	 * } & Omit<import('svelte/elements').HTMLInputAttributes, 'accept' | 'class' | 'multiple' | 'required' | 'type' > }
	 */
	let { files, max_file_size, onpreviewerror, onsizeerror, ontypeerror, ...rest } = $props();

	/** @type {'image'|'video'|undefined} */
	let file_type = $state( undefined );
	let last_selected_file = $state( '' );
	let preview_src = $state( '' );

	$effect( () => {
		if ( files?.length && ! [ 'image', 'video' ].includes( files[ 0 ].type.split( '/' )[ 0 ] ) ) {
			if ( ontypeerror ) {
				ontypeerror( files[ 0 ] );
			}

			files = undefined;
		}
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

				if ( onpreviewerror ) {
					onpreviewerror( error, file );
				}
			} finally {
				last_selected_file = file_id;
			}
		} )();
	} );

	$effect( () => {
		if ( ! files?.length ) {
			return;
		}

		if ( files[ 0 ].size <= ( max_file_size || 0 ) ) {
			return;
		}

		if ( onsizeerror ) {
			onsizeerror( files[ 0 ] );
		}

		files = undefined;
	} );
</script>

<label>
	<!-- NOTE: A hack on the required attribute is needed so that we can re-use the file shared to our PWA. -->
	<input {...rest} accept="image/*,video/*" class="visually-hidden" required={! files?.length} type="file" bind:files />

	{#if preview_src && file_type === 'image'}
		<img alt="" src={preview_src} />
	{:else if preview_src && file_type === 'video'}
		<div><Icon name="file-video" width="72" height="72" /></div>
	{/if}

	<span>Click to select an image/video. Maximum file size is <em>{pretty_bytes( max_file_size )}</em>.</span>
</label>

<style>
	label {
		border: var( --pico-border-width ) dashed var( --pico-form-element-border-color );
		border-radius: var( --pico-border-radius );
		padding-block: 1.5rem;
		padding-inline: var( --pico-form-element-spacing-horizontal );
		background-color: var( --pico-form-element-background-color );
		text-align: center;
		text-wrap: balance;
		margin-block-end: var( --pico-spacing );
		position: relative;

		&:has( input:focus ) {
			border-color: var( --pico-form-element-active-border-color );
			border-style: solid;
			box-shadow: 0 0 0 var( --pico-outline-width ) var( --pico-form-element-focus-color );
		}
	}

	img {
		max-inline-size: 100%;
		block-size: auto;
		border-radius: var( --pico-border-radius );
		display: block;
		margin-inline: auto;
		margin-block: var( --pico-spacing );
	}

	input.visually-hidden {
		inset: 0;
		margin: unset;
		block-size: 100%;
		z-index: -1;
	}
</style>
