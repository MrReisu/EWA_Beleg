<script>
	import SlideLeftRight from '$lib/components/transitions/SlideLeftRight.svelte';

	export let data;
	$: book = data.book.book;
</script>

<svelte:head>
	<title>{book.attributes.title} | Books4You</title>
</svelte:head>

<SlideLeftRight>
	<div class="row mb-3">
		<div class="col-12">
			<h1>
				<i class="fa-solid fa-circle-info"></i> 
				Informationen zu {book.attributes.title}
			</h1>
		</div>
	</div>

	<div class="row mb-5">
		<div class="col-md-4">
			<img src={book.attributes?.cover_url} alt="Book Cover" class="img-fluid" />
		</div>
		<div class="col-md-8">
			<h2>{book.attributes.title}</h2>
			<p>Author: {book.attributes.author}</p>
			<p>Preis: {book.attributes.price} €</p>
			<p>Im Lager: {book.attributes.quantity}</p>
			<p>ISBN: {book.attributes.isbn}</p>
			<p class="pt-3">{book.attributes.abstract}</p>
		</div>
	</div>

	<div class="row">
		<a class="btn btn-primary w-100" href="/">
			<i class="fa-solid fa-arrow-rotate-left"></i> Zurück zum Katalog
		</a>
	</div>
</SlideLeftRight>
