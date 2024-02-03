/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly ACCESS_KEYS: string;
	readonly PUBLIC_MAX_FILE_SIZE: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
