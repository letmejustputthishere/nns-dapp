import { Agent, Principal, QueryResponseStatus } from "@dfinity/agent";
import { Reader } from "protobufjs";
import ServiceInterface, {
    AccountIdentifier,
    BlockHeight,
    E8s,
    GetBalancesRequest,
    NotifyCanisterRequest,
    SendICPTsRequest
} from "./model";
import RequestConverters from "./RequestConverters";
import { blobToUint8Array, uint8ArrayToBlob } from "../converter";
import { ICPTs } from "./types/types_pb";
import { submitUpdateRequest } from "../updateRequestHandler";

export default class Service implements ServiceInterface {
    private readonly agent: Agent;
    private readonly canisterId: Principal;
    private readonly myPrincipal: Principal;
    private readonly requestConverters: RequestConverters;

    public constructor(agent: Agent, canisterId: Principal, myPrincipal: Principal) {
        this.agent = agent;
        this.canisterId = canisterId;
        this.myPrincipal = myPrincipal;
        this.requestConverters = new RequestConverters();
    }

    public getBalances = async (request: GetBalancesRequest) : Promise<Record<AccountIdentifier, E8s>> => {
        const rawRequests = this.requestConverters.fromGetBalancesRequest(request);
        const promises = rawRequests.map(async r => {
            const rawResponse = await this.agent.query(this.canisterId, {
                methodName: "account_balance",
                arg: uint8ArrayToBlob(r.serializeBinary())
            });
            if (rawResponse.status === QueryResponseStatus.Replied) {
                const response = ICPTs.deserializeBinary(blobToUint8Array(rawResponse.reply.arg));
                return response.getE8s() ?? BigInt(0);
            } else {
                throw new Error(`Code: {rawResponse.reject_code}. Message: {rawResponse.reject_message}`);
            }
        });
        const balances = await Promise.all(promises);

        const result = {};
        request.accounts.forEach((a, index) => {
            result[a] = balances[index];
        })
        return result;
    }

    public sendICPTs = async (request: SendICPTsRequest) : Promise<BlockHeight> => {
        const rawRequest = this.requestConverters.fromSendICPTsRequest(request);

        const responseBytes = await submitUpdateRequest(
            this.agent,
            this.canisterId,
            "send",
            uint8ArrayToBlob(rawRequest.serializeBinary()));

        const reader = new Reader(responseBytes);
        return BigInt(reader.uint64());
    }

    public notify = async (request: NotifyCanisterRequest) : Promise<any> => {
        const rawRequest = this.requestConverters.fromNotifyCanisterRequest(request);
        const requestBinary = rawRequest.serializeBinary();
        const requestBlob = uint8ArrayToBlob(requestBinary);
        return await submitUpdateRequest(
            this.agent,
            this.canisterId,
            "notify",
            requestBlob);
    }
}
