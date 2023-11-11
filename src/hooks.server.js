import {
	delete_session_cookies,
	validate_session,
	validate_token,
	wp_get_attachment_taxonomies,
	wp_get_taxonomy_terms,
} from '$lib/utils.server.js';

// TODO: Split handlers, or maybe move non-session stuff to page server loader.

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ( { event, resolve } ) => {
	const session_cookie = event.cookies.get( 'session' );

	if ( ! session_cookie ) {
		return await resolve( event );
	}

	/** @type {import('./lib/schema').Session} */
	let session;

	try {
		session = validate_session( session_cookie );
		await validate_token( session );
		const { avatar_url, email, name, wp_url } = session;
		event.locals.session = session;
		event.locals.user = { avatar_url, email, name, wp_url };
	} catch {
		delete_session_cookies( event.cookies );

		return await resolve( event );
	}

	try {
		const taxonomies = await wp_get_attachment_taxonomies( session.api_url, session.token );
		/** @type {import('$types').Taxonomy_Terms_Option[]} */
		const terms = [];

		for ( const tax of Object.values( taxonomies ) ) {
			try {
				const tax_terms = await wp_get_taxonomy_terms( tax._links[ 'wp:items' ][ 0 ].href, session.token );

				terms.push( { name: tax.name, slug: tax.slug, terms: tax_terms.map( ( { id, name } ) => ( { id, name } ) ) } );
			} catch ( err ) {
				// eslint-disable-next-line no-console
				console.log( err );
				continue;
			}
		}

		event.locals.terms = terms;
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.log( error );
	}

	return await resolve( event );
};
