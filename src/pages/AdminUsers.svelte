<script lang="ts">
	import Container from "../components/Container.svelte";
  import { user } from "../stores/user-store";
	import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../stores/httpclient-store";

	let ufvm: IUsersFeedsVM | undefined = undefined;
  let editLimitUserId = "";
  let newFeedCountLimit = "";
  
	const getUsersFeeds = async () => {
		try {
			const response: AxiosResponse<IUsersFeedsVM> = await $ax.get("/api/Stats/UsersFeeds");
			ufvm = response.data;
		}
		catch (error) {
			console.error(error);
		}
	};

  const canBeDisabled = (uid: INullable<string>) => {
    if (!uid) return false;
    return !((uid == "public-user") || (uid == $user.userId))
  };

  const setIsDisabled = async (uid: INullable<string>, isDisabled: boolean) => {
    let ix = ufvm?.users.findIndex(a => a._id === uid);
    if (ix === undefined || ix === null || ix < 0) return;

    if (ufvm) {
      ufvm.users[ix].isDisabled = isDisabled;
      ufvm = ufvm;

      try {
        await $ax.post(`/api/User/SetIsDisabled?userId=${uid}&isDisabled=${isDisabled}`);
      }
      catch (error) {
        console.error(error);
      }
    }

  };

  const editFCL = (uid: string, fcl: number) => {
    editLimitUserId = uid;
    newFeedCountLimit = fcl + "";
  };

  const saveFCL = async () => {
    if (!editLimitUserId || !newFeedCountLimit) return;

    let fcl = parseInt(newFeedCountLimit);
    if (isNaN(fcl) || fcl < 1) return;

    try {
      await $ax.post(`/api/User/SetFeedCountLimit?userId=${editLimitUserId}&feedCountLimit=${fcl}`);
      let ix = ufvm?.users.findIndex(a => a._id === editLimitUserId) ?? -1;
      if (ix >= 0 && ufvm) {
        ufvm.users[ix].feedCountLimit = fcl;
      }

      cancelFCL();
    }
    catch (error) {
      console.error(error);
    }
  };

  const cancelFCL = () => {
    editLimitUserId = "";
    newFeedCountLimit = "";
  };

  getUsersFeeds();

</script>

<Container>
	<h1>User Administration</h1>
  
  {#if ufvm?.users}
  {#each ufvm.users as u}
    <div class="user">
      <div class="title-container" class:is-disabled={u.isDisabled}>
        <div class="title">
          {u.fullName} ({u.email || "no email"})
        </div>
        <div>
          {#if canBeDisabled(u._id)}<a href="/" on:click|preventDefault={() => setIsDisabled(u._id, !u.isDisabled)}>{#if u.isDisabled}Enable{:else}Disable{/if}</a>{/if}
        </div>
      </div>
      <div class="user-info">
        Id: {u._id} {#if u.isAdmin}&#9679; Admin{/if}
      </div>
      <div class="user-info">
        Last login: {u.lastLogin} &#9679; Key: {u.subscriptionKey}
      </div>
      <div class="user-info">
        {#each u.feedCounts as fc }
        {fc.key}: {fc.value} &#9679;&nbsp;
        {/each}
        {#if u._id == editLimitUserId}
        Limit: <input type="text" bind:value={newFeedCountLimit}> -
          <a href="/" on:click|preventDefault={async () => await saveFCL()}>Save</a>-<a href="/" on:click|preventDefault={cancelFCL}>Cancel</a>
        {:else}
        Limit: {u.feedCountLimit} - <a href="/" on:click|preventDefault={() => editFCL(u._id || "", u.feedCountLimit)}>Edit</a>
        {/if}
      </div>
    </div>
  {/each}
  {/if}
	
</Container>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

  h1 {
		text-align: center;
		padding-bottom: 0.5rem;
    margin: 0 0 1rem 0;
		border-bottom: 1px solid $body-text;
	}

  .user {
    margin-top: 0.6rem;
    line-height: 1.2em;
  }

  .title-container {
    display: flex;
    justify-content: space-between;
    padding: 0.2rem;
  }

  .title {
    color: $dark-text;
  }

  .user-info {
    font-size: 0.9rem;
    margin: 0 0 0 1rem;

    input {
      display: inline-block;
      font-size: 0.75rem;
      padding: 0.1em;
      margin: 0;
      width: 2rem;
    }
  }

  .is-disabled {
    color: $disabled-text;
    background-color: $dark-background;

    a {
      color: lighten($link-color, 25%);
      text-decoration: none;

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
  }

  .is-disabled .title {
    color: $disabled-text;
    background-color: $dark-background;
  }


	@media screen and (max-width: $bp-small) {
		

	}

</style>