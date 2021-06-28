// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Bip32Path } from "../crypto/bip32Path.mjs";
export const IOTA_BIP44_BASE_PATH = "m/44'/4218'";
/**
 * Generate a bip44 path based on all its parts.
 * @param accountIndex The account index.
 * @param addressIndex The address index.
 * @param isInternal Is this an internal address.
 * @returns The generated address.
 */
export function generateBip44Path(accountIndex, addressIndex, isInternal) {
    const bip32Path = new Bip32Path(IOTA_BIP44_BASE_PATH);
    bip32Path.pushHardened(accountIndex);
    bip32Path.pushHardened(isInternal ? 1 : 0);
    bip32Path.pushHardened(addressIndex);
    return bip32Path;
}
/**
 * Generate addresses based on the account indexing style.
 * @param generatorState The address state.
 * @param generatorState.accountIndex The index of the account to calculate.
 * @param generatorState.addressIndex The index of the address to calculate.
 * @param generatorState.isInternal Are we generating an internal address.
 * @param isFirst Is this the first address we are generating.
 * @returns The key pair for the address.
 */
export function generateBip44Address(generatorState, isFirst) {
    // Not the first address so increment the counters.
    if (!isFirst) {
        // Flip-flop between internal and external
        // and then increment the address Index
        if (!generatorState.isInternal) {
            generatorState.isInternal = true;
        }
        else {
            generatorState.isInternal = false;
            generatorState.addressIndex++;
        }
    }
    const path = new Bip32Path(IOTA_BIP44_BASE_PATH);
    path.pushHardened(generatorState.accountIndex);
    path.pushHardened(generatorState.isInternal ? 1 : 0);
    path.pushHardened(generatorState.addressIndex);
    return path.toString();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcmVzc2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hpZ2hMZXZlbC9hZGRyZXNzZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLHNDQUFzQztBQUN0QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHaEQsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQVcsYUFBYSxDQUFDO0FBRTFEOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxpQkFBaUIsQ0FDN0IsWUFBb0IsRUFBRSxZQUFvQixFQUFFLFVBQW1CO0lBQy9ELE1BQU0sU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFFdEQsU0FBUyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNyQyxTQUFTLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQyxTQUFTLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRXJDLE9BQU8sU0FBUyxDQUFDO0FBQ3JCLENBQUM7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxjQUFvQyxFQUFFLE9BQWdCO0lBQ3ZGLG1EQUFtRDtJQUNuRCxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1YsMENBQTBDO1FBQzFDLHVDQUF1QztRQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRTtZQUM1QixjQUFjLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUNwQzthQUFNO1lBQ0gsY0FBYyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7WUFDbEMsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ2pDO0tBQ0o7SUFFRCxNQUFNLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBRWpELElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQy9DLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRCxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUUvQyxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMzQixDQUFDIn0=