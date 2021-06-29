// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
import { BigIntHelper } from "./bigIntHelper.mjs";
import { Converter } from "./converter.mjs";
/**
 * Keep track of the write index within a stream.
 */
export class WriteStream {
    /**
     * Create a new instance of ReadStream.
     */
    constructor() {
        this._storage = new Uint8Array(WriteStream.CHUNK_SIZE);
        this._writeIndex = 0;
    }
    /**
     * Get the length of the stream.
     * @returns The stream length.
     */
    length() {
        return this._storage.length;
    }
    /**
     * How much unused data is there.
     * @returns The amount of unused data.
     */
    unused() {
        return this._storage.length - this._writeIndex;
    }
    /**
     * Get the final stream as bytes.
     * @returns The final stream.
     */
    finalBytes() {
        return this._storage.subarray(0, this._writeIndex);
    }
    /**
     * Get the final stream as hex.
     * @returns The final stream as hex.
     */
    finalHex() {
        return Converter.bytesToHex(this._storage.subarray(0, this._writeIndex));
    }
    /**
     * Get the current write index.
     * @returns The current write index.
     */
    getWriteIndex() {
        return this._writeIndex;
    }
    /**
     * Set the current write index.
     * @param writeIndex The current write index.
     */
    setWriteIndex(writeIndex) {
        this._writeIndex = writeIndex;
        if (writeIndex >= this._storage.length) {
            throw new Error(`You cannot set the writeIndex to ${writeIndex} as the stream is only ${this._storage.length} in length`);
        }
    }
    /**
     * Write fixed length stream.
     * @param name The name of the data we are trying to write.
     * @param length The length of the data to write.
     * @param val The data to write.
     */
    writeFixedHex(name, length, val) {
        if (!Converter.isHex(val)) {
            throw new Error(`The ${name} should be in hex format`);
        }
        // Hex should be twice the length as each byte is 2 characters
        if (length * 2 !== val.length) {
            throw new Error(`${name} length ${val.length} does not match expected length ${length * 2}`);
        }
        this.expand(length);
        this._storage.set(Converter.hexToBytes(val), this._writeIndex);
        this._writeIndex += length;
    }
    /**
     * Write fixed length stream.
     * @param name The name of the data we are trying to write.
     * @param length The length of the data to write.
     * @param val The data to write.
     */
    writeBytes(name, length, val) {
        this.expand(length);
        this._storage.set(val, this._writeIndex);
        this._writeIndex += length;
    }
    /**
     * Write a byte to the stream.
     * @param name The name of the data we are trying to write.
     * @param val The data to write.
     */
    writeByte(name, val) {
        this.expand(1);
        this._storage[this._writeIndex++] = val & 0xFF;
    }
    /**
     * Write a UInt16 to the stream.
     * @param name The name of the data we are trying to write.
     * @param val The data to write.
     */
    writeUInt16(name, val) {
        this.expand(2);
        this._storage[this._writeIndex++] = val & 0xFF;
        this._storage[this._writeIndex++] = val >>> 8;
    }
    /**
     * Write a UInt32 to the stream.
     * @param name The name of the data we are trying to write.
     * @param val The data to write.
     */
    writeUInt32(name, val) {
        this.expand(4);
        this._storage[this._writeIndex++] = val & 0xFF;
        this._storage[this._writeIndex++] = val >>> 8;
        this._storage[this._writeIndex++] = val >>> 16;
        this._storage[this._writeIndex++] = val >>> 24;
    }
    /**
     * Write a UInt64 to the stream.
     * @param name The name of the data we are trying to write.
     * @param val The data to write.
     */
    writeUInt64(name, val) {
        this.expand(8);
        BigIntHelper.write8(val, this._storage, this._writeIndex);
        this._writeIndex += 8;
    }
    /**
     * Write a boolean to the stream.
     * @param name The name of the data we are trying to write.
     * @param val The data to write.
     */
    writeBoolean(name, val) {
        this.expand(1);
        this._storage[this._writeIndex++] = val ? 1 : 0;
    }
    /**
     * Expand the storage if there is not enough spave.
     * @param additional The amount of space needed.
     */
    expand(additional) {
        if (this._writeIndex + additional > this._storage.byteLength) {
            const newArr = new Uint8Array(this._storage.length + (Math.ceil(additional / WriteStream.CHUNK_SIZE) * WriteStream.CHUNK_SIZE));
            newArr.set(this._storage, 0);
            this._storage = newArr;
        }
    }
}
/**
 * Chunk size to expand the storage.
 * @internal
 */
WriteStream.CHUNK_SIZE = 4096;
