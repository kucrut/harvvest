import { env } from '$env/dynamic/private';

export function GET() {
	return new Response(
		JSON.stringify( {
			background_color: 'rgb(251, 252, 252)',
			display: 'fullscreen',
			id: '/',
			name: env.APP_NAME,
			short_name: env.APP_NAME,
			start_url: '/',
			theme_color: 'rgb(251, 252, 252)',
			icons: [
				{
					src: 'images/icon-192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: 'images/icon-512.png',
					sizes: '512x512',
					type: 'image/png',
				},
			],
			screenshots: [
				{
					form_factor: 'narrow',
					label: 'Media Upload Screen',
					sizes: '350x758',
					src: 'images/ss-upload-mobile.webp',
					type: 'image/webp',
				},
				{
					form_factor: 'wide',
					label: 'Media Upload Screen',
					sizes: '1280x807',
					src: 'images/ss-upload-desktop.webp',
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
