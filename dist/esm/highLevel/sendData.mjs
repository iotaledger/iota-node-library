// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { MAX_INDEXATION_KEY_LENGTH, MIN_INDEXATION_KEY_LENGTH } from "../binary/payload";
import { SingleNodeClient } from "../clients/singleNodeClient";
import { INDEXATION_PAYLOAD_TYPE } from "../models/IIndexationPayload";
import { Converter } from "../utils/converter";
/**
 * Send a data message.
 * @param client The client or node endpoint to send the data with.
 * @param indexationKey The index name.
 * @param indexationData The index data as either UTF8 text or Uint8Array bytes.
 * @returns The id of the message created and the message.
 */
export async function sendData(client, indexationKey, indexationData) {
    const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
    if (!indexationKey) {
        throw new Error("indexationKey must not be empty");
    }
    const localIndexationKeyHex = typeof (indexationKey) === "string"
        ? Converter.utf8ToHex(indexationKey) : Converter.bytesToHex(indexationKey);
    if (localIndexationKeyHex.length / 2 < MIN_INDEXATION_KEY_LENGTH) {
        throw new Error(`The indexation key length is ${localIndexationKeyHex.length / 2}, which is below the minimum size of ${MIN_INDEXATION_KEY_LENGTH}`);
    }
    if (localIndexationKeyHex.length / 2 > MAX_INDEXATION_KEY_LENGTH) {
        throw new Error(`The indexation key length is ${localIndexationKeyHex.length / 2}, which exceeds the maximum size of ${MAX_INDEXATION_KEY_LENGTH}`);
    }
    const indexationPayload = {
        type: INDEXATION_PAYLOAD_TYPE,
        index: localIndexationKeyHex,
        data: indexationData ? (typeof indexationData === "string"
            ? Converter.utf8ToHex(indexationData) : Converter.bytesToHex(indexationData)) : undefined
    };
    const message = {
        payload: indexationPayload
    };
    const messageId = await localClient.messageSubmit(message);
    return {
        message,
        messageId
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZERhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGlnaExldmVsL3NlbmREYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixzQ0FBc0M7QUFDdEMsT0FBTyxFQUFFLHlCQUF5QixFQUFFLHlCQUF5QixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDekYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFL0QsT0FBTyxFQUFzQix1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRTNGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUUvQzs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLFFBQVEsQ0FDMUIsTUFBd0IsRUFDeEIsYUFBa0MsRUFDbEMsY0FBb0M7SUFJcEMsTUFBTSxXQUFXLEdBQUcsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFdkYsSUFBSSxDQUFDLGFBQWEsRUFBRTtRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7S0FDdEQ7SUFFRCxNQUFNLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxRQUFRO1FBQzdELENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRS9FLElBQUkscUJBQXFCLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyx5QkFBeUIsRUFBRTtRQUM5RCxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxxQkFBcUIsQ0FBQyxNQUFNLEdBQUcsQ0FDM0Usd0NBQXdDLHlCQUF5QixFQUFFLENBQUMsQ0FBQztLQUM1RTtJQUVELElBQUkscUJBQXFCLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyx5QkFBeUIsRUFBRTtRQUM5RCxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxxQkFBcUIsQ0FBQyxNQUFNLEdBQUcsQ0FDM0UsdUNBQXVDLHlCQUF5QixFQUFFLENBQUMsQ0FBQztLQUMzRTtJQUVELE1BQU0saUJBQWlCLEdBQXVCO1FBQzFDLElBQUksRUFBRSx1QkFBdUI7UUFDN0IsS0FBSyxFQUFFLHFCQUFxQjtRQUM1QixJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sY0FBYyxLQUFLLFFBQVE7WUFDdEQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztLQUNoRyxDQUFDO0lBRUYsTUFBTSxPQUFPLEdBQWE7UUFDdEIsT0FBTyxFQUFFLGlCQUFpQjtLQUM3QixDQUFDO0lBRUYsTUFBTSxTQUFTLEdBQUcsTUFBTSxXQUFXLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNELE9BQU87UUFDSCxPQUFPO1FBQ1AsU0FBUztLQUNaLENBQUM7QUFDTixDQUFDIn0=