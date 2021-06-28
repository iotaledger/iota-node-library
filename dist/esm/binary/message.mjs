// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { INDEXATION_PAYLOAD_TYPE } from "../models/IIndexationPayload.mjs";
import { MILESTONE_PAYLOAD_TYPE } from "../models/IMilestonePayload.mjs";
import { RECEIPT_PAYLOAD_TYPE } from "../models/IReceiptPayload.mjs";
import { TRANSACTION_PAYLOAD_TYPE } from "../models/ITransactionPayload.mjs";
import { TREASURY_TRANSACTION_PAYLOAD_TYPE } from "../models/ITreasuryTransactionPayload.mjs";
import { BYTE_SIZE, MESSAGE_ID_LENGTH, UINT64_SIZE } from "./common.mjs";
import { deserializePayload, MIN_PAYLOAD_LENGTH, serializePayload } from "./payload.mjs";
/**
 * The minimum length of a message binary representation.
 */
const MIN_MESSAGE_LENGTH = UINT64_SIZE + // Network id
    BYTE_SIZE + // Parent count
    MESSAGE_ID_LENGTH + // Single parent
    MIN_PAYLOAD_LENGTH + // Min payload length
    UINT64_SIZE; // Nonce
/**
 * The maximum length of a message.
 */
export const MAX_MESSAGE_LENGTH = 32768;
/**
 * The maximum number of parents.
 */
export const MAX_NUMBER_PARENTS = 8;
/**
 * The minimum number of parents.
 */
export const MIN_NUMBER_PARENTS = 1;
/**
 * Deserialize the message from binary.
 * @param readStream The message to deserialize.
 * @returns The deserialized message.
 */
export function deserializeMessage(readStream) {
    if (!readStream.hasRemaining(MIN_MESSAGE_LENGTH)) {
        throw new Error(`Message data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_MESSAGE_LENGTH}`);
    }
    const networkId = readStream.readUInt64("message.networkId");
    const numParents = readStream.readByte("message.numParents");
    const parents = [];
    for (let i = 0; i < numParents; i++) {
        const parentMessageId = readStream.readFixedHex(`message.parentMessageId${i}`, MESSAGE_ID_LENGTH);
        parents.push(parentMessageId);
    }
    const payload = deserializePayload(readStream);
    if (payload &&
        (payload.type === RECEIPT_PAYLOAD_TYPE ||
            payload.type === TREASURY_TRANSACTION_PAYLOAD_TYPE)) {
        throw new Error("Messages can not contain receipt or treasury transaction payloads");
    }
    const nonce = readStream.readUInt64("message.nonce");
    const unused = readStream.unused();
    if (unused !== 0) {
        throw new Error(`Message data length ${readStream.length()} has unused data ${unused}`);
    }
    return {
        networkId: networkId.toString(10),
        parentMessageIds: parents,
        payload,
        nonce: nonce.toString(10)
    };
}
/**
 * Serialize the message essence to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeMessage(writeStream, object) {
    var _a, _b, _c, _d;
    writeStream.writeUInt64("message.networkId", BigInt((_a = object.networkId) !== null && _a !== void 0 ? _a : 0));
    const numParents = (_c = (_b = object.parentMessageIds) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
    writeStream.writeByte("message.numParents", numParents);
    if (object.parentMessageIds) {
        if (numParents > MAX_NUMBER_PARENTS) {
            throw new Error(`A maximum of ${MAX_NUMBER_PARENTS} parents is allowed, you provided ${numParents}`);
        }
        if ((new Set(object.parentMessageIds)).size !== numParents) {
            throw new Error("The message parents must be unique");
        }
        const sorted = object.parentMessageIds.slice().sort();
        for (let i = 0; i < numParents; i++) {
            if (sorted[i] !== object.parentMessageIds[i]) {
                throw new Error("The message parents must be lexographically sorted");
            }
            writeStream.writeFixedHex(`message.parentMessageId${i + 1}`, MESSAGE_ID_LENGTH, object.parentMessageIds[i]);
        }
    }
    if (object.payload &&
        object.payload.type !== TRANSACTION_PAYLOAD_TYPE &&
        object.payload.type !== INDEXATION_PAYLOAD_TYPE &&
        object.payload.type !== MILESTONE_PAYLOAD_TYPE) {
        throw new Error("Messages can only contain transaction, indexation or milestone payloads");
    }
    serializePayload(writeStream, object.payload);
    writeStream.writeUInt64("message.nonce", BigInt((_d = object.nonce) !== null && _d !== void 0 ? _d : 0));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW5hcnkvbWVzc2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFDL0Isc0NBQXNDO0FBQ3RDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXZFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxpQ0FBaUMsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBRzFGLE9BQU8sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUVyRjs7R0FFRztBQUNILE1BQU0sa0JBQWtCLEdBQ3BCLFdBQVcsR0FBRyxhQUFhO0lBQzNCLFNBQVMsR0FBRyxlQUFlO0lBQzNCLGlCQUFpQixHQUFHLGdCQUFnQjtJQUNwQyxrQkFBa0IsR0FBRyxxQkFBcUI7SUFDMUMsV0FBVyxDQUFDLENBQUMsUUFBUTtBQUV6Qjs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFXLEtBQUssQ0FBQztBQUVoRDs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFXLENBQUMsQ0FBQztBQUU1Qzs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFXLENBQUMsQ0FBQztBQUU1Qzs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUFDLFVBQXNCO0lBQ3JELElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLEVB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