<script lang="ts">
  import type { Proposal } from "@dfinity/nns";
  import CardBlock from "../../ui/CardBlock.svelte";
  import {
    proposalFirstActionKey,
    proposalActionFields,
  } from "../../../../lib/utils/proposals.utils";

  export let proposal: Proposal | undefined;

  let actionKey: string | undefined;
  let actionFields: [string, string][] = [];
  $: actionKey =
    proposal !== undefined ? proposalFirstActionKey(proposal) : undefined;
  $: actionFields =
    (proposal !== undefined && proposalActionFields(proposal)) || [];
</script>

<CardBlock>
  <svelte:fragment slot="title">{actionKey}</svelte:fragment>
  <ul>
    {#each actionFields as [key, value]}
      <li>
        <h4>{key}</h4>
        <p>{value}</p>
      </li>
    {/each}
  </ul>
</CardBlock>

<style lang="scss">
  @use "../../../themes/mixins/media";

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      margin-bottom: var(--padding);

      h4 {
        font-size: var(--font-size-ultra-small);
        color: var(--background-contrast);
        line-height: 1;

        @include media.min-width(medium) {
          font-size: var(--font-size-small);
        }
      }
      p {
        font-size: var(--font-size-ultra-small);
        color: var(--gray-100);
        overflow-wrap: break-word;

        @include media.min-width(medium) {
          font-size: var(--font-size-small);
        }
      }
    }
  }
</style>
