export const handle = async ( { event, resolve } ) => {
	const session = event.cookies.get( 'session' );

	if ( session ) {
		// TODO: Validate.
		const { email, name, url } = JSON.parse( session );
		event.locals.user = { email, name, url };
	}

	return await resolve( event );
};
