import { defineConfig } from 'eslint/config';
import configs from '@kucrut/eslint-config';
import globals from 'globals';
import html from '@html-eslint/eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import svelte_config from './svelte.config.js';
import svelte_plugin from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

/** @type {import('eslint/config').Config} */
const base_js = {
	extends: [
		configs.js,
		ts.configs.recommended,
		jsdoc.configs[ 'flat/recommended-mixed' ],
		jsdoc.configs[ 'flat/logical-typescript-error' ],
		jsdoc.configs[ 'flat/stylistic-typescript-error' ],
	],
	files: [
		'**/*.cjs',
		'**/*.js',
		'**/*.mjs',
		'**/*.ts',
	],
	ignores: [
		'**/*.html',
		'**/*.json',
		'**/*.md',
		'**/*.svelte',
		'**/*.svelte.js',
		'**/*.svelte.ts',
	],
	languageOptions: {
		globals: {
			...globals.browser,
		},
	},
	rules: {
		'jsdoc/tag-lines': [ 'error', 'any', { startLines: 1 } ],
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				args: 'all',
				argsIgnorePattern: '^_',
				caughtErrors: 'all',
				caughtErrorsIgnorePattern: '^_',
				destructuredArrayIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				ignoreRestSiblings: true,
			},
		],
	},
};

/** @type {import('eslint/config').Config} */
const base_json = {
	plugins: { json },
	extends: [ 'json/recommended' ],
};

export default defineConfig( [
	{
		ignores: [
			'.svelte-kit/**',
			'build/**',
			'data/**',
		],
	},
	{
		...base_js,
		name: 'JS/TS (General)',
	},
	{
		...base_js,
		name: 'JS/TS (Server only)',
		files: [
			'src/lib/server/**/*.js',
			'src/lib/server/**/*.ts',
		],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	{
		extends: [
			...base_js.extends,
			configs.svelte,
			svelte_plugin.configs.recommended,
		],
		name: 'Svelte',
		files: [
			'*.svelte.js',
			'*.svelte.ts',
			'*.svelte',
			'**/*.svelte.js',
			'**/*.svelte.ts',
			'**/*.svelte',
		],
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				extraFileExtensions: [ '.svelte' ],
				parser: ts.parser,
				projectService: true,
				svelteConfig: svelte_config,
			},
		},
		plugins: {
			svelte: svelte_plugin,
		},
		rules: base_js.rules,
	},
	{
		...base_js,
		name: 'Svelte & Vite configs',
		files: [ 'svelte.config.js', 'vite.config.js' ],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	{
		...base_json,
		name: 'JSON',
		files: [ '**/*.json' ],
		ignores: [ 'package-lock.json', 'pnpm-lock.json' ],
		language: 'json/json',
	},
	{
		...base_json,
		name: 'JSON5',
		files: [ '**/*.json5' ],
		language: 'json/json5',
	},
	{
		...base_json,
		name: 'JSONC',
		files: [ '**/*.jsonc', 'tsconfig.json', '.vscode/*.json', '.zed/*.json' ],
		language: 'json/jsonc',
		languageOptions: {
			allowTrailingCommas: true,
		},
	},
	{
		name: 'HTML',
		extends: [ html.configs[ 'flat/recommended' ] ],
		files: [ '**/*.html' ],
		rules: {
			...html.configs[ 'flat/recommended' ].rules,
			'@html-eslint/element-newline': 'off',
			'@html-eslint/indent': [ 'error', 'tab' ],
			'@html-eslint/no-extra-spacing-attrs': [ 'error', {
				enforceBeforeSelfClose: true,
			} ],
			'@html-eslint/no-extra-spacing-tags': 'off',
			'@html-eslint/require-title': 'off',
			'@html-eslint/require-closing-tags': [ 'error', {
				selfClosing: 'always',
			} ],
			'@html-eslint/use-baseline': 'off',
		},
	},
	{
		name: 'Markdown',
		extends: [ markdown.configs.processor ],
		ignores: [ 'project.inlang/*.md' ],
	},
] );
