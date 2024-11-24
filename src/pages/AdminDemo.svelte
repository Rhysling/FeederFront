<script lang="ts">
	import Container from "../components/Container.svelte";

	import type { AxiosResponse } from "axios";
	import { httpClient as ax } from "../stores/httpclient-store";

	let feedId = $state("");
	let feeds: IFeed[] = $state([]);
	let posts: IPostItem[] = $state([]);

	let feedTypeId = $derived.by(() => {
		let f = feeds.find((a) => a.feedId == feedId);
		if (!f) return { feedType: "", feedId: "" };
		return { feedType: f.feedType, feedId };
	});

	const getAllFeeds = async () => {
		try {
			const response: AxiosResponse<IFeed[]> = await $ax.get(
				"/api/LookupFeedsPosts/AllFeeds",
			);
			feeds = response.data;
		} catch (error) {
			console.error(error);
		}
	};

	const getLatestPostsForFeed = async (feedType: string, feedId: string) => {
		try {
			const response: AxiosResponse<IPostItem[]> = await $ax.get(
				`/api/LookupFeedsPosts/LatestPosts?feedType=${feedType}&feedId=${feedId}`,
			);
			posts = response.data;
		} catch (error) {
			console.error(error);
		}
	};

	getAllFeeds();
</script>

<Container>
	<h1>Demo Page</h1>

	<div>Feed</div>
	<select
		bind:value={feedId}
		onchange={() => {
			getLatestPostsForFeed(feedTypeId.feedType, feedTypeId.feedId);
		}}
	>
		{#each feeds as f}
			<option value={f.feedId}>
				{f.feedType} - {f.userName}
			</option>
		{/each}
	</select>

	<br />
	<div>Posts</div>
	{#each posts as p}
		<div>{@html p.description}</div>
	{:else}
		No posts.
	{/each}
</Container>

<style lang="scss">
	@use "../styles/_custom-variables" as c;

	h1 {
		text-align: center;
		padding-bottom: 0.5rem;
		margin: 0 0 1rem 0;
		border-bottom: 1px solid c.$body-text;
	}

	@media screen and (max-width: c.$bp-small) {
	}
</style>
