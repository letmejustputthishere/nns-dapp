<script lang="ts">
  import type { NeuronInfo } from "@dfinity/nns";
  import IconInfo from "../../icons/IconInfo.svelte";
  import { i18n } from "../../stores/i18n";
  import { formatPercentage } from "../../utils/format.utils";
  import { maturityByStake } from "../../utils/neuron.utils";
  import Card from "../ui/Card.svelte";
  import Tooltip from "../ui/Tooltip.svelte";
  import MergeMaturityButton from "./actions/MergeMaturityButton.svelte";
  import SpawnNeuronButton from "./actions/SpawnNeuronButton.svelte";

  export let neuron: NeuronInfo;
</script>

<Card>
  <div class="title" slot="start">
    <h3>{$i18n.neuron_detail.maturity_title}</h3>
    <Tooltip id="maturity-info" text={$i18n.neuron_detail.maturity_tooltip}>
      <span>
        <IconInfo />
      </span>
    </Tooltip>
  </div>
  <div slot="end">
    <h3>{formatPercentage(maturityByStake(neuron))}</h3>
  </div>
  <div class="actions">
    <MergeMaturityButton />
    <SpawnNeuronButton />
  </div>
</Card>

<style lang="scss">
  .title {
    display: flex;
    align-items: center;
    gap: calc(0.5 * var(--padding));
  }

  .actions {
    display: flex;
    justify-content: end;
    gap: var(--padding);
  }
</style>
