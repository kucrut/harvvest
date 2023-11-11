<script>
	/** @type {import("$types").Taxonomy_Terms_Option} */
	export let taxonomy;
</script>

<div class="label">
	<span>{taxonomy.name}</span>
	<div class="flex gap-4">
		<!-- eslint-disable-next-line space-in-parens -->
		{#each taxonomy.terms as term (`${ term.name }-${ term.id }`)}
			<label class="flex items-center space-x-2">
				<input class="checkbox" name="{taxonomy.slug}[]" type="checkbox" value={term.id} />
				<p>{term.name}</p>
			</label>
		{/each}
	</div>
</div>
