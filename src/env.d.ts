/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly APP_ID: string;
	readonly APP_NAME: string;
	readonly ACCESS_KEYS: string;
	readonly PUBLIC_MAX_FILE_SIZE: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
