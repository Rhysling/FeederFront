<script lang="ts">
	import Container from "../components/Container.svelte";
	import FeedList from "../components/FeedList.svelte";

	// import type { AxiosResponse } from "axios";
  // import { httpClient as ax } from "../stores/httpclient-store";
  import { user } from "../stores/user-store";
  

</script>

<Container>

	<div class="add-feed">
		<div class="add-title"></div>
		<div class="add-type"></div>
		<div class="add-screenname"></div>
		<div class="add-searchbtn"></div>
		<div class="add-result"></div>
	</div>


	<FeedList userId={$user.userId} isEdit={true} />
</Container>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

	.add-feed {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		grid-template-rows: auto;
		grid-template-areas: 
			"title  title      title"
			"type   screenname searchbtn"
			"result result     result";
		border-radius: 8px;
		border: 3px solid $dark-background;
		padding: 0.3rem;
		margin: 0 0 1rem;
	}

	.add-title {
		grid-area: title;
		height: 3rem;
		background-color: pink;
	}
	.add-type {
		grid-area: type;
		height: 3rem;
		background-color: greenyellow;
	}
	.add-screenname {
		grid-area: screenname;
		height: 3rem;
		background-color: coral;
	}
	.add-searchbtn {
		grid-area: searchbtn;
		height: 3rem;
		background-color: aqua;
	}
	.add-result {
		grid-area: result;
		height: 3rem;
		background-color: yellow;
	}


	@media screen and (max-width: $bp-small) {
		

	}

</style>