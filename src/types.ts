export type HandleResponse< T > = ( data: unknown ) => Promise< T >;

export interface Toast {
	type: 'error' | 'success';
	message: string;
}
