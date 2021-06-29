// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
// https://www.ietf.org/rfc/rfc8439.html
/**
 * Implementation of Poly1305.
 */
export class Poly1305 {
    /**
     * Create a new instance of Poly1305.
     * @param key The key.
     */
    constructor(key) {
        this._buffer = new Uint8Array(16);
        this._r = new Uint16Array(10);
        this._h = new Uint16Array(10);
        this._pad = new Uint16Array(8);
        this._leftover = 0;
        this._fin = 0;
        this._finishedMac = new Uint8Array(1);
        const t0 = key[0] | (key[1] << 8);
        this._r[0] = (t0) & 0x1FFF;
        const t1 = key[2] | (key[3] << 8);
        this._r[1] = ((t0 >>> 13) | (t1 << 3)) & 0x1FFF;
        const t2 = key[4] | (key[5] << 8);
        this._r[2] = ((t1 >>> 10) | (t2 << 6)) & 0x1F03;
        const t3 = key[6] | (key[7] << 8);
        this._r[3] = ((t2 >>> 7) | (t3 << 9)) & 0x1FFF;
        const t4 = key[8] | (key[9] << 8);
        this._r[4] = ((t3 >>> 4) | (t4 << 12)) & 0x00FF;
        this._r[5] = ((t4 >>> 1)) & 0x1FFE;
        const t5 = key[10] | (key[11] << 8);
        this._r[6] = ((t4 >>> 14) | (t5 << 2)) & 0x1FFF;
        const t6 = key[12] | (key[13] << 8);
        this._r[7] = ((t5 >>> 11) | (t6 << 5)) & 0x1F81;
        const t7 = key[14] | (key[15] << 8);
        this._r[8] = ((t6 >>> 8) | (t7 << 8)) & 0x1FFF;
        this._r[9] = ((t7 >>> 5)) & 0x007F;
        this._pad[0] = key[16] | (key[17] << 8);
        this._pad[1] = key[18] | (key[19] << 8);
        this._pad[2] = key[20] | (key[21] << 8);
        this._pad[3] = key[22] | (key[23] << 8);
        this._pad[4] = key[24] | (key[25] << 8);
        this._pad[5] = key[26] | (key[27] << 8);
        this._pad[6] = key[28] | (key[29] << 8);
        this._pad[7] = key[30] | (key[31] << 8);
    }
    /**
     * Finished the mac.
     */
    finish() {
        const g = new Uint16Array(10);
        let c;
        let mask;
        let f;
        let i;
        if (this._leftover) {
            i = this._leftover;
            this._buffer[i++] = 1;
            for (; i < 16; i++) {
                this._buffer[i] = 0;
            }
            this._fin = 1;
            this.blocks(this._buffer, 0, 16);
        }
        c = this._h[1] >>> 13;
        this._h[1] &= 0x1FFF;
        for (i = 2; i < 10; i++) {
            this._h[i] += c;
            c = this._h[i] >>> 13;
            this._h[i] &= 0x1FFF;
        }
        this._h[0] += (c * 5);
        c = this._h[0] >>> 13;
        this._h[0] &= 0x1FFF;
        this._h[1] += c;
        c = this._h[1] >>> 13;
        this._h[1] &= 0x1FFF;
        this._h[2] += c;
        g[0] = this._h[0] + 5;
        c = g[0] >>> 13;
        g[0] &= 0x1FFF;
        for (i = 1; i < 10; i++) {
            g[i] = this._h[i] + c;
            c = g[i] >>> 13;
            g[i] &= 0x1FFF;
        }
        g[9] -= (1 << 13);
        mask = (c ^ 1) - 1;
        for (i = 0; i < 10; i++) {
            g[i] &= mask;
        }
        mask = ~mask;
        for (i = 0; i < 10; i++) {
            this._h[i] = (this._h[i] & mask) | g[i];
        }
        this._h[0] = ((this._h[0]) | (this._h[1] << 13)) & 0xFFFF;
        this._h[1] = ((this._h[1] >>> 3) | (this._h[2] << 10)) & 0xFFFF;
        this._h[2] = ((this._h[2] >>> 6) | (this._h[3] << 7)) & 0xFFFF;
        this._h[3] = ((this._h[3] >>> 9) | (this._h[4] << 4)) & 0xFFFF;
        this._h[4] = ((this._h[4] >>> 12) | (this._h[5] << 1) | (this._h[6] << 14)) & 0xFFFF;
        this._h[5] = ((this._h[6] >>> 2) | (this._h[7] << 11)) & 0xFFFF;
        this._h[6] = ((this._h[7] >>> 5) | (this._h[8] << 8)) & 0xFFFF;
        this._h[7] = ((this._h[8] >>> 8) | (this._h[9] << 5)) & 0xFFFF;
        f = this._h[0] + this._pad[0];
        this._h[0] = f & 0xFFFF;
        for (i = 1; i < 8; i++) {
            f = Math.trunc((Math.trunc(this._h[i] + this._pad[i])) + (f >>> 16));
            this._h[i] = f & 0xFFFF;
        }
        this._finishedMac = new Uint8Array(16);
        this._finishedMac[0] = this._h[0] >>> 0;
        this._finishedMac[1] = this._h[0] >>> 8;
        this._finishedMac[2] = this._h[1] >>> 0;
        this._finishedMac[3] = this._h[1] >>> 8;
        this._finishedMac[4] = this._h[2] >>> 0;
        this._finishedMac[5] = this._h[2] >>> 8;
        this._finishedMac[6] = this._h[3] >>> 0;
        this._finishedMac[7] = this._h[3] >>> 8;
        this._finishedMac[8] = this._h[4] >>> 0;
        this._finishedMac[9] = this._h[4] >>> 8;
        this._finishedMac[10] = this._h[5] >>> 0;
        this._finishedMac[11] = this._h[5] >>> 8;
        this._finishedMac[12] = this._h[6] >>> 0;
        this._finishedMac[13] = this._h[6] >>> 8;
        this._finishedMac[14] = this._h[7] >>> 0;
        this._finishedMac[15] = this._h[7] >>> 8;
    }
    /**
     * Update the hash.
     * @param input The data to update with.
     * @returns Hasher instance.
     */
    update(input) {
        let mpos = 0;
        let bytes = input.length;
        let want;
        if (this._leftover) {
            want = (16 - this._leftover);
            if (want > bytes) {
                want = bytes;
            }
            for (let i = 0; i < want; i++) {
                this._buffer[this._leftover + i] = input[mpos + i];
            }
            bytes -= want;
            mpos += want;
            this._leftover += want;
            if (this._leftover < 16) {
                return this;
            }
            this.blocks(this._buffer, 0, 16);
            this._leftover = 0;
        }
        if (bytes >= 16) {
            want = bytes - (bytes % 16);
            this.blocks(input, mpos, want);
            mpos += want;
            bytes -= want;
        }
        if (bytes) {
            for (let i = 0; i < bytes; i++) {
                this._buffer[this._leftover + i] = input[mpos + i];
            }
            this._leftover += bytes;
        }
        return this;
    }
    /**
     * Get the digest for the hash.
     * @returns The mac.
     */
    digest() {
        if (!this._finishedMac) {
            this.finish();
        }
        return this._finishedMac;
    }
    /**
     * Perform the block operations.
     * @param m The data,
     * @param mpos The index in the data,
     * @param bytes The number of bytes.
     * @internal
     */
    blocks(m, mpos, bytes) {
        const hibit = this._fin ? 0 : 1 << 11;
        let h0 = this._h[0];
        let h1 = this._h[1];
        let h2 = this._h[2];
        let h3 = this._h[3];
        let h4 = this._h[4];
        let h5 = this._h[5];
        let h6 = this._h[6];
        let h7 = this._h[7];
        let h8 = this._h[8];
        let h9 = this._h[9];
        const r0 = this._r[0];
        const r1 = this._r[1];
        const r2 = this._r[2];
        const r3 = this._r[3];
        const r4 = this._r[4];
        const r5 = this._r[5];
        const r6 = this._r[6];
        const r7 = this._r[7];
        const r8 = this._r[8];
        const r9 = this._r[9];
        while (bytes >= 16) {
            const t0 = m[mpos + 0] | (m[mpos + 1] << 8);
            h0 += (t0) & 0x1FFF;
            const t1 = m[mpos + 2] | (m[mpos + 3] << 8);
            h1 += ((t0 >>> 13) | (t1 << 3)) & 0x1FFF;
            const t2 = m[mpos + 4] | (m[mpos + 5] << 8);
            h2 += ((t1 >>> 10) | (t2 << 6)) & 0x1FFF;
            const t3 = m[mpos + 6] | (m[mpos + 7] << 8);
            h3 += ((t2 >>> 7) | (t3 << 9)) & 0x1FFF;
            const t4 = m[mpos + 8] | (m[mpos + 9] << 8);
            h4 += ((t3 >>> 4) | (t4 << 12)) & 0x1FFF;
            h5 += ((t4 >>> 1)) & 0x1FFF;
            const t5 = m[mpos + 10] | (m[mpos + 11] << 8);
            h6 += ((t4 >>> 14) | (t5 << 2)) & 0x1FFF;
            const t6 = m[mpos + 12] | (m[mpos + 13] << 8);
            h7 += ((t5 >>> 11) | (t6 << 5)) & 0x1FFF;
            const t7 = m[mpos + 14] | (m[mpos + 15] << 8);
            h8 += ((t6 >>> 8) | (t7 << 8)) & 0x1FFF;
            h9 += ((t7 >>> 5)) | hibit;
            let c = 0;
            let d0 = c;
            d0 += h0 * r0;
            d0 += h1 * (5 * r9);
            d0 += h2 * (5 * r8);
            d0 += h3 * (5 * r7);
            d0 += h4 * (5 * r6);
            c = (d0 >>> 13);
            d0 &= 0x1FFF;
            d0 += h5 * (5 * r5);
            d0 += h6 * (5 * r4);
            d0 += h7 * (5 * r3);
            d0 += h8 * (5 * r2);
            d0 += h9 * (5 * r1);
            c += (d0 >>> 13);
            d0 &= 0x1FFF;
            let d1 = c;
            d1 += h0 * r1;
            d1 += h1 * r0;
            d1 += h2 * (5 * r9);
            d1 += h3 * (5 * r8);
            d1 += h4 * (5 * r7);
            c = (d1 >>> 13);
            d1 &= 0x1FFF;
            d1 += h5 * (5 * r6);
            d1 += h6 * (5 * r5);
            d1 += h7 * (5 * r4);
            d1 += h8 * (5 * r3);
            d1 += h9 * (5 * r2);
            c += (d1 >>> 13);
            d1 &= 0x1FFF;
            let d2 = c;
            d2 += h0 * r2;
            d2 += h1 * r1;
            d2 += h2 * r0;
            d2 += h3 * (5 * r9);
            d2 += h4 * (5 * r8);
            c = (d2 >>> 13);
            d2 &= 0x1FFF;
            d2 += h5 * (5 * r7);
            d2 += h6 * (5 * r6);
            d2 += h7 * (5 * r5);
            d2 += h8 * (5 * r4);
            d2 += h9 * (5 * r3);
            c += (d2 >>> 13);
            d2 &= 0x1FFF;
            let d3 = c;
            d3 += h0 * r3;
            d3 += h1 * r2;
            d3 += h2 * r1;
            d3 += h3 * r0;
            d3 += h4 * (5 * r9);
            c = (d3 >>> 13);
            d3 &= 0x1FFF;
            d3 += h5 * (5 * r8);
            d3 += h6 * (5 * r7);
            d3 += h7 * (5 * r6);
            d3 += h8 * (5 * r5);
            d3 += h9 * (5 * r4);
            c += (d3 >>> 13);
            d3 &= 0x1FFF;
            let d4 = c;
            d4 += h0 * r4;
            d4 += h1 * r3;
            d4 += h2 * r2;
            d4 += h3 * r1;
            d4 += h4 * r0;
            c = (d4 >>> 13);
            d4 &= 0x1FFF;
            d4 += h5 * (5 * r9);
            d4 += h6 * (5 * r8);
            d4 += h7 * (5 * r7);
            d4 += h8 * (5 * r6);
            d4 += h9 * (5 * r5);
            c += (d4 >>> 13);
            d4 &= 0x1FFF;
            let d5 = c;
            d5 += h0 * r5;
            d5 += h1 * r4;
            d5 += h2 * r3;
            d5 += h3 * r2;
            d5 += h4 * r1;
            c = (d5 >>> 13);
            d5 &= 0x1FFF;
            d5 += h5 * r0;
            d5 += h6 * (5 * r9);
            d5 += h7 * (5 * r8);
            d5 += h8 * (5 * r7);
            d5 += h9 * (5 * r6);
            c += (d5 >>> 13);
            d5 &= 0x1FFF;
            let d6 = c;
            d6 += h0 * r6;
            d6 += h1 * r5;
            d6 += h2 * r4;
            d6 += h3 * r3;
            d6 += h4 * r2;
            c = (d6 >>> 13);
            d6 &= 0x1FFF;
            d6 += h5 * r1;
            d6 += h6 * r0;
            d6 += h7 * (5 * r9);
            d6 += h8 * (5 * r8);
            d6 += h9 * (5 * r7);
            c += (d6 >>> 13);
            d6 &= 0x1FFF;
            let d7 = c;
            d7 += h0 * r7;
            d7 += h1 * r6;
            d7 += h2 * r5;
            d7 += h3 * r4;
            d7 += h4 * r3;
            c = (d7 >>> 13);
            d7 &= 0x1FFF;
            d7 += h5 * r2;
            d7 += h6 * r1;
            d7 += h7 * r0;
            d7 += h8 * (5 * r9);
            d7 += h9 * (5 * r8);
            c += (d7 >>> 13);
            d7 &= 0x1FFF;
            let d8 = c;
            d8 += h0 * r8;
            d8 += h1 * r7;
            d8 += h2 * r6;
            d8 += h3 * r5;
            d8 += h4 * r4;
            c = (d8 >>> 13);
            d8 &= 0x1FFF;
            d8 += h5 * r3;
            d8 += h6 * r2;
            d8 += h7 * r1;
            d8 += h8 * r0;
            d8 += h9 * (5 * r9);
            c += (d8 >>> 13);
            d8 &= 0x1FFF;
            let d9 = c;
            d9 += h0 * r9;
            d9 += h1 * r8;
            d9 += h2 * r7;
            d9 += h3 * r6;
            d9 += h4 * r5;
            c = (d9 >>> 13);
            d9 &= 0x1FFF;
            d9 += h5 * r4;
            d9 += h6 * r3;
            d9 += h7 * r2;
            d9 += h8 * r1;
            d9 += h9 * r0;
            c += (d9 >>> 13);
            d9 &= 0x1FFF;
            c = Math.trunc((c << 2) + c);
            c = Math.trunc(c + d0);
            d0 = c & 0x1FFF;
            c >>>= 13;
            d1 += c;
            h0 = d0;
            h1 = d1;
            h2 = d2;
            h3 = d3;
            h4 = d4;
            h5 = d5;
            h6 = d6;
            h7 = d7;
            h8 = d8;
            h9 = d9;
            mpos += 16;
            bytes -= 16;
        }
        this._h[0] = h0;
        this._h[1] = h1;
        this._h[2] = h2;
        this._h[3] = h3;
        this._h[4] = h4;
        this._h[5] = h5;
        this._h[6] = h6;
        this._h[7] = h7;
        this._h[8] = h8;
        this._h[9] = h9;
    }
}
