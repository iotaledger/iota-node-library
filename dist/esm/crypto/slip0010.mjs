// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
import { Converter } from "../utils/converter.mjs";
import { Ed25519 } from "./ed25519.mjs";
import { HmacSha512 } from "./hmacSha512.mjs";
/**
 * Class to help with slip0010 key derivation
 * https://github.com/satoshilabs/slips/blob/master/slip-0010.md.
 */
export class Slip0010 {
    /**
     * Get the master key from the seed.
     * @param seed The seed to generate the master key from.
     * @returns The key and chain code.
     */
    static getMasterKeyFromSeed(seed) {
        const hmac = new HmacSha512(Converter.utf8ToBytes("ed25519 seed"));
        const fullKey = hmac.update(seed).digest();
        return {
            privateKey: Uint8Array.from(fullKey.slice(0, 32)),
            chainCode: Uint8Array.from(fullKey.slice(32))
        };
    }
    /**
     * Derive a key from the path.
     * @param seed The seed.
     * @param path The path.
     * @returns The key and chain code.
     */
    static derivePath(seed, path) {
        let { privateKey, chainCode } = Slip0010.getMasterKeyFromSeed(seed);
        const segments = path.numberSegments();
        for (let i = 0; i < segments.length; i++) {
            const indexValue = 0x80000000 + segments[i];
            const data = new Uint8Array(1 + privateKey.length + 4);
            data[0] = 0;
            data.set(privateKey, 1);
            data[privateKey.length + 1] = indexValue >>> 24;
            data[privateKey.length + 2] = indexValue >>> 16;
            data[privateKey.length + 3] = indexValue >>> 8;
            data[privateKey.length + 4] = indexValue & 0xFF;
            const fullKey = new HmacSha512(chainCode)
                .update(data)
                .digest();
            privateKey = Uint8Array.from(fullKey.slice(0, 32));
            chainCode = Uint8Array.from(fullKey.slice(32));
        }
        return {
            privateKey,
            chainCode
        };
    }
    /**
     * Get the public key from the private key.
     * @param privateKey The private key.
     * @param withZeroByte Include a zero bute prefix.
     * @returns The public key.
     */
    static getPublicKey(privateKey, withZeroByte = true) {
        const keyPair = Ed25519.keyPairFromSeed(privateKey);
        const signPk = keyPair.privateKey.slice(32);
        if (withZeroByte) {
            const arr = new Uint8Array(1 + signPk.length);
            arr[0] = 0;
            arr.set(signPk, 1);
            return arr;
        }
        return signPk;
    }
}
