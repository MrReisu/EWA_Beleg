import { getOrders } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const orders = await getOrders();
    return orders;
}) satisfies PageServerLoad;
