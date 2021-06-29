// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { INDEXATION_PAYLOAD_TYPE } from "../models/IIndexationPayload.mjs";
import { SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE } from "../models/ISigLockedDustAllowanceOutput.mjs";
import { SIG_LOCKED_SINGLE_OUTPUT_TYPE } from "../models/ISigLockedSingleOutput.mjs";
import { TRANSACTION_ESSENCE_TYPE } from "../models/ITransactionEssence.mjs";
import { UTXO_INPUT_TYPE } from "../models/IUTXOInput.mjs";
import { ARRAY_LENGTH, SMALL_TYPE_LENGTH, UINT32_SIZE } from "./common.mjs";
import { deserializeInputs, serializeInputs } from "./input.mjs";
import { deserializeOutputs, serializeOutputs } from "./output.mjs";
import { deserializePayload, serializePayload } from "./payload.mjs";
/**
 * The minimum length of a transaction essence binary representation.
 */
export const MIN_TRANSACTION_ESSENCE_LENGTH = SMALL_TYPE_LENGTH + (2 * ARRAY_LENGTH) + UINT32_SIZE;
/**
 * Deserialize the transaction essence from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeTransactionEssence(readStream) {
    if (!readStream.hasRemaining(MIN_TRANSACTION_ESSENCE_LENGTH)) {
        throw new Error(`Transaction essence data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TRANSACTION_ESSENCE_LENGTH}`);
    }
    const type = readStream.readByte("transactionEssence.type");
    if (type !== TRANSACTION_ESSENCE_TYPE) {
        throw new Error(`Type mismatch in transactionEssence ${type}`);
    }
    const inputs = deserializeInputs(readStream);
    const outputs = deserializeOutputs(readStream);
    const payload = deserializePayload(readStream);
    if (payload && payload.type !== INDEXATION_PAYLOAD_TYPE) {
        throw new Error("Transaction essence can only contain embedded Indexation Payload");
    }
    for (const input of inputs) {
        if (input.type !== UTXO_INPUT_TYPE) {
            throw new Error("Transaction essence can only contain UTXO Inputs");
        }
    }
    for (const output of outputs) {
        if (output.type !== SIG_LOCKED_SINGLE_OUTPUT_TYPE &&
            output.type !== SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
            throw new Error("Transaction essence can only contain sig locked single input or sig locked dust allowance outputs");
        }
    }
    return {
        type: TRANSACTION_ESSENCE_TYPE,
        inputs: inputs,
        outputs: outputs,
        payload
    };
}
/**
 * Serialize the transaction essence to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeTransactionEssence(writeStream, object) {
    writeStream.writeByte("transactionEssence.type", object.type);
    for (const input of object.inputs) {
        if (input.type !== UTXO_INPUT_TYPE) {
            throw new Error("Transaction essence can only contain UTXO Inputs");
        }
    }
    serializeInputs(writeStream, object.inputs);
    for (const output of object.outputs) {
        if (output.type !== SIG_LOCKED_SINGLE_OUTPUT_TYPE &&
            output.type !== SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
            throw new Error("Transaction essence can only contain sig locked single input or sig locked dust allowance outputs");
        }
    }
    serializeOutputs(writeStream, object.outputs);
    serializePayload(writeStream, object.payload);
}
