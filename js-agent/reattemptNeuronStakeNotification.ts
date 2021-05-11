import { AuthClient } from "@dfinity/auth-client";
import ledgerServiceBuilder from "./src/canisters/ledger/builder";
import { HttpAgent, Principal } from "@dfinity/agent";
import GOVERNANCE_CANISTER_ID from "./src/canisters/governance/canisterId";
import { Option } from "./src/canisters/option";
import {principalToAccountIdentifier} from "./src/canisters/converter";

export const reattemptNeuronStakeNotification = async (blockHeight: bigint, fromSubAccountId: Option<number>, memo: bigint, recipient: string) : Promise<void> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();

    const agent = new HttpAgent({
        identity: authClient.getIdentity()
    });

    const ledgerService = ledgerServiceBuilder(agent, identity);

    const nonce = await calculateNonce(authClient.getIdentity().getPrincipal().toString(), memo, recipient);

    const subAccount = await buildSubAccount(nonce, identity.getPrincipal());

    await ledgerService.notify({
        toCanister: GOVERNANCE_CANISTER_ID,
        blockHeight,
        fromSubAccountId,
        toSubAccount: subAccount
    })
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

const calculateNonce = async (principal: string, estimate: bigint, expectedAccountIdentifier: string) : Promise<Uint8Array> => {
    const min = estimate - BigInt(2000);
    const max = estimate + BigInt(2000);
    let attempt = min;
    while (attempt < max) {
        const nonce = bigIntToUint8Array(attempt);
        const toSubAccount = await buildSubAccount(nonce, Principal.fromText(principal));

        const accountIdentifier = principalToAccountIdentifier(GOVERNANCE_CANISTER_ID, toSubAccount);
        if (accountIdentifier === expectedAccountIdentifier) {
            return nonce;
        }
        attempt++;
    }
    throw Error("Unable to find matching nonce");
}

const bigIntToUint8Array = (value: bigint) : Uint8Array => {
    const array = new Uint8Array(8);
    const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
    view.setBigUint64(0, value);

    return array;
}

// ENTER DETAILS HERE!
const blockHeight: bigint = 28826n;
const subAccountIndex: number = null; // This will most likely always be null
const memo: bigint = 16544917614427265000n;
const recipient: string = "de72119fd02b0e9143305a841b3cb95a870d20f9953daa229d31c2ed615fdffb";
reattemptNeuronStakeNotification(blockHeight, subAccountIndex, memo, recipient).then(_ => console.log("Done!"));
