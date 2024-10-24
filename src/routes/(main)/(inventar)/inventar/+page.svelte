<script lang="ts">
	import type { InventoryItem } from '$lib/api/inventoryModels';
	import Button from '$lib/Button.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import ErrorDisplay from '$lib/ErrorDisplay.svelte';
	import ManuelDeviceIdInput from '$lib/funk/ManuelDeviceIdInput.svelte';
	import QrScanner from '$lib/funk/QRScanner.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import { getInventoryItemByInventarNummer, inventory } from '$lib/shared/stores/inventoryStore';

	let inventoryItem: InventoryItem | undefined = $state();

	const onScan = (decodedText: string) => {
		inventoryItem = getInventoryItemByInventarNummer($inventory, decodedText);
		if (!inventoryItem) {
			$bannerMessage = {
				message: 'Inventar Item nicht gefunden',
				type: 'error',
				autoDismiss: {
					duration: 5000
				}
			};
		}
	};

	const getEinheiten = () => {
		return new Set<string>($inventory.inventoryItems?.map((item) => item.einheit));
	};
</script>

<div class="p-2 flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-bold">Inventar</h1>
		<p class="text-lg">
			Scanne den QR-Code oder gib die Inventar-Nummer manuell ein, um Informationen zu einem
			Inventar-Item im OV zu erhalten.
		</p>
	</div>

	<div class="flex flex-col gap-2">
		{#await $inventory.fetching}
			<LoadingSpinner />
		{:then}
			{#if $inventory.inventoryItems?.length === 0}
				<p class="text-lg text-gray-500">Es sind noch keine Inventar-Items im System erfasst.</p>
			{:else}
				<div class="text-lg text-gray-500">
					Es sind bereits {$inventory.inventoryItems?.length} Inventar-Items im System der folgenden
					Einheiten erfasst:

					<ul class="list-disc list-inside pl-2">
						{#each Array.from(getEinheiten()) as einheit}
							<li>{einheit}</li>
						{/each}
					</ul>
				</div>
			{/if}
		{:catch error}
			<div class="p-2">
				<ErrorDisplay label="Inventar-Items konnten nicht geladen werden" {error} />
			</div>
		{/await}
	</div>
</div>

{#if inventoryItem === undefined}
	<div class="flex flex-col gap-2 p-2">
		<QrScanner {onScan} />
		<ManuelDeviceIdInput {onScan} />
	</div>
{:else}
	<Dialog title="Inventar-Details">
		<div slot="content" class="flex flex-col gap-2">
			<div>
				<span class="font-bold">Inventar-Nummer:</span>
				<span>{inventoryItem.inventarNummer}</span>
			</div>
			<div>
				<span class="font-bold">Sach-Nummer:</span>
				<span>{inventoryItem.sachNummer}</span>
			</div>
			<div>
				<span class="font-bold">Ebene:</span>
				<span>{inventoryItem.ebene}</span>
			</div>
			<div>
				<span class="font-bold">Einheit:</span>
				<span>{inventoryItem.einheit}</span>
			</div>
			{#if inventoryItem.art}
				<div>
					<span class="font-bold">Art:</span>
					<span>{inventoryItem.art}</span>
				</div>
			{/if}
			<div>
				<span class="font-bold">Ausstattung:</span>
				<span>{inventoryItem.ausstattung}</span>
			</div>
			{#if inventoryItem.hersteller}
				<div>
					<span class="font-bold">Hersteller:</span>
					<span>{inventoryItem.hersteller}</span>
				</div>
			{/if}
			{#if inventoryItem.typ}
				<div>
					<span class="font-bold">Typ:</span>
					<span>{inventoryItem.typ}</span>
				</div>
			{/if}
			{#if inventoryItem.gerateNummer}
				<div>
					<span class="font-bold">Geräte-Nummer:</span>
					<span>{inventoryItem.gerateNummer}</span>
				</div>
			{/if}
		</div>
		<div slot="footer">
			<Button click={() => (inventoryItem = undefined)}>Schließen</Button>
		</div></Dialog
	>
{/if}
