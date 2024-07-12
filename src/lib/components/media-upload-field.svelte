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
	let { files = $bindable(), max_file_size, onsizeerror, ontypeerror, ...rest } = $props();

	/** @type {string|undefined} */
	let preview_src = $state();

	const icon_props = { height: 125, width: 125 };

	const file = $derived.by( () => ( files?.length ? files[ 0 ] : undefined ) );

	const kind = $derived.by( () => {
		if ( ! file ) {
			return undefined;
		}

		if ( file.type.startsWith( 'image/' ) ) {
			return 'image';
		}

		if ( file.type.startsWith( 'video/' ) ) {
			return 'video';
		}

		return undefined;
	} );

	$effect( () => {
		preview_src = file && kind === 'image' ? URL.createObjectURL( file ) : undefined;

		return () => {
			if ( preview_src ) {
				URL.revokeObjectURL( preview_src );
			}
		};
	} );
</script>

<div>
	<label for="file">Choose file to upload (max. {pretty_bytes( max_file_size )})</label>

	<!-- NOTE: A hack on the required attribute is needed so that we can re-use the file shared to our PWA. -->
	<input {...rest} accept="image/*,video/*" id="file" required={! files?.length} type="file" bind:files />
	<span>
		{#if kind === 'image'}
			{#if preview_src}
				<img alt="" src={preview_src} />
			{:else}
				<Icon {...icon_props} name="file-image" />
			{/if}
		{:else if kind === 'video'}
			<Icon {...icon_props} name="file-video" />
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
