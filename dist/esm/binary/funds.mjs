import { deserializeAddress, MIN_ED25519_ADDRESS_LENGTH, serializeAddress } from "./address.mjs";
import { UINT64_SIZE } from "./common.mjs";
/**
 * The length of the tail hash length in bytes.
 */
export const TAIL_HASH_LENGTH = 49;
/**
 * The minimum length of a migrated fund binary representation.
 */
export const MIN_MIGRATED_FUNDS_LENGTH = TAIL_HASH_LENGTH + // tailTransactionHash
    MIN_ED25519_ADDRESS_LENGTH + // address
    UINT64_SIZE; // deposit
/**
 * The maximum number of funds.
 */
export const MAX_FUNDS_COUNT = 127;
/**
 * Deserialize the receipt payload funds from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeFunds(readStream) {
    const numFunds = readStream.readUInt16("funds.numFunds");
    const funds = [];
    for (let i = 0; i < numFunds; i++) {
        funds.push(deserializeMigratedFunds(readStream));
    }
    return funds;
}
/**
 * Serialize the receipt payload funds to binary.
 * @param writeStream The stream to write the data to.
 * @param objects The objects to serialize.
 */
export function serializeFunds(writeStream, objects) {
    if (objects.length > MAX_FUNDS_COUNT) {
        throw new Error(`The maximum number of funds is ${MAX_FUNDS_COUNT}, you have provided ${objects.length}`);
    }
    writeStream.writeUInt16("funds.numFunds", objects.length);
    for (let i = 0; i < objects.length; i++) {
        serializeMigratedFunds(writeStream, objects[i]);
    }
}
/**
 * Deserialize the migrated fund from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeMigratedFunds(readStream) {
    if (!readStream.hasRemaining(MIN_MIGRATED_FUNDS_LENGTH)) {
        throw new Error(`Migrated funds data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_MIGRATED_FUNDS_LENGTH}`);
    }
    const tailTransactionHash = readStream.readFixedHex("migratedFunds.tailTransactionHash", TAIL_HASH_LENGTH);
    const address = deserializeAddress(readStream);
    const deposit = readStream.readUInt64("migratedFunds.deposit");
    return {
        tailTransactionHash,
        address,
        deposit: Number(deposit)
    };
}
/**
 * Serialize the migrated funds to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeMigratedFunds(writeStream, object) {
    writeStream.writeFixedHex("migratedFunds.tailTransactionHash", TAIL_HASH_LENGTH, object.tailTransactionHash);
    serializeAddress(writeStream, object.address);
    writeStream.writeUInt64("migratedFunds.deposit", BigInt(object.deposit));
}
