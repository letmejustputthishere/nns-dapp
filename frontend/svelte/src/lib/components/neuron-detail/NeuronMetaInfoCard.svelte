<script lang="ts">
  import { NeuronState } from "@dfinity/nns";
  import type { NeuronInfo } from "@dfinity/nns";
  import IconInfo from "../../icons/IconInfo.svelte";
  import { i18n } from "../../stores/i18n";
  import { secondsToDate } from "../../utils/date.utils";
  import { replacePlaceholders } from "../../utils/i18n.utils";
  import { formatICP } from "../../utils/icp.utils";
  import {
    ageMultiplier,
    dissolveDelayMultiplier,
    formatVotingPower,
    hasJoinedCommunityFund,
    isCurrentUserController,
    isNeuronControllable,
  } from "../../utils/neuron.utils";
  import NeuronCard from "../neurons/NeuronCard.svelte";
  import Tooltip from "../ui/Tooltip.svelte";
  import IncreaseDissolveDelayButton from "./actions/IncreaseDissolveDelayButton.svelte";
  import IncreaseStakeButton from "./actions/IncreaseStakeButton.svelte";
  import JoinCommunityFundButton from "./actions/JoinCommunityFundButton.svelte";
  import SplitNeuronButton from "./actions/SplitNeuronButton.svelte";
  import DissolveActionButton from "./actions/DissolveActionButton.svelte";
  import DisburseButton from "./actions/DisburseButton.svelte";
  import { accountsStore } from "../../stores/accounts.store";

  export let neuron: NeuronInfo;

  let isCommunityFund: boolean;
  $: isCommunityFund = hasJoinedCommunityFund(neuron);
  let userControlled: boolean;
  $: userControlled = isCurrentUserController(neuron);
  let isControllable: boolean;
  $: isControllable = isNeuronControllable({
    neuron,
    accounts: $accountsStore,
  });
</script>

<NeuronCard {neuron}>
  <section>
    <div class="space-between">
      <p>
        {secondsToDate(Number(neuron.createdTimestampSeconds))} - {$i18n.neurons
          .staked}
      </p>
      <JoinCommunityFundButton
        disabled={isCommunityFund || !userControlled}
        neuronId={neuron.neuronId}
      />
    </div>
    <div class="space-between">
      <p class="voting-power">
        {#if neuron.votingPower}
          {`${$i18n.neurons.voting_power}:`}
          <span class="amount">
            {formatVotingPower(neuron.votingPower)}
          </span>
          {#if neuron.fullNeuron?.cachedNeuronStake !== undefined}
            <Tooltip
              id="voting-power-info"
              text={replacePlaceholders(
                $i18n.neuron_detail.voting_power_tooltip,
                {
                  $stake: formatICP(neuron.fullNeuron.cachedNeuronStake),
                  $delayMultiplier: dissolveDelayMultiplier(
                    Number(neuron.dissolveDelaySeconds)
                  ).toFixed(2),
                  $ageMultiplier: ageMultiplier(
                    Number(neuron.ageSeconds)
                  ).toFixed(2),
                }
              )}
            >
              <span>
                <IconInfo />
              </span>
            </Tooltip>
          {/if}
        {/if}
      </p>
      <div class="buttons">
        <IncreaseDissolveDelayButton />
        {#if neuron.state === NeuronState.DISSOLVED}
          <DisburseButton />
        {:else if neuron.state === NeuronState.DISSOLVING || neuron.state === NeuronState.LOCKED}
          <DissolveActionButton
            disabled={!isControllable}
            neuronState={neuron.state}
            neuronId={neuron.neuronId}
          />
        {/if}
      </div>
    </div>
    <div class="only-buttons">
      <IncreaseStakeButton />
      <SplitNeuronButton />
    </div>
  </section>
</NeuronCard>

<style lang="scss">
  @use "../../themes/mixins/media";
  section {
    padding: var(--padding) 0 0 0;
    display: flex;
    flex-direction: column;
    gap: var(--padding);
  }
  .space-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    @include media.min-width(small) {
      flex-wrap: nowrap;
    }
  }

  .voting-power {
    display: flex;
    align-items: center;
    gap: calc(0.5 * var(--padding));

    span {
      display: flex;
      align-items: center;
    }

    .amount {
      font-weight: bold;
    }
  }

  .only-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--padding);

    @include media.min-width(small) {
      justify-content: end;
    }
  }

  .buttons {
    display: flex;
    gap: var(--padding);
  }
</style>
