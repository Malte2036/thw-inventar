<script>
	import LinkButton from '$lib/LinkButton.svelte';
</script>

<div class="flex flex-col gap-12 pt-6 p-2">
	<h1 class="text-4xl font-bold text-center italic">OV Düsseldorf</h1>
	<div class="flex flex-col gap-8">
		<div class="flex flex-col gap-2">
			<div>
				<span class="font-bold">"Funkgeräte"</span> ist ein Modul, das die Verwaltung von Funkgeräten
				und Funkgeräte-Ereignissen ermöglicht.
			</div>

			<LinkButton url="/funk">Funkgeräte</LinkButton>
		</div>

		<div class="flex flex-col gap-2">
			<div>
				<span class="font-bold">"Inventar"</span> ist ein Modul, das es ermöglicht, inventarisierte Gerätschaftes
				OV's zu scannen und Informationen zu diesen zu erhalten.
			</div>
			<LinkButton url="/inventar">Inventar</LinkButton>
		</div>
	</div>
</div>
