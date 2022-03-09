<script>
  import { navTo } from "../stores/route-store.js";

  let yr = new Date().getFullYear() - 2000;

  let scrollToTop = () => {
    window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
  };

</script>

<footer>
  <a href="/" on:click|preventDefault={() => scrollToTop()}>Top</a> | &copy;2001-{yr} TwitFeeder | 
  <a href="/" on:click|preventDefault={(e) => navTo(e, "/terms-of-service")}>Terms of Service</a> &#9679;
  <a href="/" on:click|preventDefault={(e) => navTo(e, "/privacy-policy")}>Privacy Policy</a>
</footer>


<style lang="scss">
  @import "../styles/_custom-variables.scss";

  footer {
    line-height: 1.2em;
    padding: 0.5rem 0;
    font-size: 0.9rem;
    color: $light-text;
    background-color: $dark-background;
    text-align: center;
    vertical-align: middle;
    position: sticky;
    top: calc(100vh - 4rem);
  }

  a {
    color: lighten($link-color, 25%);
    text-decoration: none;
    font-size: 0.9rem;

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

</style>