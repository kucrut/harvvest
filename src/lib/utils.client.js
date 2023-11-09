/// <reference lib="dom" />

/**
 * Create alert
 *
 * @param {ReturnType<import('@skeletonlabs/skeleton').getDrawerStore>} store Drawer store.
 * @param {import('$types').Alert} meta Alert metadata.
 */
export function create_alert( store, meta ) {
	store.open( {
		meta,
		bgDrawer: 'bg-surface-50',
		id: 'alert',
		position: 'bottom',
		rounded: 'rounded-tr-md rounded-br-none rounded-bl-none rounded-tl-md',
		regionDrawer: 'p-4 h-max w-full',
	} );
}

/**
 * Create error alert
 *
 * @param {ReturnType<import('@skeletonlabs/skeleton').getDrawerStore>} store Drawer store.
 * @param {string} message Error message.
 */
export function create_error_alert( store, message ) {
	create_alert( store, {
		message,
		title: 'Error',
		type: 'error',
	} );
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
