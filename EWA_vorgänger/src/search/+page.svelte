<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { getBooks } from '$lib/api';
	import type { Books, Book } from '$lib/api.types';
	import BookCard from '$lib/components/BookCard.svelte';
	import SlideLeftRight from '$lib/components/transitions/SlideLeftRight.svelte';

	// get search term from url parameter
	const searchTerm = derived(page, ($page) => {
		const queryParam = new URL($page.url).searchParams.get('q');
		return queryParam ? queryParam.toLowerCase() : '';
	});

	let filteredBooks: Books = [];

	async function getAndFilterBooks() {
		const { success, books } = await getBooks();
		if (success) {
			filteredBooks = books.filter((book: Book) =>
				book.attributes.title.toLowerCase().includes($searchTerm.toLowerCase()) ||
				book.attributes.author.toLowerCase().includes($searchTerm.toLowerCase())
			);
		}
	}

	searchTerm.subscribe(() => {
		getAndFilterBooks();
	});
</script>

<svelte:head>
	<title>Suchergebnisse | Books4You</title>
</svelte:head>

<SlideLeftRight>
	<div class="row">
		<div class="col-12 mb-5">
			<h1><i class="fas fa-book"></i> Suchergebnisse für "{$searchTerm}"</h1>
		</div>
	</div>

	{#if filteredBooks.length > 0}
		<div class="row">
			{#each filteredBooks as book}
				<div class="col-md-3 p-2">
					<BookCard {book} />
				</div>
			{/each}
		</div>
	{:else}
		<div class="col-12">
			<p>Keine Ergebnisse für "{$searchTerm}"</p>
		</div>
	{/if}
</SlideLeftRight>
