import { defineConfig } from 'vite';
import { parse } from 'node-html-parser';
import { sveltekit } from '@sveltejs/kit/vite';
import { readFileSync, writeFileSync } from 'node:fs';

/** @return {import('vite').Plugin} Vite plugin. */
function svg_sprite() {
	const excluded_attributes = [ 'class', 'height', 'width', 'xmlns' ];
	const icon_names = [ 'code', 'file-video', 'menu', 'tent', 'wifi-off', 'x' ];
	const source_dir = 'node_modules/lucide-static/icons';
	const target_file = 'src/lib/components/sprite.svelte';

	/**
	 * Translate svg attributes to symbol attributes
	 *
	 * @param {string[]} Attribute pair.
	 * @return {string} Translated attribute pair.
	 */
	const attributes = ( [ key, value ] ) => {
		if ( excluded_attributes.includes( key ) ) {
			return '';
		}

		if ( key === 'stroke-width' ) {
			return 'stroke-width="1"';
		}

		return `${ key }="${ value }"`;
	};

	return {
		name: 'dz-svg-sprite',

		configResolved( config ) {
			const html = icon_names
				.map( name => {
					const content = readFileSync( `${ source_dir }/${ name }.svg`, { encoding: 'utf-8' } );
					const parsed = parse( content );
					const svg = parsed.querySelector( 'svg' );

					if ( ! svg ) {
						return '';
					}

					const children = svg.removeWhitespace().childNodes.join( '' );

					if ( ! children ) {
						return '';
					}

					const attrs = Object.entries( svg.attributes ).map( attributes ).join( ' ' );

					return `<symbol id="icon-${ name }" ${ attrs }>${ children }</symbol>`;
				} )
				.join( '' );

			if ( ! html ) {
				return;
			}

			writeFileSync( `${ config.root }/${ target_file }`, `<svg>${ html }</svg>`, { encoding: 'utf-8' } );
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
