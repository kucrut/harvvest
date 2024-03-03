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
					form_factor: 'narrow',
					label: 'Media Upload Screen',
					sizes: '350x738',
					src: 'images/screenshot-mobile.webp',
					type: 'image/webp',
				},
				{
					form_factor: 'wide',
					label: 'Media Upload Screen',
					sizes: '1280x807',
					src: 'images/screenshot-desktop.webp',
					type: 'image/webp',
				},
			],
			share_target: {
				action: '/?share-target',
				enctype: 'multipart/form-data',
				method: 'POST',
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
