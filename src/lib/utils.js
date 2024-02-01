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
 * Remove file extension
 *
 * @param {string} filename File name.
 * @return {string} File name without extension.
 */
export function remove_file_extension( filename ) {
	return filename.split( '.' ).slice( 0, -1 ).join( '.' );
}
