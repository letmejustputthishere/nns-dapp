import type { NeuronInfo } from "@dfinity/nns";
import { get } from "svelte/store";
import {
  neuronsStore,
  sortedNeuronStore,
} from "../../../lib/stores/neurons.store";
import { mockNeuron } from "../../mocks/neurons.mock";

describe("neurons-store", () => {
  it("should set neurons", () => {
    const neurons: NeuronInfo[] = [
      { ...mockNeuron, neuronId: BigInt(1) },
      { ...mockNeuron, neuronId: BigInt(2) },
    ];
    neuronsStore.setNeurons(neurons);

    const neuronsInStore = get(neuronsStore);
    expect(neuronsInStore).toEqual(neurons);
  });

  it("should push neurons", () => {
    const neurons: NeuronInfo[] = [
      { ...mockNeuron, neuronId: BigInt(1) },
      { ...mockNeuron, neuronId: BigInt(2) },
    ];
    neuronsStore.setNeurons(neurons);

    const moreNeurons: NeuronInfo[] = [
      { ...mockNeuron, neuronId: BigInt(3) },
      { ...mockNeuron, neuronId: BigInt(4) },
    ];
    neuronsStore.pushNeurons(moreNeurons);

    const neuronsInStore = get(neuronsStore);
    expect(neuronsInStore).toEqual([...neurons, ...moreNeurons]);
  });

  it("should substitute duplicated neurons", () => {
    const duplicatedNeuron = { ...mockNeuron, neuronId: BigInt(2) };
    const neurons: NeuronInfo[] = [
      { ...mockNeuron, neuronId: BigInt(1) },
      duplicatedNeuron,
    ];
    neuronsStore.setNeurons(neurons);

    const moreNeurons: NeuronInfo[] = [
      { ...mockNeuron, neuronId: BigInt(3) },
      duplicatedNeuron,
    ];
    neuronsStore.pushNeurons(moreNeurons);

    const neuronsInStore = get(neuronsStore);
    expect(neuronsInStore.length).toEqual(3);
  });

  describe("sortedNeuronStore", () => {
    it("should sort neurons by createdTimestampSeconds", () => {
      const neurons = [
        { ...mockNeuron, createdTimestampSeconds: BigInt(2) },
        { ...mockNeuron, createdTimestampSeconds: BigInt(1) },
        { ...mockNeuron, createdTimestampSeconds: BigInt(3) },
      ];
      neuronsStore.setNeurons([...neurons]);
      expect(get(sortedNeuronStore)).toEqual([
        neurons[2],
        neurons[0],
        neurons[1],
      ]);
    });
  });
});
