<svelte:options runes={true} />

<script lang="ts">
	import Container from "../components/Container.svelte";
	import AddFeed from "../components/AddFeed.svelte";
	import FeedList from "../components/FeedList.svelte";
	import type { AxiosResponse } from "axios";
	import { httpClient as ax } from "../stores/httpclient-store";

	let userList: IUserInfo[] = $state([]);
	let currentUser: IUserInfo | undefined = $state(undefined);

	let feedCountTotal: number | undefined = $state(undefined);
	let feedCountLimit: number | undefined = $state(undefined);
	let feedToAdd: IFeed | null | undefined = $state(null);

	const setFeedCountTotal = (fct: number | undefined) => {
		feedCountTotal = fct;
	};
	const setFeedCountLimit = (fcl: number | undefined) => {
		feedCountLimit = fcl;
	};
	const addFeed = (feed: IFeed) => {
		feedToAdd = feed;
	};

	const loadUsers = async () => {
		try {
			const response: AxiosResponse<IUserInfo[]> = await $ax.get(
				"/api/User/GetAllUsers",
			);
			userList = response.data;

			if (userList && userList.length) currentUser = userList[0];
		} catch (error) {
			console.error(error);
		}
	};

	loadUsers();
</script>

<Container>
	<h1>Admin User Feeds</h1>
	<div class="user-select">
		<select bind:value={currentUser} onchange={() => {}}>
			{#each userList as u}
				<option value={u}>
					{u.fullName}
				</option>
			{/each}
		</select>
		<div>
			Current: {currentUser ? currentUser.fullName : "Null"}
		</div>
	</div>

	<AddFeed {feedCountTotal} {feedCountLimit} {addFeed} />
	<FeedList
		userId={currentUser?.userId || undefined}
		{feedToAdd}
		isEdit={true}
		{setFeedCountTotal}
		{setFeedCountLimit}
	/>
</Container>

<style lang="scss">
	@use "../styles/_custom-variables" as c;

	h1 {
		text-align: center;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid c.$body-text;
	}

	.user-select {
		display: flex;
		align-items: baseline;
		padding: 1rem 0;

		select {
			flex: 1 1 auto;
		}

		div {
			flex: 1 1 auto;
			text-align: right;
		}
	}

	@media screen and (max-width: c.$bp-small) {
	}
</style>
