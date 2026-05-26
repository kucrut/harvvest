<script lang="ts">
	import type { Taxonomy_Terms_Option } from '$types';

	interface Props {
		taxonomy: Taxonomy_Terms_Option
	}

	const { taxonomy }: Props = $props();
</script>

<fieldset>
	<legend>{taxonomy.name}</legend>
	{#each taxonomy.terms as term ( `${ term.name }-${ term.id }` )}
		<label>
			<input name="{taxonomy.slug}[]" type="checkbox" value={term.id} />
			<span>{term.name}</span>
		</label>
	{/each}
</fieldset>
