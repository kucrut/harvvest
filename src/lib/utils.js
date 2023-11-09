import { ZodError } from 'zod';
import { wp_rest_error_schema } from './schema';

/**
 * Create data URI for image source
 *
 * @param {File} file File object.
 * @return {Promise<string>} Data URI or undefined if file type doesn't match requirement.
 */
export function create_data_uri( file ) {
	if ( ! file.type.startsWith( 'image/' ) ) {
		return Promise.reject( 'Invalid file type.' );
	}

	const reader = new FileReader();

	return new Promise( ( resolve, reject ) => {
		reader.onerror = error => reject( error );

		/** @param {ProgressEvent<FileReader>} event */
		reader.onload = event => {
			if ( typeof event.target?.result === 'string' ) {
				resolve( event.target.result );
			} else {
				reject( 'Failed to create data URL from selected file.' );
			}
		};

		reader.readAsDataURL( file );
	} );
}

/**
 * Generate file ID
 *
 * @param {File} file File object.
 * @return {string} File ID.
 */
export function generate_file_id( file ) {
	return `${ file.name }${ file.name }${ file.size }${ file.lastModified }`;
}

/**
 * Get error message
 *
 * @param {unknown}  error    Error object, whatever.
 * @param {string}   fallback Fallback message if the error is unrecognized.
 * @param {boolean=} dump     Wheter to dump error if the error is unrecognized. (Defaults to false).
 *
 * @return {string} Error message.
 */
export function get_error_message( error, fallback, dump = false ) {
	/** @type {string} */
	let message;

	if ( error instanceof Error || error instanceof ZodError ) {
		message = error.message;
	} else {
		message = fallback;

		if ( dump ) {
			// eslint-disable-next-line no-console
			console.error( error );
		}
	}

	return message;
}

/**
 * Handle WP REST API response
 *
 * This helps catch syntax errors in json because of PHP notices, etc.
 *
 * @template T
 *
 * @param {Response}                           response Fetch response object.
 * @param {import('$types').HandleResponse<T>} callback Callback to run when json is valid.
 *
 * @throws {Error} JSON.parse error.
 *
 * @return {Promise<T>} Whatever the callback returns.
 */
export async function handle_wp_rest_response( response, callback ) {
	const clone = response.clone();
	let result;

	if ( response.ok ) {
		try {
			result = await response.json();
		} catch ( error ) {
			const text = await clone.text();
			const message = get_error_message( error, 'Please consult the logs.', true ).replace( '<', '&lt;' );

			throw new Error( `Unexpected response: ${ message }\n${ text }` );
		}

		return await callback( result );
	}

	const json = await response.json();
	const error = wp_rest_error_schema.safeParse( json );
	/** @type {string} */
	let message;

	if ( error.success ) {
		message = error.data.message;
	} else {
		message = 'Unexpected response from server. Please consult the logs.';
		// eslint-disable-next-line no-console
		console.error( error );
	}

	throw new Error( message );
}

/**
 * Remove file extension
 *
 * @param {string} filename File name.
 * @return {string} File name without extension.
 */
export function remove_file_extension( filename ) {
	return filename.split( '.' ).slice( 0, -1 ).join( '.' );
}
