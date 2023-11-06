import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter_auto from '@sveltejs/adapter-auto';
import adapter_node from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Adapter} */
let adapter;

switch ( process.env.ADAPTER ) {
	case 'node':
		adapter = adapter_node( {
			out: process.env.BUILD_OUT_DIR || 'build',
			polyfill: false,
		} );
		break;

	default:
		adapter = adapter_auto();
		break;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter,
		alias: {
			$types: 'src/types.ts',
		},
	},

	preprocess: [ vitePreprocess( {} ) ],
};

export default config;
