<script lang="ts">
	import { dateToFriendlyString } from '$lib/utils';
	import {
		batteryCountToFriendlyString,
		eventTypeToEmoji,
		type InventarItemEventBulk
	} from '../api/inventarItem';
	import InventarItemEventTypeBadge from './InventarItemEventTypeBadge.svelte';

	export let bulk: InventarItemEventBulk;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="text-xl flex flex-row items-center p-2 gap-2 bg-thw-50 border-thw-500 border-2 shadow-sm rounded-2xl transition-colors hover:cursor-pointer overflow-x-auto"
>
	<div class="text-2xl">
		{eventTypeToEmoji(bulk.eventType)}
	</div>
	<div class="flex flex-col gap-0 w-full">
		<div class="flex flex-row gap-2 justify-between w-full">
			<div class="text-nowrap text-sm">
				<span class="italic">
					{bulk.user.firstName ?? ''}
					{bulk.user.lastName ?? ''}
				</span>
				{' am '}
				<span>
					{dateToFriendlyString(new Date(bulk.date))}
				</span>
			</div>
			<InventarItemEventTypeBadge type={bulk.eventType} />
		</div>
		<ul class="pl-3 flex flex-col justify-start w-full text-sm text-gray-500 list-disc">
			<li>
				{batteryCountToFriendlyString(bulk.batteryCount)}
			</li>
			<li>
				{bulk.inventarItemEvents
					.map((event) => event.inventarItem.deviceId)
					.sort()
					.join(', ')}
			</li>
		</ul>
	</div>
</div>
