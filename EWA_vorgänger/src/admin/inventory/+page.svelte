<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import type { Book } from '$lib/api.types';
	import { updateBookQuantity } from '$lib/api';
	import SlideLeftRight from '$lib/components/transitions/SlideLeftRight.svelte';

	export let data: PageData;
	let books: Book[] = [];
	$: books = data.books;

	let editingBook: Book | null = null;
	let editedQuantity = 0;

	function editBook(book: Book) {
		// enter editing mode
		editingBook = book;
		editedQuantity = book.attributes.quantity;
	}

	async function saveChanges() {
		if (editingBook) {
			await updateBookQuantity(editingBook.id, editedQuantity);

			const updatedBooks = books.map((book) => {
				if (book.id === editingBook?.id) {
					return { ...book, attributes: { ...book.attributes, quantity: editedQuantity } };
				}
				return book;
			});
			books = updatedBooks;

			// exit editing mode
			editingBook = null;
		}
	}
</script>

<svelte:head>
	<title>Lagerbestand | Books4You</title>
</svelte:head>

<SlideLeftRight>
	<div class="container">
		<h1>Lagerbestand</h1>

		<table class="table">
			<thead>
				<tr>
					<th>Buchtitel</th>
					<th>ISBN</th>
					<th>Quantität</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each books as book}
					<tr>
						<td>{book.attributes.title}</td>
						<td>{book.attributes.isbn}</td>
						<td>
							{#if editingBook === book}
								<!-- editing mode -->
								<input type="number" bind:value={editedQuantity} />
							{:else}
								{book.attributes.quantity}
							{/if}
						</td>
						<td>
							{#if editingBook === book}
								<!-- editing mode -->
								<button class="btn btn-primary" on:click={saveChanges}>Speichern</button>
							{:else}
								<button class="btn btn-secondary" on:click={() => editBook(book)}>Bearbeiten</button
								>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</SlideLeftRight>
