<script lang="ts">
	import Container from "../components/Container.svelte";
	import AddFeed from "../components/AddFeed.svelte";
	import FeedList from "../components/FeedList.svelte";
  import { user } from "../stores/user-store";
  
	let feedCountTotal: number | undefined = undefined;
	let feedCountLimit: number | undefined = undefined;
	let feedToAdd: IFeed | null | undefined = null;

	const setFeedCountTotal = (e: CustomEvent<number>) => feedCountTotal = e.detail;
	const setFeedCountLimit = (e: CustomEvent<number>) => feedCountLimit = e.detail;
	const addFeed = (e: CustomEvent<IFeed>) => feedToAdd = e.detail;

</script>

<Container>
	<AddFeed
		{feedCountTotal}
		{feedCountLimit}
		on:add-feed={addFeed}
	/>
	<FeedList
		userId={$user.userId}
		{feedToAdd}
		isEdit={true}
		on:feed-count-total={setFeedCountTotal}
		on:feed-count-limit={setFeedCountLimit}
	/>
</Container>

<style lang="scss">
	@import "../styles/_custom-variables.scss";


	@media screen and (max-width: $bp-small) {
		
	}
</style>