// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { REFERENCE_UNLOCK_BLOCK_TYPE } from "../models/IReferenceUnlockBlock.mjs";
import { SIGNATURE_UNLOCK_BLOCK_TYPE } from "../models/ISignatureUnlockBlock.mjs";
import { SMALL_TYPE_LENGTH, UINT16_SIZE } from "./common.mjs";
import { deserializeSignature, MIN_SIGNATURE_LENGTH, serializeSignature } from "./signature.mjs";
/**
 * The minimum length of an unlock block binary representation.
 */
export const MIN_UNLOCK_BLOCK_LENGTH = SMALL_TYPE_LENGTH;
/**
 * The minimum length of a signature unlock block binary representation.
 */
export const MIN_SIGNATURE_UNLOCK_BLOCK_LENGTH = MIN_UNLOCK_BLOCK_LENGTH + MIN_SIGNATURE_LENGTH;
/**
 * The minimum length of a reference unlock block binary representation.
 */
export const MIN_REFERENCE_UNLOCK_BLOCK_LENGTH = MIN_UNLOCK_BLOCK_LENGTH + UINT16_SIZE;
/**
 * Deserialize the unlock blocks from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeUnlockBlocks(readStream) {
    const numUnlockBlocks = readStream.readUInt16("transactionEssence.numUnlockBlocks");
    const unlockBlocks = [];
    for (let i = 0; i < numUnlockBlocks; i++) {
        unlockBlocks.push(deserializeUnlockBlock(readStream));
    }
    return unlockBlocks;
}
/**
 * Serialize the unlock blocks to binary.
 * @param writeStream The stream to write the data to.
 * @param objects The objects to serialize.
 */
export function serializeUnlockBlocks(writeStream, objects) {
    writeStream.writeUInt16("transactionEssence.numUnlockBlocks", objects.length);
    for (let i = 0; i < objects.length; i++) {
        serializeUnlockBlock(writeStream, objects[i]);
    }
}
/**
 * Deserialize the unlock block from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeUnlockBlock(readStream) {
    if (!readStream.hasRemaining(MIN_UNLOCK_BLOCK_LENGTH)) {
        throw new Error(`Unlock Block data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_UNLOCK_BLOCK_LENGTH}`);
    }
    const type = readStream.readByte("unlockBlock.type", false);
    let unlockBlock;
    if (type === SIGNATURE_UNLOCK_BLOCK_TYPE) {
        unlockBlock = deserializeSignatureUnlockBlock(readStream);
    }
    else if (type === REFERENCE_UNLOCK_BLOCK_TYPE) {
        unlockBlock = deserializeReferenceUnlockBlock(readStream);
    }
    else {
        throw new Error(`Unrecognized unlock block type ${type}`);
    }
    return unlockBlock;
}
/**
 * Serialize the unlock block to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeUnlockBlock(writeStream, object) {
    if (object.type === SIGNATURE_UNLOCK_BLOCK_TYPE) {
        serializeSignatureUnlockBlock(writeStream, object);
    }
    else if (object.type === REFERENCE_UNLOCK_BLOCK_TYPE) {
        serializeReferenceUnlockBlock(writeStream, object);
    }
    else {
        throw new Error(`Unrecognized unlock block type ${object.type}`);
    }
}
/**
 * Deserialize the signature unlock block from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeSignatureUnlockBlock(readStream) {
    if (!readStream.hasRemaining(MIN_SIGNATURE_UNLOCK_BLOCK_LENGTH)) {
        throw new Error(`Signature Unlock Block data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_SIGNATURE_UNLOCK_BLOCK_LENGTH}`);
    }
    const type = readStream.readByte("signatureUnlockBlock.type");
    if (type !== SIGNATURE_UNLOCK_BLOCK_TYPE) {
        throw new Error(`Type mismatch in signatureUnlockBlock ${type}`);
    }
    const signature = deserializeSignature(readStream);
    return {
        type: SIGNATURE_UNLOCK_BLOCK_TYPE,
        signature
    };
}
/**
 * Serialize the signature unlock block to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeSignatureUnlockBlock(writeStream, object) {
    writeStream.writeByte("signatureUnlockBlock.type", object.type);
    serializeSignature(writeStream, object.signature);
}
/**
 * Deserialize the reference unlock block from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeReferenceUnlockBlock(readStream) {
    if (!readStream.hasRemaining(MIN_REFERENCE_UNLOCK_BLOCK_LENGTH)) {
        throw new Error(`Reference Unlock Block data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_REFERENCE_UNLOCK_BLOCK_LENGTH}`);
    }
    const type = readStream.readByte("referenceUnlockBlock.type");
    if (type !== REFERENCE_UNLOCK_BLOCK_TYPE) {
        throw new Error(`Type mismatch in referenceUnlockBlock ${type}`);
    }
    const reference = readStream.readUInt16("referenceUnlockBlock.reference");
    return {
        type: REFERENCE_UNLOCK_BLOCK_TYPE,
        reference
    };
}
/**
 * Serialize the reference unlock block to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeReferenceUnlockBlock(writeStream, object) {
    writeStream.writeByte("referenceUnlockBlock.type", object.type);
    writeStream.writeUInt16("referenceUnlockBlock.reference", object.reference);
}
