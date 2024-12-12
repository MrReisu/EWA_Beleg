import { getOrder, updateOrder } from '$lib/api';
import { log } from '$lib/util';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const orderId = parseInt(params.orderId);
    
    const order = await getOrder(orderId);
    if(!order || !order.order) {
        return redirect(307, "/checkout")
    }

    // Update the order status
    if(order.order.attributes.status === 'PENDING') {
        const updatedOrder = await updateOrder(orderId, { status: 'COMPLETE' });
    } else {
        return redirect(307, "/checkout")
    }

    return { success: true, order }
}) satisfies PageServerLoad;