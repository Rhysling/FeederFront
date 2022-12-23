<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isShowModal = false;

	const dispatch = createEventDispatcher();

	const hideModal = () => dispatch("hide-modal", null);

	const hideModalKey = (e: KeyboardEvent) => {
		const code = e.code;
		alert(code);
	};


</script>

<div class="modal" on:click={hideModal} on:keyup={(e) => hideModalKey(e)} style="display:{isShowModal ? "flex" : "none"}">
  <i class="close fas fa-times" on:click={hideModal} on:keyup={(e) => hideModalKey(e)} title="close"></i>
  <div class="content" on:click|stopPropagation={()=>{}} on:keyup|stopPropagation={() => {}}>
    <slot />
  </div>
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
    background-color: rgba(0,0,0,0.4);
    justify-content: center;
    align-items: center;
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
      color: white;
      text-decoration: none;
      cursor: pointer;
    }
  }

  .content {
    max-width: 80vw;
    max-height: 80vh;
  }

</style>