// @ts-nocheck
import type { Actions } from '@sveltejs/kit';
import { authStore } from '$lib/store';

export const actions = {
    default: async () => {
        authStore.set(null);
        return { success: true };
    }
};;null as any as Actions;