/* eslint-disable jsdoc/no-undefined-types */ // TODO

/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const sw = /** @type {ServiceWorkerGlobalScope} */ ( /** @type {unknown} */ ( self ) );

// Create a unique cache name for this deployment.
const CACHE = `cache-${ version }`;

const ASSETS = [
	...build, // the app itself.
	...files, // everything in `static`.
];

/** @type {Map<string, (() => void)[]>} */
const messages_map = new Map();

/** @param {string} action */
const await_client_message = action => {
	/** @type {Promise<void>} */
	const item = new Promise( resolve => {
		if ( ! messages_map.has( action ) ) {
			messages_map.set( action, [] );
		}

		messages_map.get( action )?.push( resolve );
	} );

	return item;
};

/**
 * Handle GET requests
 *
 * @param {URL} url Request URL object.
 * @param {Request} request Request object.
 */
const handle_get_requests = async ( url, request ) => {
	const cache = await caches.open( CACHE );

	try {
		const response = await fetch( request, { credentials: 'same-origin' } );

		if ( response.status === 200 ) {
			cache.put( request, response.clone() );
		}

		return response;
	} catch ( error ) {
		const from_cache = await cache.match( url.pathname, {
			ignoreSearch: true,
		} );

		if ( from_cache ) {
			return from_cache;
		}

		throw error;
	}
};

/**
 * Handle POST request with shared fiel
 *
 * @param {FetchEvent} event Fetch event.
 */
const handle_share = async event => {
	const client = await sw.clients.get( event.resultingClientId );

	if ( ! client ) {
		return;
	}

	// Wait for the the page (client) to sends this message to tell us
	// (service worker) that it's ready to receive the file.
	await await_client_message( 'share-ready' );

	const data = await event.request.formData();
	const file = data.get( 'file' );

	// Send the file to the client via post message's event.data.
	client.postMessage( { file, action: 'load-image' } );
};

sw.addEventListener( 'install', event => {
	sw.skipWaiting();

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
