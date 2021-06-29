// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
/**
 * Class to help with Sha512 scheme
 * TypeScript conversion from https://github.com/emn178/js-sha512.
 */
export class Sha512 {
    /**
     * Create a new instance of Sha512.
     * @param bits The number of bits.
     */
    constructor(bits = Sha512.SIZE_512) {
        /**
         * Blocks.
         * @internal
         */
        this._blocks = [];
        if (bits !== Sha512.SIZE_224 &&
            bits !== Sha512.SIZE_256 &&
            bits !== Sha512.SIZE_384 &&
            bits !== Sha512.SIZE_512) {
            throw new Error("Only 224, 256, 384 or 512 bits are supported");
        }
        this._blocks = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
        if (bits === Sha512.SIZE_384) {
            this._h0h = 0xCBBB9D5D;
            this._h0l = 0xC1059ED8;
            this._h1h = 0x629A292A;
            this._h1l = 0x367CD507;
            this._h2h = 0x9159015A;
            this._h2l = 0x3070DD17;
            this._h3h = 0x152FECD8;
            this._h3l = 0xF70E5939;
            this._h4h = 0x67332667;
            this._h4l = 0xFFC00B31;
            this._h5h = 0x8EB44A87;
            this._h5l = 0x68581511;
            this._h6h = 0xDB0C2E0D;
            this._h6l = 0x64F98FA7;
            this._h7h = 0x47B5481D;
            this._h7l = 0xBEFA4FA4;
        }
        else if (bits === Sha512.SIZE_256) {
            this._h0h = 0x22312194;
            this._h0l = 0xFC2BF72C;
            this._h1h = 0x9F555FA3;
            this._h1l = 0xC84C64C2;
            this._h2h = 0x2393B86B;
            this._h2l = 0x6F53B151;
            this._h3h = 0x96387719;
            this._h3l = 0x5940EABD;
            this._h4h = 0x96283EE2;
            this._h4l = 0xA88EFFE3;
            this._h5h = 0xBE5E1E25;
            this._h5l = 0x53863992;
            this._h6h = 0x2B0199FC;
            this._h6l = 0x2C85B8AA;
            this._h7h = 0x0EB72DDC;
            this._h7l = 0x81C52CA2;
        }
        else if (bits === Sha512.SIZE_224) {
            this._h0h = 0x8C3D37C8;
            this._h0l = 0x19544DA2;
            this._h1h = 0x73E19966;
            this._h1l = 0x89DCD4D6;
            this._h2h = 0x1DFAB7AE;
            this._h2l = 0x32FF9C82;
            this._h3h = 0x679DD514;
            this._h3l = 0x582F9FCF;
            this._h4h = 0x0F6D2B69;
            this._h4l = 0x7BD44DA8;
            this._h5h = 0x77E36F73;
            this._h5l = 0x04C48942;
            this._h6h = 0x3F9D85A8;
            this._h6l = 0x6A1D36C8;
            this._h7h = 0x1112E6AD;
            this._h7l = 0x91D692A1;
        }
        else { // 512
            this._h0h = 0x6A09E667;
            this._h0l = 0xF3BCC908;
            this._h1h = 0xBB67AE85;
            this._h1l = 0x84CAA73B;
            this._h2h = 0x3C6EF372;
            this._h2l = 0xFE94F82B;
            this._h3h = 0xA54FF53A;
            this._h3l = 0x5F1D36F1;
            this._h4h = 0x510E527F;
            this._h4l = 0xADE682D1;
            this._h5h = 0x9B05688C;
            this._h5l = 0x2B3E6C1F;
            this._h6h = 0x1F83D9AB;
            this._h6l = 0xFB41BD6B;
            this._h7h = 0x5BE0CD19;
            this._h7l = 0x137E2179;
        }
        this._bits = bits;
        this._block = 0;
        this._start = 0;
        this._bytes = 0;
        this._hBytes = 0;
        this._lastByteIndex = 0;
        this._finalized = false;
        this._hashed = false;
    }
    /**
     * Perform Sum 512 on the data.
     * @param data The data to operate on.
     * @returns The sum 512 of the data.
     */
    static sum512(data) {
        const b2b = new Sha512(Sha512.SIZE_512);
        b2b.update(data);
        return b2b.digest();
    }
    /**
     * Update the hash with the data.
     * @param message The data to update the hash with.
     * @returns The instance for chaining.
     */
    update(message) {
        if (this._finalized) {
            throw new Error("The hash has already been finalized.");
        }
        let index = 0;
        let i;
        const length = message.length;
        const blocks = this._blocks;
        while (index < length) {
            if (this._hashed) {
                this._hashed = false;
                blocks[0] = this._block;
                blocks[1] = 0;
                blocks[2] = 0;
                blocks[3] = 0;
                blocks[4] = 0;
                blocks[5] = 0;
                blocks[6] = 0;
                blocks[7] = 0;
                blocks[8] = 0;
                blocks[9] = 0;
                blocks[10] = 0;
                blocks[11] = 0;
                blocks[12] = 0;
                blocks[13] = 0;
                blocks[14] = 0;
                blocks[15] = 0;
                blocks[16] = 0;
                blocks[17] = 0;
                blocks[18] = 0;
                blocks[19] = 0;
                blocks[20] = 0;
                blocks[21] = 0;
                blocks[22] = 0;
                blocks[23] = 0;
                blocks[24] = 0;
                blocks[25] = 0;
                blocks[26] = 0;
                blocks[27] = 0;
                blocks[28] = 0;
                blocks[29] = 0;
                blocks[30] = 0;
                blocks[31] = 0;
                blocks[32] = 0;
            }
            for (i = this._start; index < length && i < 128; ++index) {
                blocks[i >> 2] |= message[index] << Sha512.SHIFT[i++ & 3];
            }
            this._lastByteIndex = i;
            this._bytes += i - this._start;
            if (i >= 128) {
                this._block = blocks[32];
                this._start = i - 128;
                this.hash();
                this._hashed = true;
            }
            else {
                this._start = i;
            }
        }
        if (this._bytes > 4294967295) {
            this._hBytes += Math.trunc(this._bytes / 4294967296);
            this._bytes %= 4294967296;
        }
        return this;
    }
    /**
     * Get the digest.
     * @returns The digest.
     */
    digest() {
        this.finalize();
        const h0h = this._h0h;
        const h0l = this._h0l;
        const h1h = this._h1h;
        const h1l = this._h1l;
        const h2h = this._h2h;
        const h2l = this._h2l;
        const h3h = this._h3h;
        const h3l = this._h3l;
        const h4h = this._h4h;
        const h4l = this._h4l;
        const h5h = this._h5h;
        const h5l = this._h5l;
        const h6h = this._h6h;
        const h6l = this._h6l;
        const h7h = this._h7h;
        const h7l = this._h7l;
        const bits = this._bits;
        const arr = [
            (h0h >> 24) & 0xFF, (h0h >> 16) & 0xFF, (h0h >> 8) & 0xFF, h0h & 0xFF,
            (h0l >> 24) & 0xFF, (h0l >> 16) & 0xFF, (h0l >> 8) & 0xFF, h0l & 0xFF,
            (h1h >> 24) & 0xFF, (h1h >> 16) & 0xFF, (h1h >> 8) & 0xFF, h1h & 0xFF,
            (h1l >> 24) & 0xFF, (h1l >> 16) & 0xFF, (h1l >> 8) & 0xFF, h1l & 0xFF,
            (h2h >> 24) & 0xFF, (h2h >> 16) & 0xFF, (h2h >> 8) & 0xFF, h2h & 0xFF,
            (h2l >> 24) & 0xFF, (h2l >> 16) & 0xFF, (h2l >> 8) & 0xFF, h2l & 0xFF,
            (h3h >> 24) & 0xFF, (h3h >> 16) & 0xFF, (h3h >> 8) & 0xFF, h3h & 0xFF
        ];
        if (bits >= Sha512.SIZE_256) {
            arr.push((h3l >> 24) & 0xFF, (h3l >> 16) & 0xFF, (h3l >> 8) & 0xFF, h3l & 0xFF);
        }
        if (bits >= Sha512.SIZE_384) {
            arr.push((h4h >> 24) & 0xFF, (h4h >> 16) & 0xFF, (h4h >> 8) & 0xFF, h4h & 0xFF, (h4l >> 24) & 0xFF, (h4l >> 16) & 0xFF, (h4l >> 8) & 0xFF, h4l & 0xFF, (h5h >> 24) & 0xFF, (h5h >> 16) & 0xFF, (h5h >> 8) & 0xFF, h5h & 0xFF, (h5l >> 24) & 0xFF, (h5l >> 16) & 0xFF, (h5l >> 8) & 0xFF, h5l & 0xFF);
        }
        if (bits === Sha512.SIZE_512) {
            arr.push((h6h >> 24) & 0xFF, (h6h >> 16) & 0xFF, (h6h >> 8) & 0xFF, h6h & 0xFF, (h6l >> 24) & 0xFF, (h6l >> 16) & 0xFF, (h6l >> 8) & 0xFF, h6l & 0xFF, (h7h >> 24) & 0xFF, (h7h >> 16) & 0xFF, (h7h >> 8) & 0xFF, h7h & 0xFF, (h7l >> 24) & 0xFF, (h7l >> 16) & 0xFF, (h7l >> 8) & 0xFF, h7l & 0xFF);
        }
        return Uint8Array.from(arr);
    }
    /**
     * Finalize the hash.
     * @internal
     */
    finalize() {
        if (this._finalized) {
            return;
        }
        this._finalized = true;
        const blocks = this._blocks;
        const i = this._lastByteIndex;
        blocks[32] = this._block;
        blocks[i >> 2] |= Sha512.EXTRA[i & 3];
        this._block = blocks[32];
        if (i >= 112) {
            if (!this._hashed) {
                this.hash();
            }
            blocks[0] = this._block;
            blocks[1] = 0;
            blocks[2] = 0;
            blocks[3] = 0;
            blocks[4] = 0;
            blocks[5] = 0;
            blocks[6] = 0;
            blocks[7] = 0;
            blocks[8] = 0;
            blocks[9] = 0;
            blocks[10] = 0;
            blocks[11] = 0;
            blocks[12] = 0;
            blocks[13] = 0;
            blocks[14] = 0;
            blocks[15] = 0;
            blocks[16] = 0;
            blocks[17] = 0;
            blocks[18] = 0;
            blocks[19] = 0;
            blocks[20] = 0;
            blocks[21] = 0;
            blocks[22] = 0;
            blocks[23] = 0;
            blocks[24] = 0;
            blocks[25] = 0;
            blocks[26] = 0;
            blocks[27] = 0;
            blocks[28] = 0;
            blocks[29] = 0;
            blocks[30] = 0;
            blocks[31] = 0;
            blocks[32] = 0;
        }
        blocks[30] = (this._hBytes << 3) | (this._bytes >>> 29);
        blocks[31] = this._bytes << 3;
        this.hash();
    }
    /**
     * Perform the hash.
     * @internal
     */
    hash() {
        const h0h = this._h0h;
        const h0l = this._h0l;
        const h1h = this._h1h;
        const h1l = this._h1l;
        const h2h = this._h2h;
        const h2l = this._h2l;
        const h3h = this._h3h;
        const h3l = this._h3l;
        const h4h = this._h4h;
        const h4l = this._h4l;
        const h5h = this._h5h;
        const h5l = this._h5l;
        const h6h = this._h6h;
        const h6l = this._h6l;
        const h7h = this._h7h;
        const h7l = this._h7l;
        const blocks = this._blocks;
        let j;
        let s0h;
        let s0l;
        let s1h;
        let s1l;
        let c1;
        let c2;
        let c3;
        let c4;
        let abh;
        let abl;
        let dah;
        let dal;
        let cdh;
        let cdl;
        let bch;
        let bcl;
        let majh;
        let majl;
        let t1h;
        let t1l;
        let t2h;
        let t2l;
        let chh;
        let chl;
        for (j = 32; j < 160; j += 2) {
            t1h = blocks[j - 30];
            t1l = blocks[j - 29];
            s0h = ((t1h >>> 1) | (t1l << 31)) ^ ((t1h >>> 8) | (t1l << 24)) ^ (t1h >>> 7);
            s0l = ((t1l >>> 1) | (t1h << 31)) ^ ((t1l >>> 8) | (t1h << 24)) ^ ((t1l >>> 7) | (t1h << 25));
            t1h = blocks[j - 4];
            t1l = blocks[j - 3];
            s1h = ((t1h >>> 19) | (t1l << 13)) ^ ((t1l >>> 29) | (t1h << 3)) ^ (t1h >>> 6);
            s1l = ((t1l >>> 19) | (t1h << 13)) ^ ((t1h >>> 29) | (t1l << 3)) ^ ((t1l >>> 6) | (t1h << 26));
            t1h = blocks[j - 32];
            t1l = blocks[j - 31];
            t2h = blocks[j - 14];
            t2l = blocks[j - 13];
            c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (s0l & 0xFFFF) + (s1l & 0xFFFF);
            c2 = (t2l >>> 16) + (t1l >>> 16) + (s0l >>> 16) + (s1l >>> 16) + (c1 >>> 16);
            c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (s0h & 0xFFFF) + (s1h & 0xFFFF) + (c2 >>> 16);
            c4 = (t2h >>> 16) + (t1h >>> 16) + (s0h >>> 16) + (s1h >>> 16) + (c3 >>> 16);
            blocks[j] = (c4 << 16) | (c3 & 0xFFFF);
            blocks[j + 1] = (c2 << 16) | (c1 & 0xFFFF);
        }
        let ah = h0h;
        let al = h0l;
        let bh = h1h;
        let bl = h1l;
        let ch = h2h;
        let cl = h2l;
        let dh = h3h;
        let dl = h3l;
        let eh = h4h;
        let el = h4l;
        let fh = h5h;
        let fl = h5l;
        let gh = h6h;
        let gl = h6l;
        let hh = h7h;
        let hl = h7l;
        bch = bh & ch;
        bcl = bl & cl;
        for (j = 0; j < 160; j += 8) {
            s0h = ((ah >>> 28) | (al << 4)) ^ ((al >>> 2) | (ah << 30)) ^ ((al >>> 7) | (ah << 25));
            s0l = ((al >>> 28) | (ah << 4)) ^ ((ah >>> 2) | (al << 30)) ^ ((ah >>> 7) | (al << 25));
            s1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((el >>> 9) | (eh << 23));
            s1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((eh >>> 9) | (el << 23));
            abh = ah & bh;
            abl = al & bl;
            majh = abh ^ (ah & ch) ^ bch;
            majl = abl ^ (al & cl) ^ bcl;
            chh = (eh & fh) ^ (~eh & gh);
            chl = (el & fl) ^ (~el & gl);
            t1h = blocks[j];
            t1l = blocks[j + 1];
            t2h = Sha512.K[j];
            t2l = Sha512.K[j + 1];
            c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (hl & 0xFFFF);
            c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (hl >>> 16) + (c1 >>> 16);
            c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (hh & 0xFFFF) + (c2 >>> 16);
            c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (hh >>> 16) + (c3 >>> 16);
            t1h = (c4 << 16) | (c3 & 0xFFFF);
            t1l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
            c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
            c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
            c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);
            t2h = (c4 << 16) | (c3 & 0xFFFF);
            t2l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (dl & 0xFFFF) + (t1l & 0xFFFF);
            c2 = (dl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
            c3 = (dh & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
            c4 = (dh >>> 16) + (t1h >>> 16) + (c3 >>> 16);
            hh = (c4 << 16) | (c3 & 0xFFFF);
            hl = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
            c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
            c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
            c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);
            dh = (c4 << 16) | (c3 & 0xFFFF);
            dl = (c2 << 16) | (c1 & 0xFFFF);
            s0h = ((dh >>> 28) | (dl << 4)) ^ ((dl >>> 2) | (dh << 30)) ^ ((dl >>> 7) | (dh << 25));
            s0l = ((dl >>> 28) | (dh << 4)) ^ ((dh >>> 2) | (dl << 30)) ^ ((dh >>> 7) | (dl << 25));
            s1h = ((hh >>> 14) | (hl << 18)) ^ ((hh >>> 18) | (hl << 14)) ^ ((hl >>> 9) | (hh << 23));
            s1l = ((hl >>> 14) | (hh << 18)) ^ ((hl >>> 18) | (hh << 14)) ^ ((hh >>> 9) | (hl << 23));
            dah = dh & ah;
            dal = dl & al;
            majh = dah ^ (dh & bh) ^ abh;
            majl = dal ^ (dl & bl) ^ abl;
            chh = (hh & eh) ^ (~hh & fh);
            chl = (hl & el) ^ (~hl & fl);
            t1h = blocks[j + 2];
            t1l = blocks[j + 3];
            t2h = Sha512.K[j + 2];
            t2l = Sha512.K[j + 3];
            c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (gl & 0xFFFF);
            c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (gl >>> 16) + (c1 >>> 16);
            c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (gh & 0xFFFF) + (c2 >>> 16);
            c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (gh >>> 16) + (c3 >>> 16);
            t1h = (c4 << 16) | (c3 & 0xFFFF);
            t1l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
            c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
            c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
            c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);
            t2h = (c4 << 16) | (c3 & 0xFFFF);
            t2l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (cl & 0xFFFF) + (t1l & 0xFFFF);
            c2 = (cl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
            c3 = (ch & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
            c4 = (ch >>> 16) + (t1h >>> 16) + (c3 >>> 16);
            gh = (c4 << 16) | (c3 & 0xFFFF);
            gl = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
            c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
            c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
            c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);
            ch = (c4 << 16) | (c3 & 0xFFFF);
            cl = (c2 << 16) | (c1 & 0xFFFF);
            s0h = ((ch >>> 28) | (cl << 4)) ^ ((cl >>> 2) | (ch << 30)) ^ ((cl >>> 7) | (ch << 25));
            s0l = ((cl >>> 28) | (ch << 4)) ^ ((ch >>> 2) | (cl << 30)) ^ ((ch >>> 7) | (cl << 25));
            s1h = ((gh >>> 14) | (gl << 18)) ^ ((gh >>> 18) | (gl << 14)) ^ ((gl >>> 9) | (gh << 23));
            s1l = ((gl >>> 14) | (gh << 18)) ^ ((gl >>> 18) | (gh << 14)) ^ ((gh >>> 9) | (gl << 23));
            cdh = ch & dh;
            cdl = cl & dl;
            majh = cdh ^ (ch & ah) ^ dah;
            majl = cdl ^ (cl & al) ^ dal;
            chh = (gh & hh) ^ (~gh & eh);
            chl = (gl & hl) ^ (~gl & el);
            t1h = blocks[j + 4];
            t1l = blocks[j + 5];
            t2h = Sha512.K[j + 4];
            t2l = Sha512.K[j + 5];
            c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (fl & 0xFFFF);
            c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (fl >>> 16) + (c1 >>> 16);
            c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (fh & 0xFFFF) + (c2 >>> 16);
            c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (fh >>> 16) + (c3 >>> 16);
            t1h = (c4 << 16) | (c3 & 0xFFFF);
            t1l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
            c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
            c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
            c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);
            t2h = (c4 << 16) | (c3 & 0xFFFF);
            t2l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (bl & 0xFFFF) + (t1l & 0xFFFF);
            c2 = (bl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
            c3 = (bh & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
            c4 = (bh >>> 16) + (t1h >>> 16) + (c3 >>> 16);
            fh = (c4 << 16) | (c3 & 0xFFFF);
            fl = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
            c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
            c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
            c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);
            bh = (c4 << 16) | (c3 & 0xFFFF);
            bl = (c2 << 16) | (c1 & 0xFFFF);
            s0h = ((bh >>> 28) | (bl << 4)) ^ ((bl >>> 2) | (bh << 30)) ^ ((bl >>> 7) | (bh << 25));
            s0l = ((bl >>> 28) | (bh << 4)) ^ ((bh >>> 2) | (bl << 30)) ^ ((bh >>> 7) | (bl << 25));
            s1h = ((fh >>> 14) | (fl << 18)) ^ ((fh >>> 18) | (fl << 14)) ^ ((fl >>> 9) | (fh << 23));
            s1l = ((fl >>> 14) | (fh << 18)) ^ ((fl >>> 18) | (fh << 14)) ^ ((fh >>> 9) | (fl << 23));
            bch = bh & ch;
            bcl = bl & cl;
            majh = bch ^ (bh & dh) ^ cdh;
            majl = bcl ^ (bl & dl) ^ cdl;
            chh = (fh & gh) ^ (~fh & hh);
            chl = (fl & gl) ^ (~fl & hl);
            t1h = blocks[j + 6];
            t1l = blocks[j + 7];
            t2h = Sha512.K[j + 6];
            t2l = Sha512.K[j + 7];
            c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (el & 0xFFFF);
            c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (el >>> 16) + (c1 >>> 16);
            c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (eh & 0xFFFF) + (c2 >>> 16);
            c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (eh >>> 16) + (c3 >>> 16);
            t1h = (c4 << 16) | (c3 & 0xFFFF);
            t1l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
            c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
            c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
            c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);
            t2h = (c4 << 16) | (c3 & 0xFFFF);
            t2l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (al & 0xFFFF) + (t1l & 0xFFFF);
            c2 = (al >>> 16) + (t1l >>> 16) + (c1 >>> 16);
            c3 = (ah & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
            c4 = (ah >>> 16) + (t1h >>> 16) + (c3 >>> 16);
            eh = (c4 << 16) | (c3 & 0xFFFF);
            el = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
            c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
            c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
            c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);
            ah = (c4 << 16) | (c3 & 0xFFFF);
            al = (c2 << 16) | (c1 & 0xFFFF);
        }
        c1 = (h0l & 0xFFFF) + (al & 0xFFFF);
        c2 = (h0l >>> 16) + (al >>> 16) + (c1 >>> 16);
        c3 = (h0h & 0xFFFF) + (ah & 0xFFFF) + (c2 >>> 16);
        c4 = (h0h >>> 16) + (ah >>> 16) + (c3 >>> 16);
        this._h0h = (c4 << 16) | (c3 & 0xFFFF);
        this._h0l = (c2 << 16) | (c1 & 0xFFFF);
        c1 = (h1l & 0xFFFF) + (bl & 0xFFFF);
        c2 = (h1l >>> 16) + (bl >>> 16) + (c1 >>> 16);
        c3 = (h1h & 0xFFFF) + (bh & 0xFFFF) + (c2 >>> 16);
        c4 = (h1h >>> 16) + (bh >>> 16) + (c3 >>> 16);
        this._h1h = (c4 << 16) | (c3 & 0xFFFF);
        this._h1l = (c2 << 16) | (c1 & 0xFFFF);
        c1 = (h2l & 0xFFFF) + (cl & 0xFFFF);
        c2 = (h2l >>> 16) + (cl >>> 16) + (c1 >>> 16);
        c3 = (h2h & 0xFFFF) + (ch & 0xFFFF) + (c2 >>> 16);
        c4 = (h2h >>> 16) + (ch >>> 16) + (c3 >>> 16);
        this._h2h = (c4 << 16) | (c3 & 0xFFFF);
        this._h2l = (c2 << 16) | (c1 & 0xFFFF);
        c1 = (h3l & 0xFFFF) + (dl & 0xFFFF);
        c2 = (h3l >>> 16) + (dl >>> 16) + (c1 >>> 16);
        c3 = (h3h & 0xFFFF) + (dh & 0xFFFF) + (c2 >>> 16);
        c4 = (h3h >>> 16) + (dh >>> 16) + (c3 >>> 16);
        this._h3h = (c4 << 16) | (c3 & 0xFFFF);
        this._h3l = (c2 << 16) | (c1 & 0xFFFF);
        c1 = (h4l & 0xFFFF) + (el & 0xFFFF);
        c2 = (h4l >>> 16) + (el >>> 16) + (c1 >>> 16);
        c3 = (h4h & 0xFFFF) + (eh & 0xFFFF) + (c2 >>> 16);
        c4 = (h4h >>> 16) + (eh >>> 16) + (c3 >>> 16);
        this._h4h = (c4 << 16) | (c3 & 0xFFFF);
        this._h4l = (c2 << 16) | (c1 & 0xFFFF);
        c1 = (h5l & 0xFFFF) + (fl & 0xFFFF);
        c2 = (h5l >>> 16) + (fl >>> 16) + (c1 >>> 16);
        c3 = (h5h & 0xFFFF) + (fh & 0xFFFF) + (c2 >>> 16);
        c4 = (h5h >>> 16) + (fh >>> 16) + (c3 >>> 16);
        this._h5h = (c4 << 16) | (c3 & 0xFFFF);
        this._h5l = (c2 << 16) | (c1 & 0xFFFF);
        c1 = (h6l & 0xFFFF) + (gl & 0xFFFF);
        c2 = (h6l >>> 16) + (gl >>> 16) + (c1 >>> 16);
        c3 = (h6h & 0xFFFF) + (gh & 0xFFFF) + (c2 >>> 16);
        c4 = (h6h >>> 16) + (gh >>> 16) + (c3 >>> 16);
        this._h6h = (c4 << 16) | (c3 & 0xFFFF);
        this._h6l = (c2 << 16) | (c1 & 0xFFFF);
        c1 = (h7l & 0xFFFF) + (hl & 0xFFFF);
        c2 = (h7l >>> 16) + (hl >>> 16) + (c1 >>> 16);
        c3 = (h7h & 0xFFFF) + (hh & 0xFFFF) + (c2 >>> 16);
        c4 = (h7h >>> 16) + (hh >>> 16) + (c3 >>> 16);
        this._h7h = (c4 << 16) | (c3 & 0xFFFF);
        this._h7l = (c2 << 16) | (c1 & 0xFFFF);
    }
}
/**
 * Sha512 224.
 */
Sha512.SIZE_224 = 224;
/**
 * Sha512 256.
 */
Sha512.SIZE_256 = 256;
/**
 * Sha512 384.
 */
Sha512.SIZE_384 = 384;
/**
 * Sha512 512.
 */
Sha512.SIZE_512 = 512;
/**
 * Extra constants.
 * @internal
 */
Sha512.EXTRA = [-2147483648, 8388608, 32768, 128];
/**
 * Shift constants.
 * @internal
 */
Sha512.SHIFT = [24, 16, 8, 0];
/**
 * K.
 * @internal
 */
Sha512.K = Uint32Array.from([
    0x428A2F98, 0xD728AE22, 0x71374491, 0x23EF65CD,
    0xB5C0FBCF, 0xEC4D3B2F, 0xE9B5DBA5, 0x8189DBBC,
    0x3956C25B, 0xF348B538, 0x59F111F1, 0xB605D019,
    0x923F82A4, 0xAF194F9B, 0xAB1C5ED5, 0xDA6D8118,
    0xD807AA98, 0xA3030242, 0x12835B01, 0x45706FBE,
    0x243185BE, 0x4EE4B28C, 0x550C7DC3, 0xD5FFB4E2,
    0x72BE5D74, 0xF27B896F, 0x80DEB1FE, 0x3B1696B1,
    0x9BDC06A7, 0x25C71235, 0xC19BF174, 0xCF692694,
    0xE49B69C1, 0x9EF14AD2, 0xEFBE4786, 0x384F25E3,
    0x0FC19DC6, 0x8B8CD5B5, 0x240CA1CC, 0x77AC9C65,
    0x2DE92C6F, 0x592B0275, 0x4A7484AA, 0x6EA6E483,
    0x5CB0A9DC, 0xBD41FBD4, 0x76F988DA, 0x831153B5,
    0x983E5152, 0xEE66DFAB, 0xA831C66D, 0x2DB43210,
    0xB00327C8, 0x98FB213F, 0xBF597FC7, 0xBEEF0EE4,
    0xC6E00BF3, 0x3DA88FC2, 0xD5A79147, 0x930AA725,
    0x06CA6351, 0xE003826F, 0x14292967, 0x0A0E6E70,
    0x27B70A85, 0x46D22FFC, 0x2E1B2138, 0x5C26C926,
    0x4D2C6DFC, 0x5AC42AED, 0x53380D13, 0x9D95B3DF,
    0x650A7354, 0x8BAF63DE, 0x766A0ABB, 0x3C77B2A8,
    0x81C2C92E, 0x47EDAEE6, 0x92722C85, 0x1482353B,
    0xA2BFE8A1, 0x4CF10364, 0xA81A664B, 0xBC423001,
    0xC24B8B70, 0xD0F89791, 0xC76C51A3, 0x0654BE30,
    0xD192E819, 0xD6EF5218, 0xD6990624, 0x5565A910,
    0xF40E3585, 0x5771202A, 0x106AA070, 0x32BBD1B8,
    0x19A4C116, 0xB8D2D0C8, 0x1E376C08, 0x5141AB53,
    0x2748774C, 0xDF8EEB99, 0x34B0BCB5, 0xE19B48A8,
    0x391C0CB3, 0xC5C95A63, 0x4ED8AA4A, 0xE3418ACB,
    0x5B9CCA4F, 0x7763E373, 0x682E6FF3, 0xD6B2B8A3,
    0x748F82EE, 0x5DEFB2FC, 0x78A5636F, 0x43172F60,
    0x84C87814, 0xA1F0AB72, 0x8CC70208, 0x1A6439EC,
    0x90BEFFFA, 0x23631E28, 0xA4506CEB, 0xDE82BDE9,
    0xBEF9A3F7, 0xB2C67915, 0xC67178F2, 0xE372532B,
    0xCA273ECE, 0xEA26619C, 0xD186B8C7, 0x21C0C207,
    0xEADA7DD6, 0xCDE0EB1E, 0xF57D4F7F, 0xEE6ED178,
    0x06F067AA, 0x72176FBA, 0x0A637DC5, 0xA2C898A6,
    0x113F9804, 0xBEF90DAE, 0x1B710B35, 0x131C471B,
    0x28DB77F5, 0x23047D84, 0x32CAAB7B, 0x40C72493,
    0x3C9EBE0A, 0x15C9BEBC, 0x431D67C4, 0x9C100D4C,
    0x4CC5D4BE, 0xCB3E42B6, 0x597F299C, 0xFC657E2A,
    0x5FCB6FAB, 0x3AD6FAEC, 0x6C44198C, 0x4A475817
]);
