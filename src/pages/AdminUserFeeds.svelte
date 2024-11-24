<script lang="ts">
	import Container from "../components/Container.svelte";
	import AddFeed from "../components/AddFeed.svelte";
	import FeedList from "../components/FeedList.svelte";
	import type { AxiosResponse } from "axios";
	import { httpClient as ax } from "../stores/httpclient-store";

	let userList: IUserInfo[] = [];
	let currentUser: IUserInfo | undefined;

	let feedCountTotal: number | undefined = undefined;
	let feedCountLimit: number | undefined = undefined;
	let feedToAdd: IFeed | null | undefined = null;

	const setFeedCountTotal = (e: CustomEvent<number>) =>
		(feedCountTotal = e.detail);
	const setFeedCountLimit = (e: CustomEvent<number>) =>
		(feedCountLimit = e.detail);
	const addFeed = (e: CustomEvent<IFeed>) => (feedToAdd = e.detail);

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
		<select bind:value={currentUser} on:change={() => {}}>
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

	<AddFeed {feedCountTotal} {feedCountLimit} on:add-feed={addFeed} />
	<FeedList
		userId={currentUser?.userId || undefined}
		{feedToAdd}
		isEdit={true}
		on:feed-count-total={setFeedCountTotal}
		on:feed-count-limit={setFeedCountLimit}
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
