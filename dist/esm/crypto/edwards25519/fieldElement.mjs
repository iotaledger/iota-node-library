// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
/**
 * This is a port of the Go code from https://github.com/hdevalence/ed25519consensus
 * which is an extension of https://github.com/golang/crypto/tree/master/ed25519
 * which is in turn a port of the “ref10” implementation of ed25519 from SUPERCOP.
 */
import { BigIntHelper } from "../../utils/bigIntHelper.mjs";
import { BIG_1_SHIFTL_24, BIG_1_SHIFTL_25, BIG_38, BIG_8388607, BIG_ARR } from "./bigIntCommon.mjs";
/**
 * Class for field element operations.
 * FieldElement represents an element of the field GF(2^255 - 19).  An element
 * t, entries t[0]...t[9], represents the integer t[0]+2^26 t[1]+2^51 t[2]+2^77
 * t[3]+2^102 t[4]+...+2^230 t[9].  Bounds on each t[i] vary depending on
 * context.
 */
export class FieldElement {
    /**
     * Create a new instance of FieldElement.
     * @param values A set of values to initialize the array.
     */
    constructor(values) {
        this.data = new Int32Array(FieldElement.FIELD_ELEMENT_SIZE);
        if (values) {
            this.data.set(values);
        }
    }
    /**
     * Calculates h = f * g
     * Can overlap h with f or g.
     *
     * Preconditions:
     * |f| bounded by 1.1*2^26,1.1*2^25,1.1*2^26,1.1*2^25,etc.
     * |g| bounded by 1.1*2^26,1.1*2^25,1.1*2^26,1.1*2^25,etc.
     *
     * Postconditions:
     * |h| bounded by 1.1*2^25,1.1*2^24,1.1*2^25,1.1*2^24,etc.
     *
     * Notes on implementation strategy:
     *
     * Using schoolbook multiplication.
     * Karatsuba would save a little in some cost models.
     *
     * Most multiplications by 2 and 19 are 32-bit precomputations;
     * cheaper than 64-bit postcomputations.
     *
     * There is one remaining multiplication by 19 in the carry chain;
     * one *19 precomputation can be merged into this,
     * but the resulting data flow is considerably less clean.
     *
     * There are 12 carries below.
     * 10 of them are 2-way parallelizable and vectorizable.
     * Can get away with 11 carries, but then data flow is much deeper.
     *
     * With tighter constraints on inputs, can squeeze carries into: number.
     * @param f The f element.
     * @param g The g element.
     */
    mul(f, g) {
        const f0 = BigInt(f.data[0]);
        const f1 = BigInt(f.data[1]);
        const f2 = BigInt(f.data[2]);
        const f3 = BigInt(f.data[3]);
        const f4 = BigInt(f.data[4]);
        const f5 = BigInt(f.data[5]);
        const f6 = BigInt(f.data[6]);
        const f7 = BigInt(f.data[7]);
        const f8 = BigInt(f.data[8]);
        const f9 = BigInt(f.data[9]);
        const f12 = BigInt(2 * f.data[1]);
        const f32 = BigInt(2 * f.data[3]);
        const f52 = BigInt(2 * f.data[5]);
        const f72 = BigInt(2 * f.data[7]);
        const f92 = BigInt(2 * f.data[9]);
        const g0 = BigInt(g.data[0]);
        const g1 = BigInt(g.data[1]);
        const g2 = BigInt(g.data[2]);
        const g3 = BigInt(g.data[3]);
        const g4 = BigInt(g.data[4]);
        const g5 = BigInt(g.data[5]);
        const g6 = BigInt(g.data[6]);
        const g7 = BigInt(g.data[7]);
        const g8 = BigInt(g.data[8]);
        const g9 = BigInt(g.data[9]);
        const g119 = BigInt(19 * g.data[1]); /* 1.4*2^29 */
        const g219 = BigInt(19 * g.data[2]); /* 1.4*2^30; still ok */
        const g319 = BigInt(19 * g.data[3]);
        const g419 = BigInt(19 * g.data[4]);
        const g519 = BigInt(19 * g.data[5]);
        const g619 = BigInt(19 * g.data[6]);
        const g719 = BigInt(19 * g.data[7]);
        const g819 = BigInt(19 * g.data[8]);
        const g919 = BigInt(19 * g.data[9]);
        const h0 = (f0 * g0) + (f12 * g919) + (f2 * g819) + (f32 * g719) +
            (f4 * g619) + (f52 * g519) + (f6 * g419) + (f72 * g319) + (f8 * g219) + (f92 * g119);
        const h1 = (f0 * g1) + (f1 * g0) + (f2 * g919) + (f3 * g819) + (f4 * g719) +
            (f5 * g619) + (f6 * g519) + (f7 * g419) + (f8 * g319) + (f9 * g219);
        const h2 = (f0 * g2) + (f12 * g1) + (f2 * g0) + (f32 * g919) + (f4 * g819) +
            (f52 * g719) + (f6 * g619) + (f72 * g519) + (f8 * g419) + (f92 * g319);
        const h3 = (f0 * g3) + (f1 * g2) + (f2 * g1) + (f3 * g0) + (f4 * g919) +
            (f5 * g819) + (f6 * g719) + (f7 * g619) + (f8 * g519) + (f9 * g419);
        const h4 = (f0 * g4) + (f12 * g3) + (f2 * g2) + (f32 * g1) + (f4 * g0) +
            (f52 * g919) + (f6 * g819) + (f72 * g719) + (f8 * g619) + (f92 * g519);
        const h5 = (f0 * g5) + (f1 * g4) + (f2 * g3) + (f3 * g2) + (f4 * g1) +
            (f5 * g0) + (f6 * g919) + (f7 * g819) + (f8 * g719) + (f9 * g619);
        const h6 = (f0 * g6) + (f12 * g5) + (f2 * g4) + (f32 * g3) + (f4 * g2) +
            (f52 * g1) + (f6 * g0) + (f72 * g919) + (f8 * g819) + (f92 * g719);
        const h7 = (f0 * g7) + (f1 * g6) + (f2 * g5) + (f3 * g4) + (f4 * g3) +
            (f5 * g2) + (f6 * g1) + (f7 * g0) + (f8 * g919) + (f9 * g819);
        const h8 = (f0 * g8) + (f12 * g7) + (f2 * g6) + (f32 * g5) + (f4 * g4) +
            (f52 * g3) + (f6 * g2) + (f72 * g1) + (f8 * g0) + (f92 * g919);
        const h9 = (f0 * g9) + (f1 * g8) + (f2 * g7) + (f3 * g6) + (f4 * g5) +
            (f5 * g4) + (f6 * g3) + (f7 * g2) + (f8 * g1) + (f9 * g0);
        this.combine(h0, h1, h2, h3, h4, h5, h6, h7, h8, h9);
    }
    /**
     * Combine the element.
     * @param h0 The h0 component.
     * @param h1 The h1 component.
     * @param h2 The h2 component.
     * @param h3 The h3 component.
     * @param h4 The h4 component.
     * @param h5 The h5 component.
     * @param h6 The h6 component.
     * @param h7 The h7 component.
     * @param h8 The h8 component.
     * @param h9 The h9 component.
     */
    combine(h0, h1, h2, h3, h4, h5, h6, h7, h8, h9) {
        let c0;
        let c4;
        /*
          |h0| <= (1.1*1.1*2^52*(1+19+19+19+19)+1.1*1.1*2^50*(38+38+38+38+38))
            i.e. |h0| <= 1.2*2^59; narrower ranges for h2, h4, h6, h8
          |h1| <= (1.1*1.1*2^51*(1+1+19+19+19+19+19+19+19+19))
            i.e. |h1| <= 1.5*2^58; narrower ranges for h3, h5, h7, h9
        */
        c0 = (h0 + BIG_1_SHIFTL_25) >> BIG_ARR[26];
        h1 += c0;
        h0 -= c0 << BIG_ARR[26];
        c4 = (h4 + BIG_1_SHIFTL_25) >> BIG_ARR[26];
        h5 += c4;
        h4 -= c4 << BIG_ARR[26];
        /* |h0| <= 2^25 */
        /* |h4| <= 2^25 */
        /* |h1| <= 1.51*2^58 */
        /* |h5| <= 1.51*2^58 */
        const c1 = (h1 + BIG_1_SHIFTL_24) >> BIG_ARR[25];
        h2 += c1;
        h1 -= c1 << BIG_ARR[25];
        const c5 = (h5 + BIG_1_SHIFTL_24) >> BIG_ARR[25];
        h6 += c5;
        h5 -= c5 << BIG_ARR[25];
        /* |h1| <= 2^24; from now on fits into: number */
        /* |h5| <= 2^24; from now on fits into: number */
        /* |h2| <= 1.21*2^59 */
        /* |h6| <= 1.21*2^59 */
        const c2 = (h2 + BIG_1_SHIFTL_25) >> BIG_ARR[26];
        h3 += c2;
        h2 -= c2 << BIG_ARR[26];
        const c6 = (h6 + BIG_1_SHIFTL_25) >> BIG_ARR[26];
        h7 += c6;
        h6 -= c6 << BIG_ARR[26];
        /* |h2| <= 2^25; from now on fits into: number unchanged */
        /* |h6| <= 2^25; from now on fits into: number unchanged */
        /* |h3| <= 1.51*2^58 */
        /* |h7| <= 1.51*2^58 */
        const c3 = (h3 + BIG_1_SHIFTL_24) >> BIG_ARR[25];
        h4 += c3;
        h3 -= c3 << BIG_ARR[25];
        const c7 = (h7 + BIG_1_SHIFTL_24) >> BIG_ARR[25];
        h8 += c7;
        h7 -= c7 << BIG_ARR[25];
        /* |h3| <= 2^24; from now on fits into: number unchanged */
        /* |h7| <= 2^24; from now on fits into: number unchanged */
        /* |h4| <= 1.52*2^33 */
        /* |h8| <= 1.52*2^33 */
        c4 = (h4 + BIG_1_SHIFTL_25) >> BIG_ARR[26];
        h5 += c4;
        h4 -= c4 << BIG_ARR[26];
        const c8 = (h8 + BIG_1_SHIFTL_25) >> BIG_ARR[26];
        h9 += c8;
        h8 -= c8 << BIG_ARR[26];
        /* |h4| <= 2^25; from now on fits into: number unchanged */
        /* |h8| <= 2^25; from now on fits into: number unchanged */
        /* |h5| <= 1.01*2^24 */
        /* |h9| <= 1.51*2^58 */
        const c9 = (h9 + BIG_1_SHIFTL_24) >> BIG_ARR[25];
        h0 += c9 * BIG_ARR[19];
        h9 -= c9 << BIG_ARR[25];
        /* |h9| <= 2^24; from now on fits into: number unchanged */
        /* |h0| <= 1.8*2^37 */
        c0 = (h0 + BIG_1_SHIFTL_25) >> BIG_ARR[26];
        h1 += c0;
        h0 -= c0 << BIG_ARR[26];
        /* |h0| <= 2^25; from now on fits into: number unchanged */
        /* |h1| <= 1.01*2^24 */
        this.data[0] = Number(h0);
        this.data[1] = Number(h1);
        this.data[2] = Number(h2);
        this.data[3] = Number(h3);
        this.data[4] = Number(h4);
        this.data[5] = Number(h5);
        this.data[6] = Number(h6);
        this.data[7] = Number(h7);
        this.data[8] = Number(h8);
        this.data[9] = Number(h9);
    }
    /**
     * FieldElement.square calculates h = f*f. Can overlap h with f.
     *
     * Preconditions:
     * |f| bounded by 1.1*2^26,1.1*2^25,1.1*2^26,1.1*2^25,etc.
     *
     * Postconditions:
     * |h| bounded by 1.1*2^25,1.1*2^24,1.1*2^25,1.1*2^24,etc.
     * @param f The f element.
     */
    square(f) {
        const { h0, h1, h2, h3, h4, h5, h6, h7, h8, h9 } = this.internalSquare(f);
        this.combine(h0, h1, h2, h3, h4, h5, h6, h7, h8, h9);
    }
    /**
     * FieldElement.square calculates h = f*f. Can overlap h with f.
     *
     * Preconditions:
     * |f| bounded by 1.1*2^26,1.1*2^25,1.1*2^26,1.1*2^25,etc.
     *
     * Postconditions:
     * |h| bounded by 1.1*2^25,1.1*2^24,1.1*2^25,1.1*2^24,etc.
     * @param f The f element.
     * @returns The components.
     */
    internalSquare(f) {
        const f0 = BigInt(f.data[0]);
        const f1 = BigInt(f.data[1]);
        const f2 = BigInt(f.data[2]);
        const f3 = BigInt(f.data[3]);
        const f4 = BigInt(f.data[4]);
        const f5 = BigInt(f.data[5]);
        const f6 = BigInt(f.data[6]);
        const f7 = BigInt(f.data[7]);
        const f8 = BigInt(f.data[8]);
        const f9 = BigInt(f.data[9]);
        const f02 = BigInt(2 * f.data[0]);
        const f12 = BigInt(2 * f.data[1]);
        const f22 = BigInt(2 * f.data[2]);
        const f32 = BigInt(2 * f.data[3]);
        const f42 = BigInt(2 * f.data[4]);
        const f52 = BigInt(2 * f.data[5]);
        const f62 = BigInt(2 * f.data[6]);
        const f72 = BigInt(2 * f.data[7]);
        const f538 = BIG_38 * f5; // 1.31*2^30
        const f619 = BIG_ARR[19] * f6; // 1.31*2^30
        const f738 = BIG_38 * f7; // 1.31*2^30
        const f819 = BIG_ARR[19] * f8; // 1.31*2^30
        const f938 = BIG_38 * f9; // 1.31*2^30
        return {
            h0: (f0 * f0) + (f12 * f938) + (f22 * f819) + (f32 * f738) + (f42 * f619) + (f5 * f538),
            h1: (f02 * f1) + (f2 * f938) + (f32 * f819) + (f4 * f738) + (f52 * f619),
            h2: (f02 * f2) + (f12 * f1) + (f32 * f938) + (f42 * f819) + (f52 * f738) + (f6 * f619),
            h3: (f02 * f3) + (f12 * f2) + (f4 * f938) + (f52 * f819) + (f6 * f738),
            h4: (f02 * f4) + (f12 * f32) + (f2 * f2) + (f52 * f938) + (f62 * f819) + (f7 * f738),
            h5: (f02 * f5) + (f12 * f4) + (f22 * f3) + (f6 * f938) + (f72 * f819),
            h6: (f02 * f6) + (f12 * f52) + (f22 * f4) + (f32 * f3) + (f72 * f938) + (f8 * f819),
            h7: (f02 * f7) + (f12 * f6) + (f22 * f5) + (f32 * f4) + (f8 * f938),
            h8: (f02 * f8) + (f12 * f72) + (f22 * f6) + (f32 * f52) + (f4 * f4) + (f9 * f938),
            h9: (f02 * f9) + (f12 * f8) + (f22 * f7) + (f32 * f6) + (f42 * f5)
        };
    }
    /**
     * Square2 sets h = 2 * f * f.
     *
     * Can overlap h with f.
     *
     * Preconditions:
     * |f| bounded by 1.65*2^26,1.65*2^25,1.65*2^26,1.65*2^25,etc.
     *
     * Postconditions:
     * |h| bounded by 1.01*2^25,1.01*2^24,1.01*2^25,1.01*2^24,etc.
     * See fe_mul.c for discussion of implementation strategy.
     * @param f The f element.
     */
    square2(f) {
        let { h0, h1, h2, h3, h4, h5, h6, h7, h8, h9 } = this.internalSquare(f);
        h0 += h0;
        h1 += h1;
        h2 += h2;
        h3 += h3;
        h4 += h4;
        h5 += h5;
        h6 += h6;
        h7 += h7;
        h8 += h8;
        h9 += h9;
        this.combine(h0, h1, h2, h3, h4, h5, h6, h7, h8, h9);
    }
    /**
     * Add the elements and store in this.
     * @param a The a element.
     * @param b The b element.
     */
    add(a, b) {
        this.data[0] = a.data[0] + b.data[0];
        this.data[1] = a.data[1] + b.data[1];
        this.data[2] = a.data[2] + b.data[2];
        this.data[3] = a.data[3] + b.data[3];
        this.data[4] = a.data[4] + b.data[4];
        this.data[5] = a.data[5] + b.data[5];
        this.data[6] = a.data[6] + b.data[6];
        this.data[7] = a.data[7] + b.data[7];
        this.data[8] = a.data[8] + b.data[8];
        this.data[9] = a.data[9] + b.data[9];
    }
    /**
     * Subtract the elements and store in this.
     * @param a The a element.
     * @param b The b element.
     */
    sub(a, b) {
        this.data[0] = a.data[0] - b.data[0];
        this.data[1] = a.data[1] - b.data[1];
        this.data[2] = a.data[2] - b.data[2];
        this.data[3] = a.data[3] - b.data[3];
        this.data[4] = a.data[4] - b.data[4];
        this.data[5] = a.data[5] - b.data[5];
        this.data[6] = a.data[6] - b.data[6];
        this.data[7] = a.data[7] - b.data[7];
        this.data[8] = a.data[8] - b.data[8];
        this.data[9] = a.data[9] - b.data[9];
    }
    /**
     * Populate from bytes.
     * @param bytes The bytes to populate from.
     */
    fromBytes(bytes) {
        const h0 = BigIntHelper.read4(bytes, 0);
        const h1 = BigIntHelper.read3(bytes, 4) << BIG_ARR[6];
        const h2 = BigIntHelper.read3(bytes, 7) << BIG_ARR[5];
        const h3 = BigIntHelper.read3(bytes, 10) << BIG_ARR[3];
        const h4 = BigIntHelper.read3(bytes, 13) << BIG_ARR[2];
        const h5 = BigIntHelper.read4(bytes, 16);
        const h6 = BigIntHelper.read3(bytes, 20) << BIG_ARR[7];
        const h7 = BigIntHelper.read3(bytes, 23) << BIG_ARR[5];
        const h8 = BigIntHelper.read3(bytes, 26) << BIG_ARR[4];
        const h9 = (BigIntHelper.read3(bytes, 29) & BIG_8388607) << BIG_ARR[2];
        this.combine(h0, h1, h2, h3, h4, h5, h6, h7, h8, h9);
    }
    /**
     * FieldElement.toBytes marshals h to s.
     * Preconditions:
     * |h| bounded by 1.1*2^25,1.1*2^24,1.1*2^25,1.1*2^24,etc.
     *
     * Write p=2^255-19; q=floor(h/p).
     * Basic claim: q = floor(2^(-255)(h + 19 2^(-25)h9 + 2^(-1))).
     *
     * Proof:
     * Have |h|<=p so |q|<=1 so |19^2 2^(-255) q|<1/4.
     * Also have |h-2^230 h9|<2^230 so |19 2^(-255)(h-2^230 h9)|<1/4.
     *
     * Write y=2^(-1)-19^2 2^(-255)q-19 2^(-255)(h-2^230 h9).
     * Then 0<y<1.
     *
     * Write r=h-pq.
     * Have 0<=r<=p-1=2^255-20.
     * Thus 0<=r+19(2^-255)r<r+19(2^-255)2^255<=2^255-1.
     *
     * Write x=r+19(2^-255)r+y.
     * Then 0<x<2^255 so floor(2^(-255)x) = 0 so floor(q+2^(-255)x) = q.
     *
     * Have q+2^(-255)x = 2^(-255)(h + 19 2^(-25) h9 + 2^(-1))
     * so floor(2^(-255)(h + 19 2^(-25) h9 + 2^(-1))) = q.
     * @param bytes The bytes to populate.
     */
    toBytes(bytes) {
        const carry = new Int32Array(FieldElement.FIELD_ELEMENT_SIZE);
        let q = ((19 * this.data[9]) + (1 << 24)) >> 25;
        q = (this.data[0] + q) >> 26;
        q = (this.data[1] + q) >> 25;
        q = (this.data[2] + q) >> 26;
        q = (this.data[3] + q) >> 25;
        q = (this.data[4] + q) >> 26;
        q = (this.data[5] + q) >> 25;
        q = (this.data[6] + q) >> 26;
        q = (this.data[7] + q) >> 25;
        q = (this.data[8] + q) >> 26;
        q = (this.data[9] + q) >> 25;
        // Goal: Output h-(2^255-19)q, which is between 0 and 2^255-20.
        this.data[0] += 19 * q;
        // Goal: Output h-2^255 q, which is between 0 and 2^255-20.
        carry[0] = this.data[0] >> 26;
        this.data[1] += carry[0];
        this.data[0] -= carry[0] << 26;
        carry[1] = this.data[1] >> 25;
        this.data[2] += carry[1];
        this.data[1] -= carry[1] << 25;
        carry[2] = this.data[2] >> 26;
        this.data[3] += carry[2];
        this.data[2] -= carry[2] << 26;
        carry[3] = this.data[3] >> 25;
        this.data[4] += carry[3];
        this.data[3] -= carry[3] << 25;
        carry[4] = this.data[4] >> 26;
        this.data[5] += carry[4];
        this.data[4] -= carry[4] << 26;
        carry[5] = this.data[5] >> 25;
        this.data[6] += carry[5];
        this.data[5] -= carry[5] << 25;
        carry[6] = this.data[6] >> 26;
        this.data[7] += carry[6];
        this.data[6] -= carry[6] << 26;
        carry[7] = this.data[7] >> 25;
        this.data[8] += carry[7];
        this.data[7] -= carry[7] << 25;
        carry[8] = this.data[8] >> 26;
        this.data[9] += carry[8];
        this.data[8] -= carry[8] << 26;
        carry[9] = this.data[9] >> 25;
        this.data[9] -= carry[9] << 25;
        // h10 = carry9
        // Goal: Output h[0]+...+2^255 h10-2^255 q, which is between 0 and 2^255-20.
        // Have h[0]+...+2^230 h[9] between 0 and 2^255-1;
        // evidently 2^255 h10-2^255 q = 0.
        // Goal: Output h[0]+...+2^230 h[9].
        bytes[0] = (Math.trunc(this.data[0]));
        bytes[1] = (this.data[0] >> 8);
        bytes[2] = (this.data[0] >> 16);
        bytes[3] = ((this.data[0] >> 24) | (this.data[1] << 2));
        bytes[4] = (this.data[1] >> 6);
        bytes[5] = (this.data[1] >> 14);
        bytes[6] = ((this.data[1] >> 22) | (this.data[2] << 3));
        bytes[7] = (this.data[2] >> 5);
        bytes[8] = (this.data[2] >> 13);
        bytes[9] = ((this.data[2] >> 21) | (this.data[3] << 5));
        bytes[10] = (this.data[3] >> 3);
        bytes[11] = (this.data[3] >> 11);
        bytes[12] = ((this.data[3] >> 19) | (this.data[4] << 6));
        bytes[13] = (this.data[4] >> 2);
        bytes[14] = (this.data[4] >> 10);
        bytes[15] = (this.data[4] >> 18);
        bytes[16] = (Math.trunc(this.data[5]));
        bytes[17] = (this.data[5] >> 8);
        bytes[18] = (this.data[5] >> 16);
        bytes[19] = ((this.data[5] >> 24) | (this.data[6] << 1));
        bytes[20] = (this.data[6] >> 7);
        bytes[21] = (this.data[6] >> 15);
        bytes[22] = ((this.data[6] >> 23) | (this.data[7] << 3));
        bytes[23] = (this.data[7] >> 5);
        bytes[24] = (this.data[7] >> 13);
        bytes[25] = ((this.data[7] >> 21) | (this.data[8] << 4));
        bytes[26] = (this.data[8] >> 4);
        bytes[27] = (this.data[8] >> 12);
        bytes[28] = ((this.data[8] >> 20) | (this.data[9] << 6));
        bytes[29] = (this.data[9] >> 2);
        bytes[30] = (this.data[9] >> 10);
        bytes[31] = (this.data[9] >> 18);
    }
    /**
     * Is the element negative.
     * @returns 1 if its negative.
     */
    isNegative() {
        const s = new Uint8Array(32);
        this.toBytes(s);
        return s[0] & 1;
    }
    /**
     * Is the value non zero.
     * @returns 1 if non zero.
     */
    isNonZero() {
        const s = new Uint8Array(32);
        this.toBytes(s);
        let x = 0;
        for (let i = 0; i < s.length; i++) {
            x |= s[i];
        }
        x |= x >> 4;
        x |= x >> 2;
        x |= x >> 1;
        return (x & 1);
    }
    /**
     * Neg sets h = -f.
     *
     * Preconditions:
     * |f| bounded by 1.1*2^25,1.1*2^24,1.1*2^25,1.1*2^24,etc.
     *
     * Postconditions:
     * |h| bounded by 1.1*2^25,1.1*2^24,1.1*2^25,1.1*2^24,etc.
     */
    neg() {
        for (let i = 0; i < FieldElement.FIELD_ELEMENT_SIZE; i++) {
            this.data[i] = -this.data[i];
        }
    }
    /**
     * Invert.
     * @param z The elemnt to invert.
     */
    invert(z) {
        const t0 = new FieldElement();
        const t1 = new FieldElement();
        const t2 = new FieldElement();
        const t3 = new FieldElement();
        let i;
        t0.square(z); // 2^1
        t1.square(t0); // 2^2
        for (i = 1; i < 2; i++) { // 2^3
            t1.square(t1);
        }
        t1.mul(z, t1); // 2^3 + 2^0
        t0.mul(t0, t1); // 2^3 + 2^1 + 2^0
        t2.square(t0); // 2^4 + 2^2 + 2^1
        t1.mul(t1, t2); // 2^4 + 2^3 + 2^2 + 2^1 + 2^0
        t2.square(t1); // 5,4,3,2,1
        for (i = 1; i < 5; i++) { // 9,8,7,6,5
            t2.square(t2);
        }
        t1.mul(t2, t1); // 9,8,7,6,5,4,3,2,1,0
        t2.square(t1); // 10..1
        for (i = 1; i < 10; i++) { // 19..10
            t2.square(t2);
        }
        t2.mul(t2, t1); // 19..0
        t3.square(t2); // 20..1
        for (i = 1; i < 20; i++) { // 39..20
            t3.square(t3);
        }
        t2.mul(t3, t2); // 39..0
        t2.square(t2); // 40..1
        for (i = 1; i < 10; i++) { // 49..10
            t2.square(t2);
        }
        t1.mul(t2, t1); // 49..0
        t2.square(t1); // 50..1
        for (i = 1; i < 50; i++) { // 99..50
            t2.square(t2);
        }
        t2.mul(t2, t1); // 99..0
        t3.square(t2); // 100..1
        for (i = 1; i < 100; i++) { // 199..100
            t3.square(t3);
        }
        t2.mul(t3, t2); // 199..0
        t2.square(t2); // 200..1
        for (i = 1; i < 50; i++) { // 249..50
            t2.square(t2);
        }
        t1.mul(t2, t1); // 249..0
        t1.square(t1); // 250..1
        for (i = 1; i < 5; i++) { // 254..5
            t1.square(t1);
        }
        this.mul(t1, t0); // 254..5,3,1,0
    }
    /**
     * Perform the pow 22523 calculate.
     * @param z The element to operate on.
     */
    pow22523(z) {
        const t0 = new FieldElement();
        const t1 = new FieldElement();
        const t2 = new FieldElement();
        let i;
        t0.square(z);
        // for (i = 1; i < 1; i++) {
        //     t0.square(t0);
        // }
        t1.square(t0);
        for (i = 1; i < 2; i++) {
            t1.square(t1);
        }
        t1.mul(z, t1);
        t0.mul(t0, t1);
        t0.square(t0);
        // for (i = 1; i < 1; i++) {
        //     t0.square(t0);
        // }
        t0.mul(t1, t0);
        t1.square(t0);
        for (i = 1; i < 5; i++) {
            t1.square(t1);
        }
        t0.mul(t1, t0);
        t1.square(t0);
        for (i = 1; i < 10; i++) {
            t1.square(t1);
        }
        t1.mul(t1, t0);
        t2.square(t1);
        for (i = 1; i < 20; i++) {
            t2.square(t2);
        }
        t1.mul(t2, t1);
        t1.square(t1);
        for (i = 1; i < 10; i++) {
            t1.square(t1);
        }
        t0.mul(t1, t0);
        t1.square(t0);
        for (i = 1; i < 50; i++) {
            t1.square(t1);
        }
        t1.mul(t1, t0);
        t2.square(t1);
        for (i = 1; i < 100; i++) {
            t2.square(t2);
        }
        t1.mul(t2, t1);
        t1.square(t1);
        for (i = 1; i < 50; i++) {
            t1.square(t1);
        }
        t0.mul(t1, t0);
        t0.square(t0);
        for (i = 1; i < 2; i++) {
            t0.square(t0);
        }
        this.mul(t0, z);
    }
    /**
     * Replace (f,g) with (g,g) if b == 1;
     * replace (f,g) with (f,g) if b == 0.
     *
     * Preconditions: b in {0,1}.
     * @param g The g element.
     * @param b The b value.
     */
    cMove(g, b) {
        b = -b;
        this.data[0] ^= b & (this.data[0] ^ g.data[0]);
        this.data[1] ^= b & (this.data[1] ^ g.data[1]);
        this.data[2] ^= b & (this.data[2] ^ g.data[2]);
        this.data[3] ^= b & (this.data[3] ^ g.data[3]);
        this.data[4] ^= b & (this.data[4] ^ g.data[4]);
        this.data[5] ^= b & (this.data[5] ^ g.data[5]);
        this.data[6] ^= b & (this.data[6] ^ g.data[6]);
        this.data[7] ^= b & (this.data[7] ^ g.data[7]);
        this.data[8] ^= b & (this.data[8] ^ g.data[8]);
        this.data[9] ^= b & (this.data[9] ^ g.data[9]);
    }
    /**
     * Zero the values.
     */
    zero() {
        this.data.fill(0);
    }
    /**
     * Zero all the values and set the first byte to 1.
     */
    one() {
        this.data.fill(0);
        this.data[0] = 1;
    }
    /**
     * Clone the field element.
     * @returns The clones element.
     */
    clone() {
        return new FieldElement(this.data);
    }
}
/**
 * Field element size.
 */
FieldElement.FIELD_ELEMENT_SIZE = 10;
