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
 * Check if string is a valid HTTP/HTTPS URL.
 *
 * @param {string} url URL string to check.
 * @return {boolean} Whether string is a valid HTTP/HTTPS URL.
 */
export function is_valid_http_url( url ) {
	try {
		const url_o = new URL( url );
		return [ 'http:', 'https:' ].includes( url_o.protocol );
	} catch {
		return false;
	}
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
