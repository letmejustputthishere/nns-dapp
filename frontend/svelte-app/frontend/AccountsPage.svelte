<script lang="ts">
  // import ServiceApi from "./api/ServiceApi.ts"
  import { Actor, HttpAgent } from "@dfinity/agent";
  import * as nnsApp from "./canisters/nnsDapp/nnsApp.did.js";
  document.nnsApp = nnsApp;
  console.log("foo", nnsApp);
  const agent = new HttpAgent();
  document.icagent = {Actor, HttpAgent};
  const actor = Actor.createActor(nnsApp.idlFactory, { agent, canisterId: "sbzkb-zqaaa-aaaaa-aaaiq-cai" });
  document.icactor = actor;
</script>


<div>Accounts page</div>

<style>
  :root {
    background-color: red;
  }
</style>
