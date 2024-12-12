export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14')
];

export const server_loads = [0];

export const dictionary = {
		"/": [~3],
		"/admin": [~4,[2]],
		"/admin/inventory": [~5,[2]],
		"/admin/orders": [~6,[2]],
		"/book/[id]": [~7],
		"/checkout": [8],
		"/checkout/[orderId]/cancel": [~9],
		"/checkout/[orderId]/success": [~10],
		"/login": [~11],
		"/logout": [~12],
		"/search": [13],
		"/shopping-cart": [14]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';