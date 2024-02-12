/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly APP_NAME: string;
	readonly ACCESS_KEYS: string;
	readonly PUBLIC_MAX_FILE_SIZE: string;
	readonly WP_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
