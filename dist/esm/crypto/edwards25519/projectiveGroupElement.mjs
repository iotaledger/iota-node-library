// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
/**
 * This is a port of the Go code from https://github.com/hdevalence/ed25519consensus
 * which is an extension of https://github.com/golang/crypto/tree/master/ed25519
 * which in a port of the “ref10” implementation of ed25519 from SUPERCOP.
 */
import { CachedGroupElement } from "./cachedGroupElement.mjs";
import { CompletedGroupElement } from "./completedGroupElement.mjs";
import { CONST_BI } from "./const.mjs";
import { ExtendedGroupElement } from "./extendedGroupElement.mjs";
import { FieldElement } from "./fieldElement.mjs";
/**
 * Group elements are members of the elliptic curve -x^2 + y^2 = 1 + d * x^2 *
 * y^2 where d = -121665/121666
 * ProjectiveGroupElement: (X:Y:Z) satisfying x=X/Z, y=Y/Z.
 */
export class ProjectiveGroupElement {
    /**
     * Create a new instance of CompletedGroupElement.
     * @param X The X element.
     * @param Y The Y Element.
     * @param Z The Z Element.
     */
    constructor(X, Y, Z) {
        this.X = X !== null && X !== void 0 ? X : new FieldElement();
        this.Y = Y !== null && Y !== void 0 ? Y : new FieldElement();
        this.Z = Z !== null && Z !== void 0 ? Z : new FieldElement();
    }
    /**
     * Zero the elements.
     */
    zero() {
        this.X.zero();
        this.Y.one();
        this.Z.one();
    }
    /**
     * Double the elements.
     * @param r The elements.
     */
    double(r) {
        const t0 = new FieldElement();
        r.X.square(this.X);
        r.Z.square(this.Y);
        r.T.square2(this.Z);
        r.Y.add(this.X, this.Y);
        t0.square(r.Y);
        r.Y.add(r.Z, r.X);
        r.Z.sub(r.Z, r.X);
        r.X.sub(t0, r.Y);
        r.T.sub(r.T, r.Z);
    }
    /**
     * Convert to extended form.
     * @param r The extended element.
     */
    toExtended(r) {
        r.X.mul(this.X, this.Z);
        r.Y.mul(this.Y, this.Z);
        r.Z.square(this.Z);
        r.T.mul(this.X, this.Y);
    }
    /**
     * Convert the element to bytes.
     * @param s The bytes.
     */
    toBytes(s) {
        const recip = new FieldElement();
        const x = new FieldElement();
        const y = new FieldElement();
        recip.invert(this.Z);
        x.mul(this.X, recip);
        y.mul(this.Y, recip);
        y.toBytes(s);
        s[31] ^= x.isNegative() << 7;
    }
    /**
     * GeDoubleScalarMultVartime sets r = a*A + b*B
     * where a = a[0]+256*a[1]+...+256^31 a[31]
     * and b = b[0]+256*b[1]+...+256^31 b[31]
     * B is the Ed25519 base point (x,4/5) with x positive.
     * @param a The a.
     * @param A The A.
     * @param b The b.
     */
    doubleScalarMultVartime(a, A, b) {
        const aSlide = new Int8Array(256);
        const bSlide = new Int8Array(256);
        const ai = [
            new CachedGroupElement(),
            new CachedGroupElement(),
            new CachedGroupElement(),
            new CachedGroupElement(),
            new CachedGroupElement(),
            new CachedGroupElement(),
            new CachedGroupElement(),
            new CachedGroupElement()
        ]; // A,3A,5A,7A,9A,11A,13A,15A
        const t = new CompletedGroupElement();
        const u = new ExtendedGroupElement();
        const A2 = new ExtendedGroupElement();
        let i;
        this.slide(aSlide, a);
        this.slide(bSlide, b);
        A.toCached(ai[0]);
        A.double(t);
        t.toExtended(A2);
        for (i = 0; i < 7; i++) {
            t.add(A2, ai[i]);
            t.toExtended(u);
            u.toCached(ai[i + 1]);
        }
        this.zero();
        for (i = 255; i >= 0; i--) {
            if (aSlide[i] !== 0 || bSlide[i] !== 0) {
                break;
            }
        }
        for (; i >= 0; i--) {
            this.double(t);
            if (aSlide[i] > 0) {
                t.toExtended(u);
                t.add(u, ai[Math.floor(aSlide[i] / 2)]);
            }
            else if (aSlide[i] < 0) {
                t.toExtended(u);
                t.sub(u, ai[Math.floor(-aSlide[i] / 2)]);
            }
            if (bSlide[i] > 0) {
                t.toExtended(u);
                t.mixedAdd(u, CONST_BI[Math.floor(bSlide[i] / 2)]);
            }
            else if (bSlide[i] < 0) {
                t.toExtended(u);
                t.mixedSub(u, CONST_BI[Math.floor(-bSlide[i] / 2)]);
            }
            t.toProjective(this);
        }
    }
    /**
     * Perform the slide.
     * @param r The r.
     * @param a The a.
     */
    slide(r, a) {
        let i;
        for (i = 0; i < r.length; i++) {
            r[i] = 1 & (a[i >> 3] >> (i & 7));
        }
        for (i = 0; i < r.length; i++) {
            if (r[i] !== 0) {
                for (let b = 1; b <= 6 && i + b < 256; b++) {
                    if (r[i + b] !== 0) {
                        if (r[i] + (r[i + b] << b) <= 15) {
                            r[i] += r[i + b] << b;
                            r[i + b] = 0;
                        }
                        else if (r[i] - (r[i + b] << b) >= -15) {
                            r[i] -= r[i + b] << b;
                            for (let k = i + b; k < 256; k++) {
                                if (r[k] === 0) {
                                    r[k] = 1;
                                    break;
                                }
                                r[k] = 0;
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
    }
}
