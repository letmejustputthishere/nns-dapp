<script lang="ts">
  import type {
    NeuronId,
    Proposal,
    ProposalId,
    ProposalInfo,
  } from "@dfinity/nns";
  import { Topic } from "@dfinity/nns";
  import { i18n } from "../../../../lib/stores/i18n";
  import ProposerModal from "../../../modals/proposals/ProposerModal.svelte";

  export let proposalInfo: ProposalInfo;

  let proposal: Proposal | undefined;
  let proposer: NeuronId | undefined;
  let id: ProposalId | undefined;
  let topic: string | undefined;
  let url: string | undefined;

  $: ({ proposal, proposer, id } = proposalInfo);
  $: topic = $i18n.topics[Topic[proposalInfo?.topic]];
  $: url = proposal?.url;

  let modalOpen = false;
</script>

<div>
  {#if url}
    <a target="_blank" href={url}>{url}</a>
  {/if}

  {#if proposer !== undefined}
    <button class="text" on:click|stopPropagation={() => (modalOpen = true)}>
      {$i18n.proposal_detail.proposer_prefix}
      {proposer}
    </button>

    {#if modalOpen}
      <ProposerModal {proposer} on:nnsClose={() => (modalOpen = false)} />
    {/if}
  {/if}

  <p>
    {$i18n.proposal_detail.topic_prefix}
    {topic}
  </p>
  <p>{$i18n.proposal_detail.id_prefix} {id}</p>
</div>

<style lang="scss">
  @use "../../../themes/mixins/media";

  div {
    margin: calc(3 * var(--padding)) 0;

    a,
    p,
    button {
      display: block;
      margin: 0 0 calc(0.5 * var(--padding));
      padding: 0;

      font-size: var(--font-size-h5);
      line-height: var(--line-height-standard);
      text-align: start;
      color: var(--gray-100);
      overflow-wrap: anywhere;

      @include media.min-width(medium) {
        font-size: var(--font-size-h4);
      }
    }
  }
</style>
