// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
import { Sha512 } from "./sha512.mjs";
/**
 * Class to help with HmacSha512 scheme.
 * TypeScript conversion from https://github.com/emn178/js-sha512.
 */
export class HmacSha512 {
    /**
     * Create a new instance of HmacSha512.
     * @param key The key for the hmac.
     * @param bits The number of bits.
     */
    constructor(key, bits = 512) {
        this._bits = bits;
        this._sha512 = new Sha512(bits);
        if (key.length > 128) {
            key = new Sha512(bits)
                .update(key)
                .digest();
        }
        this._oKeyPad = new Uint8Array(128);
        const iKeyPad = new Uint8Array(128);
        for (let i = 0; i < 128; ++i) {
            const b = key[i] || 0;
            this._oKeyPad[i] = 0x5C ^ b;
            iKeyPad[i] = 0x36 ^ b;
        }
        this._sha512.update(iKeyPad);
    }
    /**
     * Perform Sum 512 on the data.
     * @param key The key for the hmac.
     * @param data The data to operate on.
     * @returns The sum 512 of the data.
     */
    static sum512(key, data) {
        const b2b = new HmacSha512(key, 512);
        b2b.update(data);
        return b2b.digest();
    }
    /**
     * Update the hash with the data.
     * @param message The data to update the hash with.
     * @returns The instance for chaining.
     */
    update(message) {
        this._sha512.update(message);
        return this;
    }
    /**
     * Get the digest.
     * @returns The digest.
     */
    digest() {
        const innerHash = this._sha512.digest();
        const finalSha512 = new Sha512(this._bits);
        finalSha512.update(this._oKeyPad);
        finalSha512.update(innerHash);
        return finalSha512.digest();
    }
}
