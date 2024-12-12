import { redirect } from '@sveltejs/kit';
import { authStore } from '$lib/store';
import { get } from 'svelte/store';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    let authenticatedUser = get(authStore);

    if (!authenticatedUser) {
        throw redirect(308, '/login');
    }

    if (authenticatedUser.user.bookstore_role === 'ADMIN') {
        throw redirect(308, '/admin/inventory');
    }

    throw redirect(308, '/');
}) satisfies PageServerLoad;