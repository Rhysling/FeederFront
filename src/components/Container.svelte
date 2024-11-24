<script lang="ts">
	export let ishome = false;
</script>

<div class="container" class:ishome>
	<div class="content">
		<slot></slot>
	</div>
</div>

<style lang="scss">
	@use "../styles/_custom-variables" as c;

	.container {
		display: flex;
		align-content: center;
		justify-content: center;
		width: 100%;
		margin-top: 4rem;
		background-color: c.$body-background;
		border-top: 2px solid c.$dark-background;

		@media screen and (max-width: c.$bp-small) {
			margin-top: 0;
		}

		&.ishome {
			margin-top: 25rem;

			@media screen and (max-width: c.$bp-small) {
				margin-top: 0;
			}
		}
	}

	.content {
		display: block;
		padding: 1rem;
		background-color: c.$body-background;
		width: min(c.$content-max-width, 90%);
		min-height: 60vh;
	}

	@media screen and (max-width: c.$bp-small) {
		.content {
			padding: 1rem 0;
		}
	}
</style>
