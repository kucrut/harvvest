/** @type {import('stylelint').Config} */
export default {
	extends: [
		'stylelint-config-standard',
		'@stylistic/stylelint-config',
	],
	ignoreFiles: [
		'.svelte-kit/**',
		'build/**',
		'data/**',
		'src/lib/styles/pico.slate.css',
	],
	rules: {
		'declaration-block-no-redundant-longhand-properties': null,
		'selector-pseudo-class-no-unknown': [ true, {
			'ignorePseudoClasses': [ 'global' ],
		} ],
		'selector-type-no-unknown': [ true, {
			'ignore': [ 'custom-elements' ],
		} ],
		'@stylistic/function-parentheses-space-inside': 'always',
		'@stylistic/indentation': 'tab',
		'@stylistic/media-feature-parentheses-space-inside': 'always',
		'@stylistic/string-quotes': 'single',
	},
	overrides: [
		{
			files: [ '**/*.html', '**/*.svelte' ],
			customSyntax: 'postcss-html',
		},
		{
			files: [ './src/app.html' ],
			rules: {
				'no-invalid-position-declaration': null,
			},
		},
	],
};
