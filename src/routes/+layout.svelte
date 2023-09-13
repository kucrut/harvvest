<script>
	import { page } from '$app/stores';
	import { AppShell } from '@skeletonlabs/skeleton';
	import '../app.postcss';
</script>


<AppShell>
    <nav slot="header">
        <!-- TODO: Don't show on login page. -->
        {#if ! $page.data.user}
            <a href="/login">Log In</a>
        {/if}

        {#if $page.data.user}
            <form action="/logout" method="POST">
                <button type="submit">Log Out</button>
            </form>
        {/if}
    </nav>

	<slot />
</AppShell>

