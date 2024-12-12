import type { Actions } from '@sveltejs/kit';
import { authStore } from '$lib/store';

export const actions: Actions = {
    default: async () => {
        authStore.set(null);
        return { success: true };
    }
};