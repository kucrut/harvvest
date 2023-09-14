export interface User {
	email?: string
	name: string;
}

export interface Session extends User {
	api_url: string;
	token: string;
	url: string;
}
