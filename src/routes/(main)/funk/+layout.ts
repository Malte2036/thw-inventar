import { getFunkItemEventBulks, getFunkItems } from '$lib/api/funkApi';
import { userToFriendlyString } from '$lib/api/funkModels';
import { getOrganisationForUser } from '$lib/api/organisationApi';
import { getLastFunkItemEventByFunkItemInternalId } from '$lib/shared/stores/funkStore';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load = (async () => {
	return {
		organisation: getOrganisationForUser().then((org) => {
			org.members.sort((a, b) => userToFriendlyString(a).localeCompare(userToFriendlyString(b)));
			return org;
		}),
		funkData: Promise.all([getFunkItems(), getFunkItemEventBulks()]).then(([items, bulks]) => {
			return {
				funkItems: items
					.map((item) => ({
						item: item,
						lastEvent: getLastFunkItemEventByFunkItemInternalId(
							{ funkItems: items, funkItemEventBulks: bulks },
							item._id
						)
					}))
					.sort((a, b) => {
						const dateA = a.lastEvent ? new Date(a.lastEvent.date).getTime() : 0;
						const dateB = b.lastEvent ? new Date(b.lastEvent.date).getTime() : 0;
						return dateB - dateA;
					})
					.map((item) => item.item),
				funkItemEventBulks: bulks.sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
				)
			};
		})
	};
}) satisfies LayoutLoad;