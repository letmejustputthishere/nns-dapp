<script lang="ts">
  import { ProposalStatus } from "@dfinity/nns";
  import type { Proposal, ProposalInfo } from "@dfinity/nns";
  import Badge from "../../ui/Badge.svelte";
  import Card from "../../ui/Card.svelte";
  import type { ProposalColor } from "../../../../lib/constants/proposals.constants";
  import { PROPOSAL_COLOR } from "../../../../lib/constants/proposals.constants";
  import { i18n } from "../../../../lib/stores/i18n";
  import ProposalMeta from "./ProposalMeta.svelte";
  import ProposalActions from "./ProposalActions.svelte";
  import ProposalSummaryCardBlock from "./ProposalSummaryCardBlock.svelte";

  export let proposalInfo: ProposalInfo;

  let proposal: Proposal | undefined;
  let title: string | undefined;
  let status: ProposalStatus = ProposalStatus.PROPOSAL_STATUS_UNKNOWN;
  let color: ProposalColor;

  $: ({ proposal, status } = proposalInfo);
  $: title = proposal?.title;
  $: color = PROPOSAL_COLOR[status];
</script>

<Card>
  <h2 slot="start" {title}>{title}</h2>
  <Badge slot="end" {color}
    ><h2 class="status">{$i18n.status[ProposalStatus[status]]}</h2></Badge
  >
  <ProposalSummaryCardBlock {proposal} />
  <ProposalMeta {proposalInfo} />
  <ProposalActions {proposal} />
</Card>

<style lang="scss">
  @use "../../../themes/mixins/media";
  @use "../../../themes/mixins/text";

  h2 {
    font-size: var(--font-size-h5);
    line-height: var(--line-height-standard);
    @include text.clamp(3);

    @include media.min-width(medium) {
      margin-top: calc(0.5 * var(--padding));
      padding-right: var(--padding);
      font-size: var(--font-size-h3);
    }
  }

  .status {
    color: inherit;
  }
</style>
