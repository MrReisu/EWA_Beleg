import { deleteOrderItemsFromOrder, getOrder, updateOrder } from '$lib/api';
import { log } from '$lib/util';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const orderId = parseInt(params.orderId);
    
    const order = await getOrder(orderId);
    if(!order || !order.order) {
        return redirect(307, "/checkout")
    }

    // Remove all order items from order
    const response = await deleteOrderItemsFromOrder(orderId);
    log('deleteOrderItemsFromOrder', response);

    // Update the order status
    if(order.order.attributes.status === 'PENDING') {
        await updateOrder(orderId, { status: 'FAILED' });
    } else {
        return redirect(307, "/checkout")
    }

    return { success: true, order }
}) satisfies PageServerLoad;