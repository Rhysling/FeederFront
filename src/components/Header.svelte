<script lang="ts">
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';

  import { user } from "../stores/user-store";
  import { httpClient as ax } from "../stores/httpclient-store";
  import type { AxiosResponse } from "axios";
  import { currentSlug, navTo } from "../stores/route-store.js";

  let showAdmin = false;

  
	onMount(async () => {
		await user.initAuth0Async();

    if ($user.isAuthenticated) {
      window.history.replaceState({}, document.title, window.location.pathname);

      return;
    }

    const query = window.location.search;
    const shouldParseResult = query.includes("code=") && query.includes("state=");

    if (shouldParseResult) {
      try {
        await user.handleRedirectCallbackAsync();

        let isAuth = await user.getIsAuthenticatedAsync();

        if (isAuth) {
          await user.getIdTokenClaimsAsync();
          await user.getAuthTokenAsync();
          try {
            const response: AxiosResponse<string> = await $ax.post("/api/User/Login", $user);
            if (response.data)
              console.error(response.data);
          } catch (error) {
            console.error(error);
          }

        }
        else {
          console.error("FAILED login on redirect!");
        }

        $user.isAuthenticated = isAuth;

      } catch (err) {
        console.error("Error parsing redirect:", err);
      }

      window.history.replaceState({}, document.title, "/");
    }

    
    
	});

</script>

<div class="ap-menu">
  {#if !showAdmin}
    <div transition:slide class="ap-menu-main">
      <div class="ap-menu-heading">
        <a
          href="/"
          on:click={(e) => navTo(e, "/")}
          class:selected={("/" === $currentSlug) ? true : undefined}>Twit Feeder</a>
      </div>
      <a
        class="ap-menu-logo" href="/"
        on:click={(e) => navTo(e, "/")}
        class:selected={("/" === $currentSlug) ? true : undefined}><img src="/assets/img/logo-twitfeeder-400x400.png" alt="TwitFeeder" title="Twitter and other feeds sent to your RSS reader" /></a>
      {#if $user.isAuthenticated}
        <div class="ap-menu-text">{$user.fullName}</div>
      {/if}
      <div class="ap-menu-sep">&nbsp;</div>

      {#if $user.isAuthenticated}
        <a
          href="/my-feeds"
          on:click={(e) => navTo(e, "/my-feeds")}
          class:selected={("/my-feeds" === $currentSlug) ? true : undefined}>My Feeds</a>
        <a
          href="/account"
          on:click={(e) => navTo(e, "/account")}
          class:selected={("/account" === $currentSlug) ? true : undefined}>Account</a>
        {#if $user.isAdmin}<a href="/" on:click|preventDefault={ () => showAdmin = !showAdmin }>Admin</a>{/if}
        <a href="/" on:click|preventDefault={ () => user.logout() }>Sign Out</a>
      {:else}
        <a href="/" on:click|preventDefault={ async () => await user.loginAsync(null) }>Sign In/Sign Up</a>
      {/if}
    </div>
  {:else}
    <div transition:slide class="ap-menu-admin">
      <a href="/" on:click={(e) => {e.preventDefault(); showAdmin = !showAdmin; }}>&lt; Back</a>
      <div class="ap-menu-sep">&nbsp;</div>
      <a
          href="/admin-users"
          on:click={(e) => navTo(e, "/admin-users")}
          class:selected={("/admin-users" === $currentSlug) ? true : undefined}>Users</a>
        <a
          href="/admin-log"
          on:click={(e) => navTo(e, "/admin-log")}
          class:selected={("/admin-log" === $currentSlug) ? true : undefined}>Log</a>
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

    > div, a {
      padding: 0.5rem 0.75rem;
    }
  }

  .ap-menu-main {
    .ap-menu-logo {
      display: none;
    }
  }

  a {
    color: lighten($link-color, 25%);
    display: block;
    text-decoration: none;
    white-space: nowrap;

    &.selected {
      font-weight: bold;
      cursor: default;
    }

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