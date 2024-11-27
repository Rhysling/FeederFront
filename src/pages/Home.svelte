<svelte:options runes={true} />

<script lang="ts">
	//import { onMount } from 'svelte';
	import Container from "../components/Container.svelte";
	import FeedList from "../components/FeedList.svelte";

	import type { AxiosResponse } from "axios";
	import { httpClient as ax } from "../stores/httpclient-store";

	// *** Begin Testing ***
	let unsecuredVal = $state("Empty");
	let securedVal = $state("Empty");
	let adminVal = $state("Empty");

	const getUnsecured = () => {
		$ax
			.get("/api/Test/GetUnsecuredValue")
			.then((response: AxiosResponse<string>) => (unsecuredVal = response.data))
			.catch((err) => console.error({ getUnsecuredErr: err }));
	};

	const getSecured = () => {
		$ax
			.get("/api/Test/GetSecuredValue")
			.then((response: AxiosResponse<string>) => (securedVal = response.data))
			.catch((err) => console.error({ getSecuredErr: err }));
	};

	const getAdmin = () => {
		$ax
			.get("/api/Test/GetAdminValue")
			.then((response: AxiosResponse<string>) => (adminVal = response.data))
			.catch((err) => console.error({ getAdminErr: err }));
	};
	// *** End Testing ***
</script>

<div class="splash-container">
	<div class="splash">
		<div class="splash-logo">
			<img
				src="/assets/img/logo-twitfeeder-400x400.png"
				alt="TwitFeeder"
				title="Twitter and other feeds sent to your RSS reader"
			/>
		</div>
		<p class="splash-subhead">Twitter and other feeds in your RSS reader</p>
	</div>
</div>

<Container ishome={true}>
	{#if false}
		<h1>Test request no auth</h1>
		<div>Unsecured value: {unsecuredVal}</div>
		<button
			onclick={(e) => {
				e.preventDefault();
				getUnsecured();
			}}>Get Unsecured</button
		>

		<h1>Test request with auth</h1>
		<div>Secured value: {securedVal}</div>
		<button
			onclick={(e) => {
				e.preventDefault();
				getSecured();
			}}>Get Secured</button
		>

		<h1>Test requires admin</h1>
		<div>Unsecured value: {adminVal}</div>
		<button
			onclick={(e) => {
				e.preventDefault();
				getAdmin();
			}}>Get Admin</button
		>
	{/if}

	<FeedList userId={"public-user"} isEdit={false} />
</Container>

<style lang="scss">
	@use "../styles/_custom-variables" as c;

	.splash-container {
		background: c.$main-color;
		z-index: -1;
		overflow: hidden;
		width: 100%;
		height: 25rem;
		top: 0;
		left: 0;
		position: fixed;
	}
	.splash {
		width: min(c.$content-max-width, 92.5%);
		height: 200px;
		margin: 6rem auto 0;
	}

	.splash-logo {
		background-color: c.$body-background;
		border: 3px solid c.$body-background;
		padding: 1em 1.6em;
		border-radius: 5px;

		img {
			display: block;
			max-width: 200px;
			margin: 0 auto;
		}
	}

	.splash-subhead {
		color: c.$body-background;
		letter-spacing: 0.05em;
		opacity: 0.8;
		text-align: center;
		margin-top: 1rem;
		text-transform: uppercase;
	}

	@media screen and (max-width: c.$bp-small) {
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
</style>
