<script>
	import { onMount } from "svelte";

	import GlobalCss from "./components/GlobalCss.svelte";
	import Header from "./components/Header.svelte";
	import Footer from "./components/Footer.svelte";

	import Home from "./pages/Home.svelte";
	import UserAdmin from "./pages/admin/UserAdmin.svelte";

	import { currentRoute, navFromUrl } from "./stores/route-store.js";
	import { user } from "./stores/user-store.js";
	
	let slug = "/";
	let page = "Home";

	if ($user.userId)
		wls.init();


	onMount(() => {
		navFromUrl();
	});


	let pages = {
		Home,
		UserAdmin
	};

	$: {
		slug = $currentRoute.slug;
		page = $currentRoute?.page ?? "Home";
		//console.log({currentRoute: $currentRoute});

		window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth"
		});
	}

</script>

<GlobalCss />
<main>
	<Header />
	<svelte:component this={ pages[page] } />
	<Footer {slug} />

</main>

<style lang="scss">
  @import "./styles/_custom-variables.scss";

	main {
		background-color: #fff;
		padding: 1em;
		max-width: 800px;
		margin: 0 auto;
	}

	@media only screen and (max-width: $bp-small) {
		
	}
</style>