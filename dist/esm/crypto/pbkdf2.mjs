// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
/* eslint-disable unicorn/prefer-math-trunc */
import { HmacSha256 } from "./hmacSha256.mjs";
import { HmacSha512 } from "./hmacSha512.mjs";
/**
 * Implementation of the password based key derivation function 2.
 */
export class Pbkdf2 {
    /**
     * Derive a key from the parameters using Sha256.
     * @param password The password to derive the key from.
     * @param salt The salt for the derivation.
     * @param iterations Numer of iterations to perform.
     * @param keyLength The length of the key to derive.
     * @returns The derived key.
     */
    static sha256(password, salt, iterations, keyLength) {
        return Pbkdf2.deriveKey(password, salt, iterations, keyLength, 32, (pass, block) => HmacSha256.sum256(pass, block));
    }
    /**
     * Derive a key from the parameters using Sha512.
     * @param password The password to derive the key from.
     * @param salt The salt for the derivation.
     * @param iterations Numer of iterations to perform.
     * @param keyLength The length of the key to derive.
     * @returns The derived key.
     */
    static sha512(password, salt, iterations, keyLength) {
        return Pbkdf2.deriveKey(password, salt, iterations, keyLength, 64, (pass, block) => HmacSha512.sum512(pass, block));
    }
    /**
     * Derive a key from the parameters.
     * @param password The password to derive the key from.
     * @param salt The salt for the derivation.
     * @param iterations Numer of iterations to perform.
     * @param keyLength The length of the key to derive.
     * @param macLength The length of the mac key.
     * @param sumFunc The mac function.
     * @returns The derived key.
     * @internal
     */
    static deriveKey(password, salt, iterations, keyLength, macLength, sumFunc) {
        if (iterations < 1) {
            throw new Error("Iterations must be > 0");
        }
        if (keyLength > (Math.pow(2, 32) - 1) * macLength) {
            throw new Error("Requested key length is too long");
        }
        const DK = new Uint8Array(keyLength);
        let T = new Uint8Array(macLength);
        const block1 = new Uint8Array(salt.length + 4);
        const l = Math.ceil(keyLength / macLength);
        const r = (keyLength - (l - 1)) * macLength;
        block1.set(salt, 0);
        for (let i = 1; i <= l; i++) {
            block1[salt.length + 0] = (i >> 24) & 0xFF;
            block1[salt.length + 1] = (i >> 16) & 0xFF;
            block1[salt.length + 2] = (i >> 8) & 0xFF;
            block1[salt.length + 3] = (i >> 0) & 0xFF;
            let U = sumFunc(password, block1);
            T = U.slice(0, macLength);
            for (let j = 1; j < iterations; j++) {
                U = sumFunc(password, U);
                for (let k = 0; k < macLength; k++) {
                    T[k] ^= U[k];
                }
            }
            const destPos = (i - 1) * macLength;
            const len = (i === l ? r : macLength);
            for (let j = 0; j < len; j++) {
                DK[destPos + j] = T[j];
            }
        }
        return DK;
    }
}
