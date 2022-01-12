<script lang="ts">
  import { slide } from 'svelte/transition';
  import { routes, currentRoute, navTo } from "../stores/route-store.js";

  let isAuthenticated = true;
  let fullName = "Test Name";
  let isAdmin = true;
  let showAdmin = false;

  $: slug = $currentRoute.slug;

</script>

<div class="ap-menu">
  {#if !showAdmin}
    <div transition:slide class="ap-menu-main">
      <div class="ap-menu-heading"><a href="/">Twit Feeder</a></div>
      <a class="ap-menu-logo" href="/"><img src="/assets/img/logo-twitfeeder-400x400.png" alt="TwitFeeder" title="Twitter and other feeds sent to your RSS reader" /></a>
      {#if isAuthenticated}
        <div class="ap-menu-text">{fullName}</div>
      {/if}
      <div class="ap-menu-sep">&nbsp;</div>

      {#if isAuthenticated}
        <a href="/Manage/MyFeeds">My Feeds</a>
        <a href="/" on:click={(e) => {e.preventDefault(); showAdmin = !showAdmin; }}>Account</a>
        <a href="/Account/LogOff">Sign Out</a>
      {:else}
        <a href="/Account/Login">Sign In/Sign Up</a>
      {/if}
    </div>
  {:else}
    <div transition:slide class="ap-menu-admin">
      <a href="/" on:click={(e) => {e.preventDefault(); showAdmin = !showAdmin; }}>&lt; Back</a>
      <div class="ap-menu-sep">&nbsp;</div>
      <a href="/Admin/Users">Users</a>
      <a href="/Admin/Log">Log</a>
    </div>
  {/if}
</div>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .ap-menu {
    width: 100%;
    position: fixed;
    top: 0;
		left: 0;
  }
  .ap-menu-main, .ap-menu-admin {
    display: flex;
    flex-flow: row nowrap;
    align-items: baseline;
    background: $dark-background;

    .ap-menu-logo {
      display: none;
    }

    > div, a {
      padding: 0.5rem 0.75rem;
    }
  }

  a {
    color: lighten($link-color, 25%);
    display: block;
    text-decoration: none;
    white-space: nowrap;

    &:visited {
      color: lighten($link-color, 25%);
    }

    &:hover,
    &:focus {
      background: none;
      border: none;
      color: lighten($link-color, 45%);
      text-decoration: none;
    }
  }

.ap-menu-heading {
	color: white;
	font-weight: 400;
	font-size: 120%;
	text-transform: uppercase;
}

.ap-menu-sep {
	flex: 1 1 auto;
}

.ap-menu-text {
	top: 2px;
  font-size: 90%;
}


@media screen and (max-width: $bp-small) {

  .ap-menu {
    position: static;
  }

  .ap-menu-heading {
    display: none;
  }

  .ap-menu-main {
    align-items: center;

    .ap-menu-logo {
      display: block;

      img {
        max-width: 25px;
        margin-top: 0.3rem;
      }
    }

    > div, a {
      padding: 0.25rem 0.5rem;
    }
  }
}

</style>