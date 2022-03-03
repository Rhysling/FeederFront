<script lang="ts">
	import Container from "../components/Container.svelte";
	import AddFeed from "../components/AddFeed.svelte";
	import FeedList from "../components/FeedList.svelte";
  import { user } from "../stores/user-store";
  
	let feedToAdd: IFeed | null | undefined = null;

	const addFeed = (e: CustomEvent<IFeed>) => feedToAdd = e.detail;

</script>

<Container>
	<AddFeed on:add-feed={addFeed} />
	<FeedList userId={$user.userId} {feedToAdd} isEdit={true} />
</Container>

<style lang="scss">
	@import "../styles/_custom-variables.scss";


	@media screen and (max-width: $bp-small) {
		
	}
</style>