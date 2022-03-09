<script lang="ts">
	import Container from "../components/Container.svelte";
	import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../stores/httpclient-store";
  import { user } from "../stores/user-store.js";
  
	let ui: IUserInfo | undefined;

	const getUserInfo = async () => {
		try {
			const response: AxiosResponse<IUserInfo> = await $ax.get(`/api/User/GetUserInfo/${$user.userId}`);
			ui = response.data;
		}
		catch (error) {
			console.error(error);
		}
	};

	const loginProvider = (id: string) => {
		if (id.startsWith("twit")) return "Twitter";
		if (id.startsWith("goog")) return "Google";
		if (id.startsWith("auth")) return "Auth0";
		return "unknown";
	};

	getUserInfo();

</script>

<Container>
	<h1>Account Page</h1>

	<div class="info">
		<div class="title">Your Name</div>
		<div class="content">{ui?.fullName || "missing"}</div>
	</div>
	<div class="info">
		<div class="title">Email</div>
		<div class="content">{ui?.email || "not provided"}</div>
	</div>
	<div class="info">
		<div class="title">Subscription Key</div>
		<div class="content">{ui?.subscriptionKey || "not available"}</div>
	</div>
	<div class="info">
		<div class="title">Login Source</div>
		<div class="content">{ loginProvider($user.userId) }</div>
	</div>
	<div class="info">
		<div class="title">Last Login</div>
		<div class="content">{ui?.lastLogin || "not available"}</div>
	</div>
	<div class="info">
		<div class="title">Feed Count</div>
		<div class="content">
			{#each (ui?.feedCounts || []) as fc }
				<div>{fc.key} - {fc.value}</div>
			{:else}
				None
			{/each}
		</div>
	</div>
</Container>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

	h1 {
		font-size: 1.2rem;
		text-align: center;
		padding: 0.5rem 0;
	}

	.info {
		margin: 0.5rem 0 0 0;
		border-bottom: 1px solid $gray-light;

		.title {
			color: $main-color;
			font-weight: bold;
		}

		.content {
			padding: 0 0 1rem 1rem;
		}

	}

	@media screen and (max-width: $bp-small) {
		

	}

</style>