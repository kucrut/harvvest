export const handle = async ( { event, resolve } ) => {
	const session = event.cookies.get( 'session' );

	if ( session ) {
		// TODO: Validate.
		event.locals.user = JSON.parse( session );
	}

	return await resolve( event );
};
