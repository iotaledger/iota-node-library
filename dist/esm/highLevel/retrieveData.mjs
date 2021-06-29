// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { SingleNodeClient } from "../clients/singleNodeClient.mjs";
import { INDEXATION_PAYLOAD_TYPE } from "../models/IIndexationPayload.mjs";
import { TRANSACTION_PAYLOAD_TYPE } from "../models/ITransactionPayload.mjs";
import { Converter } from "../utils/converter.mjs";
/**
 * Retrieve a data message.
 * @param client The client or node endpoint to retrieve the data with.
 * @param messageId The message id of the data to get.
 * @returns The message index and data.
 */
export async function retrieveData(client, messageId) {
    const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
    const message = await localClient.message(messageId);
    if (message === null || message === void 0 ? void 0 : message.payload) {
        let indexationPayload;
        if (message.payload.type === TRANSACTION_PAYLOAD_TYPE) {
            indexationPayload = message.payload.essence.payload;
        }
        else if (message.payload.type === INDEXATION_PAYLOAD_TYPE) {
            indexationPayload = message.payload;
        }
        if (indexationPayload) {
            return {
                index: Converter.hexToBytes(indexationPayload.index),
                data: indexationPayload.data ? Converter.hexToBytes(indexationPayload.data) : undefined
            };
        }
    }
}
