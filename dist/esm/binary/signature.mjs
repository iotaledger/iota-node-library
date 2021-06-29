// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Ed25519 } from "../crypto/ed25519.mjs";
import { ED25519_SIGNATURE_TYPE } from "../models/IEd25519Signature.mjs";
import { SMALL_TYPE_LENGTH } from "./common.mjs";
/**
 * The minimum length of a signature binary representation.
 */
export const MIN_SIGNATURE_LENGTH = SMALL_TYPE_LENGTH;
/**
 * The minimum length of an ed25519 signature binary representation.
 */
export const MIN_ED25519_SIGNATURE_LENGTH = MIN_SIGNATURE_LENGTH + Ed25519.SIGNATURE_SIZE + Ed25519.PUBLIC_KEY_SIZE;
/**
 * Deserialize the signature from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeSignature(readStream) {
    if (!readStream.hasRemaining(MIN_SIGNATURE_LENGTH)) {
        throw new Error(`Signature data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_SIGNATURE_LENGTH}`);
    }
    const type = readStream.readByte("signature.type", false);
    let input;
    if (type === ED25519_SIGNATURE_TYPE) {
        input = deserializeEd25519Signature(readStream);
    }
    else {
        throw new Error(`Unrecognized signature type ${type}`);
    }
    return input;
}
/**
 * Serialize the signature to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeSignature(writeStream, object) {
    if (object.type === ED25519_SIGNATURE_TYPE) {
        serializeEd25519Signature(writeStream, object);
    }
    else {
        throw new Error(`Unrecognized signature type ${object.type}`);
    }
}
/**
 * Deserialize the Ed25519 signature from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeEd25519Signature(readStream) {
    if (!readStream.hasRemaining(MIN_ED25519_SIGNATURE_LENGTH)) {
        throw new Error(`Ed25519 signature data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ED25519_SIGNATURE_LENGTH}`);
    }
    const type = readStream.readByte("ed25519Signature.type");
    if (type !== ED25519_SIGNATURE_TYPE) {
        throw new Error(`Type mismatch in ed25519Signature ${type}`);
    }
    const publicKey = readStream.readFixedHex("ed25519Signature.publicKey", Ed25519.PUBLIC_KEY_SIZE);
    const signature = readStream.readFixedHex("ed25519Signature.signature", Ed25519.SIGNATURE_SIZE);
    return {
        type: ED25519_SIGNATURE_TYPE,
        publicKey,
        signature
    };
}
/**
 * Serialize the Ed25519 signature to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeEd25519Signature(writeStream, object) {
    writeStream.writeByte("ed25519Signature.type", object.type);
    writeStream.writeFixedHex("ed25519Signature.publicKey", Ed25519.PUBLIC_KEY_SIZE, object.publicKey);
    writeStream.writeFixedHex("ed25519Signature.signature", Ed25519.SIGNATURE_SIZE, object.signature);
}
