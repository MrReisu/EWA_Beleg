<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Orders } from '$lib/api.types';
	import SlideLeftRight from '$lib/components/transitions/SlideLeftRight.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let orders: Orders = [];
	$: orders = data.orders;

</script>

<svelte:head>
	<title>Bestellungen | Books4You</title>
</svelte:head>

<SlideLeftRight>
	<div class="container">
		<h1>Bestellungen</h1>
		{#if orders.length > 0}
			<table class="table">
				<thead>
					<tr>
						<th>Bestell-ID</th>
						<th>Status</th>
						<th>Erstellt am</th>
						<!-- <th>Details</th> -->
					</tr>
				</thead>
				<tbody>
					{#each orders as order}
						<tr>
							<td>{order.id}</td>
							<td>{order.attributes.status}</td>
							<td>{new Date(order.attributes.createdAt).toLocaleString()}</td>
						</tr>
						{#if order.detailsVisible}
							<tr>
								<td colspan="4">
									<h3>Adresse:</h3>
									<ul>
										<!-- Lieferadresse liegt bei Stripe -->
									</ul>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		{:else}
			<p>Keine Bestellungen vorhanden.</p>
		{/if}
	</div>
</SlideLeftRight>
