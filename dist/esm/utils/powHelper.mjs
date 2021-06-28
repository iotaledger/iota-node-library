// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
import { Blake2b } from "../crypto/blake2b.mjs";
import { Curl } from "../crypto/curl.mjs";
import { B1T6 } from "../encoding/b1t6.mjs";
import { BigIntHelper } from "./bigIntHelper.mjs";
/**
 * Helper methods for POW.
 */
export class PowHelper {
    /**
     * Perform the score calculation.
     * @param message The data to perform the score on.
     * @returns The score for the data.
     */
    static score(message) {
        // the PoW digest is the hash of msg without the nonce
        const powRelevantData = message.slice(0, -8);
        const powDigest = Blake2b.sum256(powRelevantData);
        const nonce = BigIntHelper.read8(message, message.length - 8);
        const zeros = PowHelper.trailingZeros(powDigest, nonce);
        return Math.pow(3, zeros) / message.length;
    }
    /**
     * Calculate the number of zeros required to get target score.
     * @param message The message to process.
     * @param targetScore The target score.
     * @returns The number of zeros to find.
     */
    static calculateTargetZeros(message, targetScore) {
        return Math.ceil(Math.log(message.length * targetScore) / this.LN3);
    }
    /**
     * Calculate the trailing zeros.
     * @param powDigest The pow digest.
     * @param nonce The nonce.
     * @returns The trailing zeros.
     */
    static trailingZeros(powDigest, nonce) {
        const buf = new Int8Array(Curl.HASH_LENGTH);
        const digestTritsLen = B1T6.encode(buf, 0, powDigest);
        const biArr = new Uint8Array(8);
        BigIntHelper.write8(nonce, biArr, 0);
        B1T6.encode(buf, digestTritsLen, biArr);
        const curl = new Curl();
        curl.absorb(buf, 0, Curl.HASH_LENGTH);
        const hash = new Int8Array(Curl.HASH_LENGTH);
        curl.squeeze(hash, 0, Curl.HASH_LENGTH);
        return PowHelper.trinaryTrailingZeros(hash);
    }
    /**
     * Find the number of trailing zeros.
     * @param trits The trits to look for zeros.
     * @param endPos The end position to start looking for zeros.
     * @returns The number of trailing zeros.
     */
    static trinaryTrailingZeros(trits, endPos = trits.length) {
        let z = 0;
        for (let i = endPos - 1; i >= 0 && trits[i] === 0; i--) {
            z++;
        }
        return z;
    }
    /**
     * Perform the hash on the data until we reach target number of zeros.
     * @param powDigest The pow digest.
     * @param targetZeros The target number of zeros.
     * @param startIndex The index to start looking from.
     * @returns The nonce.
     */
    static performPow(powDigest, targetZeros, startIndex) {
        let nonce = BigInt(startIndex);
        let returnNonce;
        const buf = new Int8Array(Curl.HASH_LENGTH);
        const digestTritsLen = B1T6.encode(buf, 0, powDigest);
        const biArr = new Uint8Array(8);
        do {
            BigIntHelper.write8(nonce, biArr, 0);
            B1T6.encode(buf, digestTritsLen, biArr);
            const curlState = new Int8Array(Curl.STATE_LENGTH);
            curlState.set(buf, 0);
            Curl.transform(curlState, 81);
            if (PowHelper.trinaryTrailingZeros(curlState, Curl.HASH_LENGTH) >= targetZeros) {
                returnNonce = nonce;
            }
            else {
                nonce++;
            }
        } while (returnNonce === undefined);
        return returnNonce !== null && returnNonce !== void 0 ? returnNonce : BigInt(0);
    }
}
/**
 * LN3 Const see https://oeis.org/A002391.
 */
PowHelper.LN3 = 1.098612288668109691395245236922525704647490557822749451734694333;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG93SGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3Bvd0hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFDL0Isc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUMvQixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDNUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN4QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUM7O0dBRUc7QUFDSCxNQUFNLE9BQU8sU0FBUztJQU1sQjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFtQjtRQUNuQyxzREFBc0Q7UUFDdEQsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3QyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRWxELE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFOUQsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQy9DLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxPQUFtQixFQUFFLFdBQW1CO1FBQ3ZFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FB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