import { getUnspentAddresses } from "./getUnspentAddresses.mjs";
/**
 * Get the balance for a list of addresses.
 * @param client The client or node endpoint to send the transfer with.
 * @param seed The seed.
 * @param accountIndex The account index in the wallet.
 * @param addressOptions Optional address configuration for balance address lookups.
 * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
 * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
 * @returns The balance.
 */
export async function getBalance(client, seed, accountIndex, addressOptions) {
    const allUnspent = await getUnspentAddresses(client, seed, accountIndex, addressOptions);
    let total = 0;
    for (const output of allUnspent) {
        total += output.balance;
    }
    return total;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QmFsYW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oaWdoTGV2ZWwvZ2V0QmFsYW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUU1RDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLFVBQVUsQ0FDNUIsTUFBd0IsRUFDeEIsSUFBVyxFQUNYLFlBQW9CLEVBQ3BCLGNBR0M7SUFDRCxNQUFNLFVBQVUsR0FBRyxNQUFNLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBRXpGLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNkLEtBQUssTUFBTSxNQUFNLElBQUksVUFBVSxFQUFFO1FBQzdCLEtBQUssSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDO0tBQzNCO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQyJ9