// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { FieldElement } from "./fieldElement";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGVkR3JvdXBFbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NyeXB0by9lZHdhcmRzMjU1MTkvY2FjaGVkR3JvdXBFbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixzQ0FBc0M7QUFFdEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTlDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGtCQUFrQjtJQXFCM0I7Ozs7OztPQU1HO0lBQ0gsWUFBWSxNQUFxQixFQUFFLE9BQXNCLEVBQUUsQ0FBZ0IsRUFBRSxHQUFrQjtRQUMzRixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sYUFBTixNQUFNLGNBQU4sTUFBTSxHQUFJLElBQUksWUFBWSxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLGFBQVAsT0FBTyxjQUFQLE9BQU8sR0FBSSxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFELENBQUMsY0FBRCxDQUFDLEdBQUksSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsYUFBSCxHQUFHLGNBQUgsR0FBRyxHQUFJLElBQUksWUFBWSxFQUFFLENBQUM7SUFDekMsQ0FBQztDQUNKIn0=