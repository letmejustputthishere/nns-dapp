<script lang="ts">
  import type { NeuronInfo, NeuronId } from "@dfinity/nns";
  import { onDestroy, onMount } from "svelte";
  import HeadlessLayout from "../lib/components/common/HeadlessLayout.svelte";
  import { getNeuronId, loadNeuron } from "../lib/services/neurons.services";
  import NeuronFollowingCard from "../lib/components/neuron-detail/NeuronFollowingCard.svelte";
  import NeuronHotkeysCard from "../lib/components/neuron-detail/NeuronHotkeysCard.svelte";
  import NeuronMaturityCard from "../lib/components/neuron-detail/NeuronMaturityCard.svelte";
  import NeuronMetaInfoCard from "../lib/components/neuron-detail/NeuronMetaInfoCard.svelte";
  import NeuronProposalsCard from "../lib/components/neuron-detail/NeuronProposalsCard.svelte";
  import NeuronVotingHistoryCard from "../lib/components/neuron-detail/NeuronVotingHistoryCard.svelte";
  import Spinner from "../lib/components/ui/Spinner.svelte";
  import {
    AppPath,
    SHOW_NEURONS_ROUTE,
  } from "../lib/constants/routes.constants";
  import { i18n } from "../lib/stores/i18n";
  import { routeStore } from "../lib/stores/route.store";
  import { neuronSelectStore, neuronsStore } from "../lib/stores/neurons.store";
  import { IS_TESTNET } from "../lib/constants/environment.constants";

  let neuronId: NeuronId | undefined;
  $: neuronSelectStore.select(neuronId);

  // TODO: To be removed once this page has been implemented
  onMount(() => {
    if (!SHOW_NEURONS_ROUTE) {
      window.location.replace(`/${window.location.hash}`);
      return;
    }
  });

  const unsubscribe = routeStore.subscribe(async ({ path }) => {
    const neuronIdMaybe = getNeuronId(path);
    if (neuronIdMaybe === undefined) {
      unsubscribe();
      routeStore.replace({ path: AppPath.Neurons });
      return;
    }
    neuronId = neuronIdMaybe;

    const onError = () => {
      unsubscribe();

      // Wait a bit before redirection so the user recognizes on which page the error occures
      setTimeout(() => {
        routeStore.replace({ path: AppPath.Neurons });
      }, 1500);
    };

    await loadNeuron({
      neuronId: neuronIdMaybe,
      setNeuron: (neuronInfo: NeuronInfo) =>
        neuronsStore.pushNeurons([neuronInfo]),
      handleError: onError,
    });
  });

  onDestroy(unsubscribe);

  const goBack = () => {
    unsubscribe();

    routeStore.navigate({
      path: AppPath.Neurons,
    });
  };
</script>

{#if SHOW_NEURONS_ROUTE}
  <HeadlessLayout on:nnsBack={goBack} showFooter={false}>
    <svelte:fragment slot="header">{$i18n.neuron_detail.title}</svelte:fragment>
    <section>
      {#if $neuronSelectStore}
        <NeuronMetaInfoCard neuron={$neuronSelectStore} />
        <NeuronMaturityCard neuron={$neuronSelectStore} />
        <NeuronFollowingCard neuron={$neuronSelectStore} />
        {#if IS_TESTNET}
          <NeuronProposalsCard neuron={$neuronSelectStore} />
        {/if}
        <NeuronHotkeysCard neuron={$neuronSelectStore} />
        <NeuronVotingHistoryCard neuron={$neuronSelectStore} />
      {:else}
        <Spinner />
      {/if}
    </section>
  </HeadlessLayout>
{/if}
