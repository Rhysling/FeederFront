<script lang="ts">
	import Container from "../components/Container.svelte";

	import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../stores/httpclient-store";

	let s = "";
  
	const runStats = async () => {
		try {
			const response: AxiosResponse<string> = await $ax.get("/api/Stats/UsersFeeds");
			s = response.data;
		}
		catch (error) {
			console.error(error);
		}
	};

</script>

<Container>
	<h1>Admin Log Page</h1>

	<div>
		<a href="/" on:click|preventDefault={runStats}>Run Stats</a>
	</div>
	<div>
		Result: {s}
	</div>
</Container>

<style lang="scss">
	@import "../styles/_custom-variables.scss";


	@media screen and (max-width: $bp-small) {
		

	}

</style>