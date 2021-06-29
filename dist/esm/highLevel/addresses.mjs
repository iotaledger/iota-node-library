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
