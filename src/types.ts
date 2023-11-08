export type HandleResponse< T > = ( data: unknown ) => Promise< T >;

export interface Toast {
	autohide?: boolean | number;
	id: string;
	message: string;
	type: 'error' | 'success';
}
