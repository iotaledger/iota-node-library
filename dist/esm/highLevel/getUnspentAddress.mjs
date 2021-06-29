import { getUnspentAddresses } from "./getUnspentAddresses.mjs";
/**
 * Get the first unspent address.
 * @param client The client or node endpoint to send the transfer with.
 * @param seed The seed to use for address generation.
 * @param accountIndex The account index in the wallet.
 * @param addressOptions Optional address configuration for balance address lookups.
 * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
 * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
 * @returns The first unspent address.
 */
export async function getUnspentAddress(client, seed, accountIndex, addressOptions) {
    const allUnspent = await getUnspentAddresses(client, seed, accountIndex, {
        startIndex: addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.startIndex,
        zeroCount: addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.zeroCount,
        requiredCount: 1
    });
    return allUnspent.length > 0 ? allUnspent[0] : undefined;
}
