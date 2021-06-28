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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jcnlwdG8vY3VybC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFDL0Isc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUMvQjs7R0FFRztBQUNILE1BQU0sT0FBTyxJQUFJO0lBbUNiOzs7T0FHRztJQUNILFlBQVksU0FBaUIsSUFBSSxDQUFDLGdCQUFnQjtRQUM5QyxJQUFJLE1BQU0sS0FBSyxFQUFFLElBQUksTUFBTSxLQUFLLEVBQUUsRUFBRTtZQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLG9FQUFvRSxDQUFDLENBQUM7U0FDekY7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQW9CLEVBQUUsTUFBYztRQUN4RCxJQUFJLFNBQVMsQ0FBQztRQUNkLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUVkLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDekMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUU5QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDeEMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLEtBQUssR0FBRyxHQUFHLEVBQUU7b0JBQ2IsS0FBSyxJQUFJLEdBQUcsQ0FBQztpQkFDaEI7cUJBQU07b0JBQ0gsS0FBSyxJQUFJLEdBQUcsQ0FBQztpQkFDaEI7Z0JBQ0QsTUFBTSxPQUFP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