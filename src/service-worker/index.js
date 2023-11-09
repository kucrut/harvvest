/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// eslint-disable-next-line jsdoc/no-undefined-types
const sw = /** @type {ServiceWorkerGlobalScope} */ ( /** @type {unknown} */ ( self ) );

import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment.
const CACHE = `cache-${ version }`;

const ASSETS = [
	...build, // the app itself.
	...files, // everything in `static`.
];

sw.addEventListener( 'install', event => {
	// Create a new cache and add all files to it.
	async function add_files_to_cache() {
		const cache = await caches.open( CACHE );
		await cache.addAll( ASSETS );
	}

	event.waitUntil( add_files_to_cache() );
} );
