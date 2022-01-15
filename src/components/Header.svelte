<script lang="ts">
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';

  import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
  //import { routes, currentRoute, navTo } from "../stores/route-store.js";

  let isAuthenticated = false;
  let fullName = "Test Name";
  let showAdmin = false;

  // *** auth0 ***
  let auth0: Auth0Client | null = null;
  let config = {
    "domain": "dev-rbsjv5fo.us.auth0.com",
    "client_id": "LDAABMhgOTuV8Ixu83phtk0BcIG3zrCm"
  };


  /**
   * Starts the authentication flow
   */
  const login = async (targetUrl: string | null) => {
    try {
      console.log("Logging in", targetUrl);

      const options = {
        redirect_uri: window.location.origin,
        appState: targetUrl ? { targetUrl } : undefined
      };
      if (auth0)
        await auth0.loginWithRedirect(options);

      isAuthenticated = true;

    } catch (err) {
      console.log("Log in failed", err);
      isAuthenticated = false;
    }
  };

  /**
   * Executes the logout flow
   */
  const logout = () => {
    try {
      console.log("Logging out");

      if (auth0) {
        isAuthenticated = false;
        auth0.logout({
          returnTo: window.location.origin
        });
      }
        
    } catch (err) {
      console.log("Log out failed", err);
    }
  };
  
  /**
   * Initializes the Auth0 client
   */
  const configureClient = async () => {
    auth0 = await createAuth0Client(config);
  };

  /**
   * Checks to see if the user is authenticated. If so, `fn` is executed. Otherwise, the user
   * is prompted to log in
   * @param {*} fn The function to execute if the user is logged in
   */
  // const requireAuth = async (fn, targetUrl) => {
  //   const isAuthenticated = await auth0.isAuthenticated();

  //   if (isAuthenticated) {
  //     return fn();
  //   }

  //   return login(targetUrl);
  // };




	onMount(async () => {
		console.log("The component has mounted.");

    await configureClient();

    isAuthenticated = !!auth0 && await auth0.isAuthenticated();

    if (isAuthenticated && auth0) {
      console.log("Mount: User is authenticated.");
      window.history.replaceState({}, document.title, window.location.pathname);
      //updateUI();
      const user = await auth0.getUser();
      console.log({user: user});

      return;
    }

    console.log("Mount: User not authenticated.");

    const query = window.location.search;
    const shouldParseResult = query.includes("code=") && query.includes("state=");

    if (shouldParseResult) {
      console.log("Mount: Parsing redirect.");

      if (auth0) {
        try {
          const result = await auth0.handleRedirectCallback();

          console.log({redirectResult: result})
          console.log("Logged in!");
          isAuthenticated = true;

          const user = await auth0.getUser();
          console.log({ user });

          let claims: any = await auth0.getIdTokenClaims();
          console.log({ claims });

          let roles = (claims||{})["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
          console.log("Roles: " + roles.join(","));
          

        } catch (err) {
          console.log("Error parsing redirect:", err);
        }
      }

      window.history.replaceState({}, document.title, "/");
    }

    
    
	});

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
        <a href="/" on:click={(e) => {e.preventDefault(); logout(); }}>Sign Out</a>
      {:else}
        <a href="/" on:click={async (e) => {e.preventDefault(); await login(null); }}>Sign In/Sign Up</a>
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