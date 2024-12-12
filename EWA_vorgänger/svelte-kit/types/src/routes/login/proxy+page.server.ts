// @ts-nocheck
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

import { authStore } from '$lib/store';
import { authLogin } from '$lib/api';
import { log } from '$lib/util';

export const load = async () => {
    const user = get(authStore);
    if (user) {
        return redirect(307, '/admin');
    }

    return {};
};

export const actions = {
	default: async ({ request }: import('./$types').RequestEvent) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		const auth = await authLogin(username, password);

		if (!auth.success) {
			return fail(400, { incorrect: true });
		}
		if (!auth || !auth.authenticatedUser) {
			return fail(400, { failed: true });
		}

		authStore.set(auth.authenticatedUser)

        log(`API => Successfully authenticated user ${username}.`);

		return { success: true };
	}
};
;null as any as Actions;