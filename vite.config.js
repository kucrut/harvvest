import { defineConfig } from 'vite';
import { parse } from 'node-html-parser';
import { sveltekit } from '@sveltejs/kit/vite';
import { readFileSync, writeFileSync } from 'node:fs';

/** @return {import('vite').Plugin} Vite plugin. */
function svg_sprite() {
	const icon_names = [ 'code', 'file-video', 'menu', 'tent', 'wifi-off', 'x' ];
	const source_dir = 'node_modules/lucide-static/icons';
	const target_file = 'src/lib/components/sprite.svelte';

	return {
		name: 'dz-svg-sprite',

		configResolved( config ) {
			const html = icon_names
				.map( name => {
					const content = readFileSync( `${ source_dir }/${ name }.svg`, { encoding: 'utf-8' } );
					const parsed = parse( content );
					const svg_content = parsed.querySelector( 'svg' )?.removeWhitespace().childNodes.join( '' );
					return svg_content ? `<symbol id="icon-${ name }">${ svg_content }</symbol>` : '';
				} )
				.join( '' );

			if ( ! html ) {
				return;
			}

			const sprite = `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1"><defs>${ html }</defs></svg>`;

			writeFileSync( `${ config.root }/${ target_file }`, sprite, { encoding: 'utf-8' } );
		},
	};
}

export default defineConfig( {
	plugins: [ sveltekit(), svg_sprite() ],

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;',
			},
		},
	},
} );
