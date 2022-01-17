<script lang="ts">
  export let ishome = false;

</script>

<div class="container" class:ishome>
	<div class="content">
		<slot></slot>
	</div>
</div>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

	.container {
		display: flex;
		align-content: center;
		justify-content: center;
		width: 100%;
		margin-top: 4rem;
		background-color: pink;
		border-top: 2px solid $dark-background;

			@media screen and (max-width: $bp-small) {
				margin-top: 0;
			}

      &.ishome {
        margin-top: 25rem;

        @media screen and (max-width: $bp-small) {
          margin-top: 0;
        }
      }

	}

	.content {
		display: block;
		padding: 1rem;
		background-color: $body-background;
		width: min($content-max-width, 90%);
	}

	

	@media screen and (max-width: $bp-small) {
		

	}

</style>