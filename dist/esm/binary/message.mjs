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
