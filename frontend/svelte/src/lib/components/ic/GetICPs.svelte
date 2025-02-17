<script lang="ts">
  /**
   * Transfer ICP to current principal. For test purpose only and only available on "testnet" too.
   */
  import Modal from "../../modals/Modal.svelte";
  import Input from "../ui/Input.svelte";
  import { getICPs } from "../../services/dev.services";
  import Spinner from "../ui/Spinner.svelte";
  import { toastsStore } from "../../stores/toasts.store";

  let visible: boolean = false;
  let transferring: boolean = false;

  let inputValue: number | undefined = undefined;

  const onSubmit = async ({ target }) => {
    if (invalidForm) {
      toastsStore.error({
        labelKey: "Invalid ICPs input.",
      });
      return;
    }

    const formData: FormData = new FormData(target);
    const icps: number = formData.get("icp") as unknown as number;

    transferring = true;

    try {
      await getICPs(icps);

      reset();
    } catch (err: unknown) {
      toastsStore.error({
        labelKey: "ICPs could not be transferred.",
        err,
      });
    }

    transferring = false;
  };

  const onClose = () => reset();

  const reset = () => {
    visible = false;
    inputValue = undefined;
  };

  let invalidForm: boolean;

  $: invalidForm = inputValue === undefined || inputValue <= 0;
</script>

<button
  data-tid="get-icp-button"
  on:click={() => (visible = true)}
  class="open text">Get ICPs</button
>

<Modal {visible} on:nnsClose={onClose}>
  <span slot="title">Get ICPs</span>

  <form data-tid="get-icp-form" on:submit|preventDefault={onSubmit}>
    <span class="how-much">How much?</span>

    <Input
      placeholderLabelKey="core.icp"
      name="icp"
      bind:value={inputValue}
      disabled={transferring}
    />

    <button
      data-tid="get-icp-submit"
      type="submit"
      class="primary"
      disabled={invalidForm || transferring}
    >
      {#if transferring}
        <Spinner />
      {:else}
        Get
      {/if}
    </button>
  </form>
</Modal>

<style lang="scss">
  .open {
    justify-self: flex-start;
  }

  .how-much {
    margin-bottom: calc(var(--padding) / 2);
  }

  form {
    display: flex;
    flex-direction: column;

    padding: calc(2 * var(--padding));

    button {
      margin-top: calc(var(--padding) / 2);
    }
  }
</style>
