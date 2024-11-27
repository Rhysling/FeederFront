<svelte:options runes={true} />

<script lang="ts">
	type AddFeedProps = {
		feedCountTotal: number | undefined;
		feedCountLimit: number | undefined;
		addFeed: (feed: IFeed) => void;
	};

	type StateNames = "initial" | "editing" | "missing" | "found" | "notfound";

	import Modal from "../components/Modal.svelte";
	import { fade } from "svelte/transition";
	// import { createEventDispatcher } from "svelte";

	import type { AxiosResponse } from "axios";
	import { httpClient as ax } from "../stores/httpclient-store";

	// export let feedCountTotal: number | undefined = undefined;
	// export let feedCountLimit: number | undefined = undefined;
	// const dispatch = createEventDispatcher();

	let { feedCountTotal, feedCountLimit, addFeed }: AddFeedProps = $props();

	let stateName: StateNames = $state("initial"); // initial editing missing found notfound added
	let screenName = $state("");
	let result = $state("");

	$effect(() => {
		switch (stateName) {
			case "initial":
				screenName = "";
				result = "";
				break;
			case "editing":
				break;
			case "missing":
				screenName = "";
				result = "Need a screen name for search.";
				break;
			case "found":
			case "notfound":
				//screenName = screenName.trim();
				//result;
				break;
			default:
				screenName = "Missing case";
				result = "Missing case";
		}

		setMessage(feedCountTotal, feedCountLimit);
	});

	let isSuccess: boolean = $derived.by(() => {
		switch (stateName) {
			case "initial":
				return false;
			case "editing":
				return false;
			case "missing":
				return false;
			case "found":
				return true;
			case "notfound":
				return false;
			default:
				return false;
		}
	});

	let isError: boolean = $derived.by(() => {
		switch (stateName) {
			case "initial":
				return false;
			case "editing":
				return false;
			case "missing":
				return true;
			case "found":
				return false;
			case "notfound":
				return true;
			default:
				return true;
		}
	});

	let isEnabledSearch: boolean = $derived.by(() => {
		switch (stateName) {
			case "initial":
				return false;
			case "editing":
				return true;
			case "missing":
				return false;
			case "found":
				return false;
			case "notfound":
				return false;
			default:
				return false;
		}
	});

	let isEnabledAdd: boolean = $derived.by(() => {
		switch (stateName) {
			case "initial":
				return false;
			case "editing":
				return false;
			case "missing":
				return false;
			case "found":
				return (feedCountTotal ?? 0) < (feedCountLimit ?? 0); // true if space left;
			case "notfound":
				return false;
			default:
				return false;
		}
	});

	let isEnabledCancel: boolean = $derived.by(() => {
		switch (stateName) {
			case "initial":
				return false;
			case "editing":
				return true;
			case "missing":
				return false;
			case "found":
				return true;
			case "notfound":
				return true;
			default:
				return false;
		}
	});

	let isLoading = $state(false);
	let isShowModal = $state(false);

	let sources = [
		//{ id: "tw", text: "Twitter" },
		{ id: "bs", text: "Bluesky" },
		{ id: "go", text: "Go Comics" },
		{ id: "ma", text: "Mastodon" },
	];
	let selectedSource = $state(sources[0]);

	let addedResult = $state("");
	let showAddedResult = $state(false);

	let lookupFeed: IFeed | null | undefined = null;
	let message = $state("");

	//api/LookupSource/?feedType=xxx&screenName=yyy
	const lookupFeedAsync = async () => {
		if (!screenName) return;

		isLoading = true;

		try {
			const response: AxiosResponse<IFeed | null> = await $ax.get(
				`/api/LookupSource/?feedType=${selectedSource.id}&screenName=${screenName}`,
			);
			isLoading = false;
			return response.data;
		} catch (error) {
			isLoading = false;
			console.error(error);
		}
	};

	let setMessage = (fcTot: number | undefined, fcLim: number | undefined) => {
		if (fcTot === undefined || fcLim === undefined) {
			message = "";
			return;
		}

		if (fcTot === 0) {
			message = `Add up to ${fcLim} feeds.`;
			return;
		}

		if (fcTot >= fcLim) {
			message = `You have ${fcTot} feeds. Delete one to add another.`;
			return;
		}

		if (fcTot > 0 && fcLim > 0) {
			message = `You have ${fcTot} of ${fcLim} feeds.`;
			return;
		}

		message = "";
	};

	let setEditing = () => {
		if (!screenName.trim()) {
			stateName = "initial";
		} else stateName = "editing";
	};

	let search = async () => {
		screenName = screenName.trim();

		if (screenName.startsWith("@")) screenName = screenName.substring(1);

		if (!screenName) {
			stateName = "initial";
			return;
		}

		lookupFeed = await lookupFeedAsync();

		if (lookupFeed) {
			result = "Found: " + lookupFeed.title;
			stateName = "found";
		} else {
			result = "Not Found: " + screenName;
			stateName = "notfound";
		}
	};

	let add = () => {
		if (!lookupFeed) return;

		addFeed(lookupFeed);

		addedResult = `Added ${screenName}!`;
		result = "";
		// isEnabledAdd = false;
		// isEnabledCancel = false;
		showAddedResult = true;

		setTimeout(() => {
			showAddedResult = false;
		}, 2000);

		setTimeout(() => {
			stateName = "initial";
		}, 2500);
	};

	let cancel = () => {
		stateName = "initial";
		const sn = document.getElementById("screenname");
		if (sn) sn.focus();
	};
</script>

<div class="add-feed">
	<div class="add-title">Add a Feed</div>
	<div class="add-message">{message}</div>
	<div class="add-type">
		<select bind:value={selectedSource}>
			{#each sources as s}
				<option value={s}>
					{s.text}
				</option>
			{/each}
		</select>
	</div>
	<div class="add-screenname">
		<input
			id="screenname"
			type="text"
			bind:value={screenName}
			onkeyup={() => setEditing()}
			placeholder="Screen name"
			class:is-error={isError}
			style="width:100%; display:block;"
		/>
	</div>
	<div class="add-subtext">
		<a
			href="/"
			onclick={(e) => {
				e.preventDefault();
				isShowModal = true;
			}}>Hint</a
		>
		- how to find screen names for {selectedSource.text}.
	</div>
	<div class="add-searchbtn">
		<button onclick={() => search()} disabled={!isEnabledSearch}>Search</button>
	</div>
	<div class="add-result" class:is-success={isSuccess} class:is-error={isError}>
		{result}
		{#if showAddedResult}
			<div out:fade={{ delay: 0, duration: 500 }}>
				{addedResult}
			</div>
		{/if}
	</div>
	<div class="add-resbtn">
		<button
			class="narrow"
			onclick={() => add()}
			style="width:100%;"
			disabled={!isEnabledAdd}>Add Feed</button
		>
		<button
			class="secondary narrow"
			onclick={() => cancel()}
			style="width:100%; margin:0;"
			disabled={!isEnabledCancel}>Cancel</button
		>
	</div>
	<div class="cover" class:is-hidden={!isLoading}>
		<i class="fa-solid fa-circle-notch fa-spin"></i>
	</div>
</div>
<Modal {isShowModal} on:hide-modal={() => (isShowModal = false)}>
	{#if selectedSource.id == "go"}
		<img
			src="/assets/img/hint-gocomics.png"
			alt="Hint to search for Go Comics feeds"
		/>
	{:else if selectedSource.id == "ma"}
		<img
			src="/assets/img/hint-mastodon.png"
			alt="Hint to search for Mastodon feeds"
		/>
	{:else if selectedSource.id == "bs"}
		<img
			src="/assets/img/hint-bluesky.png"
			alt="Hint to search for Bluesky feeds"
		/>
	{:else}
		<img
			src="/assets/img/hint-twitter.png"
			alt="Hint to search for Twitter feeds"
		/>
	{/if}
</Modal>

<style lang="scss">
	@use "../styles/_custom-variables" as c;
	@use "sass:color";

	.cover {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 4;
		background-color: rgba(0, 0, 0, 0.2);
		font-size: 5rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.is-hidden {
		display: none;
	}

	.add-feed {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		grid-template-rows: auto;
		grid-template-areas:
			"title  message    message"
			"type   screenname searchbtn"
			".      subtext    subtext"
			"result result     resbtn";
		border-radius: 8px;
		border: 1px solid c.$gray-light;
		padding: 0.3rem;
		margin: 0 0 1rem;
		background-color: color.adjust(c.$link-color, $lightness: 45%);
		position: relative;
	}

	.add-title {
		grid-area: title;
		padding: 0.5rem;
		font-weight: bold;
		color: c.$dark-text;
	}
	.add-message {
		grid-area: message;
		padding: 0.5rem;
		font-size: 0.9rem;
		text-align: right;
	}

	.add-type {
		grid-area: type;
		padding: 0.5rem 0.5rem 0;
		font-size: 0.9rem;
		display: flex;
		align-items: baseline;
	}
	.add-screenname {
		grid-area: screenname;
		padding: 0.5rem 0.5rem 0;
		display: flex;
		justify-content: center;
		align-items: baseline;

		input {
			margin: 0;
			border-radius: 5px;
		}
	}
	.add-searchbtn {
		grid-area: searchbtn;
		padding: 0.5rem 0.5rem 0;
		font-size: 0.9rem;
		display: flex;
		justify-content: right;
		align-items: baseline;
	}
	.add-result {
		grid-area: result;
		padding: 0.5rem;
		font-size: 0.9rem;
		border-radius: 3px;
		display: flex;
		justify-content: left;
		align-items: baseline;
	}

	.add-resbtn {
		grid-area: resbtn;
		padding: 0.5rem;
		font-size: 0.9rem;
		display: flex;
		flex-flow: row wrap;
		justify-content: right;
	}

	.add-subtext {
		grid-area: subtext;
		font-size: 0.8rem;
		padding: 0 0 0 0.5rem;
	}

	.is-success {
		color: c.$color-success;
		background-color: c.$color-success-bg;
		border: 1px solid c.$color-success;
	}

	.is-error {
		color: c.$color-error;
		background-color: c.$color-error-bg;
		border: 1px solid c.$color-error;
	}

	@media screen and (max-width: c.$bp-small) {
	}
</style>
