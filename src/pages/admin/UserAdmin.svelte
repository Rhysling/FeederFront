<script lang="ts">
  import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../../stores/httpclient-store";

  let master: IvwUserDetail[] = [];
  let list: IvwUserDetail[] = [];
  let fs = {
    prop1: "",
    prop2: "",
    isAsc1: true,
    isAsc2: true
  };

  let filterList = (filterText: string) => {
    list = master.filter((a) => true);
  };

  let sortList = (currentProp: string) => {

    if (currentProp == fs.prop1) {
      fs.isAsc1 = !fs.isAsc1;
    }
    else {
      fs.prop2 = fs.prop1;
      fs.isAsc2 = fs.isAsc1;
      fs.prop1 = currentProp;
      fs.isAsc1 = true;
    }

    let sortFn = (a: any, b: any) => {
      let sv = 0;

      if ((a[fs.prop1] === undefined) || (b[fs.prop1] === undefined)) return 0;
      if (a[fs.prop1] < b[fs.prop1]) sv = -100 * (fs.isAsc1 ? 1 : -1);
      if (a[fs.prop1] > b[fs.prop1]) sv = 100 * (fs.isAsc1 ? 1 : -1);

      if ((a[fs.prop2] === undefined) || (b[fs.prop2] === undefined)) return sv;
      if (a[fs.prop2] < b[fs.prop2]) sv -= 10 * (fs.isAsc2 ? 1 : -1);
      if (a[fs.prop2] > b[fs.prop2]) sv += 10 * (fs.isAsc2 ? 1 : -1);

      return sv;
    };

    list = list.sort(sortFn);
  };


  



// *** Init ***

  let init = () => {
    $ax.get("/api/admin/Users/GetDetails")
    .then((response: AxiosResponse<IvwUserDetail[]>) => {
      master = response.data;
    })
    .then(() => filterList("todo"))
    .catch((err) => console.log({err}));

  };

  init();

</script>

<div class="summary">
  <div class="search">
    <div>
      Filter:
      <input type="text" class="filter-box"  />
      <a href="/">Go</a>
    </div>
    <div class="right"></div>
  </div>

  <div class="title row">
    <div><a href="/" on:click|preventDefault={() => sortList("userId")}>Id</a></div>
    <div><a href="/" on:click|preventDefault={() => sortList("email")}>Email</a></div>
    <div><a href="/" on:click|preventDefault={() => sortList("fullName")}>Full Name</a></div>
    <div><a href="/" on:click|preventDefault={() => sortList("createdDate")}>Created</a></div>
    <div><a href="/" on:click|preventDefault={() => sortList("lastLoginDate")}>Last Login</a></div>
    <div class="sm">
      <a href="/" on:click|preventDefault={() => sortList("countAll")}>All</a> /
      <a href="/" on:click|preventDefault={() => sortList("countPending")}>Pend</a> /
      <a href="/" on:click|preventDefault={() => sortList("countClosed")}>Closed</a>
    </div>
  </div>

  {#each list as a (a.userId)}
    <div class="item row" class:is-admin={a.isAdmin ? true : undefined}>
      <div>{a.userId}</div>
      <div>{a.email}</div>
      <div>{a.fullName ? a.fullName : "none"}</div>
      <div>{a.createdDateFormatted}</div>
      <div>{a.lastLoginDateFormatted}</div>
      <div>{a.countAll} / {a.countPending} / {a.countClosed}</div>
    </div>
  {/each}
</div>


<style lang="scss">
  @import "../../styles/_custom-variables.scss";

  .search {
    display: flex;
    flex-flow: row nowrap;
    align-items:baseline;
    font-size: 0.8rem;
    margin-top: 0.5em;
    padding: 0.2rem 0.4rem;
    background-color: $beige-lighter;

    input {
      position: relative;
      top: 2px;
    }

    .right {
      flex: 1 1 50%;
      text-align: right;
    }
  }

  .title {
    font-size: 0.8rem;
    font-weight: bold;
    color: $main-color;
    margin: 1rem 0;

    > div {
      align-self: end;
    }

    @media screen and (max-width: $bp-small) {
      display: block;

      // .count, .pretax {
      //   text-align: left;
      // }
    }
  }

  .item {
    font-size: 0.7rem;
    font-weight: normal;
    color: $text-color;
    margin: 0.5rem 0;

    @media screen and (max-width: $bp-small) {
      display: block;

    }
  }

  .row {
    display: grid;
    grid-template-columns: 0.75fr 5fr 5fr 4fr 4fr 4fr;

    // .qty, .price, .ext {
    //   text-align: right;
    //   padding-right: 0.5rem;
    // }
  }

  .sm {
    font-size: 0.8em;
  }

  .is-admin {
    background-color: azure;
  }

</style>