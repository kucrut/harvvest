export type HandleResponse< T > = ( data: unknown ) => Promise< T >;

export interface Alert {
	message: string;
	title: string;
	type: 'error' | 'success';
}
