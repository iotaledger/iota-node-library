import { IClient } from "../models/IClient";
import { IKeyPair } from "../models/IKeyPair";
import { IMessage } from "../models/IMessage";
import { ITransactionPayload } from "../models/ITransactionPayload";
import { IUTXOInput } from "../models/IUTXOInput";
/**
 * Send a transfer from the balance on the seed.
 * @param client The client to send the transfer with.
 * @param inputsAndSignatureKeyPairs The inputs with the signature key pairs needed to sign transfers.
 * @param outputs The outputs to send.
 * @param indexationKey Optional indexation key.
 * @param indexationData Optional index data.
 * @returns The id of the message created and the remainder address if one was needed.
 */
export declare function sendAdvanced(client: IClient, inputsAndSignatureKeyPairs: {
    input: IUTXOInput;
    addressKeyPair: IKeyPair;
}[], outputs: {
    address: string;
    addressType: number;
    amount: number;
    isDustAllowance?: boolean;
}[], indexationKey?: string, indexationData?: Uint8Array): Promise<{
    messageId: string;
    message: IMessage;
}>;
/**
 * Build a transaction payload.
 * @param inputsAndSignatureKeyPairs The inputs with the signature key pairs needed to sign transfers.
 * @param outputs The outputs to send.
 * @param indexationKey Optional indexation key.
 * @param indexationData Optional index data.
 * @returns The transaction payload.
 */
export declare function buildTransactionPayload(inputsAndSignatureKeyPairs: {
    input: IUTXOInput;
    addressKeyPair: IKeyPair;
}[], outputs: {
    address: string;
    addressType: number;
    amount: number;
    isDustAllowance?: boolean;
}[], indexationKey?: string, indexationData?: Uint8Array): ITransactionPayload;