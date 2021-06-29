// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { FieldElement } from "./fieldElement.mjs";
/**
 * Cached group element.
 */
export class CachedGroupElement {
    /**
     * Create a new instance of CachedGroupElement.
     * @param yPlusX Y + X Element.
     * @param yMinusX Y - X Element.
     * @param Z Z Element.
     * @param T2d T2d Element.
     */
    constructor(yPlusX, yMinusX, Z, T2d) {
        this.yPlusX = yPlusX !== null && yPlusX !== void 0 ? yPlusX : new FieldElement();
        this.yMinusX = yMinusX !== null && yMinusX !== void 0 ? yMinusX : new FieldElement();
        this.Z = Z !== null && Z !== void 0 ? Z : new FieldElement();
        this.T2d = T2d !== null && T2d !== void 0 ? T2d : new FieldElement();
    }
}
