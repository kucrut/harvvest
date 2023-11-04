export interface User {
	email?: string;
	name: string;
	url: string;
}

export interface Session extends User {
	api_url: string;
	token: string;
}
