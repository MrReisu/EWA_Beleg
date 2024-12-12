import type { Book, CartItem } from '$lib/api.types';
import { type RequestHandler } from '@sveltejs/kit';

import Stripe from 'stripe';
import { SECRET_STRIPE_KEY } from '$env/static/private';
import { createOrder, createOrderItem, isBookAvailable } from '$lib/api';


const stripe = new Stripe(SECRET_STRIPE_KEY);

export const POST: RequestHandler = async ({ request }) => {
	
	// Get cart items from request
	const data = await request.json();
	const cartItems: CartItem[] = data.items;

	// Check if all books are available
	let errors: number[] = [];
	await Promise.all(
		cartItems.map(async (cartItem) => {
			const isAvailable = await isBookAvailable(cartItem.book_id, cartItem.quantity);
			if(!isAvailable) {
				errors.push(cartItem.book_id);
				return;
			}
		})
	);

	// Return error if not all books are available
	if (errors.length > 0) {
		return new Response(JSON.stringify({ success: false, books: [...errors] }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Create order in database
	const order = await createOrder();

	// Create order items in database
	await Promise.all(
		cartItems.map(async (cartItem) => {
			const book: Book = {
				id: cartItem.book_id,
				attributes: cartItem.book_attributes
			};
			await createOrderItem(book, order.orderId, cartItem.quantity);
		})
	);

	// Parse items into Stripe format
	const lineItems = cartItems.map((CartItem) => {
		return {
			price_data: {
				currency: 'eur',
				product_data: {
					name: `${CartItem.book_attributes.title} - ${CartItem.book_attributes.author}`,
					images: []
				},
				unit_amount: Math.round(CartItem.book_attributes.price * 100) //in cent benötigt
			},
			quantity: CartItem.quantity
		};
	});

	// Create Stripe Checkout session
	const session = await stripe.checkout.sessions.create({
		line_items: lineItems,
		shipping_address_collection: {
			allowed_countries: ['DE', 'AT', 'CH']
		},
		mode: 'payment',
		success_url: `http://localhost:5173/checkout/${order.orderId}/success`,
		cancel_url: `http://localhost:5173/checkout/${order.orderId}/cancel`
	});

	return new Response(JSON.stringify({ success: true, url: session.url }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
