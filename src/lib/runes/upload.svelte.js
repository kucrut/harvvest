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

	#is_valid_size = $derived.by( () => this.#file !== undefined && this.#file.size <= this.#config.max_size );

	#is_valid_type = $derived.by( () => {
		return this.#file !== undefined &&
			this.#config.allowed_types
				.map( type => type.replace( /\/\*$/, '/' ) )
				.some( type => {
					return this.#file?.type === type ||
						( type.endsWith( '/' ) && this.#file?.type.startsWith( type ) );
					// TODO: More checks.
				} );
	} );

	#errors = $derived.by( () => [
		! this.#is_valid_size ? new Error( 'This file exceeds the maximum upload size.' ) : null,
		! this.#is_valid_type ? new Error( 'This file type is not allowed.' ) : null,
	].filter( i => i instanceof Error ) );

	#is_valid = $derived.by( () => this.#has_file && this.#is_valid_size && this.#is_valid_type );

	/**
	 * @param {UploadOptions} options Options.
	 */
	constructor( options ) {
		this.#config = options;
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

	get kind() {
		return this.#kind;
	}

	get is_valid() {
		return this.#is_valid;
	}

	get is_valid_size() {
		return this.#is_valid_size;
	}

	get is_valid_type() {
		return this.#is_valid_type;
	}
}
