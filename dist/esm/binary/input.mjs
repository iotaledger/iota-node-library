// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { TREASURY_INPUT_TYPE } from "../models/ITreasuryInput.mjs";
import { UTXO_INPUT_TYPE } from "../models/IUTXOInput.mjs";
import { SMALL_TYPE_LENGTH, TRANSACTION_ID_LENGTH, UINT16_SIZE } from "./common.mjs";
/**
 * The minimum length of an input binary representation.
 */
export const MIN_INPUT_LENGTH = SMALL_TYPE_LENGTH;
/**
 * The minimum length of a utxo input binary representation.
 */
export const MIN_UTXO_INPUT_LENGTH = MIN_INPUT_LENGTH + TRANSACTION_ID_LENGTH + UINT16_SIZE;
/**
 * The minimum length of a treasury input binary representation.
 */
export const MIN_TREASURY_INPUT_LENGTH = MIN_INPUT_LENGTH + TRANSACTION_ID_LENGTH;
/**
 * The minimum number of inputs.
 */
export const MIN_INPUT_COUNT = 1;
/**
 * The maximum number of inputs.
 */
export const MAX_INPUT_COUNT = 127;
/**
 * Deserialize the inputs from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeInputs(readStream) {
    const numInputs = readStream.readUInt16("inputs.numInputs");
    const inputs = [];
    for (let i = 0; i < numInputs; i++) {
        inputs.push(deserializeInput(readStream));
    }
    return inputs;
}
/**
 * Serialize the inputs to binary.
 * @param writeStream The stream to write the data to.
 * @param objects The objects to serialize.
 */
export function serializeInputs(writeStream, objects) {
    if (objects.length < MIN_INPUT_COUNT) {
        throw new Error(`The minimum number of inputs is ${MIN_INPUT_COUNT}, you have provided ${objects.length}`);
    }
    if (objects.length > MAX_INPUT_COUNT) {
        throw new Error(`The maximum number of inputs is ${MAX_INPUT_COUNT}, you have provided ${objects.length}`);
    }
    writeStream.writeUInt16("inputs.numInputs", objects.length);
    for (let i = 0; i < objects.length; i++) {
        serializeInput(writeStream, objects[i]);
    }
}
/**
 * Deserialize the input from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeInput(readStream) {
    if (!readStream.hasRemaining(MIN_INPUT_LENGTH)) {
        throw new Error(`Input data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_INPUT_LENGTH}`);
    }
    const type = readStream.readByte("input.type", false);
    let input;
    if (type === UTXO_INPUT_TYPE) {
        input = deserializeUTXOInput(readStream);
    }
    else if (type === TREASURY_INPUT_TYPE) {
        input = deserializeTreasuryInput(readStream);
    }
    else {
        throw new Error(`Unrecognized input type ${type}`);
    }
    return input;
}
/**
 * Serialize the input to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeInput(writeStream, object) {
    if (object.type === UTXO_INPUT_TYPE) {
        serializeUTXOInput(writeStream, object);
    }
    else if (object.type === TREASURY_INPUT_TYPE) {
        serializeTreasuryInput(writeStream, object);
    }
    else {
        throw new Error(`Unrecognized input type ${object.type}`);
    }
}
/**
 * Deserialize the utxo input from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeUTXOInput(readStream) {
    if (!readStream.hasRemaining(MIN_UTXO_INPUT_LENGTH)) {
        throw new Error(`UTXO Input data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_UTXO_INPUT_LENGTH}`);
    }
    const type = readStream.readByte("utxoInput.type");
    if (type !== UTXO_INPUT_TYPE) {
        throw new Error(`Type mismatch in utxoInput ${type}`);
    }
    const transactionId = readStream.readFixedHex("utxoInput.transactionId", TRANSACTION_ID_LENGTH);
    const transactionOutputIndex = readStream.readUInt16("utxoInput.transactionOutputIndex");
    return {
        type: UTXO_INPUT_TYPE,
        transactionId,
        transactionOutputIndex
    };
}
/**
 * Serialize the utxo input to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeUTXOInput(writeStream, object) {
    writeStream.writeByte("utxoInput.type", object.type);
    writeStream.writeFixedHex("utxoInput.transactionId", TRANSACTION_ID_LENGTH, object.transactionId);
    writeStream.writeUInt16("utxoInput.transactionOutputIndex", object.transactionOutputIndex);
}
/**
 * Deserialize the treasury input from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeTreasuryInput(readStream) {
    if (!readStream.hasRemaining(MIN_TREASURY_INPUT_LENGTH)) {
        throw new Error(`Treasury Input data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TREASURY_INPUT_LENGTH}`);
    }
    const type = readStream.readByte("treasuryInput.type");
    if (type !== TREASURY_INPUT_TYPE) {
        throw new Error(`Type mismatch in treasuryInput ${type}`);
    }
    const milestoneId = readStream.readFixedHex("treasuryInput.milestoneId", TRANSACTION_ID_LENGTH);
    return {
        type: TREASURY_INPUT_TYPE,
        milestoneId
    };
}
/**
 * Serialize the treasury input to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeTreasuryInput(writeStream, object) {
    writeStream.writeByte("treasuryInput.type", object.type);
    writeStream.writeFixedHex("treasuryInput.milestoneId", TRANSACTION_ID_LENGTH, object.milestoneId);
}
