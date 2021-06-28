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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2JpbmFyeS9vdXRwdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLHNDQUFzQztBQUN0QyxPQUFPLEVBQWlDLHFDQUFxQyxFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDL0gsT0FBTyxFQUEwQiw2QkFBNkIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3pHLE9BQU8sRUFBbUIsb0JBQW9CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUlsRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsMEJBQTBCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDakgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUUxRDs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFXLGlCQUFpQixDQUFDO0FBRTNEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sbUNBQW1DLEdBQzVDLGlCQUFpQixHQUFHLGtCQUFrQixHQUFHLDBCQUEwQixDQUFDO0FBRXhFOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sMkNBQTJDLEdBQ3BELGlCQUFpQixHQUFHLGtCQUFrQixHQUFHLDBCQUEwQixDQUFDO0FBRXhFOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQ25DLGlCQUFpQixHQUFHLFdBQVcsQ0FBQztBQUVwQzs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFXLENBQUMsQ0FBQztBQUUxQzs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFXLEdBQUcsQ0FBQztBQUU1Qzs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUFDLFVBQXNCO0lBRXJELE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUUvRCxNQUFNLE1BQU0sR0FBaUYsRUFBRSxDQUFDO0lBQ2hHLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0tBQzlDO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsV0FBd0IsRUFDckQsT0FBcUY7SUFDckYsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLGdCQUFnQixFQUFFO1FBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLGdCQUFnQix1QkFBdUIsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7S0FDaEg7SUFDRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLEVBQUU7UUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsZ0JBQWdCLHVCQUF1QixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztLQUNoSDtJQUVELFdBQVcsQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTlELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUM7QUFDTCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxVQUFzQjtJQUVwRCxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO1FBQzdDLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLFVBQVUsQ0FBQyxNQUFNLEVBQy9DLGdFQUFnRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7S0FDNUY7SUFFRCxNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN2RCxJQUFJLEtBQUssQ0FBQztJQUVWLElBQUksSUFBSSxLQUFLLDZCQUE2QixFQUFFO1FBQ3hDLEtBQUssR0FBRyxnQ0FBZ0MsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN4RDtTQUFNLElBQUksSUFBSSxLQUFLLHFDQUFxQyxFQUFFO1FBQ3ZELEtBQUssR0FBRyx1Q0FBdUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUMvRDtTQUFNLElBQUksSUFBSSxLQUFLLG9CQUFvQixFQUFFO1FBQ3RDLEtBQUssR0FBRyx5QkFBeUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUNqRDtTQUFNO1FBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUN2RDtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLGVBQWUsQ0FBQyxXQUF3QixFQUNwRCxNQUF5QjtJQUN6QixJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssNkJBQTZCLEVBQUU7UUFDL0MsOEJBQThCLENBQUMsV0FBVyxFQUFFLE1BQWdDLENBQUMsQ0FBQztLQUNqRjtTQUFNLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxxQ0FBcUMsRUFBRTtRQUM5RCxxQ0FBcUMsQ0FBQyxXQUFXLEVBQUUsTUFBdUMsQ0FBQyxDQUFDO0tBQy9GO1NBQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLG9CQUFvQixFQUFFO1FBQzdDLHVCQUF1QixDQUFDLFdBQVcsRUFBRSxNQUF5QixDQUFDLENBQUM7S0FDbkU7U0FBTTtRQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQzlEO0FBQ0wsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsZ0NBQWdDLENBQUMsVUFBc0I7SUFDbkUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsbUNBQW1DLENBQUMsRUFBRTtRQUMvRCxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxVQUFVLENBQUMsTUFBTSxFQUN2RSxnRUFBZ0UsbUNBQW1DLEVBQUUsQ0FBQyxDQUFDO0tBQzlHO0lBRUQsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQy9ELElBQUksSUFBSSxLQUFLLDZCQUE2QixFQUFFO1FBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLElBQUksRUFBRSxDQUFDLENBQUM7S0FDckU7SUFFRCxNQUFNLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvQyxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFFckUsT0FBTztRQUNILElBQUksRUFBRSw2QkFBNkI7UUFDbkMsT0FBTztRQUNQLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDO0tBQ3pCLENBQUM7QUFDTixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSw4QkFBOEIsQ0FBQyxXQUF3QixFQUNuRSxNQUE4QjtJQUM5QixXQUFXLENBQUMsU0FBUyxDQUFDLDRCQUE0QixFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRSxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLFdBQVcsQ0FBQyxXQUFXLENBQUMsOEJBQThCLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ25GLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLHVDQUF1QyxDQUFDLFVBQXNCO0lBQzFFLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLDJDQUEyQyxDQUFDLEVBQUU7UUFDdkUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrREFBa0QsVUFBVSxDQUFDLE1BQU0sRUFDL0UsZ0VBQWdFLDJDQUNoRSxFQUFFLENBQUMsQ0FBQztLQUNYO0lBRUQsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0lBQ3RFLElBQUksSUFBSSxLQUFLLHFDQUFxQyxFQUFFO1FBQ2hELE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELElBQUksRUFBRSxDQUFDLENBQUM7S0FDNUU7SUFFRCxNQUFNLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvQyxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7SUFFNUUsT0FBTztRQUNILElBQUksRUFBRSxxQ0FBcUM7UUFDM0MsT0FBTztRQUNQLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDO0tBQ3pCLENBQUM7QUFDTixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxxQ0FBcUMsQ0FBQyxXQUF3QixFQUMxRSxNQUFxQztJQUNyQyxXQUFXLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4RSxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLFdBQVcsQ0FBQyxXQUFXLENBQUMscUNBQXFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzFGLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLHlCQUF5QixDQUFDLFVBQXNCO0lBQzVELElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDLEVBQUU7UUFDdEQsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsVUFBVSxDQUFDLE1BQU0sRUFDeEQsZ0VBQWdFLDBCQUNoRSxFQUFFLENBQUMsQ0FBQztLQUNYO0lBRUQsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3hELElBQUksSUFBSSxLQUFLLG9CQUFvQixFQUFFO1FBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLElBQUksRUFBRSxDQUFDLENBQUM7S0FDOUQ7SUFFRCxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFFOUQsT0FBTztRQUNILElBQUksRUFBRSxvQkFBb0I7UUFDMUIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUM7S0FDekIsQ0FBQztBQUNOLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLHVCQUF1QixDQUFDLFdBQXdCLEVBQzVELE1BQXVCO0lBQ3ZCLFdBQVcsQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFELFdBQVcsQ0FBQyxXQUFXLENBQUMsdUJBQXVCLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzVFLENBQUMifQ==