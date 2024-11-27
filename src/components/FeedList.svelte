<svelte:options runes={true} />

<script lang="ts">
	type FeedListProps = {
		userId: string | undefined;
		isEdit: boolean;
		feedToAdd: IFeed | null | undefined;
		setFeedCountTotal: ((fct: number | undefined) => void) | undefined;
		setFeedCountLimit: ((fcl: number | undefined) => void) | undefined;
	};

	type FeedBatch = {
		feedType: string;
		feeds: IFeed[];
	};

	import type { AxiosResponse } from "axios";
	import { httpClient as ax, getBaseURL } from "../stores/httpclient-store";
	import "../js/copy-to-clipboard";

	let {
		userId = "public-user",
		isEdit = false,
		feedToAdd = null,
		setFeedCountTotal,
		setFeedCountLimit,
	}: FeedListProps = $props();

	let feeds: IFeed[] = [];
	let feedBatches: FeedBatch[] = $state([]);
	let userInfo: IUserInfo | undefined = $state(undefined);
	let burl = getBaseURL();

	let feedListTitle: string = $derived.by(() => {
		if (userId == "public-user") return "PUBLIC FEEDS";
		if (!userInfo) return "";
		return `Feeds for ${userInfo.fullName}`;
	});

	// Clean Id name for Copy Link button target
	const cleanName = (id: string) => id.replace(/\W/g, "");

	const getFeedsAsync = async (uid: string) => {
		try {
			const response: AxiosResponse<IFeed[]> = await $ax.get(
				`/api/User/GetFeedsForUser/${uid}`,
			);
			return response.data;
		} catch (error) {
			console.error(error);
		}
	};

	const getUserInfoAsync = async (uid: string) => {
		try {
			const response: AxiosResponse<IUserInfo> = await $ax.get(
				`/api/User/GetUserInfo/${uid}`,
			);
			return response.data;
		} catch (error) {
			console.error(error);
		}
	};

	const loadFeeds = async (uid: string) => {
		feeds = (await getFeedsAsync(uid)) ?? [];
		if (!feeds.length) {
			feedBatches = [];
			return;
		}

		makeBatches();
	};

	const makeBatches = () => {
		const sortFn = (a: IFeed, b: IFeed) => {
			let at = (a.title ?? "").toLowerCase();
			let bt = (b.title ?? "").toLowerCase();
			return (at < bt ? -100 : 0) + (at > bt ? 100 : 0);
		};

		feedBatches = [];

		const ft = feeds.filter((f) => f.feedType == "tw").sort(sortFn);

		if (ft.length) {
			feedBatches.push({
				feedType: "Twitter",
				feeds: ft,
			});
		}

		const fb = feeds.filter((f) => f.feedType == "bs").sort(sortFn);

		if (fb.length) {
			feedBatches.push({
				feedType: "Bluesky",
				feeds: fb,
			});
		}

		const fg = feeds.filter((f) => f.feedType == "go").sort(sortFn);

		if (fg.length) {
			feedBatches.push({
				feedType: "Go Comics",
				feeds: fg,
			});
		}

		const fm = feeds.filter((f) => f.feedType == "ma").sort(sortFn);

		if (fm.length) {
			feedBatches.push({
				feedType: "Mastodon",
				feeds: fm,
			});
		}
	};

	const addFeedAsync = async (newFeed: IFeed | null | undefined) => {
		if (!newFeed?._id) return;

		try {
			await $ax.post(`/api/User/AddFeed?userid=${userId}`, newFeed);
		} catch (error) {
			console.error(error);
		}

		let f = feeds.find((a) => a._id == newFeed._id);
		if (!f) {
			feeds.push(newFeed);
			if (setFeedCountTotal) setFeedCountTotal(feeds.length);
			makeBatches();
		}
	};

	const removeFeedAsync = async (uid: string, ft: string, fid: string) => {
		let f = feeds.find((a) => a.feedType == ft && a.feedId == fid);
		if (f) {
			let ok = confirm(`Remove feed: ${f.title}?`);
			if (!ok) return;
		}

		try {
			await $ax.post(
				`/api/User/RemoveFeed?userid=${uid}&feedType=${ft}&feedId=${fid}`,
			);
		} catch (error) {
			console.error(error);
		}

		feeds = feeds.filter((f) => f.feedId != fid);
		if (setFeedCountTotal) setFeedCountTotal(feeds.length);
		makeBatches();
	};

	const refresh = async (uid: string) => {
		userInfo = await getUserInfoAsync(uid);
		if (!userInfo) {
			feedBatches = [];
			if (setFeedCountLimit) setFeedCountLimit(undefined);
			return;
		}

		await loadFeeds(uid);
		if (setFeedCountLimit) setFeedCountLimit(userInfo.feedCountLimit);
		if (setFeedCountTotal) setFeedCountTotal(feeds.length);
	};

	// ** Reactives **

	$effect(() => {
		addFeedAsync(feedToAdd);
	});

	$effect(() => {
		refresh(userId);
	});
</script>

<h1>{feedListTitle}</h1>

{#each feedBatches as fb}
	<h2>{fb.feedType}</h2>
	{#each fb.feeds as feed}
		<div class="feed">
			<div class="left">
				<h3>{feed.title}</h3>
				{#if feed.description && feed.description != feed.title}<div
						class="description"
					>
						{feed.description}
					</div>{/if}
				<a
					href="{burl}/api/feeds/{userInfo?.subscriptionKey}/{feed.feedType}/{feed.feedId}"
					target="_blank"
					rel="noreferrer"
					id="inp-{feed.feedType}-{cleanName(feed.feedId)}"
					class="link"
					>{burl}/api/feeds/{userInfo?.subscriptionKey}/{feed.feedType}/{feed.feedId}</a
				>
				<button
					class="small"
					data-copytarget="#inp-{feed.feedType}-{cleanName(feed.feedId)}"
					>Copy Link</button
				>
			</div>
			<div class="right">
				{#if isEdit}<a
						href="/"
						onclick={(e) => {
							e.preventDefault();
							removeFeedAsync(userId, feed.feedType, feed.feedId);
						}}
						title="Remove feed"
						aria-label="Remove feed"><i class="fa-solid fa-trash-can"></i></a
					>{/if}
			</div>
		</div>
	{/each}
{:else}
	<h2>No Feeds</h2>
{/each}

<style lang="scss">
	@use "../styles/_custom-variables" as c;

	h1 {
		display: block;
		font-size: 1.5rem;
		color: c.$dark-text;
		text-align: center;
		margin-bottom: 1rem;
	}

	h2 {
		display: block;
		font-size: 1rem;
		color: c.$body-text;
		margin: 0.75rem 0 0.5rem;
		border-bottom: 1px solid c.$body-text;
	}

	h3 {
		display: block;
		font-weight: bold;
		font-size: 1.15rem;
		color: c.$main-color;
	}

	.description {
		font-size: 0.9rem;
		color: c.$main-color;
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
			font-size: 1rem;
			margin: 0 0 0.25rem;
		}

		i {
			font-size: 1.5rem;
			color: c.$main-color;

			&:hover {
				color: c.$link-hover-color;
			}
		}
	}

	@media screen and (max-width: c.$bp-small) {
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
