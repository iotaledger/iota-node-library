// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
/**
 * Class to implement Curl sponge.
 */
export class Curl {
    /**
     * Create a new instance of Curl.
     * @param rounds The number of rounds to perform.
     */
    constructor(rounds = Curl.NUMBER_OF_ROUNDS) {
        if (rounds !== 27 && rounds !== 81) {
            throw new Error("Illegal number of rounds. Only `27` and `81` rounds are supported.");
        }
        this._state = new Int8Array(Curl.STATE_LENGTH);
        this._rounds = rounds;
    }
    /**
     * Sponge transform function
     * @param curlState The curl state to transform.
     * @param round The number of rounds to use.
     * @internal
     */
    static transform(curlState, rounds) {
        let stateCopy;
        let index = 0;
        for (let round = 0; round < rounds; round++) {
            stateCopy = curlState.slice();
            for (let i = 0; i < Curl.STATE_LENGTH; i++) {
                const lastVal = stateCopy[index];
                if (index < 365) {
                    index += 364;
                }
                else {
                    index -= 365;
                }
                const nextVal = stateCopy[index] << 2;
                curlState[i] = Curl.TRUTH_TABLE[lastVal + nextVal + 5];
            }
        }
    }
    /**
     * Resets the state.
     */
    reset() {
        this._state = new Int8Array(Curl.STATE_LENGTH);
    }
    /**
     * Get the state of the sponge.
     * @param len The length of the state to get.
     * @returns The state.
     */
    rate(len = Curl.HASH_LENGTH) {
        return this._state.slice(0, len);
    }
    /**
     * Absorbs trits given an offset and length.
     * @param trits The trits to absorb.
     * @param offset The offset to start abororbing from the array.
     * @param length The length of trits to absorb.
     */
    absorb(trits, offset, length) {
        do {
            const limit = length < Curl.HASH_LENGTH ? length : Curl.HASH_LENGTH;
            this._state.set(trits.subarray(offset, offset + limit));
            Curl.transform(this._state, this._rounds);
            length -= Curl.HASH_LENGTH;
            offset += limit;
        } while (length > 0);
    }
    /**
     * Squeezes trits given an offset and length.
     * @param trits The trits to squeeze.
     * @param offset The offset to start squeezing from the array.
     * @param length The length of trits to squeeze.
     */
    squeeze(trits, offset, length) {
        do {
            const limit = length < Curl.HASH_LENGTH ? length : Curl.HASH_LENGTH;
            trits.set(this._state.subarray(0, limit), offset);
            Curl.transform(this._state, this._rounds);
            length -= Curl.HASH_LENGTH;
            offset += limit;
        } while (length > 0);
    }
}
/**
 * The Hash Length.
 */
Curl.HASH_LENGTH = 243;
/**
 * The State Length.
 */
Curl.STATE_LENGTH = 3 * Curl.HASH_LENGTH;
/**
 * The default number of rounds.
 * @internal
 */
Curl.NUMBER_OF_ROUNDS = 81;
/**
 * Truth Table.
 * @internal
 */
Curl.TRUTH_TABLE = [1, 0, -1, 2, 1, -1, 0, 2, -1, 1, 0];
