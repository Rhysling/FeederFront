<script>

  export let slug = "/";

  let yr = new Date().getFullYear() - 2000;
  let isFooter = true;

  let scrollToTop = () => {
    window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
  };

</script>

<footer>
  <div class="f1">
    {#if slug == "/"}
    Remember, plant selections change throughout the season!
    {:else}
    <hr style="width:100%" />
    {/if}
  </div>
  <div class="f2">
    <a href="/" on:click|preventDefault={scrollToTop}>Top</a> | &copy;2001-{yr} Pamela Harlow
  </div>
  <br />
</footer>


<style>

  .f1 {
    font-family: 'Arrus-BT-Bold', 'Times New Roman', Times, serif;
    font-weight: bold;
    font-size: 1rem;
    text-align: center;
    width: 100%;
    margin-top: 1rem;

  }

  .f2 {
    font-size: 0.75rem;
    text-align: center;
    width: 100%;
    margin-top: 0.5rem;
  }

</style>