/* eslint-disable svelte/prefer-destructured-store-props */

/** @typedef {{allowed_types: string[]; max_size: number}} UploadOptions */

export class Upload {
	/** @type {UploadOptions} */
	#config;

	/** @type {FileList|null} */
	files = $state( null );

	#file = $derived.by( () => ( this.files?.length ? this.files[ 0 ] : undefined ) );

	#has_file = $derived( this.#file !== undefined );

	#kind = $derived.by( () => {
		if ( ! this.#file ) {
			return undefined;
		}

		if ( this.#file.type.startsWith( 'image/' ) ) {
			return 'image';
		}

		if ( this.#file.type.startsWith( 'video/' ) ) {
			return 'video';
		}

		return undefined;
	} );

	#errors = $derived.by( () => {
		/** @type {Error[]} */
		const items = [];

		if ( ! this.#file ) {
			return items;
		}

		if ( this.#file.size > this.#config.max_size ) {
			items.push( new Error( 'This file exceeds the maximum upload size.' ) );
		}

		if ( ! this.#is_type_allowed( this.#file.type ) ) {
			items.push( new Error( 'This file type is not allowed.' ) );
		}

		return items;
	} );

	#is_valid = $derived( ! this.#errors?.length );

	/**
	 * @param {UploadOptions} options Options.
	 */
	constructor( options ) {
		this.#config = options;
	}

	/** @param {string} file_type */
	#is_type_allowed( file_type ) {
		return this.#config.allowed_types
			.map( type => type.replace( /\/\*$/, '/' ) )
			.some( type => {
				return file_type === type ||
					( type.endsWith( '/' ) && file_type.startsWith( type ) );
				// TODO: More checks.
			} );
	}

	get allowed_types() {
		return this.#config.allowed_types.join( ',' );
	}

	get errors() {
		return this.#errors;
	}

	get file() {
		return this.#file;
	}

	get has_file() {
		return this.#has_file;
	}

	get is_valid() {
		return this.#is_valid;
	}

	get kind() {
		return this.#kind;
	}
}
