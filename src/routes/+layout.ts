import { isAuthenticated, login } from '$lib/api/authApi';
import type { LayoutLoad } from './$types';

export const trailingSlash = 'always';
export const ssr = false;

const EMPTY = {};

export const load = (async ({ url }) => {
	const isBrowser = typeof window !== 'undefined';
	if (!isBrowser) return EMPTY;

	if (!(await isAuthenticated())) {
		console.log('Not authenticated');

		await login(url);
		return EMPTY;
	}

	return {};
}) satisfies LayoutLoad;
