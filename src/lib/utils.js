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
