export type HandleResponse< T > = ( data: unknown ) => Promise< T >;

export interface AlertDataToCopy {
	content: string;
	label?: string;
}

export interface Alert {
	data_to_copy?: AlertDataToCopy[];
	message: string;
	title: string;
	type: 'error' | 'success';
}
