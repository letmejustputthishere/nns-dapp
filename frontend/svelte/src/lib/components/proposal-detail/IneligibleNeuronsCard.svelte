<script lang="ts">
  import { ineligibleNeurons as filterIneligibleNeurons } from "@dfinity/nns";
  import type { ProposalInfo, NeuronInfo } from "@dfinity/nns";
  import { i18n } from "../../stores/i18n";
  import Card from "../ui/Card.svelte";

  export let proposalInfo: ProposalInfo;
  export let neurons: NeuronInfo[];

  let ineligibleNeurons: NeuronInfo[];
  let visible: boolean = false;

  $: ineligibleNeurons = filterIneligibleNeurons({
    neurons,
    proposal: proposalInfo,
  });
  $: visible = ineligibleNeurons.length > 0;

  const reason = ({ createdTimestampSeconds }: NeuronInfo): string =>
    createdTimestampSeconds > proposalInfo.proposalTimestampSeconds
      ? $i18n.proposal_detail__ineligible.reason_since
      : $i18n.proposal_detail__ineligible.reason_short;
</script>

{#if visible}
  <Card>
    <h3 slot="start">{$i18n.proposal_detail__ineligible.headline}</h3>
    <p>{$i18n.proposal_detail__ineligible.text}</p>
    <ul>
      {#each ineligibleNeurons as neuron}
        <li>
          {neuron.neuronId}<small>{reason(neuron)}</small>
        </li>
      {/each}
    </ul>
  </Card>
{/if}

<style lang="scss">
  @use "../../themes/mixins/media";

  p {
    margin: 0 0 calc(2 * var(--padding));
    font-size: var(--font-size-h5);
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: var(--padding) 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    font-size: var(--font-size-h5);

    @include media.min-width(small) {
      margin: calc(0.5 * var(--padding)) 0;
      flex-direction: row;
      align-items: center;
    }

    @include media.min-width(medium) {
      font-size: var(--font-size-h4);
    }
    small {
      font-size: var(--font-size-ultra-small);
      @include media.min-width(medium) {
        font-size: var(--font-size-small);
      }
    }
  }
</style>
