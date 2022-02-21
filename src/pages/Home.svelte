<script lang="ts">
  import { onMount } from 'svelte';
	import Container from "../components/Container.svelte";

	import type { AxiosResponse } from "axios";
  import { httpClient as ax, getBaseURL } from "../stores/httpclient-store";
  import "../js/copy-to-clipboard";
  // import { isLoggedIn } from "../stores/user-store.js";
  
	interface IFeedBatch {
		feedType: string;
		feeds: IFeed[];
	}

	let feedBatches: IFeedBatch[] = [];
	let burl = getBaseURL();

	// *** Begin Testing ***
	let unsecuredVal = "Empty";
	let securedVal = "Empty";
	let adminVal = "Empty";

	const getUnsecured = () => {
		$ax.get("/api/Test/GetUnsecuredValue")
			.then((response: AxiosResponse<string>) => unsecuredVal = response.data)
			.catch((err) => console.error({getUnsecuredErr: err}));
	};

	const getSecured = () => {
		$ax.get("/api/Test/GetSecuredValue")
			.then((response: AxiosResponse<string>) => securedVal = response.data)
			.catch((err) => console.error({getSecuredErr: err}));
	};

	const getAdmin = () => {
		$ax.get("/api/Test/GetAdminValue")
			.then((response: AxiosResponse<string>) => adminVal = response.data)
			.catch((err) => console.error({getAdminErr: err}));
	};
// *** End Testing ***

	// const getPublicFeeds = () => {
	// 	$ax.get("/api/User/GetFeedsForUser/public-user")
	// 		.then((response: AxiosResponse<IFeed[]>) => {
	// 			feeds = response.data;
	// 			console.log({feeds});
	// 			})
	// 		.catch((err) => console.error({getPublicFeeds: err}));
	// };

	const getPublicFeedsAsync = async () => {
		try {
			const response: AxiosResponse<IFeed[]> = await $ax.get("/api/User/GetFeedsForUser/public-user");
			return response.data;
		}
		catch (error) {
			console.error(error);
		}
	};

	onMount(async () => {
		let feeds = await getPublicFeedsAsync();
		if (!feeds) return;

		feedBatches = [];

		feedBatches.push({
			feedType: "Twitter",
			feeds: feeds.filter( f => f.feedType == "tw").sort((a, b) => {
				let at = (a.title ?? "").toLowerCase();
				let bt = (b.title ?? "").toLowerCase();
				return ((at < bt) ? -100 : 0) + ((at > bt) ? 100 : 0)
			})
		});

		feedBatches.push({
			feedType: "Go Comics",
			feeds: feeds.filter( f => f.feedType == "go").sort((a, b) => {
				let at = (a.title ?? "").toLowerCase();
				let bt = (b.title ?? "").toLowerCase();
				return ((at < bt) ? -100 : 0) + ((at > bt) ? 100 : 0)
			})
		});

	});

</script>

<div class="splash-container">
	<div class="splash">
		<div class="splash-logo">
			<img src="/assets/img/logo-twitfeeder-400x400.png" alt="TwitFeeder" title="Twitter and other feeds sent to your RSS reader" />
		</div>
		<p class="splash-subhead">
			Twitter and other feeds in your RSS reader
		</p>
	</div>
</div>

<Container ishome={true}>
	{#if false}
	<h1>Test request no auth</h1>
	<div>Unsecured value: { unsecuredVal }</div>
	<button on:click|preventDefault={ getUnsecured }>Get Unsecured</button>

	<h1>Test request with auth</h1>
	<div>Secured value: { securedVal }</div>
	<button on:click|preventDefault={ getSecured }>Get Secured</button>

	<h1>Test requires admin</h1>
	<div>Unsecured value: { adminVal }</div>
	<button on:click|preventDefault={ getAdmin }>Get Admin</button>
	{/if}
	
	<h2>PUBLIC FEEDS</h2>
	
	{#each feedBatches as fb}
		<h3>{fb.feedType}</h3>
		{#each fb.feeds as feed}
			<div class="feed">
				<h4>{feed.title} {#if feed.description != feed.title}({feed.description}){/if}</h4>
				<a href="{burl}/api/feeds/public/{feed.feedType}/{feed.feedId}" target="_blank" id="inp-{feed.feedType}-{feed.feedId}" class="link">{burl}/api/feeds/public/{feed.feedType}/{feed.feedId}</a>
				<button class="small" data-copytarget="#inp-{feed.feedType}-{feed.feedId}">Copy Link</button>
			</div>
		{/each}
	{/each}

</Container>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

	.splash-container {
		background: $main-color;
		z-index: -1;
		overflow: hidden;
		width: 100%;
		height: 25rem;
		top: 0;
		left: 0;
		position: fixed;

	}
	.splash {
		width: min($content-max-width, 92.5%);
		height: 200px;
		margin: 6rem auto 0;
	}

	.splash-logo {
		background-color: $body-background;
		border: 3px solid $body-background;
		padding: 1em 1.6em;
		border-radius: 5px;

		img {
			display: block;
			max-width: 200px;
			margin: 0 auto;
		}
	}

	.splash-subhead {
		color: $body-background;
		letter-spacing: 0.05em;
		opacity: 0.8;
		text-align: center;
		margin-top: 1rem;
		text-transform: uppercase;
	}

	h2 {
		text-align: center;
		font-size: 1.5rem;
		color: $dark-text;
	}

	h3 {
		display: block;
		font-size: 1.0rem;
		color: $body-text;
		margin: 0.75rem 0 0.5rem;
		border-bottom: 1px solid $body-text;
	}

	.feed {
		margin: 0.5rem 0;
		line-height: 1.5rem;

		h4 {
			display: block;
			font-weight: bold;
			font-size: 1.15rem;
			color: $main-color;
		}

		a {
			display: block;
			font-size: 1.0rem;
			margin: 0 0 0.25rem;
		}
	}

	@media screen and (max-width: $bp-small) {
			
		.splash-container {
			position: static;
			height: unset;
		}

		.splash {
			width: 100%;
			height: unset;
			margin: 0;
			padding: 0 1rem;
			line-height: 1em;
		}

		.splash-logo {
			display: none;
		}

		.splash-subhead {
			margin: 1rem auto;
		}

	}

/*
	.container {
		display: flex;
		align-content: center;
		justify-content: center;
		width: 100%;
		margin-top: 25rem;
		background-color: pink;
		border-top: 2px solid $dark-background;

			@media screen and (max-width: $bp-small) {
				margin-top: 0;
			}

	}

	.content {
		display: block;
		padding: 1rem;
		background-color: $body-background;
		max-width: $content-max-width;
	}

	
@media (max-width: $bp-small) {
	.splash-subhead {
		font-size: 13px;
	}

	.splash-container {
		height: 280px;
	}

	.splash {
		height: 100px;
	}

	img {
		max-width: 100px;
	}
}


@media (min-width: @bp-md-up) {

	.splash-container {
		height: 400px;
	}

	 We decrease the width of the .splash, since we have more width to work with
	.splash {
		width: 52%;
		height: 200px;
	}

	.splash-head {
		font-size: 250%;
	}

	.splash-head-logo {

		img {
			max-width: 200px;
			max-height: 200px;
		}
	}
}
*/


	@media screen and (max-width: $bp-small) {
		

	}

</style>