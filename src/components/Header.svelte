<script>
  import { currentRoute, navTo } from "../stores/route-store.js";
  import Headroom from "./Headroom.svelte"; // Thanks to "svelte-headroom"
  import Nav from "./Nav.svelte";

  $: slug = $currentRoute.slug;

</script>

<div class="page-head" class:subpage={slug != "/"}>
  <a href="/" on:click={(e) => navTo(e, "/")}>
    <img class="logo" src="./assets/img/botanica-logo-512x512.png" alt="Botanica" />
  </a>
  <div class="page-title">
    <div class="botanica">Botanica</div>
    <div class="page-name">{$currentRoute.title || $currentRoute.page}</div>
  </div>
  <img class="logo" src="./assets/img/botanica-logo-512x512.png" alt="Botanica" />
</div>
{#if slug == "/"}
  <div class="subtitle">
    A specialty nursery featuring rare, choice, and unusual perennials...<br>
    as well as many old favorites.
  </div>
{/if}

<Headroom offset={ 110 }>
  <Nav { slug } />
</Headroom>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .page-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: block;
    width: clamp(50px, 22px + 11vw, 110px);
    height: auto;
    filter: drop-shadow(1px 1px 1px #333);
  }

  .page-title {
    font-family: 'Arrus-BT-Bold', 'Times New Roman', Times, serif;
    filter: drop-shadow(1px 1px 1px #333);

    .botanica {
      font-size: clamp(30px, 11vw - 3px, 85px);
      text-transform: uppercase;
      text-align: center;
      color: $second-color;
    }

    .page-name {
      display: none;
      text-align: center;
      margin-top: -5px;
    }
  }

  .subpage {
    margin-bottom: 0.3rem;

    .logo {
      width: clamp(40px, 10px + 11vw, 85px);
    }

    .botanica {
      font-size: 30px;
      color: $second-color;
    }

    .page-name {
      display: block;
      font-size: clamp(30px, 13vw - 50px, 45px);
      color: darken($main-color, 5%);
    }
  }
  

  .subtitle {
    font-weight: bold;
    font-style: italic;
    font-size: 0.75rem;
    width:100%;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  @media screen and (max-width: $bp-small) {
    .page-head {
      display:block;

      .botanica {
        text-align: center;
      }

      .page-name {
        text-align: center;
      }
    }

    .logo {
      display: none;
    }
  }
</style>