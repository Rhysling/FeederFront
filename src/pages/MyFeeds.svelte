<svelte:options runes={true} />

<script lang="ts">
	import Container from "../components/Container.svelte";
	import AddFeed from "../components/AddFeed.svelte";
	import FeedList from "../components/FeedList.svelte";
	import { user } from "../stores/user-store";

	let feedCountTotal: number | undefined = $state(undefined);
	let feedCountLimit: number | undefined = $state(undefined);
	let feedToAdd: IFeed | null | undefined = $state(null);

	const setFeedCountTotal = (fct: number | undefined) => {
		feedCountTotal = fct;
	};
	const setFeedCountLimit = (fcl: number | undefined) => {
		feedCountLimit = fcl;
	};
	const addFeed = (feed: IFeed) => {
		feedToAdd = feed;
	};
</script>

<Container>
	<AddFeed {feedCountTotal} {feedCountLimit} {addFeed} />
	<FeedList
		userId={$user.userId}
		{feedToAdd}
		isEdit={true}
		{setFeedCountTotal}
		{setFeedCountLimit}
	/>
</Container>

<style lang="scss">
	@use "../styles/_custom-variables" as c;

	@media screen and (max-width: c.$bp-small) {
	}
</style>
