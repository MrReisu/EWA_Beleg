import { authStore } from '$lib/store';
import { get } from 'svelte/store';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	let authenticatedUser = null;

	// Get the user and jwt from the store
	authenticatedUser = get(authStore);

	return { authenticatedUser };
}) satisfies LayoutServerLoad;
