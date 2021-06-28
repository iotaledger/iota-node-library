// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { MAX_NUMBER_PARENTS } from "../binary/message.mjs";
import { SingleNodeClient } from "../clients/singleNodeClient.mjs";
/**
 * Promote an existing message.
 * @param client The clientor node endpoint to perform the promote with.
 * @param messageId The message to promote.
 * @returns The id and message that were promoted.
 */
export async function promote(client, messageId) {
    const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
    const message = await localClient.message(messageId);
    if (!message) {
        throw new Error("The message does not exist.");
    }
    const tipsResponse = await localClient.tips();
    // Parents must be unique and lexicographically sorted
    // so don't add the messageId if it is already one of the tips
    if (!tipsResponse.tipMessageIds.includes(messageId)) {
        tipsResponse.tipMessageIds.unshift(messageId);
    }
    // If we now exceed the max parents remove as many as we need
    if (tipsResponse.tipMessageIds.length > MAX_NUMBER_PARENTS) {
        tipsResponse.tipMessageIds = tipsResponse.tipMessageIds.slice(0, MAX_NUMBER_PARENTS);
    }
    // Finally sort the list
    tipsResponse.tipMessageIds.sort();
    const promoteMessage = {
        parentMessageIds: tipsResponse.tipMessageIds
    };
    const promoteMessageId = await localClient.messageSubmit(promoteMessage);
    return {
        message,
        messageId: promoteMessageId
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbW90ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oaWdoTGV2ZWwvcHJvbW90ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFDL0Isc0NBQXNDO0FBQ3RDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBSS9EOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLEtBQUssVUFBVSxPQUFPLENBQUMsTUFBd0IsRUFBRSxTQUFpQjtJQUlyRSxNQUFNLFdBQVcsR0FBRyxPQUFPLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUV2RixNQUFNLE9BQU8sR0FBRyxNQUFNLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckQsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUNsRDtJQUVELE1BQU0sWUFBWSxHQUFHLE1BQU0sV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRTlDLHNEQUFzRDtJQUN0RCw4REFBOEQ7SUFDOUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ2pELFlBQVksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ2pEO0lBRUQsNkRBQTZEO0lBQzdELElBQUksWUFBWSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsa0JBQWtCLEVBQUU7UUFDeEQsWUFBWSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztLQUN4RjtJQUVELHdCQUF3QjtJQUN4QixZQUFZLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO0lBRWxDLE1BQU0sY0FBYyxHQUFhO1FBQzdCLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxhQUFhO0tBQy9DLENBQUM7SUFFRixNQUFNLGdCQUFnQixHQUFHLE1BQU0sV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUV6RSxPQUFPO1FBQ0gsT0FBTztRQUNQLFNBQVMsRUFBRSxnQkFBZ0I7S0FDOUIsQ0FBQztBQUNOLENBQUMifQ==