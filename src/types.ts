export interface User {
	email?: string
	name: string;
}

export interface Session extends User {
	token: string;
	url: string;
}
