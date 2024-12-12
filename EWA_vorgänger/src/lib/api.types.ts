/* =================== AUTH =================== */

export interface User {
	id: number;
	username: string;
	email: string;
	provider: string;
	confirmed: boolean;
	blocked: boolean;
	bookstore_role: string;
	address: string;
	zipcode: string;
	city: string;
	country: string;
	createdAt: string;
	updatedAt: string;
}
export interface AuthenticatedUser {
	jwt: string;
	user: User;
}

/* =================== BOOKS =================== */

export type Book = {
	id: number;
	attributes: {
		title: string;
		author: string;
		abstract: string;
		quantity: number;
		price: number;
		cover_url: string | null;
		isbn: string | null;
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
	};
};
export type Books = Book[];

/* =================== SHOPPING CART =================== */

export type CartItem = {
	book_id: number;
	book_attributes: Book['attributes'];
	quantity: number;
};

/* =================== ORDERS =================== */

export type Order = {
    detailsVisible: boolean;
    id: number;
    attributes: {
        status: string;
        createdAt: string;
        updatedAt: string;
        order_items: OrderItem[];
    };
};

export type OrderItem = {
    book: Book;
    quantity: number;
};

export type Orders = Order[];