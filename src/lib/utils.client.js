/// <reference lib="dom" />

/**
 * Copy text to clipboard
 *
 * @param {string} text Text to copy to clipboard.
 */
export async function copy_to_clipboard( text ) {
	try {
		if ( navigator?.clipboard?.writeText ) {
			await navigator.clipboard.writeText( text );
		}
	} catch ( err ) {
		// eslint-disable-next-line no-console
		console.error( err );
	}
}

/**
 * Handle file shared by PWA
 *
 * @return {Promise<FileList|undefined>} Files.
 */
export async function handle_pwa_share() {
	const shared_file = await retrieve_pwa_shared_file();
	const container = new DataTransfer();
	container.items.add( shared_file );

	return container.files;
}

/**
 * Retrieve shared file from PWA
 *
 * Stolen from Squoosh.
 *
 * @return {Promise<File>} Shared file object.
 */
export async function retrieve_pwa_shared_file() {
	return new Promise( resolve => {
		/** @param {MessageEvent} event */
		const onmessage = event => {
			if ( event.data.action !== 'load-image' ) {
				return;
			}

			resolve( event.data.file );
			navigator.serviceWorker.removeEventListener( 'message', onmessage );
		};

		navigator.serviceWorker.addEventListener( 'message', onmessage );

		// This message is picked up by the service worker -
		// it's how it knows we're ready to receive the file.
		navigator.serviceWorker.controller?.postMessage( 'share-ready' );
	} );
}
