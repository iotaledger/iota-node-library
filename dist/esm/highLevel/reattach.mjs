// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { SingleNodeClient } from "../clients/singleNodeClient.mjs";
/**
 * Reattach an existing message.
 * @param client The client or node endpoint to perform the reattach with.
 * @param messageId The message to reattach.
 * @returns The id and message that were reattached.
 */
export async function reattach(client, messageId) {
    const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
    const message = await localClient.message(messageId);
    if (!message) {
        throw new Error("The message does not exist.");
    }
    const reattachMessage = {
        payload: message.payload
    };
    const reattachedMessageId = await localClient.messageSubmit(reattachMessage);
    return {
        message,
        messageId: reattachedMessageId
    };
}
