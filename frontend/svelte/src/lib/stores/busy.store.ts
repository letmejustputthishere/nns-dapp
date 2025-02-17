import type { Readable } from "svelte/store";
import { derived, writable } from "svelte/store";

export type BusyStateInitiator =
  | "vote"
  | "accounts"
  | "join-community-fund"
  | "dissolve-action"
  | "add-followee"
  | "remove-followee";

/**
 * Store that reflects the app busy state.
 * Is used to show the busy-screen that locks the UI
 */
const initBusyStore = () => {
  const { subscribe, update } = writable<Set<BusyStateInitiator>>(new Set());

  return {
    subscribe,

    /**
     * Show the busy-screen if not visible
     */
    startBusy(initiator: BusyStateInitiator) {
      update((state) => state.add(initiator));
    },

    /**
     * Hide the busy-screen if no other initiators are done
     */
    stopBusy(initiator: BusyStateInitiator) {
      update((state) => {
        state.delete(initiator);
        return state;
      });
    },
  };
};

const busyStore = initBusyStore();

export const { startBusy, stopBusy } = busyStore;

export const busy: Readable<boolean> = derived(
  busyStore,
  ($busyStore) => $busyStore.size > 0
);
