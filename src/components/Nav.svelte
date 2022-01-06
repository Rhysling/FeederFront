<script lang="ts">
  import { routes, navTo } from "../stores/route-store.js";

  export let slug = "/";

  let allRoutes: Route[];
  $: {
    allRoutes = [{...$routes}, ...($routes.children?.filter(a => !a.isHidden) || [])];
    allRoutes[0].children = [];
  }

  let isOpenRoot = false;

  let setOpenRoot = (val: boolean) => {
    isOpenRoot = val;
    toggleOpenDropdown("");
  };

  let toggleOpenDropdown = (slug: string) => {
    // let r = allRoutes.find(a => a.slug == slug);
    // if (r) r.isExpanded = !r.isExpanded;
    for (let r of allRoutes) {
      r.isExpanded = (r.slug == slug) ? !r.isExpanded : false;
    }
    allRoutes = allRoutes;
  };

  let nav = (e: MouseEvent, slug: string) => {
    e.stopPropagation();
    navTo(e, slug);
    setOpenRoot(false);
  };


</script>

<div class="nav-vertical" class:open={isOpenRoot ? true : undefined}>
  <div
    class="nav-toggle"
    on:mouseenter={() => setOpenRoot(true)}
    on:click|stopPropagation={() => setOpenRoot(!isOpenRoot)}
    ><i class="fas fa-bars"></i></div>
  <nav>
    {#each allRoutes as r}
    {#if r.children && r.children.length}
      <a
        href="/"
        on:click|preventDefault|stopPropagation={() => toggleOpenDropdown(r.slug)}
        class="dropdown" class:open={r.isExpanded ? true : undefined}>
        <span class="icon">{r.page}</span>
        <div class="dropdown-content">
          {#each r.children.filter(a => !a.isHidden) as c}
            <a
              href="/"
              on:click={(e) => nav(e, c.slug)}
              class:selected="{c.slug === slug}">{c.navName || c.page}</a>
          {/each}
        </div>
      </a>
    {:else}
      <a
        href="/"
        on:click={(e) => nav(e, r.slug)}
        class:selected="{r.slug === slug}">{r.navName || r.page}</a>
    {/if}
    {/each}
  </nav>
</div>

<svelte:body
  on:click={() => setOpenRoot(false)}
/>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .icon::after {
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    margin-left: 0.5em;
  }

  nav {
    display: flex;
    background-color: $nav-bg-color;

    a {
      display: block;
      box-shadow: 0px 6px 12px 0px rgba(0,0,0,0.2);
      border-radius: 5px;
      padding: 0.5em;
      margin: 0.5em;
    }

    // a:first-child {
    //   margin: 0.5em 0.5em 0.5em 0.25rem;
    // }

    a:hover {
      background-color: darken($nav-bg-color, 10%);
    }

    a.selected {
      color: #eee;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.6);
      background-color: $main-color;
      cursor: default;

      &:hover {
        text-decoration: none;
      }
    }


    .dropdown {
      position: relative;
      display: block;
    }

    .icon::after {
    font-family: "Font Awesome 5 Free"; font-weight: 900; content: "\f107";
  }

    .dropdown-content {
      display: none;
      position: absolute;
      background-color: $nav-drop-bg-color;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      padding: 0.5em 0.75em;
      z-index: 1;

      a {
        display: block;
        margin: 0;
        font-size: 0.85em;
      }

      a:hover {
        background-color: darken($nav-drop-bg-color, 10%);
      }

      a.selected:hover {
        background-color: $main-color;
      }
    }

    // .dropdown:hover .dropdown-content {
    //   display: block;
    // }

    .dropdown.open .dropdown-content {
      display: block;
    }
  }

  .nav-toggle {
    display: none;
  }

  @media screen and (max-width: $bp-small) {

    .nav-toggle {
      display: block;
      background-color: $nav-bg-color;
      padding: 0.5em;

      i {
        display: block;
        font-size: 1.2em;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .nav-vertical {

      nav {
        display: none;
        position: absolute;
        z-index: 1;
        transition: height 0.5s ease 0;

        .icon::after {
          font-family: "Font Awesome 5 Free"; font-weight: 900; content: "\f105";
        }

        a {
          display: block;
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
          padding: 0.5em 0.75em;
        }

        a, a:first-child {
          margin: 0.5em;
        }
      }

      // &:hover nav {
      //   display: block;
      // }

      &.open nav {
        display: block;
      }
    }


  }

</style>