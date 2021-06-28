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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0VW5zcGVudEFkZHJlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGlnaExldmVsL2dldFVuc3BlbnRBZGRyZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTVEOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sQ0FBQyxLQUFLLFVBQVUsaUJBQWlCLENBQ25DLE1BQXdCLEVBQ3hCLElBQVcsRUFDWCxZQUFvQixFQUNwQixjQUdDO0lBS0QsTUFBTSxVQUFVLEdBQUcsTUFBTSxtQkFBbUIsQ0FDeEMsTUFBTSxFQUNOLElBQUksRUFDSixZQUFZLEVBQ1o7UUFDSSxVQUFVLEVBQUUsY0FBYyxhQUFkLGNBQWMsdUJBQWQsY0FBYyxDQUFFLFVBQVU7UUFDdEMsU0FBUyxFQUFFLGNBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSxTQUFTO1FBQ3BDLGFBQWEsRUFBRSxDQUFDO0tBQ25CLENBQUMsQ0FBQztJQUVQLE9BQU8sVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQzdELENBQUMifQ==