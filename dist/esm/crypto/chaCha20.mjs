// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
// Implementation derived from chacha-ref.c version 20080118
// See for details: http://cr.yp.to/chacha/chacha-20080128.pdf
// https://www.ietf.org/rfc/rfc8439.html
import { BitHelper } from "../utils/bitHelper.mjs";
/**
 * Implementation of the ChaCha29 cipher.
 */
export class ChaCha20 {
    /**
     * Create a new instance of ChaCha20.
     * @param key The key.
     * @param nonce The nonce.
     * @param counter Counter.
     */
    constructor(key, nonce, counter = 0) {
        this._input = new Uint32Array(16);
        // https://www.ietf.org/rfc/rfc8439.html#section-2.3
        this._input[0] = 1634760805;
        this._input[1] = 857760878;
        this._input[2] = 2036477234;
        this._input[3] = 1797285236;
        this._input[4] = BitHelper.u8To32LittleEndian(key, 0);
        this._input[5] = BitHelper.u8To32LittleEndian(key, 4);
        this._input[6] = BitHelper.u8To32LittleEndian(key, 8);
        this._input[7] = BitHelper.u8To32LittleEndian(key, 12);
        this._input[8] = BitHelper.u8To32LittleEndian(key, 16);
        this._input[9] = BitHelper.u8To32LittleEndian(key, 20);
        this._input[10] = BitHelper.u8To32LittleEndian(key, 24);
        this._input[11] = BitHelper.u8To32LittleEndian(key, 28);
        this._input[12] = counter;
        this._input[13] = BitHelper.u8To32LittleEndian(nonce, 0);
        this._input[14] = BitHelper.u8To32LittleEndian(nonce, 4);
        this._input[15] = BitHelper.u8To32LittleEndian(nonce, 8);
    }
    /**
     * Quarter round.
     * @param x The 32 bit array.
     * @param a The a index.
     * @param b The b index.
     * @param c The c index.
     * @param d The d index.
     * @internal
     */
    static quarterRound(x, a, b, c, d) {
        x[a] += x[b];
        x[d] = BitHelper.rotate(x[d] ^ x[a], 16);
        x[c] += x[d];
        x[b] = BitHelper.rotate(x[b] ^ x[c], 12);
        x[a] += x[b];
        x[d] = BitHelper.rotate(x[d] ^ x[a], 8);
        x[c] += x[d];
        x[b] = BitHelper.rotate(x[b] ^ x[c], 7);
    }
    /**
     * Encrypt the data.
     * @param data The source data to encrypt.
     * @returns The encrypted data.
     */
    encrypt(data) {
        const x = new Uint32Array(16);
        const output = new Uint8Array(64);
        let dpos = 0;
        let i;
        let spos = 0;
        let len = data.length;
        const dst = new Uint8Array(data.length);
        while (len > 0) {
            for (i = 16; i--;) {
                x[i] = this._input[i];
            }
            for (i = 20; i > 0; i -= 2) {
                ChaCha20.quarterRound(x, 0, 4, 8, 12);
                ChaCha20.quarterRound(x, 1, 5, 9, 13);
                ChaCha20.quarterRound(x, 2, 6, 10, 14);
                ChaCha20.quarterRound(x, 3, 7, 11, 15);
                ChaCha20.quarterRound(x, 0, 5, 10, 15);
                ChaCha20.quarterRound(x, 1, 6, 11, 12);
                ChaCha20.quarterRound(x, 2, 7, 8, 13);
                ChaCha20.quarterRound(x, 3, 4, 9, 14);
            }
            for (i = 16; i--;) {
                x[i] += this._input[i];
            }
            for (i = 16; i--;) {
                BitHelper.u32To8LittleEndian(output, 4 * i, x[i]);
            }
            this._input[12] += 1;
            if (!this._input[12]) {
                this._input[13] += 1;
            }
            if (len <= 64) {
                for (i = len; i--;) {
                    dst[i + dpos] = data[i + spos] ^ output[i];
                }
                return dst;
            }
            for (i = 64; i--;) {
                dst[i + dpos] = data[i + spos] ^ output[i];
            }
            len -= 64;
            spos += 64;
            dpos += 64;
        }
        return dst;
    }
    /**
     * Decrypt the data.
     * @param data The source data to decrypt.
     * @returns The decrypted data.
     */
    decrypt(data) {
        return this.encrypt(data);
    }
    /**
     * Create a keystream of the given length.
     * @param length The length to create the keystream.
     * @returns The keystream.
     */
    keyStream(length) {
        const dst = new Uint8Array(length);
        for (let i = 0; i < dst.length; i++) {
            dst[i] = 0;
        }
        return this.encrypt(dst);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhQ2hhMjAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY3J5cHRvL2NoYUNoYTIwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixzQ0FBc0M7QUFDdEMsK0JBQStCO0FBQy9CLDREQUE0RDtBQUM1RCw4REFBOEQ7QUFDOUQsd0NBQXdDO0FBRXhDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUUvQzs7R0FFRztBQUNILE1BQU0sT0FBTyxRQUFRO0lBT2pCOzs7OztPQUtHO0lBQ0gsWUFBWSxHQUFlLEVBQUUsS0FBaUIsRUFBRSxVQUFrQixDQUFDO1FBQy9ELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbEMsb0RBQW9EO1FBQ3BELElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ssTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFjLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUNsRixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE9BQU8sQ0FBQyxJQUFnQjtRQUMzQixNQUFNLENBQUMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QixNQUFNLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsQ0FBQztRQUNOLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNiLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENB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