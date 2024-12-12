<script lang="ts">
	import SlideLeftRight from '$lib/components/transitions/SlideLeftRight.svelte';

	import { cartStore } from '$lib/store';
	import type { CartItem } from '$lib/api.types';
	import { onMount } from 'svelte';

	let cartItems: CartItem[] = [];
	let quantityError: boolean = false;
	let quantityErrorText: string;

	onMount(() => {
		// Load cart from localStorage
		const savedCart = localStorage.shoppingCart;
		if (savedCart && savedCart.length > 0 && savedCart !== 'undefined') {
			cartItems = JSON.parse(savedCart);
			cartStore.set(cartItems);
		}
	});

	async function checkout() {
		const data = await fetch('/checkout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				items: cartItems
			})
		}).then((data) => data.json());

		if (data && !data.success && data.books.length > 0) {
			const bookList = data.books.join(', ');
			quantityErrorText =
				data.books.length === 1
					? `Das Buch mit der Nummer ${bookList} ist nicht mehr in dieser Anzahl verfügbar.`
					: `Die Bücher mit den Nummern ${bookList} sind nicht in dieser Anzahl mehr verfügbar.`;
			quantityError = true;
			return;
		}
		quantityError = false;

		window.location.replace(data.url);
	}

	let totalQuantity: number;
	let totalPrice: number;
	$: {
		totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
		totalPrice = cartItems.reduce(
			(total, item) => total + item.quantity * item.book_attributes.price,
			0
		);
	}

	let isAgbAccepted = false;
	let showAgbModal = false;
	function toggleAgbModal() {
		showAgbModal = !showAgbModal;
	}
</script>

<svelte:head>
	<title>Zusammenfassung | Books4You</title>
</svelte:head>

<SlideLeftRight>
	<div class="row">
		<div class="col-12 mb-5">
			<h1><i class="fa-solid fa-money-check-dollar"></i> Zusammenfassung deiner Bestellung</h1>

			<div class="row">
				<table class="table">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Titel</th>
							<th scope="col">Autor</th>
							<th scope="col">Preis</th>
							<th scope="col">Anzahl</th>
							<th scope="col"></th>
						</tr>
					</thead>
					<tbody>
						{#each cartItems as item (item.book_id)}
							<tr class="table-row">
								<th scope="row">{item.book_id}</th>
								<td>{item.book_attributes.title}</td>
								<td>{item.book_attributes.author}</td>
								<td>{item.book_attributes.price} €</td>
								<td>{item.quantity}</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr class="table-row">
							<td></td>
							<td colspan="2"><b>Gesamt</b></td>
							<td><b>{totalPrice.toFixed(2)} €</b></td>
							<td><b>{totalQuantity}</b></td>
						</tr>
					</tfoot>
				</table>
			</div>

			<div class="row mb-3">
				<label>
					<input type="checkbox" bind:checked={isAgbAccepted} />
					Ich akzeptiere die
					<a href="#" on:click|preventDefault={toggleAgbModal}>Allgemeinen Geschäftsbedingungen</a>
				</label>
			</div>

			{#if showAgbModal}
				<div class="agb-modal-overlay">
					<div class="agb-modal-content">
						<h2>Allgemeinen Geschäftsbedingungen</h2>
						<div class="agb-text-container">
							<p>
								Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
								tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
								eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
								takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
								consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
								dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
								dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
								ipsum dolor sit amet.
							</p>
						</div>
						<button class="btn btn-secondary mb-3 w-100" on:click={toggleAgbModal}>
							<i class="fa-solid fa-xmark"></i> Schließen
						</button>
					</div>
				</div>
			{/if}

			{#if quantityError}
				<div class="alert alert-warning text-center" role="alert">
					{quantityErrorText}
				</div>
				<a class="btn btn-secondary w-100 mb-3" href="/shopping-cart">
					<i class="fa-solid fa-arrow-rotate-left"></i> Zurück zum Warenkorb
				</a>
			{/if}

			<div class="row">
				<form on:submit|preventDefault={checkout}>
					<button
						type="submit"
						class="btn btn-primary w-100"
						disabled={!isAgbAccepted || totalQuantity === 0}
					>
						<i class="fa-solid fa-money-check-dollar"></i> Weiter zur Bezahlung (Stripe)
					</button>
				</form>
			</div>
		</div>
	</div>
</SlideLeftRight>
