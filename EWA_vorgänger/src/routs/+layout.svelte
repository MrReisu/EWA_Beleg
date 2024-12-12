<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import type { LayoutData } from './$types';
	import { page } from "$app/stores";

	export let data: LayoutData;
	$: authenticatedUser = data.authenticatedUser;

	$: currentPath = $page.url.pathname;

    function handleSearchSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();
        const searchInput = document.querySelector('[type="search"]');

        if (searchInput instanceof HTMLInputElement) {
            const searchTerm = searchInput.value;
            goto(`/search?q=${encodeURIComponent(searchTerm)}`);
        } else {
            console.error('Suchfeld nicht gefunden');
        }
	}
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
	<div class="container-fluid text-white">

		<!-- Navbar Toggle on low display width -->
		<a class="navbar-brand" href="/">Books<b>4</b>You</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarText"
			aria-controls="navbarText"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="navbarText">
			<ul class="navbar-nav me-auto mb-2 mb-lg-0">

				<!-- Navbar Items -->
				<li class="nav-item">
					<a class="nav-link" class:active={currentPath === "/"} aria-current="page" href="/">
						<i class="fas fa-book"></i> Katalog
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" class:active={currentPath.includes("shopping-cart")} href="/shopping-cart">
						<i class="fas fa-shopping-cart"></i> Warenkorb
					</a>
				</li>

				{#if !authenticatedUser}
					<li class="nav-item">
						<a class="nav-link" class:active={currentPath.includes("login")} href="/login">
							<i class="fa-solid fa-right-to-bracket"></i> Anmelden
						</a>
					</li>
				{:else}

					{#if authenticatedUser.user.bookstore_role === 'ADMIN'}
						<li class="nav-item">
							<a class="nav-link" class:active={currentPath.includes("admin")} href="/admin">
								<i class="fa-solid fa-screwdriver-wrench"></i> Administration
							</a>
						</li>
					{/if}

					<li class="nav-item">
						<form
							action="/logout"
							method="post"
							use:enhance={() => {
								return async ({ result }) => {
									invalidateAll();
									goto('/');
								};
							}}
						>
							<button type="submit" class="nav-link">
								<i class="fa-solid fa-right-from-bracket"></i> Abmelden
							</button>
						</form>
					</li>
					
				{/if}

			</ul>

			<!-- Search Form -->
			<form class="d-flex" on:submit={handleSearchSubmit}>
				{#if authenticatedUser}
					<span class="navbar-text">
						{authenticatedUser.user.username}&nbsp;&nbsp;&nbsp;
					</span>
				{/if}
				<input
					class="form-control me-4 ml-5"
					type="search"
					placeholder="Suchen ..."
					aria-label="Search"
					autofocus
				/>
				<button class="btn btn-outline-success" type="submit">
					Suchen
				</button>
			</form>

		</div>
	</div>
</nav>

<main class="container">
	<slot />
</main>
