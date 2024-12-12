<script lang="ts">
	import { goto } from '$app/navigation';
	import SlideLeftRight from '$lib/components/transitions/SlideLeftRight.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: authenticatedUser = data.authenticatedUser;
	$: isAdmin = authenticatedUser && authenticatedUser.user.bookstore_role === 'ADMIN';

	function navigateTo(url: string) {
		goto(`/admin/${url}`);
	}
</script>

<svelte:head>
	<title>Administration | Books4You</title>
</svelte:head>

{#if isAdmin}
	<SlideLeftRight>
		<div class="row">
			<div class="col-12 mb-5">
				<h1><i class="fa-solid fa-screwdriver-wrench"></i> Administration</h1>
				<div class="btn-group w-100 mb-3" role="group" aria-label="Admin Tabs">
					<button class="btn btn-secondary" on:click={() => navigateTo('inventory')}>
						<i class="fa-solid fa-warehouse"></i>
						Lagerbestände
					</button>
					<button class="btn btn-secondary" on:click={() => navigateTo('orders')}>
						<i class="fa-solid fa-store"></i> Bestellungen
					</button>
				</div>
			</div>
		</div>
	</SlideLeftRight>

	<slot />
{/if}
