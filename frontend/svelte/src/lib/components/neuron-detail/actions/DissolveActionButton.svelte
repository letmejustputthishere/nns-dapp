<script lang="ts">
  import { NeuronState } from "@dfinity/nns";
  import type { NeuronId } from "@dfinity/nns";
  import ConfirmationModal from "../../../modals/ConfirmationModal.svelte";
  import {
    startDissolving,
    stopDissolving,
  } from "../../../services/neurons.services";
  import { startBusy, stopBusy } from "../../../stores/busy.store";
  import { i18n } from "../../../stores/i18n";
  import { toastsStore } from "../../../stores/toasts.store";

  export let neuronId: NeuronId;
  export let disabled: boolean = false;
  export let neuronState: NeuronState;

  let isOpen: boolean = false;

  const showModal = () => (isOpen = true);
  const closeModal = () => (isOpen = false);

  let isDissolving: boolean;
  let buttonKey: string;
  let descriptionKey: string;
  $: {
    isDissolving = neuronState === NeuronState.DISSOLVING;
    buttonKey = isDissolving ? "stop_dissolving" : "start_dissolving";
    descriptionKey = isDissolving
      ? "stop_dissolve_description"
      : "start_dissolve_description";
  }

  const dissolveAction = async () => {
    const action = isDissolving ? stopDissolving : startDissolving;
    const successKey = isDissolving
      ? "neuron_detail.stop_dissolve_success"
      : "neuron_detail.start_dissolve_success";
    const errorKey = isDissolving
      ? "error.stop_dissolving"
      : "error.start_dissolving";
    startBusy("dissolve-action");
    try {
      await action(neuronId);
      toastsStore.show({
        labelKey: successKey,
        level: "info",
      });
      closeModal();
    } catch (err) {
      toastsStore.error({
        labelKey: errorKey,
        err,
      });
    } finally {
      stopBusy("dissolve-action");
    }
  };
</script>

<button on:click={showModal} {disabled} class="warning small"
  >{$i18n.neuron_detail[buttonKey]}</button
>
{#if isOpen}
  <ConfirmationModal on:nnsClose={closeModal} on:nnsConfirm={dissolveAction}>
    <div data-tid="dissolve-action-modal">
      <h4>{$i18n.core.confirm}</h4>
      <p>{$i18n.neuron_detail[descriptionKey]}</p>
    </div>
  </ConfirmationModal>
{/if}

<style lang="scss">
  @use "../../../themes/mixins/confirmation-modal.scss";

  div {
    @include confirmation-modal.wrapper;
  }

  h4 {
    @include confirmation-modal.title;
  }

  p {
    @include confirmation-modal.text;
  }
</style>
