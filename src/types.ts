export type HandleResponse< T > = ( data: unknown ) => Promise< T >;

export interface AlertDataToCopy {
	content: string;
	label?: string;
}

export interface AlertLink {
	label: string;
	url: string;
}

export interface Alert {
	message: string;
	type: 'error' | 'message' | 'success';
}

export interface Term_Option {
	id: number;
	name: string;
}

export interface Taxonomy_Terms_Option {
	name: string;
	slug: string;
	terms: Term_Option[];
}
