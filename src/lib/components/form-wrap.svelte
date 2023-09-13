<div class="gap-y-4 grid place-items-center mx-auto transition-[width] duration-200 w-full">
	<slot name="before" />
	<div class="card p-4 w-full text-token space-y-4">
		<slot/>
	</div>
	<slot name="after" />
</div>
