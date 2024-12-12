import axios, {  AxiosError } from 'axios';
import { PUBLIC_STRAPI_API_TOKEN } from '$env/static/public';
import { log } from '$lib/util';
import { type Book } from '$lib/api.types';


const baseURL: string = 'http://127.0.0.1:1337/api';

const headers = {
	Authorization: `Bearer ${PUBLIC_STRAPI_API_TOKEN}`,
	'Content-Type': 'application/json'
};

/* ====================================================== */
/* ===== Auth Operations =====  */
/* ====================================================== */

export async function authLogin(username: string, password: string) {
	try {
		const body = {
			identifier: username,
			password: password
		};

		const response = await axios.post(`${baseURL}/auth/local`, body, { headers });

		const authenticatedUser = response.data;

		return { success: true, authenticatedUser };
	} catch (error) {
		const axiosError = error as AxiosError<any>;

		if (axiosError && axiosError?.response?.status === 400) {
			log(`API => Error authenticating user ${username}: Invalid Credentials`);
			return { success: false, error: axiosError?.response?.data?.error?.message };
		} else {
			log(`API => Error authenticating user ${username}: Unknown Error`);
			return { success: false, error: axiosError?.message || 'Unknown error' };
		}
	}
}

/* ====================================================== */
/* ===== Book Operations =====  */
/* ====================================================== */

export async function getBooks() {
	try {
		const response = await axios.get(`${baseURL}/bookstore-books`, { headers });

		if (response.status !== 200) {
			log(`API => Error fetching bookstore-books: Bad Request`);
			throw new Error(response.data?.error);
		}

		const books = response.data?.data;

		return { success: true, books };
	} catch (error) {
		log(`API => Error fetching bookstore-books: Unknown Error`);
		throw new Error(String(error));
	}
}

export async function getBook(id: number) {
	try {
		const response = await axios.get(`${baseURL}/bookstore-books/${id}`, { headers });

		if (response.status !== 200) {
			log(`API => Error fetching bookstore-book with id ${id}: Bad Request`);
			throw new Error(response.data?.error);
		}

		const book = response.data?.data;

		return { success: true, book };
	} catch (error) {
		log(`API => Error fetching bookstore-book with id ${id}: Unknown Error`);
		throw new Error(String(error));
	}
}

export async function updateBookQuantity(id: number, newQuantity: number) {
    try {
        const response = await axios.put(`${baseURL}/bookstore-books/${id}`, {
            data: {
                quantity: newQuantity
            }
        }, { headers });

        if (response.status !== 200) {
            log(`API => Error updating bookstore-book with id ${id}: Bad Request`);
            throw new Error(response.data?.error);
        }

        return { success: true };
    } catch (error) {
        log(`API => Error updating bookstore-book with id ${id}: Unknown Error`);
        throw new Error(String(error));
    }
}

/* ====================================================== */
/* ===== Order Operations =====  */
/* ====================================================== */
/* ===== READ =====  */
/* ====================================================== */

export async function getOrders() {
	try {
		const response = await axios.get(`${baseURL}/bookstore-orders`, { headers });
		//const response = await axios.get(`${baseURL}/bookstore-orders?populate=*`, { headers });

		if (response.status !== 200) {
			log(`API => Error fetching bookstore-orders: Bad Request`);
			throw new Error(response.data?.error);
		}

		const orders = response.data?.data;

		return { success: true, orders };
	} catch (error) {
		log(`API => Error fetching bookstore-orders: Unknown Error`);
		throw new Error(String(error));
	}
}

export async function getOrder(orderId: number) {
	try {
		const response = await axios.get(`${baseURL}/bookstore-orders/${orderId}`, { headers });

		if (response.status !== 200) {
			log(`API => Error fetching bookstore-order with id ${orderId}: Bad Request`);
			throw new Error(response.data?.error);
		}

		const order = response.data?.data;

		return { success: true, order };
	} catch (error) {
		log(`API => Error fetching bookstore-order with id ${orderId}: Unknown Error`);
		return { success: false, error };
	}
}

export async function getOrderDetails(orderId: number) {
	try {
		const response = await axios.get(`${baseURL}/bookstore-orders/${orderId}?populate=*`, { headers });
		if (response.status === 200) {
			return { success: true, attributes: response.data.attributes };
		} else {
			console.error('Fehler beim Abrufen der Bestelldetails');
		}
	} catch (error) {
		console.error('Fehler beim Abrufen der Bestelldetails:', error);
	}
}

export async function isBookAvailable(bookId: number, quantity: number) : Promise<boolean> {
	try {
		const response = await axios.get(`${baseURL}/bookstore-books/${bookId}`, { headers });

		if (response.status !== 200) {
			log(`API => Error fetching bookstore-book with id ${bookId}: Bad Request`);
			throw new Error(response.data?.error);
		}

		const book: Book = response.data?.data;
		if (quantity > book.attributes.quantity) {
			return false;
		}
		return true;
		
	} catch (error) {
		log(`API => Error fetching bookstore-book with id ${bookId}: Unknown Error`);
		throw new Error(String(error));
	}
}

/* ====================================================== */
/* ===== CREATE =====  */
/* ====================================================== */

export async function createOrder() {
	try {
		const body = {
			data: {}
		};
		const response = await axios.post(`${baseURL}/bookstore-orders`, body, { headers });

		if (response.status !== 200) {
			log(`API => Error creating bookstore-order: Bad Request`);
			throw new Error(response.data?.error);
		}

		const orderId = response.data?.data?.id;

		return { success: true, orderId };
	} catch (error) {
		log(`API => Error creating bookstore-order: Unknown Error`);
		throw new Error(String(error));
	}
}

export async function createOrderItem(book: Book, orderId: number, quantity: number) {
	try {
		const body = {
			data: {
				book: book.id,
				order: orderId,
				quantity: quantity
			}
		};
		const response = await axios.post(`${baseURL}/bookstore-order-items`, body, { headers });

		if (response.status !== 200) {
			log(`API => Error creating bookstore-order-item for order ${orderId}: Bad Request`);
			throw new Error(response.data?.error);
		}

		const orderItemId = response.data?.id;

		return { success: true, book };
	} catch (error) {
		const axiosError = error as AxiosError<any>;

		if (axiosError && axiosError?.response?.status === 422) {
			log(`API => Error creating bookstore-order-item for order ${orderId}: Insufficient Inventory`);
			return { success: false, error: "Insufficient Inventory", bookId: book.id };
		} else {
			log(`API => Error creating bookstore-order-item for order ${orderId}: Unknown Error`);
			return { success: false, error: axiosError?.message, bookId: book.id };
		}
	}
}

/* ====================================================== */
/* ===== UPDATE =====  */
/* ====================================================== */

export async function updateOrder(orderId: number, data: any) {
	try {
		const body = {
			data: data
		};
		const response = await axios.put(`${baseURL}/bookstore-orders/${orderId}`, body, { headers });

		if (response.status !== 200) {
			log(`API => Error updating bookstore-order with id ${orderId}: Bad Request`);
			throw new Error(response.data?.error);
		}

		const updatedOrder = response.data?.data;

		return { success: true, updatedOrder };
	} catch (error) {
		log(`API => Error updating bookstore-order with id ${orderId}: Unknown Error`);
		throw new Error(String(error));
	}
}

/* ====================================================== */
/* ===== MIXED =====  */
/* ====================================================== */

export async function deleteOrderItemsFromOrder(orderId: number) {
	try {
		const response = await axios.get(`${baseURL}/bookstore-orders?populate=*`, { headers });

		if (response.status !== 200) {
			log(`API => Error fetching bookstore-order-items from order ${orderId}: Bad Request`);
			throw new Error(response.data?.error);
		}

		// Get order items from order
		const orders = response.data?.data;
		const order = orders.find((order: any) => order.id === orderId);
		
		// Get order item ids
		let orderItemIds: number[] = [];
		for (const orderItem of order.attributes.order_items.data) {
			orderItemIds.push(orderItem.id);
		}

		// Delete order items
		await Promise.all(
			orderItemIds.map(async (orderItemId) => {
				await axios.delete(`${baseURL}/bookstore-order-items/${orderItemId}`, { headers });
			})
		);

		return { success: true, order };
	} catch (error) {
		log(`API => Error fetching bookstore-order-items from order ${orderId}: Unknown Error`);
		throw new Error(String(error));
	}
}
