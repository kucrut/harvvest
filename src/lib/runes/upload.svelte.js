/* eslint-disable svelte/prefer-destructured-store-props */

/** @typedef {{allowed_types: string[]; max_size: number}} UploadOptions */

export class Upload {
	/** @type {UploadOptions} */
	#config;

	/** @type {FileList|null} */
	files = $state( null );

	#file = $derived.by( () => ( this.files?.length ? this.files[ 0 ] : undefined ) );

	#has_file = $derived( this.#file !== undefined );

	#has_invalid_type = $derived.by( () => {
		if ( ! this.#file ) {
			return false;
		}

		const type_allowed = this.#config.allowed_types
			.map( type => type.replace( /\/\*$/, '/' ) )
			.some( type => {
				return this.#file?.type === type ||
					( type.endsWith( '/' ) && this.#file?.type.startsWith( type ) );
				// TODO: More checks.
			} );

		return ! type_allowed;
	} );

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

	/**
	 * @param {UploadOptions} options Options.
	 */
	constructor( options ) {
		this.#config = options;
	}

	get allowed_types() {
		return this.#config.allowed_types.join( ',' );
	}

	get file() {
		return this.#file;
	}

	get has_file() {
		return this.#has_file;
	}

	get has_invalid_type() {
		return this.#has_invalid_type;
	}

	get kind() {
		return this.#kind;
	}
}
