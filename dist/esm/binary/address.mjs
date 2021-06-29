// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Ed25519Address } from "../addressTypes/ed25519Address.mjs";
import { ED25519_ADDRESS_TYPE } from "../models/IEd25519Address.mjs";
import { SMALL_TYPE_LENGTH } from "./common.mjs";
/**
 * The minimum length of an address binary representation.
 */
export const MIN_ADDRESS_LENGTH = SMALL_TYPE_LENGTH;
/**
 * The minimum length of an ed25519 address binary representation.
 */
export const MIN_ED25519_ADDRESS_LENGTH = MIN_ADDRESS_LENGTH + Ed25519Address.ADDRESS_LENGTH;
/**
 * Deserialize the address from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeAddress(readStream) {
    if (!readStream.hasRemaining(MIN_ADDRESS_LENGTH)) {
        throw new Error(`Address data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ADDRESS_LENGTH}`);
    }
    const type = readStream.readByte("address.type", false);
    let address;
    if (type === ED25519_ADDRESS_TYPE) {
        address = deserializeEd25519Address(readStream);
    }
    else {
        throw new Error(`Unrecognized address type ${type}`);
    }
    return address;
}
/**
 * Serialize the address to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeAddress(writeStream, object) {
    if (object.type === ED25519_ADDRESS_TYPE) {
        serializeEd25519Address(writeStream, object);
    }
    else {
        throw new Error(`Unrecognized address type ${object.type}`);
    }
}
/**
 * Deserialize the Ed25519 address from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeEd25519Address(readStream) {
    if (!readStream.hasRemaining(MIN_ED25519_ADDRESS_LENGTH)) {
        throw new Error(`Ed25519 address data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ED25519_ADDRESS_LENGTH}`);
    }
    const type = readStream.readByte("ed25519Address.type");
    if (type !== ED25519_ADDRESS_TYPE) {
        throw new Error(`Type mismatch in ed25519Address ${type}`);
    }
    const address = readStream.readFixedHex("ed25519Address.address", Ed25519Address.ADDRESS_LENGTH);
    return {
        type: ED25519_ADDRESS_TYPE,
        address
    };
}
/**
 * Serialize the ed25519 address to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeEd25519Address(writeStream, object) {
    writeStream.writeByte("ed25519Address.type", object.type);
    writeStream.writeFixedHex("ed25519Address.address", Ed25519Address.ADDRESS_LENGTH, object.address);
}
