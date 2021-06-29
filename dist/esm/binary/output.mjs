// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE } from "../models/ISigLockedDustAllowanceOutput.mjs";
import { SIG_LOCKED_SINGLE_OUTPUT_TYPE } from "../models/ISigLockedSingleOutput.mjs";
import { TREASURY_OUTPUT_TYPE } from "../models/ITreasuryOutput.mjs";
import { deserializeAddress, MIN_ADDRESS_LENGTH, MIN_ED25519_ADDRESS_LENGTH, serializeAddress } from "./address.mjs";
import { SMALL_TYPE_LENGTH, UINT64_SIZE } from "./common.mjs";
/**
 * The minimum length of an output binary representation.
 */
export const MIN_OUTPUT_LENGTH = SMALL_TYPE_LENGTH;
/**
 * The minimum length of a sig locked single output binary representation.
 */
export const MIN_SIG_LOCKED_SINGLE_OUTPUT_LENGTH = MIN_OUTPUT_LENGTH + MIN_ADDRESS_LENGTH + MIN_ED25519_ADDRESS_LENGTH;
/**
 * The minimum length of a sig locked dust allowance output binary representation.
 */
export const MIN_SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_LENGTH = MIN_OUTPUT_LENGTH + MIN_ADDRESS_LENGTH + MIN_ED25519_ADDRESS_LENGTH;
/**
 * The minimum length of a treasury output binary representation.
 */
export const MIN_TREASURY_OUTPUT_LENGTH = MIN_OUTPUT_LENGTH + UINT64_SIZE;
/**
 * The minimum number of outputs.
 */
export const MIN_OUTPUT_COUNT = 1;
/**
 * The maximum number of outputs.
 */
export const MAX_OUTPUT_COUNT = 127;
/**
 * Deserialize the outputs from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeOutputs(readStream) {
    const numOutputs = readStream.readUInt16("outputs.numOutputs");
    const inputs = [];
    for (let i = 0; i < numOutputs; i++) {
        inputs.push(deserializeOutput(readStream));
    }
    return inputs;
}
/**
 * Serialize the outputs to binary.
 * @param writeStream The stream to write the data to.
 * @param objects The objects to serialize.
 */
export function serializeOutputs(writeStream, objects) {
    if (objects.length < MIN_OUTPUT_COUNT) {
        throw new Error(`The minimum number of outputs is ${MIN_OUTPUT_COUNT}, you have provided ${objects.length}`);
    }
    if (objects.length > MAX_OUTPUT_COUNT) {
        throw new Error(`The maximum number of outputs is ${MAX_OUTPUT_COUNT}, you have provided ${objects.length}`);
    }
    writeStream.writeUInt16("outputs.numOutputs", objects.length);
    for (let i = 0; i < objects.length; i++) {
        serializeOutput(writeStream, objects[i]);
    }
}
/**
 * Deserialize the output from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeOutput(readStream) {
    if (!readStream.hasRemaining(MIN_OUTPUT_LENGTH)) {
        throw new Error(`Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_OUTPUT_LENGTH}`);
    }
    const type = readStream.readByte("output.type", false);
    let input;
    if (type === SIG_LOCKED_SINGLE_OUTPUT_TYPE) {
        input = deserializeSigLockedSingleOutput(readStream);
    }
    else if (type === SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
        input = deserializeSigLockedDustAllowanceOutput(readStream);
    }
    else if (type === TREASURY_OUTPUT_TYPE) {
        input = deserializeTreasuryOutput(readStream);
    }
    else {
        throw new Error(`Unrecognized output type ${type}`);
    }
    return input;
}
/**
 * Serialize the output to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeOutput(writeStream, object) {
    if (object.type === SIG_LOCKED_SINGLE_OUTPUT_TYPE) {
        serializeSigLockedSingleOutput(writeStream, object);
    }
    else if (object.type === SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
        serializeSigLockedDustAllowanceOutput(writeStream, object);
    }
    else if (object.type === TREASURY_OUTPUT_TYPE) {
        serializeTreasuryOutput(writeStream, object);
    }
    else {
        throw new Error(`Unrecognized output type ${object.type}`);
    }
}
/**
 * Deserialize the signature locked single output from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeSigLockedSingleOutput(readStream) {
    if (!readStream.hasRemaining(MIN_SIG_LOCKED_SINGLE_OUTPUT_LENGTH)) {
        throw new Error(`Signature Locked Single Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_SIG_LOCKED_SINGLE_OUTPUT_LENGTH}`);
    }
    const type = readStream.readByte("sigLockedSingleOutput.type");
    if (type !== SIG_LOCKED_SINGLE_OUTPUT_TYPE) {
        throw new Error(`Type mismatch in sigLockedSingleOutput ${type}`);
    }
    const address = deserializeAddress(readStream);
    const amount = readStream.readUInt64("sigLockedSingleOutput.amount");
    return {
        type: SIG_LOCKED_SINGLE_OUTPUT_TYPE,
        address,
        amount: Number(amount)
    };
}
/**
 * Serialize the signature locked single output to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeSigLockedSingleOutput(writeStream, object) {
    writeStream.writeByte("sigLockedSingleOutput.type", object.type);
    serializeAddress(writeStream, object.address);
    writeStream.writeUInt64("sigLockedSingleOutput.amount", BigInt(object.amount));
}
/**
 * Deserialize the signature locked dust allowance output from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeSigLockedDustAllowanceOutput(readStream) {
    if (!readStream.hasRemaining(MIN_SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_LENGTH)) {
        throw new Error(`Signature Locked Dust Allowance Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_LENGTH}`);
    }
    const type = readStream.readByte("sigLockedDustAllowanceOutput.type");
    if (type !== SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
        throw new Error(`Type mismatch in sigLockedDustAllowanceOutput ${type}`);
    }
    const address = deserializeAddress(readStream);
    const amount = readStream.readUInt64("sigLockedDustAllowanceOutput.amount");
    return {
        type: SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE,
        address,
        amount: Number(amount)
    };
}
/**
 * Serialize the signature locked dust allowance output to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeSigLockedDustAllowanceOutput(writeStream, object) {
    writeStream.writeByte("sigLockedDustAllowanceOutput.type", object.type);
    serializeAddress(writeStream, object.address);
    writeStream.writeUInt64("sigLockedDustAllowanceOutput.amount", BigInt(object.amount));
}
/**
 * Deserialize the treasury output from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeTreasuryOutput(readStream) {
    if (!readStream.hasRemaining(MIN_TREASURY_OUTPUT_LENGTH)) {
        throw new Error(`Treasury Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TREASURY_OUTPUT_LENGTH}`);
    }
    const type = readStream.readByte("treasuryOutput.type");
    if (type !== TREASURY_OUTPUT_TYPE) {
        throw new Error(`Type mismatch in treasuryOutput ${type}`);
    }
    const amount = readStream.readUInt64("treasuryOutput.amount");
    return {
        type: TREASURY_OUTPUT_TYPE,
        amount: Number(amount)
    };
}
/**
 * Serialize the treasury output to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeTreasuryOutput(writeStream, object) {
    writeStream.writeByte("treasuryOutput.type", object.type);
    writeStream.writeUInt64("treasuryOutput.amount", BigInt(object.amount));
}
