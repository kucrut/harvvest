<script lang="ts">
	import type { ChangeEventHandler, HTMLInputAttributes } from 'svelte/elements';
	import type { Upload } from '$lib/runes/upload.svelte.js';
	import { onMount } from 'svelte';
	import pretty_bytes from 'pretty-bytes';
	import Icon from './icon.svelte';

	interface Props extends Omit<HTMLInputAttributes, 'accept' | 'class' | 'multiple' | 'required' | 'type'> {
		max_file_size: number;
		upload: Upload;
	}

	const { max_file_size, onchange, upload = $bindable(), ...rest }: Props = $props();

	let input: HTMLInputElement;
	let preview_src = $state( '' );

	const icon_props = { height: 125, width: 125 };

	const handle_file_change: ChangeEventHandler<HTMLInputElement> = event => {
		if ( preview_src ) {
			URL.revokeObjectURL( preview_src );
		}

		preview_src = upload.file && upload.kind === 'image'
			? URL.createObjectURL( upload.file )
			: '';

		if ( onchange ) {
			onchange( event );
		}
	};

	onMount( () => {
		// On refresh, browsers tend to keep the previous file input value
		// so let's re-use it.
		if ( input.value && input.files?.length && ! upload.file ) {
			input.dispatchEvent( new Event( 'change', { 'bubbles': true } ) );
		}
	} );
</script>

<div>
	<label for="file">Choose file to upload (max. {pretty_bytes( max_file_size )})</label>

	<!-- NOTE: A hack on the required attribute is needed so that we can re-use the file shared to our PWA. -->
	<input
		{...rest}
		bind:this={input}
		accept={upload.allowed_types}
		id="file"
		required={! upload.files?.length}
		type="file"
		bind:files={upload.files}
		onchange={handle_file_change}
	/>
	<span>
		{#if upload.kind === 'image'}
			{#if preview_src}
				<img alt="" src={preview_src} />
			{:else}
				<Icon {...icon_props} name="file-image" />
			{/if}
		{:else if upload.kind === 'video'}
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

	span:not(:empty) {
		block-size: 125px;
		overflow: clip;
		margin-block-end: var( --pico-spacing );
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		& :global(svg) {
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
