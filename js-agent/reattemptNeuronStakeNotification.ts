import { AuthClient } from "@dfinity/auth-client";
import ledgerServiceBuilder from "./src/canisters/ledger/builder";
import { HttpAgent, Principal } from "@dfinity/agent";
import GOVERNANCE_CANISTER_ID from "./src/canisters/governance/canisterId";
import { Option } from "./src/canisters/option";

export const reattemptNeuronStakeNotification = async (blockHeight: bigint, fromSubAccountId: Option<number>, memo: bigint) : Promise<void> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();

    const agent = new HttpAgent({
        identity: authClient.getIdentity()
    });

    const ledgerService = ledgerServiceBuilder(agent, identity);

    const memoArray = bigIntToUint8Array(memo);

    const subAccount = await buildSubAccount(memoArray, identity.getPrincipal());

    await ledgerService.notify({
        toCanister: GOVERNANCE_CANISTER_ID,
        blockHeight,
        fromSubAccountId,
        toSubAccount: subAccount
    })
}

// Taken from https://stackoverflow.com/a/56943145
const bigIntToUint8Array = (value: bigint) : Uint8Array => {
    const array = new Uint8Array(8);
    const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
    view.setBigUint64(0, value);

    return array;
}

// 32 bytes
async function buildSubAccount(nonce: Uint8Array, principal: Principal) : Promise<Uint8Array> {
    const padding = asciiStringToByteArray("neuron-stake");
    const array = new Uint8Array([
        0x0c,
        ...padding,
        ...principal.toBlob(),
        ...nonce]);
    const result = await crypto.subtle.digest("SHA-256", array);
    return new Uint8Array(result);
}

const asciiStringToByteArray = (text: string) : Array<number> => {
    return Array
        .from(text)
        .map(c => c.charCodeAt(0));
}

// ENTER DETAILS HERE!
const blockHeight: bigint = 0n;
const subAccountIndex: number = null;
const memo: bigint = 0n;
reattemptNeuronStakeNotification(blockHeight, subAccountIndex, memo).then(_ => console.log("Done!"));
