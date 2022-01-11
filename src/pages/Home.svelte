<script lang="ts">
	// import type { AxiosResponse } from "axios";
  // import { httpClient as ax } from "../stores/httpclient-store";
  // import { navTo } from "../stores/route-store.js";
  // import { isLoggedIn } from "../stores/user-store.js";
  

	// $ax.get("/api/Calendar/GetNext")
	// 	.then((response: AxiosResponse<ICalendar>) => nextSale = response.data)
	// 	.catch((err) => console.log({err}));


	// let goToShoppingList = (e: MouseEvent) => {
	// 	e.preventDefault();
	// 	if ($isLoggedIn)
	// 		navTo(e, "/shopping-list");
	// 	else
	// 		() => {} //no-op
	// };

  // async function getWeather() {
	// 	gettingWx = true;
	// 	const res = await fetch("https://localhost:44370/WeatherForecast");
	// 	wx = await res.json();
	// 	console.log(wx);
	// 	gettingWx = false;
  // }
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

<div class="container">
	<div class="content">
		<ul>
			<li>Begin</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam culpa non earum porro delectus doloribus nam et veniam ut tempora.</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
			<li>Stuff here</li>
		</ul>
	</div>
</div>

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

	/*
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