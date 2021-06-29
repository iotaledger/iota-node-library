// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/**
 * Class to help with bip32 paths.
 */
export class Bip32Path {
    /**
     * Create a new instance of Bip32Path.
     * @param initialPath Initial path to create.
     */
    constructor(initialPath) {
        if (initialPath) {
            this._path = initialPath.split("/");
            if (this._path[0] === "m") {
                this._path.shift();
            }
        }
        else {
            this._path = [];
        }
    }
    /**
     * Construct a new path by cloning an existing one.
     * @param bip32Path The path to clone.
     * @returns A new instance of Bip32Path.
     */
    static fromPath(bip32Path) {
        const p = new Bip32Path();
        p._path = bip32Path._path.slice();
        return p;
    }
    /**
     * Converts the path to a string.
     * @returns The path as a string.
     */
    toString() {
        return this._path.length > 0 ? `m/${this._path.join("/")}` : "m";
    }
    /**
     * Push a new index on to the path.
     * @param index The index to add to the path.
     */
    push(index) {
        this._path.push(`${index}`);
    }
    /**
     * Push a new hardened index on to the path.
     * @param index The index to add to the path.
     */
    pushHardened(index) {
        this._path.push(`${index}'`);
    }
    /**
     * Pop an index from the path.
     */
    pop() {
        this._path.pop();
    }
    /**
     * Get the segments.
     * @returns The segments as numbers.
     */
    numberSegments() {
        return this._path.map(p => Number.parseInt(p, 10));
    }
}
