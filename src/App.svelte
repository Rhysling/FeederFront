<svelte:options runes={true} />

<script lang="ts">
	import { onMount } from "svelte";

	import Header from "./components/Header.svelte";
	import Footer from "./components/Footer.svelte";

	import Home from "./pages/Home.svelte";
	import MyFeeds from "./pages/MyFeeds.svelte";
	import Account from "./pages/Account.svelte";
	import AdminDemo from "./pages/AdminDemo.svelte";
	import AdminUserFeeds from "./pages/AdminUserFeeds.svelte";
	import AdminFeeds from "./pages/AdminFeeds.svelte";
	import AdminUsers from "./pages/AdminUsers.svelte";
	import AdminLog from "./pages/AdminLog.svelte";
	import PrivacyPolicy from "./pages/PrivacyPolicy.svelte";
	import TermsOfService from "./pages/TermsOfService.svelte";

	import { currentRoute, navFromUrl } from "./stores/route-store";
	//import { user } from "./stores/user-store.js";

	let pages = {
		Home,
		MyFeeds,
		Account,
		AdminDemo,
		AdminUserFeeds,
		AdminFeeds,
		AdminUsers,
		AdminLog,
		PrivacyPolicy,
		TermsOfService,
	};

	type PK = keyof typeof pages;

	//let path = $derived($currentRoute.path || "/");
	let pageName = $derived($currentRoute?.page ?? "Home") as PK;
	let CurrentPage = $derived(pages[pageName]);

	$effect(() => {
		pageName;
		window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
	});

	onMount(() => {
		navFromUrl();
	});
</script>

<Header />
<main>
	<CurrentPage />
</main>
<Footer />

<style lang="scss">
	@use "./styles/custom-variables" as c;

	main {
		background-color: c.$body-background;
		padding: 0;
		margin: 0 auto;
	}

	@media only screen and (max-width: c.$bp-small) {
	}
</style>
