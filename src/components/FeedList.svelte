<script lang="ts">
  import { createEventDispatcher } from 'svelte';
	import type { AxiosResponse } from "axios";
  import { httpClient as ax, getBaseURL } from "../stores/httpclient-store";
  import "../js/copy-to-clipboard";

	interface IFeedBatch {
		feedType: string;
		feeds: IFeed[];
	}

	export let userId = "public-user";
	export let isEdit = false;
	export let feedToAdd: IFeed | null | undefined = null;

	const dispatch = createEventDispatcher();

	let feeds: IFeed[] = [];
	let feedBatches: IFeedBatch[] = [];
	let userInfo: IUserInfo | undefined;
	let feedListTitle = "";
	let burl = getBaseURL();


	const getFeedsAsync = async (uid: string) => {
		try {
			const response: AxiosResponse<IFeed[]> = await $ax.get(`/api/User/GetFeedsForUser/${uid}`);
			return response.data;
		}
		catch (error) {
			console.error(error);
		}
	};

	const getUserInfoAsync = async (uid: string) => {
		try {
			const response: AxiosResponse<IUserInfo> = await $ax.get(`/api/User/GetUserInfo/${uid}`);
			return response.data;
		}
		catch (error) {
			console.error(error);
		}
	};

	const loadFeeds = async (uid: string) => {
		feeds = await getFeedsAsync(uid) ?? [];
		if (!feeds.length) return;

		makeBatches();
	};

	const makeBatches = () => {
		const sortFn = (a: IFeed, b: IFeed) => {
			let at = (a.title ?? "").toLowerCase();
			let bt = (b.title ?? "").toLowerCase();
			return ((at < bt) ? -100 : 0) + ((at > bt) ? 100 : 0)
		}

		feedBatches = [];

		const ft = feeds.filter( f => f.feedType == "tw").sort(sortFn);

		if (ft.length) {
			feedBatches.push({
				feedType: "Twitter",
				feeds: ft
			});
		}

		const fg = feeds.filter( f => f.feedType == "go").sort(sortFn);

		if (fg.length) {
			feedBatches.push({
				feedType: "Go Comics",
				feeds: fg
			});
		}

		const fm = feeds.filter( f => f.feedType == "ma").sort(sortFn);

		if (fm.length) {
			feedBatches.push({
				feedType: "Mastodon",
				feeds: fm
			});
		}
	};

	const addFeedAsync = async (newFeed: IFeed | null | undefined) => {
		if (!newFeed?._id) return;

		try {
			await $ax.post(`/api/User/AddFeed?userid=${userId}`, newFeed);
		}
		catch (error) {
			console.error(error);
		}

		let f = feeds.find(a => a._id == newFeed._id);
		if (!f) {
			feeds.push(newFeed);
			dispatch("feed-count-total", feeds.length);
			makeBatches();
		}
	};

	const removeFeedAsync = async (uid: string, ft: string, fid: string) => {
		let f = feeds.find(a => a.feedType == ft && a.feedId == fid);
		if (f) {
			let ok = confirm(`Remove feed: ${f.title}?`);
			if (!ok) return;
		}

		try {
			await $ax.post(`/api/User/RemoveFeed?userid=${uid}&feedType=${ft}&feedId=${fid}`);
		}
		catch (error) {
			console.error(error);
		}

		feeds = feeds.filter(f => f.feedId != fid);
		dispatch("feed-count-total", feeds.length);
		makeBatches();
	};

	const refresh = async (uid: string) => {
		userInfo = await getUserInfoAsync(uid);
		if (!userInfo) {
			feedBatches = [];
			dispatch("feed-count-limit", undefined);
			return;
		}

		await loadFeeds(uid);
		dispatch("feed-count-limit", userInfo.feedCountLimit);
		dispatch("feed-count-total", feeds.length);
	};

	// ** Reactives **

	$: feedListTitle = (userInfo) ? ((userId == "public-user") ? "PUBLIC FEEDS" : `Feeds for ${userInfo.fullName}`) : "";
	$: addFeedAsync(feedToAdd);

	$: refresh(userId);

</script>

<h1>{feedListTitle}</h1>

	{#each feedBatches as fb}
		<h2>{fb.feedType}</h2>
		{#each fb.feeds as feed}
			<div class="feed">
				<div class="left">
					<h3>{feed.title} {#if feed.description != feed.title}({feed.description}){/if}</h3>
					<a href="{burl}/api/feeds/{userInfo?.subscriptionKey}/{feed.feedType}/{feed.feedId}" target="_blank" rel="noreferrer" id="inp-{feed.feedType}-{feed.feedId}" class="link">{burl}/api/feeds/{userInfo?.subscriptionKey}/{feed.feedType}/{feed.feedId}</a>
					<button class="small" data-copytarget="#inp-{feed.feedType}-{feed.feedId}">Copy Link</button>
				</div>
				<div class="right">
					{#if isEdit}<a href="/" on:click|preventDefault={() => removeFeedAsync(userId, feed.feedType, feed.feedId)} title="Remove feed"><i class="fa-solid fa-trash-can"></i></a>{/if}
				</div>
			</div>
		{/each}
	{/each}



<style lang="scss">
	@import "../styles/_custom-variables.scss";

	h1 {
		display: block;
		font-size: 1.5rem;
		color: $dark-text;
		text-align: center;
		margin-bottom: 1rem;
	}

	h2 {
		display: block;
		font-size: 1.0rem;
		color: $body-text;
		margin: 0.75rem 0 0.5rem;
		border-bottom: 1px solid $body-text;
	}

	h3 {
		display: block;
		font-weight: bold;
		font-size: 1.15rem;
		color: $main-color;
	}

	.feed {
		display: flex;
		align-items: center;
		margin: 0.5rem 0;
		line-height: 1.5rem;

		.left {
			flex: 1 1 auto;
			padding-right: 0.2rem;
		}

		.right {
			flex: 0 1 0;
		}

		a {
			display: block;
			font-size: 1.0rem;
			margin: 0 0 0.25rem;
		}

		i {
			font-size: 1.5rem;
			color: $main-color;
		}
	}

	@media screen and (max-width: $bp-small) {
		.feed {
			h3 {
				font-size: 1rem;
			}

			a {
				font-size: 0.8rem;
			}
		}
	}

</style>