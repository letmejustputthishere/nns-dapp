<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { i18n } from "../stores/i18n";
  import Modal from "./Modal.svelte";

  const dispatch = createEventDispatcher();
</script>

<Modal theme="dark" size="small" on:nnsClose>
  <article>
    <slot />
    <div role="toolbar">
      <button
        data-tid="confirm-no"
        on:click={() => dispatch("nnsClose")}
        class="secondary full-width">{$i18n.core.confirm_no}</button
      >
      <button
        data-tid="confirm-yes"
        class="primary full-width"
        on:click={() => dispatch("nnsConfirm")}>{$i18n.core.confirm_yes}</button
      >
    </div>
  </article>
</Modal>

<style lang="scss">
  article {
    padding: calc(2 * var(--padding));
  }

  [role="toolbar"] {
    display: flex;
    gap: var(--padding);
  }
</style>
