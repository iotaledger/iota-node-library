// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/**
 * Array helper methods.
 */
export class ArrayHelper {
    /**
     * Are the two array equals.
     * @param array1 The first array.
     * @param array2 The second array.
     * @returns True if the arrays are equal.
     */
    static equal(array1, array2) {
        if (!array1 || !array2 || array1.length !== array2.length) {
            return false;
        }
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    }
}
