import configs from '@kucrut/eslint-config';
import globals from 'globals';
import json from 'eslint-plugin-json';
import svelte_parser from 'svelte-eslint-parser';
import svelte_plugin from 'eslint-plugin-svelte';
import ts_parser from '@typescript-eslint/parser';

export default [
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	{
		files: [ '**/*.json' ],
		...json.configs.recommended,
	},
	{
		files: [ '.vscode/settings.json', '.zed/settings.json' ],
		...json.configs.recommended,
		rules: {
			'json/*': [ 'error', 'allowComments' ],
		},
	},
	{
		files: [ '**/*server.js', 'svelte.config.js' ],
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
		files: [ '**/*.ts', '*.ts' ],
		languageOptions: {
			parser: ts_parser,
		},
		rules: {
			'no-unused-vars': 'off',
		},
	},
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
