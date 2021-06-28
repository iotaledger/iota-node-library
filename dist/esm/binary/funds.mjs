import { deserializeAddress, MIN_ED25519_ADDRESS_LENGTH, serializeAddress } from "./address";
import { UINT64_SIZE } from "./common";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmluYXJ5L2Z1bmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtBLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSwwQkFBMEIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUM3RixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRXZDOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQVcsRUFBRSxDQUFDO0FBRTNDOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQ2xDLGdCQUFnQixHQUFHLHNCQUFzQjtJQUN6QywwQkFBMEIsR0FBRyxVQUFVO0lBQ3ZDLFdBQVcsQ0FBQyxDQUFDLFVBQVU7QUFFM0I7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQVcsR0FBRyxDQUFDO0FBRTNDOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsVUFBc0I7SUFDbkQsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBRXpELE1BQU0sS0FBSyxHQUFxQixFQUFFLENBQUM7SUFDbkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMvQixLQUFLLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7S0FDcEQ7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxjQUFjLENBQUMsV0FBd0IsRUFDbkQsT0FBeUI7SUFDekIsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLGVBQWUsRUFBRTtRQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxlQUFlLHVCQUF1QixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztLQUM3RztJQUNELFdBQVcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTFELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuRDtBQUNMLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLHdCQUF3QixDQUFDLFVBQXNCO0lBQzNELElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLHlCQUF5QixDQUFDLEVBQUU7UUFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsVUFBVSxDQUFDLE1BQU0sRUFDdkQsZ0VBQWdFLHlCQUF5QixFQUFFLENBQUMsQ0FBQztLQUNwRztJQUVELE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxtQ0FBbUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzNHLE1BQU0sT0FBTyxHQUFHLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUUvRCxPQUFPO1FBQ0gsbUJBQW1CO1FBQ25CLE9BQU87UUFDUCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQztLQUMzQixDQUFDO0FBQ04sQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsc0JBQXNCLENBQUMsV0FBd0IsRUFDM0QsTUFBc0I7SUFDdEIsV0FBVyxDQUFDLGFBQWEsQ0FBQyxtQ0FBbUMsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUM3RyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLFdBQVcsQ0FBQyxXQUFXLENBQUMsdUJBQXVCLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzdFLENBQUMifQ==