<script>
	import BookCard from '$lib/components/BookCard.svelte';
	import SlideLeftRight from '$lib/components/transitions/SlideLeftRight.svelte';

	export let data;
	$: books = data.books.books;
</script>

<svelte:head>
	<title>Katalog | Books4You</title>
</svelte:head>

<SlideLeftRight>
	<div class="row">
		<div class="col-12 mb-3">
			<h1><i class="fas fa-book"></i> Unser Katalog</h1>
		</div>
	</div>

	<div class="row">
		{#each books as book}
			<div class="col-md-3 p-2">
				<BookCard {book} />
			</div>
		{/each}
	</div>
</SlideLeftRight>
