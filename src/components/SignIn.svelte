<script lang="ts">
  import type { AxiosResponse } from "axios";
  import Modal from "./Modal.svelte";
  import { user, isLoggedIn } from "../stores/user-store";
	import { wishListStore as wls } from "../stores/wishlist-store.js";
  import { httpClient as ax } from "../stores/httpclient-store";
  
  $: isShowModal = false;
  let showModal = (val: boolean) => isShowModal = val;

  let setModal = (e: any) => {
    isShowModal = e.detail.val;
    resetUserLogin();
  }
  
  let userLogin: IUserLogin;

  let isValidEmail: boolean | null = null; // null / true / false
  let emailValidationMessage = "";
  let submitErrorMessage = "";
  let isShowName = false;
  let isShowPw = false;

  let showLogin = () => {
    showModal(true);
    setTimeout(() => document.getElementById("login-email")?.focus(), 200);
  };

  let resetUserLogin = () => {
    
    isValidEmail = null;
    emailValidationMessage = "";
    submitErrorMessage = "";

    isShowName = false;
    isShowPw = false;

    userLogin = {
      email: "",
      fullName: "", 
      pw: "" 
    };
  };

  resetUserLogin();


  let signOut = () => {
    user.logOut();
    $wls = [];
  };


  let validateEmail = function() {
    emailValidationMessage = "";
    userLogin.email = userLogin.email.trim();

    if (userLogin.email == "") {
      emailValidationMessage = "Email required.";
      isValidEmail = false;
      return;
    }

    isValidEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(userLogin.email);

    if (!isValidEmail)
      emailValidationMessage = "Email address doesn't look right.";

    isShowPw = userLogin.email.endsWith("polson.com");

    if (isShowPw)
    setTimeout(() => document.getElementById("login-pw")?.focus(), 200);
  };

  
  let showName = () => {
    isShowName = true;
    setTimeout(() => document.getElementById("login-name")?.focus(), 200);
  }


  let signIn = function() {
    validateEmail();

    if (!isValidEmail) return;

    $ax.post("/api/Login", userLogin)
    .then(function (response: AxiosResponse<UserClient>) {
      $user = response.data;
      resetUserLogin();
      isShowModal = false;
    })
    .then(() => {
      wls.init();
    })
    .catch(function (error) {
      if (error?.response?.status){
        let s = +error.response.status;
        submitErrorMessage = (s >= 400 && s < 500) ? "Email/password incorrect." : "Something went wrong.";
      }
      else {
        submitErrorMessage = "Something went wrong.";
      }
    });
    
  }

  let cancel = function() {
    resetUserLogin();
    isShowModal = false;
  }

</script>

{#if $isLoggedIn}
  {$user.fullName || $user.email} <a href="/" on:click|preventDefault={signOut}>Sign out</a>
{:else}
  <a href="/" on:click|preventDefault={() => showLogin()}>Sign in</a>
{/if}

<Modal { isShowModal } on:setmodal={setModal}>
  <div class="modal-content" on:click={(e) => e.stopPropagation()}>
    <div class="title">
      Provide your email address to save your plant wish list.
    </div>
    <div class="content">
      <input
        id="login-email"
        type="text"
        class="signin"
        placeholder="Email"
        bind:value={userLogin.email}
        on:blur={validateEmail} />
      <div class="error">{emailValidationMessage}</div>

      <a href="/" on:click|preventDefault={showName} style="display:{isShowName ? "none" : "block"}">Optional: Include your name</a>
      <input
        id="login-name"
        type="text"
        class="signin"
        style="display:{isShowName ? "block" : "none"}"
        placeholder="Your Name"
        bind:value={userLogin.fullName} />

      <input
        id="login-pw"
        type="password"
        class="signin"
        style="display:{isShowPw ? "block" : "none"}"
        placeholder="Password"
        bind:value={userLogin.pw} />

      <button on:click={signIn} class="primary" disabled={isValidEmail === false}>Save</button>
      <button on:click={cancel} >Cancel</button>
      <div class="error">{submitErrorMessage}</div>
    </div>
  </div>
</Modal>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .modal-content {
    position: relative;
    background-color: #fefefe;
    margin: 15% auto;
    padding: 40px 20px 30px;
    border: 1px solid #888;
    width: 80%;
  }

  .title {
    font-size: 1.25rem;
    font-weight: bold;
    text-align: center;
    width : 100%;
    margin-top: 1.25rem;
  }

  .content {
    width : 100%;
    padding-left: 35%;
    
    input {
      margin: 1rem 0 0;
      width: 200px;
    }

    a {
      display: block;
      margin: 1rem 0 0;
      font-size: 0.85rem;
    }

    button {
      display: inline-block;
      margin: 1rem 0 0;
    }
  }

  .error {
    display: inline-block;
    margin: 0 0 0 0.75rem;
    height: 1rem;
    color: red;
    font-size: 0.75rem;
  }

</style>