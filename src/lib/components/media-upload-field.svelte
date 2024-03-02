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
	 * } & Omit<import('svelte/elements').HTMLInputAttributes, 'accept' | 'class' | 'required' | 'type' > }
	 */
	let { files, max_file_size, onpreviewerror, onsizeerror, ...rest } = $props();

	/** @type {'image'|'video'|undefined} */
	let file_type = $state( undefined );
	let last_selected_file = $state( '' );
	let preview_src = $state( '' );

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
	{#if preview_src && file_type === 'image'}
		<img alt="" src={preview_src} />
	{:else if preview_src && file_type === 'video'}
		<div><Icon name="file-video" width="72" height="72" /></div>
	{/if}

	<small>Click to select an image/video. Maximum file size is <em>{pretty_bytes( max_file_size )}</em>.</small>

	<!-- NOTE: A hack on the required attribute is needed so that we can re-use the file shared to our PWA. -->
	<input {...rest} class="visually-hidden" required={! files?.length} accept="image/*,video/*" type="file" bind:files />
</label>

<style>
	label {
		border: var( --pico-border-width ) dashed var( --pico-form-element-border-color );
		border-radius: var( --pico-border-radius );
		padding: var( --pico-form-element-spacing-vertical ) var( --pico-form-element-spacing-horizontal );
		background-color: var( --pico-form-element-background-color );
		text-align: center;
		margin-block-end: var( --pico-spacing );
	}

	img {
		max-width: 100%;
		height: auto;
		border-radius: var( --pico-border-radius );
		display: block;
		margin-inline: auto;
		margin-block: var( --pico-spacing );
	}
</style>
