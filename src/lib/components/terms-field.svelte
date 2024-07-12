<script>
	/** @type {{ taxonomy: import('$types').Taxonomy_Terms_Option }} */
	const { taxonomy } = $props();
</script>

<fieldset>
	<legend>{taxonomy.name}</legend>
	<!-- eslint-disable-next-line space-in-parens -->
	{#each taxonomy.terms as term ( `${ term.name }-${ term.id }` )}
		<label>
			<input name="{taxonomy.slug}[]" type="checkbox" value={term.id} />
			<span>{term.name}</span>
		</label>
	{/each}
</fieldset>
