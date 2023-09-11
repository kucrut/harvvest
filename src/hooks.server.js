export const handle = async ( { event, resolve } ) => {
	const session = event.cookies.get( 'session' );

	if ( session ) {
		// TODO: Validate.
		const { name } = JSON.parse( session );
		event.locals.user = { name };
	}

	return await resolve( event );
};
