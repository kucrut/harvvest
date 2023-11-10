/* eslint-disable jsdoc/no-undefined-types */ // TODO

/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope} */ ( /** @type {unknown} */ ( self ) );

import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment.
const CACHE = `cache-${ version }`;

const ASSETS = [
	...build, // the app itself.
	...files, // everything in `static`.
];

/**
 * Handle GET requests
 *
 * @param {URL} url Request URL object.
 * @param {Request} request Request object.
 */
const handle_get_requests = async ( url, request ) => {
	const cache = await caches.open( CACHE );

	try {
		const response = await fetch( request );

		if ( response.status === 200 ) {
			cache.put( request, response.clone() );
		}

		return response;
	} catch ( error ) {
		const from_cache = await cache.match( url.pathname, {
			ignoreSearch: true,
		} );

		return from_cache;
	}
};

/** @type {Map<string, (() => void)[]>} */
const messages_map = new Map();

/** @param {string} data_value */
const next_message = data_value => {
	/** @type {Promise<void>} */
	const item = new Promise( resolve => {
		if ( ! messages_map.has( data_value ) ) {
			messages_map.set( data_value, [] );
		}

		messages_map.get( data_value )?.push( resolve );
	} );

	return item;
};

/**
 * Handle POST request with shared fiel
 *
 * @param {FetchEvent} event Fetch event.
 */
const handle_share = async event => {
	// The page sends this message to tell the service worker it's ready to receive the file.
	await next_message( 'share-ready' );
	const client = await sw.clients.get( event.resultingClientId );

	if ( ! client ) {
		return;
	}

	const data = await event.request.formData();
	const file = data.get( 'file' );

	client.postMessage( { file, action: 'load-image' } );
};

sw.addEventListener( 'install', event => {
	// Create a new cache and add all files to it.
	async function add_files_to_cache() {
		const cache = await caches.open( CACHE );
		await cache.addAll( ASSETS );
	}

	event.waitUntil( add_files_to_cache() );
} );

sw.addEventListener( 'activate', event => {
	// Remove previous cached data from disk.
	async function delete_old_caches() {
		for ( const key of await caches.keys() ) {
			if ( key !== CACHE ) {
				await caches.delete( key );
			}
		}
	}

	event.waitUntil( delete_old_caches() );
} );

sw.addEventListener( 'fetch', event => {
	const url = new URL( event.request.url );

	// Don't care about other-origin URLs.
	if ( url.origin !== location.origin ) {
		return;
	}

	if ( event.request.method === 'POST' && url.pathname === '/' && url.searchParams.has( 'share-target' ) ) {
		// Redirect so the user can refresh the page without resending data.
		event.respondWith( Response.redirect( '/?share-target' ) );
		event.waitUntil( handle_share( event ) );

		return;
	}

	if ( event.request.method === 'GET' ) {
		event.respondWith( handle_get_requests( url, event.request ) );
	}
} );

sw.addEventListener( 'message', event => {
	const resolvers = messages_map.get( event.data );

	if ( ! resolvers ) {
		return;
	}

	messages_map.delete( event.data );

	for ( const resolve of resolvers ) {
		resolve();
	}
} );
