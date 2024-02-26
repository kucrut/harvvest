<script>
	import { page } from '$app/stores';

	/** @type {() => void } */
	export let close;
	export let is_open = false;
</script>

<aside class:is-open={is_open}>
	<button on:click={close}>Close</button>
	<nav>
		<h1>Photo Harvest</h1>
		<ul>
			<li>
				<a href="https://gitlab.com/kucrut/photo-harvest">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="24" width="24" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zm4.03 6.28a.75.75 0 00-1.06-1.06L4.97 9.47a.75.75 0 000 1.06l2.25 2.25a.75.75 0 001.06-1.06L6.56 10l1.72-1.72zm4.5-1.06a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z"
							clip-rule="evenodd"
						/>
					</svg>
					<span>Source Code</span>
				</a>
			</li>
		</ul>
	</nav>

	{#if $page.data.user}
		<div class="user-info">
			<img alt="User avatar" src={$page.data.user.avatar_url} />
			<span>{$page.data.user.name}</span>
			<a href={$page.data.user.wp_url} target="_blank">{$page.data.user.wp_url}</a>
			<form action="/logout" method="POST">
				<button type="submit">Log Out</button>
			</form>
		</div>
	{/if}
</aside>

<style lang="scss">
	aside {
		position: fixed;
		inset: 0;
		block-size: 100dvh;
		max-inline-size: unset;
		inline-size: min( 35ch, 100vw );
		padding: var( --pico-spacing );
		background-color: var( --pico-background-color );
		display: grid;
		transform: translate3d( -100%, 0, 0 );
		transition: transform 0.5s;

		&.is-open {
			transform: translateZ( 0 );
		}
	}

	h1 {
		font-size: 1.25rem;
	}

	.user-info {
		block-size: fit-content;
		align-self: self-end;
		display: grid;
		column-gap: var( --pico-spacing );
		grid-template-columns: max-content 1fr;
	}

	img {
		width: 48px;
		grid-row: 1/3;
		border-radius: var( --pico-border-radius );
	}

	form {
		margin-block-start: var( --pico-spacing );
		grid-column: 1/3;
	}
</style>
