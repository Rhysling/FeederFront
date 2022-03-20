<script lang="ts">
	import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

	import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../stores/httpclient-store";

	export let feedCountTotal: number | undefined = undefined;
	export let feedCountLimit: number | undefined = undefined;

	const dispatch = createEventDispatcher();
  
	let state = "initial"; // initial editing missing found notfound added

	let sources = [
		{ id: "tw", text: "Twitter" },
		{ id: "go", text: "Go Comics" }
	];
	let selectedSource = sources[0];

	let screenName = "";
	let result = "";
	let isSuccess = true;
	let isError = false;
	let isScreenNameError = false;
	let isEnabledSearch = true;
	let isEnabledAdd = false;
	let isEnabledCancel = false;
	let isLoading = false;

	let addedResult = "";
	let showAddedResult = false;

	let lookupFeed: IFeed | null | undefined = null;
	let message = "";

	//api/LookupSource/?feedType=xxx&screenName=yyy
	const lookupFeedAsync = async () => {
		if (!screenName.trim()) return;

		isLoading = true;

		try {
			const response: AxiosResponse<IFeed | null> = await $ax.get(`/api/LookupSource/?feedType=${selectedSource.id}&screenName=${screenName}`);
			isLoading = false;
			return response.data;
		}
		catch (error) {
			isLoading = false;
			console.error(error);
		}
	};


	let setState = (state: string) => {
		switch(state) {
			case "initial":
				screenName = "";
				result = "";
				addedResult = "";
				isSuccess = false;
				isError = false;
				isScreenNameError = false;
				isEnabledSearch = false;
				isEnabledAdd = false;
				isEnabledCancel = false;
				lookupFeed = null;
				break;
			case "editing":
				//screenName = "";
				result = "";
				isSuccess = false;
				isError = false;
				isScreenNameError = false;
				isEnabledSearch = true;
				isEnabledAdd = false;
				isEnabledCancel = true;
				break;
			case "missing":
				screenName = "";
				result = "Need a screen name for search.";
				isSuccess = false;
				isError = true;
				isScreenNameError = true;
				isEnabledSearch = false;
				isEnabledAdd = false;
				isEnabledCancel = false;
				break;
			case "found":
				//screenName = "";
				//result = "";
				isSuccess = true;
				isError = false;
				isScreenNameError = false;
				isEnabledSearch = false;
				isEnabledAdd = ((feedCountTotal ?? 0) < (feedCountLimit ?? 0)); // true if space left
				isEnabledCancel = true;
				break;
			case "notfound":
				//screenName = "";
				//result = "";
				isSuccess = false;
				isError = true;
				isScreenNameError = false;
				isEnabledSearch = false;
				isEnabledAdd = false;
				isEnabledCancel = true;
				break;
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
			screenName = "";
			state = "initial";
		}
		else
			state = "editing";
	};

	let search = async () => {
		screenName = screenName.trim();
		if (!screenName) {
			state = "initial";
			return;
		}

		lookupFeed = await lookupFeedAsync();

		if (lookupFeed) {
			result = "Found: " + lookupFeed.title;
			state = "found";
		}
		else {
			result = "Not Found: " + screenName;
			state = "notfound";
		}

	};

	let add = () => {
		dispatch("add-feed", lookupFeed);

		addedResult = `Added ${screenName}!`;
		result = "";
		isEnabledAdd = false;
		isEnabledCancel = false;
		showAddedResult = true;

		setTimeout(() => {
			showAddedResult = false;
		}, 2000);

		setTimeout(() => {
			state = "initial";
		}, 2500);

	};

	let cancel = () => {
		state = "initial";
		const sn = document.getElementById("screenname");
		if (sn)
			sn.focus();
	};

	$: setState(state);
	$: setMessage(feedCountTotal, feedCountLimit);

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
		<input id="screenname" type="text" bind:value={screenName} on:keyup={() => setEditing()} placeholder="Screen name" class:is-error={isScreenNameError} style="width:100%; display:block;" />
	</div>
	<div class="add-subtext">Screen name to identify feed (found in URL).</div>
	<div class="add-searchbtn">
		<button on:click={() => search()}  disabled={!isEnabledSearch}>Search</button>
	</div>
	<div class="add-result" class:is-success={isSuccess} class:is-error={isError}>
		{result}
		{#if showAddedResult}
		<div out:fade="{{delay: 0, duration: 500}}">
			{addedResult}
		</div>
		{/if}
	</div>
	<div class="add-resbtn">
		<button class="narrow" on:click={() => add()} style="width:100%;" disabled={!isEnabledAdd}>Add Feed</button>
		<button class="secondary narrow" on:click={() => cancel()} style="width:100%; margin:0;" disabled={!isEnabledCancel}>Cancel</button>
	</div>
	<div class="cover" class:is-hidden={!isLoading}>
		<i class="fa-solid fa-circle-notch fa-spin"></i>
	</div>
</div>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

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
		border: 1px solid $gray-light;
		padding: 0.3rem;
		margin: 0 0 1rem;
		background-color: lighten($link-color, 45%);
		position: relative;
	}

	.add-title {
		grid-area: title;
		padding: 0.5rem;
		font-weight: bold;
		color: $dark-text;
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
		color: $color-success;
		background-color: $color-success-bg;
		border: 1px solid $color-success;
	}

	.is-error {
		color: $color-error;
		background-color: $color-error-bg;
		border: 1px solid $color-error;
	}


	@media screen and (max-width: $bp-small) {
		

	}

</style>