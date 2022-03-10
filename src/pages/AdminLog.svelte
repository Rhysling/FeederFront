<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Container from "../components/Container.svelte";

	import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../stores/httpclient-store";
	import flatpickr from "flatpickr";
	import type { Instance } from 'flatpickr/dist/types/instance';

	let fp: Instance;
	let now = new Date();
	let utcNow = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  
	const runStats = async () => {
		try {
			const response: AxiosResponse<string> = await $ax.get("/api/Stats/UsersFeeds");
			let s = response.data;
		}
		catch (error) {
			console.error(error);
		}
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

	<div class="now">
		Now: {now.toUTCString()}
	</div>
	<div class="bar">
		<div>As of:</div>
		<input id="fp" type="text" placeholder="Select Date.." readonly />
		<div>&#9679; Take:</div>
		<div>
			<select style="width:3.5rem;">
				<option value="50" selected>50</option>
				<option value="100">100</option>
				<option value="200">200</option>
				<option value="500">500</option>
			</select>
		</div>
		<div>| All for date:</div>
		<input type="checkbox" style="position:relative;top:0.2rem;" />
		<div>&#9679;</div>
		<button on:click={() => console.log({fpDates: fp.selectedDates})}>Search</button>
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

	.now {
		font-size: 1.1rem;
		color: $dark-text;
		padding: 0.5rem 0.5rem 0;
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

	@media screen and (max-width: $bp-small) {
		

	}

</style>