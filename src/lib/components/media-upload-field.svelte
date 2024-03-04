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

	/** @type {HTMLInputElement} */
	let input;

	const clear_file = () => ( input.value = '' );

	$effect( () => {
		if ( files?.length && ! [ 'image', 'video' ].includes( files[ 0 ].type.split( '/' )[ 0 ] ) ) {
			if ( ontypeerror ) {
				ontypeerror( files[ 0 ] );
			}

			clear_file();
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

		clear_file();
	} );
</script>

<div>
	<label for="file">Choose file to upload (max. <em>{pretty_bytes( max_file_size )})</em></label>

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
		{#if preview_src}
			{#if file_type === 'image'}
				<img alt="" src={preview_src} />
			{:else if file_type === 'video'}
				<Icon name="file-video" width="72" height="72" />
			{/if}
		{:else}{/if}
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
		block-size: 150px;
		overflow: clip;
		margin-block-end: var( --pico-spacing );
		text-align: center;
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
