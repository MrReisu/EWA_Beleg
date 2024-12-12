
import { getBook } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const bookId = parseInt(params.id);
    const book = await getBook(bookId);
    return { success: true, book }
}) satisfies PageServerLoad;
