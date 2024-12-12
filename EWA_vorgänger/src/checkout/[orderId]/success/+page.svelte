<script lang="ts">
	import { onMount } from 'svelte';
	import { cartStore } from '$lib/store';

	onMount(() => {
		cartStore.set([]);
		localStorage.removeItem('shoppingCart');
	});
</script>

<div class="alert alert-success p-5" role="alert">
	<h1 class="text-center mb-5">
		<i class="fa-solid fa-check"></i>
		Deine Bestellung wurde erfolgreich abgeschlossen
		<i class="fa-solid fa-check"></i>
	</h1>

	<h4 class="text-center">
		Vielen Dank für deine Bestellung! Sie wird in wenigen Tagen bei dir eintreffen!
	</h4>
</div>
