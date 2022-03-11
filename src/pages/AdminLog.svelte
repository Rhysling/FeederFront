<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Container from "../components/Container.svelte";

	import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../stores/httpclient-store";
	import flatpickr from "flatpickr";
	import type { Instance } from 'flatpickr/dist/types/instance';

	let logItems: ILogItemOut[] = [];

	let fp: Instance;
	let now = new Date();
	let utcNow = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

	const levels = [
		{ id: 1, text: "Info" },
		{ id: 2, text: "Warn" },
		{ id: 3, text: "Error" }
	];
	let selectedLevel = 1;

	const takeList = [
		{ id: 50, text: "50" },
		{ id: 100, text: "100" },
		{ id: 200, text: "200" },
		{ id: 999, text: "ForDate" }
	];
	let selectedTake = 50;

  
	const getLogItems = async () => {
		try {
			const response: AxiosResponse<ILogItemOut[]> = await $ax.get(`/api/Log/GetItems?asOfDate=${fp.selectedDates[0].toJSON()}&takeCount=${selectedTake}`);
			logItems = response.data;
		}
		catch (error) {
			console.error(error);
		}
	};

	const toggleDetail = (id: string) => {
		let ix = logItems.findIndex(a => a._id === id);
		if (ix > -1) {
			logItems[ix].showDetail = !logItems[ix].showDetail;
		}
	};

	const toggleAllDetail = () => {
		if (!logItems.length) return;

		let isOpen = !logItems[0].showDetail;
		logItems = logItems.map(a => {a.showDetail = isOpen; return a;});
	};

	

	onMount(() => {
		fp = <Instance>flatpickr("#fp", { altInput: true, static: true, defaultDate: utcNow });
	});

	onDestroy(() => {
		fp.destroy();
	});

</script>

<Container>
	<h1>TwitFeeder Log</h1>

	<div class="top">
		<div class="now">
			Now: {now.toUTCString()}
		</div>
		<div class="toggle">
			<a href="/" on:click|preventDefault={toggleAllDetail}>Toggle Detail</a>
		</div>
	</div>
	<div class="bar">
		<div>As of:
			<input id="fp" type="text" placeholder="Select Date.." readonly />
		</div>
		<div>&#9679;</div>
		<div>
			Take:
			<select bind:value={selectedTake} style="width:5rem;">
				{#each takeList as take}
				<option value={take.id} selected={(take.id == selectedTake) ? true : undefined}>{take.text}</option>
				{/each}
			</select>
		</div>
		<div>
			<select bind:value={selectedLevel} style="width:4rem;">
				{#each levels as level}
				<option value={level.id} selected={(level.id == selectedLevel) ? true : undefined}>{level.text}</option>
				{/each}
			</select>
		</div>
		<div>&#9679;</div>
		<button on:click={() => getLogItems()}>Search</button>
	</div>

	<div class="log">
		<div class="head">Time</div>
		<div class="head">Level</div>
		<div class="head">Message</div>
		{#each logItems as item}
			<div class:error={item.levelId == 3} class:warning={item.levelId == 2}>{item.eventDatePT}</div>
			<div class:error={item.levelId == 3} class:warning={item.levelId == 2}>{item.levelName}</div>
			<div class:error={item.levelId == 3} class:warning={item.levelId == 2}>
				{#if item.infoObjDisplay && item.infoObjDisplay.trim()}
				<a href="/" on:click|preventDefault={() => toggleDetail(item._id) }>{item.message}</a>
				{:else}
				{item.message}
				{/if}
			</div>
			<div class="detail" class:show={item.showDetail ? true : undefined}>{item.infoObjDisplay}</div>
		{/each}
	</div>
</Container>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

	h1 {
		font-size: 1.3rem;
		text-align: center;
		margin: 0 0 0.5rem 0;
		padding: 0.5rem 0;
		border-bottom: 1px solid $gray-light;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin: 0;
		padding: 0.5rem 0.5rem 0;

		.now {
			font-size: 1.1rem;
			color: $dark-text;
			padding: 0.5rem 0.5rem 0;
		}
		.toggle {
			font-size: 0.8rem;
		}
	}

	

	.bar {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		background-color: $blue-background;
		border: 2px solid black;
		margin: 1rem 0;
		padding: 0.5rem;
		font-size: 0.8rem;

		input[type="text"] {
			width: 8.5rem;
		}
	}

	.log {
		display: grid;
		grid-template-columns: 20fr 8fr 60fr;
		font-size: 0.8rem;
		margin-top: 1rem;
		border: 1px solid $dark-text;

		> div {
			line-height: 1.1;
			padding: 0.1rem;
			border-bottom: 1px solid $gray-lighter;
		}

		.head {
			font-size: 0.8rem;
			font-weight: bold;
			color: $main-color;
			border-bottom: 1px solid $dark-text;
		}

		.detail {
			font-size: 0.8rem;
			grid-column-start: 1;
			grid-column-end: -1;
			max-height: 0;
			transition: max-height 0.25s ease-out;
			visibility: hidden;
			opacity: 0;
			transition: visibility 0s, opacity 0.5s linear;
			overflow: hidden;
			background: $gray-lighter;

			&.show {
				max-height: 500px;
				transition: max-height 0.25s ease-in;
				visibility: visible;
				opacity: 1;
				overflow: visible;
			}
		}

		.error {
			color: $color-error;
			background-color: $color-error-bg;
		}

		.warning {
			color: $color-warning;
			background-color: $color-warning-bg;
		}
	}

	@media screen and (max-width: $bp-small) {
		

	}

</style>