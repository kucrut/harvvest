import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig( {
	plugins: [ sveltekit() ],

	css: {
		preprocessorOptions: {
			sass: {
				additionalData: '@use "src/variables.scss" as *',
			},
		},
	},
} );
