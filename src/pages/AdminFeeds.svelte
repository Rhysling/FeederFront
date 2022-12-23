<script lang="ts">
	import Container from "../components/Container.svelte";

	import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../stores/httpclient-store";

	let ufvm: IUsersFeedsVM | undefined = undefined;

	const getUsersFeeds = async () => {
		try {
			const response: AxiosResponse<IUsersFeedsVM> = await $ax.get("/api/Stats/UsersFeeds");
			ufvm = response.data;
		}
		catch (error) {
			console.error(error);
		}
	};

  const ellipsis = (s: INullable<string>, n: number) => {
    if (!s) return "missing!";
    if (s.length <= n) return s;
    return s.substring(0,n) + "...";
  }

  const userCountForFeed = (fid: string) => {
    let ufc = ufvm?.userFeedCounts.find(a => a.key === fid);
    return ufc ? ufc.value : "none";
  }

  const postCountForFeed = (fid: string) => {
    let ufc = ufvm?.postCounts.find(a => a.key === fid);
    return ufc ? ufc.value : "none";
  }

	const feedState = (f: IFeed) => {
		if (f.statusCode >= 200 && f.statusCode < 300) return "success";
		if (f.statusCode >= 300 && f.statusCode < 500) return "warning"
		if (f.statusCode >= 500) return "error"
		return "unknown";
	};

  getUsersFeeds();

</script>

<Container>
	<h1>Admin Feeds</h1>

  {#if ufvm?.feeds}
  {#each ufvm.feeds as f}
    {@const ufc = userCountForFeed(f._id)}
    {@const state = feedState(f)}
    <div class="feed">
      <div class="feed-title" class:success={state == "success"} class:warning={state == "warning"} class:error={state == "error"} class:unknown={state == "unknown"}>
        <div>{f.title}</div>
				<div>({f.statusCode || 0})</div>

      </div>
      <div class="feed-info">
        {f.description} &#9679; {f._id}
      </div>
      <div class="feed-info">
        Built: {f.lastBuildDate.substring(0, 19)} &#9679; Posts: {postCountForFeed(f._id)} &#9679;
				<span class:warning={ufc == "none"}>Users: {ufc}</span>
      </div>
      <div class="post-info">
        {ellipsis(f.postItems[0]?.title ?? "No posts", 82)} &#9679; {f.postItems[0]?.pubDateGmt?.substring(0, 16) ?? "No date"}
      </div>
    </div>
  {/each}
  {/if}

</Container>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

  h1 {
		text-align: center;
		padding-bottom: 0.5rem;
    margin: 0 0 1rem 0;
		border-bottom: 1px solid $body-text;
	}

  .feed {
    margin-top: 0.6rem;
    line-height: 1.2em;
  }

	.feed-title {
		display: flex;
		justify-content: space-between;
	}

  .feed-title, span {
    color: $dark-text;

    &.success {
      background-color: $color-success-bg;
    }

    &.warning {
      background-color: $color-warning-bg;
    }

    &.error {
      background-color: $color-error-bg;
    }

		&.unknown {
      background-color: $color-unknown-bg;
    }
  }

  .feed-info {
    font-size: 0.9rem;
    margin: 0 0 0 1rem;
  }

  .post-info {
    font-size: 0.7rem;
    font-style: italic;
    margin: 0 0 0 1rem;
  }


	@media screen and (max-width: $bp-small) {


	}

</style>