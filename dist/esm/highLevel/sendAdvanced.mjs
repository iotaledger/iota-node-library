// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { serializeInput } from "../binary/input.mjs";
import { serializeOutput } from "../binary/output.mjs";
import { MAX_INDEXATION_KEY_LENGTH, MIN_INDEXATION_KEY_LENGTH } from "../binary/payload.mjs";
import { serializeTransactionEssence } from "../binary/transaction.mjs";
import { SingleNodeClient } from "../clients/singleNodeClient.mjs";
import { Blake2b } from "../crypto/blake2b.mjs";
import { Ed25519 } from "../crypto/ed25519.mjs";
import { ED25519_ADDRESS_TYPE } from "../models/IEd25519Address.mjs";
import { ED25519_SIGNATURE_TYPE } from "../models/IEd25519Signature.mjs";
import { INDEXATION_PAYLOAD_TYPE } from "../models/IIndexationPayload.mjs";
import { REFERENCE_UNLOCK_BLOCK_TYPE } from "../models/IReferenceUnlockBlock.mjs";
import { SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE } from "../models/ISigLockedDustAllowanceOutput.mjs";
import { SIG_LOCKED_SINGLE_OUTPUT_TYPE } from "../models/ISigLockedSingleOutput.mjs";
import { SIGNATURE_UNLOCK_BLOCK_TYPE } from "../models/ISignatureUnlockBlock.mjs";
import { TRANSACTION_ESSENCE_TYPE } from "../models/ITransactionEssence.mjs";
import { TRANSACTION_PAYLOAD_TYPE } from "../models/ITransactionPayload.mjs";
import { Converter } from "../utils/converter.mjs";
import { WriteStream } from "../utils/writeStream.mjs";
/**
 * Send a transfer from the balance on the seed.
 * @param client The client or node endpoint to send the transfer with.
 * @param inputsAndSignatureKeyPairs The inputs with the signature key pairs needed to sign transfers.
 * @param outputs The outputs to send.
 * @param indexation Optional indexation data to associate with the transaction.
 * @param indexation.key Indexation key.
 * @param indexation.data Optional index data.
 * @returns The id of the message created and the remainder address if one was needed.
 */
export async function sendAdvanced(client, inputsAndSignatureKeyPairs, outputs, indexation) {
    const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
    const transactionPayload = buildTransactionPayload(inputsAndSignatureKeyPairs, outputs, indexation);
    const message = {
        payload: transactionPayload
    };
    const messageId = await localClient.messageSubmit(message);
    return {
        messageId,
        message
    };
}
/**
 * Build a transaction payload.
 * @param inputsAndSignatureKeyPairs The inputs with the signature key pairs needed to sign transfers.
 * @param outputs The outputs to send.
 * @param indexation Optional indexation data to associate with the transaction.
 * @param indexation.key Indexation key.
 * @param indexation.data Optional index data.
 * @returns The transaction payload.
 */
export function buildTransactionPayload(inputsAndSignatureKeyPairs, outputs, indexation) {
    if (!inputsAndSignatureKeyPairs || inputsAndSignatureKeyPairs.length === 0) {
        throw new Error("You must specify some inputs");
    }
    if (!outputs || outputs.length === 0) {
        throw new Error("You must specify some outputs");
    }
    let localIndexationKeyHex;
    if (indexation === null || indexation === void 0 ? void 0 : indexation.key) {
        localIndexationKeyHex = typeof (indexation.key) === "string"
            ? Converter.utf8ToHex(indexation.key) : Converter.bytesToHex(indexation.key);
        if (localIndexationKeyHex.length / 2 < MIN_INDEXATION_KEY_LENGTH) {
            throw new Error(`The indexation key length is ${localIndexationKeyHex.length / 2}, which is below the minimum size of ${MIN_INDEXATION_KEY_LENGTH}`);
        }
        if (localIndexationKeyHex.length / 2 > MAX_INDEXATION_KEY_LENGTH) {
            throw new Error(`The indexation key length is ${localIndexationKeyHex.length / 2}, which exceeds the maximum size of ${MAX_INDEXATION_KEY_LENGTH}`);
        }
    }
    const outputsWithSerialization = [];
    for (const output of outputs) {
        if (output.addressType === ED25519_ADDRESS_TYPE) {
            const o = {
                type: output.isDustAllowance ? SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE : SIG_LOCKED_SINGLE_OUTPUT_TYPE,
                address: {
                    type: output.addressType,
                    address: output.address
                },
                amount: output.amount
            };
            const writeStream = new WriteStream();
            serializeOutput(writeStream, o);
            outputsWithSerialization.push({
                output: o,
                serialized: writeStream.finalHex()
            });
        }
        else {
            throw new Error(`Unrecognized output address type ${output.addressType}`);
        }
    }
    const inputsAndSignatureKeyPairsSerialized = inputsAndSignatureKeyPairs.map(i => {
        const writeStream = new WriteStream();
        serializeInput(writeStream, i.input);
        return {
            ...i,
            serialized: writeStream.finalHex()
        };
    });
    // Lexigraphically sort the inputs and outputs
    const sortedInputs = inputsAndSignatureKeyPairsSerialized.sort((a, b) => a.serialized.localeCompare(b.serialized));
    const sortedOutputs = outputsWithSerialization.sort((a, b) => a.serialized.localeCompare(b.serialized));
    const transactionEssence = {
        type: TRANSACTION_ESSENCE_TYPE,
        inputs: sortedInputs.map(i => i.input),
        outputs: sortedOutputs.map(o => o.output),
        payload: localIndexationKeyHex
            ? {
                type: INDEXATION_PAYLOAD_TYPE,
                index: localIndexationKeyHex,
                data: (indexation === null || indexation === void 0 ? void 0 : indexation.data) ? (typeof indexation.data === "string"
                    ? Converter.utf8ToHex(indexation.data) : Converter.bytesToHex(indexation.data)) : undefined
            }
            : undefined
    };
    const binaryEssence = new WriteStream();
    serializeTransactionEssence(binaryEssence, transactionEssence);
    const essenceFinal = binaryEssence.finalBytes();
    const essenceHash = Blake2b.sum256(essenceFinal);
    // Create the unlock blocks
    const unlockBlocks = [];
    const addressToUnlockBlock = {};
    for (const input of sortedInputs) {
        const hexInputAddressPublic = Converter.bytesToHex(input.addressKeyPair.publicKey);
        if (addressToUnlockBlock[hexInputAddressPublic]) {
            unlockBlocks.push({
                type: REFERENCE_UNLOCK_BLOCK_TYPE,
                reference: addressToUnlockBlock[hexInputAddressPublic].unlockIndex
            });
        }
        else {
            unlockBlocks.push({
                type: SIGNATURE_UNLOCK_BLOCK_TYPE,
                signature: {
                    type: ED25519_SIGNATURE_TYPE,
                    publicKey: hexInputAddressPublic,
                    signature: Converter.bytesToHex(Ed25519.sign(input.addressKeyPair.privateKey, essenceHash))
                }
            });
            addressToUnlockBlock[hexInputAddressPublic] = {
                keyPair: input.addressKeyPair,
                unlockIndex: unlockBlocks.length - 1
            };
        }
    }
    const transactionPayload = {
        type: TRANSACTION_PAYLOAD_TYPE,
        essence: transactionEssence,
        unlockBlocks
    };
    return transactionPayload;
}
