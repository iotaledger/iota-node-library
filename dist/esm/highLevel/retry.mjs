// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { SingleNodeClient } from "../clients/singleNodeClient.mjs";
import { promote } from "./promote.mjs";
import { reattach } from "./reattach.mjs";
/**
 * Retry an existing message either by promoting or reattaching.
 * @param client The client or node endpoint to perform the retry with.
 * @param messageId The message to retry.
 * @returns The id and message that were retried.
 */
export async function retry(client, messageId) {
    const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
    const metadata = await localClient.messageMetadata(messageId);
    if (!metadata) {
        throw new Error("The message does not exist.");
    }
    if (metadata.shouldPromote) {
        return promote(client, messageId);
    }
    else if (metadata.shouldReattach) {
        return reattach(client, messageId);
    }
    throw new Error("The message should not be promoted or reattached.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGlnaExldmVsL3JldHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixzQ0FBc0M7QUFDdEMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFHL0QsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNwQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXRDOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLEtBQUssVUFBVSxLQUFLLENBQUMsTUFBd0IsRUFBRSxTQUFpQjtJQUluRSxNQUFNLFdBQVcsR0FBRyxPQUFPLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUV2RixNQUFNLFFBQVEsR0FBRyxNQUFNLFdBQVcsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFOUQsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUNsRDtJQUVELElBQUksUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUN4QixPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDckM7U0FBTSxJQUFJLFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDaEMsT0FBTyxRQUFRLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ3RDO0lBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO0FBQ3pFLENBQUMifQ==