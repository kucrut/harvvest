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
	data_to_copy?: AlertDataToCopy[];
	links?: AlertLink[];
	message: string;
	title: string;
	type: 'error' | 'success';
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
