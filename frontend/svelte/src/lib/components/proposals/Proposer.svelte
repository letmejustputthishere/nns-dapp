<script lang="ts">
  import type { ProposalInfo } from "@dfinity/nns";
  import type { NeuronId } from "@dfinity/nns";
  import ProposerModal from "../../modals/proposals/ProposerModal.svelte";
  import { i18n } from "../../stores/i18n";

  export let proposalInfo: ProposalInfo;

  let modalOpen = false;

  let proposer: NeuronId | undefined;
  $: ({ proposer } = proposalInfo);
</script>

{#if proposer !== undefined}
  <button class="text" on:click|stopPropagation={() => (modalOpen = true)}
    ><small>{$i18n.neuron_detail.proposer}: {proposer}</small></button
  >

  {#if modalOpen}
    <ProposerModal {proposer} on:nnsClose={() => (modalOpen = false)} />
  {/if}
{/if}

<style lang="scss">
  button {
    padding: 0;
    line-height: var(--line-height-standard);
    margin: 0;
  }
</style>
