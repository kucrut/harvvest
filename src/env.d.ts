/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly ACCESS_KEYS: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
