<script lang="ts">
  import type { ProposalInfo, Vote } from "@dfinity/nns";
  import {
    notVotedNeurons as getNotVotedNeurons,
    ProposalStatus,
  } from "@dfinity/nns";
  import { onDestroy } from "svelte";
  import { registerVotes } from "../../../services/proposals.services";
  import { i18n } from "../../../stores/i18n";
  import { neuronsStore } from "../../../stores/neurons.store";
  import { votingNeuronSelectStore } from "../../../stores/proposals.store";
  import Card from "../../ui/Card.svelte";
  import VotingConfirmationToolbar from "./VotingConfirmationToolbar.svelte";
  import CastVoteCardNeuronSelect from "./VotingNeuronSelect.svelte";

  export let proposalInfo: ProposalInfo;

  const notVotedNeurons = () =>
    getNotVotedNeurons({
      neurons: $neuronsStore,
      proposal: proposalInfo,
    });
  let visible: boolean = false;
  /** Signals that the initial checkbox preselection was done. To avoid removing of user selection after second queryAndUpdate callback. */
  let initialSelectionDone = false;

  $: visible =
    notVotedNeurons().length > 0 &&
    proposalInfo.status === ProposalStatus.PROPOSAL_STATUS_OPEN;

  const unsubcribe = neuronsStore.subscribe(() => {
    if (!initialSelectionDone) {
      initialSelectionDone = true;
      votingNeuronSelectStore.set(notVotedNeurons());
    } else {
      // preserve user selection after neurons update (e.g. queryAndUpdate second callback)
      votingNeuronSelectStore.updateNeurons(notVotedNeurons());
    }
  });
  const vote = async ({ detail }: { detail: { voteType: Vote } }) =>
    await registerVotes({
      neuronIds: $votingNeuronSelectStore.selectedIds,
      vote: detail.voteType,
      proposalId: proposalInfo.id as bigint,
    });

  onDestroy(() => {
    unsubcribe();
    votingNeuronSelectStore.reset();
  });
</script>

{#if visible}
  <Card>
    <h3 slot="start">{$i18n.proposal_detail__vote.headline}</h3>
    <CastVoteCardNeuronSelect />
    <VotingConfirmationToolbar on:nnsConfirm={vote} />
  </Card>
{/if}
