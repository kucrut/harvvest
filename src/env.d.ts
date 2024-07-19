/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly ACCESS_KEYS: string;
	readonly ALLOWED_FILE_TYPES: string;
	readonly APP_NAME: string;
	readonly APP_SECRET: string;
	readonly PUBLIC_MAX_FILE_SIZE: string;
	readonly WP_AUTH_ENDPOINT: string;
	readonly WP_INTERNAL_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
