// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Ed25519Address } from "../addressTypes/ed25519Address.mjs";
import { SingleNodeClient } from "../clients/singleNodeClient.mjs";
import { Bip32Path } from "../crypto/bip32Path.mjs";
import { ED25519_ADDRESS_TYPE } from "../models/IEd25519Address.mjs";
import { Bech32Helper } from "../utils/bech32Helper.mjs";
import { Converter } from "../utils/converter.mjs";
import { generateBip44Address } from "./addresses.mjs";
/**
 * Get all the unspent addresses.
 * @param client The client or node endpoint to send the transfer with.
 * @param seed The seed to use for address generation.
 * @param accountIndex The account index in the wallet.
 * @param addressOptions Optional address configuration for balance address lookups.
 * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
 * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
 * @param addressOptions.requiredCount The max number of addresses to find.
 * @returns All the unspent addresses.
 */
export async function getUnspentAddresses(client, seed, accountIndex, addressOptions) {
    var _a;
    return getUnspentAddressesWithAddressGenerator(client, seed, {
        accountIndex,
        addressIndex: (_a = addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.startIndex) !== null && _a !== void 0 ? _a : 0,
        isInternal: false
    }, generateBip44Address, addressOptions);
}
/**
 * Get all the unspent addresses using an address generator.
 * @param client The client or node endpoint to get the addresses from.
 * @param seed The seed to use for address generation.
 * @param initialAddressState The initial address state for calculating the addresses.
 * @param nextAddressPath Calculate the next address for inputs.
 * @param addressOptions Optional address configuration for balance address lookups.
 * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
 * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
 * @param addressOptions.requiredCount The max number of addresses to find.
 * @returns All the unspent addresses.
 */
export async function getUnspentAddressesWithAddressGenerator(client, seed, initialAddressState, nextAddressPath, addressOptions) {
    var _a, _b;
    const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
    const nodeInfo = await localClient.info();
    const localRequiredLimit = (_a = addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.requiredCount) !== null && _a !== void 0 ? _a : Number.MAX_SAFE_INTEGER;
    const localZeroCount = (_b = addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.zeroCount) !== null && _b !== void 0 ? _b : 20;
    let finished = false;
    const allUnspent = [];
    let isFirst = true;
    let zeroBalance = 0;
    do {
        const path = nextAddressPath(initialAddressState, isFirst);
        isFirst = false;
        const addressSeed = seed.generateSeedFromPath(new Bip32Path(path));
        const ed25519Address = new Ed25519Address(addressSeed.keyPair().publicKey);
        const addressBytes = ed25519Address.toAddress();
        const addressHex = Converter.bytesToHex(addressBytes);
        const addressResponse = await localClient.addressEd25519(addressHex);
        // If there is no balance we increment the counter and end
        // the text when we have reached the count
        if (addressResponse.balance === 0) {
            zeroBalance++;
            if (zeroBalance >= localZeroCount) {
                finished = true;
            }
        }
        else {
            allUnspent.push({
                address: Bech32Helper.toBech32(ED25519_ADDRESS_TYPE, addressBytes, nodeInfo.bech32HRP),
                path,
                balance: addressResponse.balance
            });
            if (allUnspent.length === localRequiredLimit) {
                finished = true;
            }
        }
    } while (!finished);
    return allUnspent;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0VW5zcGVudEFkZHJlc3Nlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oaWdoTGV2ZWwvZ2V0VW5zcGVudEFkZHJlc3Nlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFDL0Isc0NBQXNDO0FBQ3RDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNoRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHaEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFakUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFbkQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQU0sQ0FBQyxLQUFLLFVBQVUsbUJBQW1CLENBQ3JDLE1BQXdCLEVBQ3hCLElBQVcsRUFDWCxZQUFvQixFQUNwQixjQUlDOztJQUtELE9BQU8sdUNBQXVDLENBQzFDLE1BQU0sRUFDTixJQUFJLEVBQ0o7UUFDSSxZQUFZO1FBQ1osWUFBWSxFQUFFLE1BQUEsY0FBYyxhQUFkLGNBQWMsdUJBQWQsY0FBYyxDQUFFLFVBQVUsbUNBQUksQ0FBQztRQUM3QyxVQUFVLEVBQUUsS0FBSztLQUNwQixFQUNELG9CQUFvQixFQUNwQixjQUFjLENBQ2pCLENBQUM7QUFDTixDQUFDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLHVDQUF1QyxDQUN6RCxNQUF3QixFQUN4QixJQUFXLEVBQ1gsbUJBQXNCLEVBQ3RCLGVBQThELEVBQzlELGNBSUM7O0lBS0QsTUFBTSxXQUFXLEdBQUcsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFdkYsTUFBTSxRQUFRLEdBQUcsTUFBTSxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDMUMsTUFBTSxrQkFBa0IsR0FBRyxNQUFBLGNBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSxhQUFhLG1DQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUNwRixNQUFNLGNBQWMsR0FBRyxNQUFBLGNBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSxTQUFTLG1DQUFJLEVBQUUsQ0FBQztJQUN2RCxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDckIsTUFBTSxVQUFVLEdBSVYsRUFBRSxDQUFDO0lBRVQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ25CLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztJQUVwQixHQUFHO1FBQ0MsTUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNELE9BQU8sR0FBRyxLQUFLLENBQUM7UUFFaEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFbkUsTUFBTSxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNFLE1BQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3RELE1BQU0sZUFBZSxHQUFHLE1BQU0sV0FBVyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVyRSwwREFBMEQ7UUFDMUQsMENBQTBDO1FBQzFDLElBQUksZUFBZSxDQUFDLE9BQU8sS0FBSyxDQUFDLEVBQUU7WUFDL0IsV0FBVyxFQUFFLENBQUM7WUFDZCxJQUFJLFdBQVcsSUFBSSxjQUFjLEVBQUU7Z0JBQy9CLFFBQVEsR0FBRyxJQUFJLENBQUM7YUFDbkI7U0FDSjthQUFNO1lBQ0gsVUFBVSxDQUFDLElBQUksQ0FBQztnQkFDWixPQUFPLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQztnQkFDdEYsSUFBSTtnQkFDSixPQUFPLEVBQUUsZUFBZSxDQUFDLE9BQU87YUFDbkMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLGtCQUFrQixFQUFFO2dCQUMxQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2FBQ25CO1NBQ0o7S0FDSixRQUFRLENBQUMsUUFBUSxFQUFFO0lBRXBCLE9BQU8sVUFBVSxDQUFDO0FBQ3RCLENBQUMifQ==