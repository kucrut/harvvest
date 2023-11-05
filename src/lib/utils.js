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
		reader.onload = e => {
			if ( typeof e.target?.result === 'string' ) {
				resolve( e.target?.result );
			} else {
				reject( 'Moo' );
			}
		};

		reader.readAsDataURL( file );
	} );
}
