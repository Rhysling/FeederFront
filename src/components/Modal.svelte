<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let isShowModal = false;

  const dispatch = createEventDispatcher();

  function setModal(val: boolean) {
		dispatch("setmodal", { val });
  }

</script>

<div class="modal" on:click={() => setModal(false)} style="display:{isShowModal ? "block" : "none"}">
  <i class="close fas fa-times" on:click={() => setModal(false)} title="close"></i>
  <slot />
</div>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .modal {
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
  }

  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    z-index: 110;
    
    &:hover,
    &:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
  }

</style>