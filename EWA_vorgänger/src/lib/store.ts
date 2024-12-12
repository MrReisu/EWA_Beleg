import { writable } from 'svelte/store';
import type { AuthenticatedUser, CartItem } from './api.types';

export const authStore = writable<AuthenticatedUser | null>(null);
export const cartStore = writable<CartItem[]>([]);
