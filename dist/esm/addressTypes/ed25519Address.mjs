// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Blake2b } from "../crypto/blake2b.mjs";
import { ArrayHelper } from "../utils/arrayHelper.mjs";
/**
 * Class to help with Ed25519 Signature scheme.
 */
export class Ed25519Address {
    /**
     * Create a new instance of Ed25519Address.
     * @param publicKey The public key for the address.
     */
    constructor(publicKey) {
        this._publicKey = publicKey;
    }
    /**
     * Convert the public key to an address.
     * @returns The address.
     */
    toAddress() {
        return Blake2b.sum256(this._publicKey);
    }
    /**
     * Use the public key to validate the address.
     * @param address The address to verify.
     * @returns True if the data and address is verified.
     */
    verify(address) {
        return ArrayHelper.equal(this.toAddress(), address);
    }
}
/**
 * Address size.
 * @internal
 */
Ed25519Address.ADDRESS_LENGTH = Blake2b.SIZE_256;
