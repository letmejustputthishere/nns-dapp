<script lang="ts">
  // TODO: Rename file
  import { i18n } from "../../stores/i18n";
  import type { Account } from "../../types/account";
  import SelectAccount from "../../components/accounts/SelectAccount.svelte";
  import StakeNeuron from "../../components/neurons/StakeNeuron.svelte";
  import SetDissolveDelay from "../../components/neurons/SetDissolveDelay.svelte";
  import type { NeuronId } from "@dfinity/nns";
  import type { NeuronInfo } from "@dfinity/nns";
  import { neuronsStore } from "../../stores/neurons.store";
  import ConfirmDissolveDelay from "../../components/neurons/ConfirmDissolveDelay.svelte";
  import EditFollowNeurons from "../../components/neurons/EditFollowNeurons.svelte";
  import WizardModal from "../WizardModal.svelte";
  import { stepIndex } from "../../utils/step.utils";
  import { createEventDispatcher } from "svelte";
  import { toastsStore } from "../../stores/toasts.store";
  import type { Steps } from "../../stores/steps.state";

  const steps: Steps = [
    { name: "SelectAccount", showBackButton: false },
    { name: "StakeNeuron", showBackButton: true },
    { name: "SetDissolveDelay", showBackButton: false },
    { name: "ConfirmDissolveDelay", showBackButton: true },
    { name: "EditFollowNeurons", showBackButton: false },
  ];

  let currentStepName: string | undefined;
  let modal: WizardModal;

  let selectedAccount: Account | undefined;

  let newNeuronId: NeuronId | undefined;
  let newNeuron: NeuronInfo | undefined;
  const dispatcher = createEventDispatcher();
  type InvalidState = {
    stepName: string;
    neuron?: null;
    account?: null;
  };
  const invalidStates: InvalidState[] = [
    { stepName: "StakeNeuron", account: null },
    { stepName: "SetDissolveDelay", neuron: null },
    { stepName: "ConfirmDissolveDelay", neuron: null },
    { stepName: "EditFollowNeurons", neuron: null },
  ];
  $: {
    newNeuron = $neuronsStore.find(({ neuronId }) => newNeuronId === neuronId);
    const invalidState = invalidStates.find(({ stepName, neuron, account }) => {
      if (stepName === currentStepName) {
        if (neuron === null) {
          return newNeuron === undefined;
        }
        if (account === null) {
          return selectedAccount === undefined;
        }
      }
    });
    if (invalidState !== undefined) {
      toastsStore.error({
        labelKey: "error.neuron_not_found",
      });
      dispatcher("nnsClose");
    }
  }
  let delayInSeconds: number = 0;

  const chooseAccount = ({
    detail,
  }: CustomEvent<{ selectedAccount: Account }>) => {
    selectedAccount = detail.selectedAccount;
    modal.next();
  };
  const goBack = () => {
    modal.back();
  };
  const goNext = () => {
    modal.next();
  };
  const goToDissolveDelay = ({
    detail,
  }: CustomEvent<{ neuronId: NeuronId }>) => {
    newNeuronId = detail.neuronId;
    modal.next();
  };
  const goEditFollowers = () => {
    modal.set(stepIndex({ name: "EditFollowNeurons", steps }));
  };

  const titleMapper: Record<string, string> = {
    SelectAccount: "select_source",
    StakeNeuron: "stake_neuron",
    SetDissolveDelay: "set_dissolve_delay",
    ConfirmDissolveDelay: "confirm_dissolve_delay",
    EditFollowNeurons: "follow_neurons_screen",
  };
  let titleKey: string = titleMapper[0];
  $: titleKey = titleMapper[currentStepName ?? "SelectAccount"];
</script>

<WizardModal {steps} bind:currentStepName bind:this={modal} on:nnsClose>
  <svelte:fragment slot="title">{$i18n.neurons?.[titleKey]}</svelte:fragment>

  {#if currentStepName === "SelectAccount"}
    <SelectAccount on:nnsSelectAccount={chooseAccount} />
  {/if}
  {#if currentStepName === "StakeNeuron" && selectedAccount !== undefined}
    <StakeNeuron
      account={selectedAccount}
      on:nnsNeuronCreated={goToDissolveDelay}
    />
  {/if}
  {#if currentStepName === "SetDissolveDelay" && newNeuron !== undefined}
    <SetDissolveDelay
      neuron={newNeuron}
      on:nnsSkipDelay={goEditFollowers}
      on:nnsConfirmDelay={goNext}
      bind:delayInSeconds
    />
  {/if}
  {#if currentStepName === "ConfirmDissolveDelay" && newNeuron !== undefined}
    <ConfirmDissolveDelay
      neuron={newNeuron}
      {delayInSeconds}
      on:back={goBack}
      on:nnsNext={goNext}
    />
  {/if}
  {#if currentStepName === "EditFollowNeurons" && newNeuron !== undefined}
    <EditFollowNeurons neuron={newNeuron} />
  {/if}
</WizardModal>
