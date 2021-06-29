// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
import { BigIntHelper } from "./bigIntHelper.mjs";
import { Converter } from "./converter.mjs";
/**
 * Keep track of the read index within a stream.
 */
export class ReadStream {
    /**
     * Create a new instance of ReadStream.
     * @param storage The data to access.
     * @param readStartIndex The index to start the reading from.
     */
    constructor(storage, readStartIndex = 0) {
        this._storage = new Uint8Array(storage);
        this._readIndex = readStartIndex;
    }
    /**
     * Get the length of the storage.
     * @returns The storage length.
     */
    length() {
        return this._storage.byteLength;
    }
    /**
     * Does the storage have enough data remaining.
     * @param remaining The amount of space needed.
     * @returns True if it has enough data.
     */
    hasRemaining(remaining) {
        return this._readIndex + remaining <= this._storage.byteLength;
    }
    /**
     * How much unused data is there.
     * @returns The amount of unused data.
     */
    unused() {
        return this._storage.byteLength - this._readIndex;
    }
    /**
     * Get the current read index.
     * @returns The current read index.
     */
    getReadIndex() {
        return this._readIndex;
    }
    /**
     * Set the current read index.
     * @param readIndex The current read index.
     */
    setReadIndex(readIndex) {
        this._readIndex = readIndex;
        if (readIndex >= this._storage.length) {
            throw new Error(`You cannot set the readIndex to ${readIndex} as the stream is only ${this._storage.length} in length`);
        }
    }
    /**
     * Read fixed length as hex.
     * @param name The name of the data we are trying to read.
     * @param length The length of the data to read.
     * @param moveIndex Move the index pointer on.
     * @returns The hex formatted data.
     */
    readFixedHex(name, length, moveIndex = true) {
        if (!this.hasRemaining(length)) {
            throw new Error(`${name} length ${length} exceeds the remaining data ${this.unused()}`);
        }
        const hex = Converter.bytesToHex(this._storage, this._readIndex, length);
        if (moveIndex) {
            this._readIndex += length;
        }
        return hex;
    }
    /**
     * Read an array of byte from the stream.
     * @param name The name of the data we are trying to read.
     * @param length The length of the array to read.
     * @param moveIndex Move the index pointer on.
     * @returns The value.
     */
    readBytes(name, length, moveIndex = true) {
        if (!this.hasRemaining(length)) {
            throw new Error(`${name} length ${length} exceeds the remaining data ${this.unused()}`);
        }
        const val = this._storage.slice(this._readIndex, this._readIndex + length);
        if (moveIndex) {
            this._readIndex += length;
        }
        return val;
    }
    /**
     * Read a byte from the stream.
     * @param name The name of the data we are trying to read.
     * @param moveIndex Move the index pointer on.
     * @returns The value.
     */
    readByte(name, moveIndex = true) {
        if (!this.hasRemaining(1)) {
            throw new Error(`${name} length 1 exceeds the remaining data ${this.unused()}`);
        }
        const val = this._storage[this._readIndex];
        if (moveIndex) {
            this._readIndex += 1;
        }
        return val;
    }
    /**
     * Read a UInt16 from the stream.
     * @param name The name of the data we are trying to read.
     * @param moveIndex Move the index pointer on.
     * @returns The value.
     */
    readUInt16(name, moveIndex = true) {
        if (!this.hasRemaining(2)) {
            throw new Error(`${name} length 2 exceeds the remaining data ${this.unused()}`);
        }
        const val = this._storage[this._readIndex] |
            (this._storage[this._readIndex + 1] << 8);
        if (moveIndex) {
            this._readIndex += 2;
        }
        return val;
    }
    /**
     * Read a UInt32 from the stream.
     * @param name The name of the data we are trying to read.
     * @param moveIndex Move the index pointer on.
     * @returns The value.
     */
    readUInt32(name, moveIndex = true) {
        if (!this.hasRemaining(4)) {
            throw new Error(`${name} length 4 exceeds the remaining data ${this.unused()}`);
        }
        const val = (this._storage[this._readIndex]) |
            (this._storage[this._readIndex + 1] * 0x100) |
            (this._storage[this._readIndex + 2] * 0x10000) +
                (this._storage[this._readIndex + 3] * 0x1000000);
        if (moveIndex) {
            this._readIndex += 4;
        }
        return val;
    }
    /**
     * Read a UInt64 from the stream.
     * @param name The name of the data we are trying to read.
     * @param moveIndex Move the index pointer on.
     * @returns The value.
     */
    readUInt64(name, moveIndex = true) {
        if (!this.hasRemaining(8)) {
            throw new Error(`${name} length 8 exceeds the remaining data ${this.unused()}`);
        }
        const val = BigIntHelper.read8(this._storage, this._readIndex);
        if (moveIndex) {
            this._readIndex += 8;
        }
        return val;
    }
    /**
     * Read a boolean from the stream.
     * @param name The name of the data we are trying to read.
     * @param moveIndex Move the index pointer on.
     * @returns The value.
     */
    readBoolean(name, moveIndex = true) {
        if (!this.hasRemaining(1)) {
            throw new Error(`${name} length 1 exceeds the remaining data ${this.unused()}`);
        }
        const val = this._storage[this._readIndex];
        if (moveIndex) {
            this._readIndex += 1;
        }
        return val !== 0;
    }
}
