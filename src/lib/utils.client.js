/// <reference lib="dom" />

import { getDrawerStore } from '@skeletonlabs/skeleton';

/**
 * Create alert
 *
 * @param {Record<string,string>} meta Alert metadata.
 */
export function create_alert( meta ) {
	const drawer_store = getDrawerStore();

	drawer_store.open( {
		meta,
		bgDrawer: 'bg-surface-50',
		id: 'alert',
		position: 'bottom',
		rounded: 'rounded-tr-md rounded-br-none rounded-bl-none rounded-tl-md',
		regionDrawer: 'p-4 h-max w-full',
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
