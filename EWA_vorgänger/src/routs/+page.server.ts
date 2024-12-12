import { getBooks } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const books = await getBooks();
    return { books };
}) satisfies PageServerLoad;