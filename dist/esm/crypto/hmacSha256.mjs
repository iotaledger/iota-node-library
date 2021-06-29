// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
import { Sha256 } from "./sha256.mjs";
/**
 * Class to help with HmacSha256 scheme.
 * TypeScript conversion from https://github.com/emn178/js-sha256.
 */
export class HmacSha256 {
    /**
     * Create a new instance of HmacSha256.
     * @param key The key for the hmac.
     * @param bits The number of bits.
     */
    constructor(key, bits = 256) {
        this._bits = bits;
        this._sha256 = new Sha256(bits);
        if (key.length > 64) {
            key = new Sha256(bits)
                .update(key)
                .digest();
        }
        this._oKeyPad = new Uint8Array(64);
        const iKeyPad = new Uint8Array(64);
        for (let i = 0; i < 64; ++i) {
            const b = key[i] || 0;
            this._oKeyPad[i] = 0x5C ^ b;
            iKeyPad[i] = 0x36 ^ b;
        }
        this._sha256.update(iKeyPad);
    }
    /**
     * Perform Sum 256 on the data.
     * @param key The key for the hmac.
     * @param data The data to operate on.
     * @returns The sum 256 of the data.
     */
    static sum256(key, data) {
        const b2b = new HmacSha256(key, 256);
        b2b.update(data);
        return b2b.digest();
    }
    /**
     * Update the hash with the data.
     * @param message The data to update the hash with.
     * @returns The instance for chaining.
     */
    update(message) {
        this._sha256.update(message);
        return this;
    }
    /**
     * Get the digest.
     * @returns The digest.
     */
    digest() {
        const innerHash = this._sha256.digest();
        const finalSha256 = new Sha256(this._bits);
        finalSha256.update(this._oKeyPad);
        finalSha256.update(innerHash);
        return finalSha256.digest();
    }
}
