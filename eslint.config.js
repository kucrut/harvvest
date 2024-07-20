import configs from '@kucrut/eslint-config';
import globals from 'globals';
import svelte_parser from 'svelte-eslint-parser';
import svelte_plugin from 'eslint-plugin-svelte';

export default [
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	...configs.js,
	...svelte_plugin.configs[ 'flat/recommended' ],
	{
		files: [
			'*.svelte.js',
			'*.svelte.ts',
			'*.svelte',
			'**/*.svelte.js',
			'**/*.svelte.ts',
			'**/*.svelte',
		],
		languageOptions: {
			parser: svelte_parser,
		},
		plugins: {
			svelte: svelte_plugin,
		},
		...configs.svelte,
	},
	{
		ignores: [ 'build/', '.svelte-kit/', 'package/' ],
	},
];
