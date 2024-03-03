import { env } from '$env/dynamic/private';

export function GET() {
	return new Response(
		JSON.stringify( {
			background_color: '#faf8fc',
			display: 'fullscreen',
			id: '/',
			name: env.APP_NAME,
			short_name: env.APP_NAME,
			start_url: '/',
			theme_color: '#f2eef7',
			icons: [
				{
					src: 'images/svelte-android-chrome-192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: 'images/svelte-android-chrome-512.png',
					sizes: '512x512',
					type: 'image/png',
				},
			],
			screenshots: [
				{
					src: 'images/screenshot-mobile.webp',
					sizes: '350x738',
					type: 'image/webp',
					form_factor: 'narrow',
					label: 'Media Upload Screen',
				},
				{
					src: 'images/screenshot-desktop.webp',
					sizes: '1280x807',
					type: 'image/webp',
					form_factor: 'wide',
					label: 'Media Upload Screen',
				},
			],
			share_target: {
				action: '/?share-target',
				method: 'POST',
				enctype: 'multipart/form-data',
				params: {
					files: [
						{
							name: 'file',
							accept: [ 'image/*', 'video/*' ],
						},
					],
				},
			},
		} ),
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);
}
