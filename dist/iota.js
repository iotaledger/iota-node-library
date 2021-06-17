(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node-fetch')) :
    typeof define === 'function' && define.amd ? define(['exports', 'node-fetch'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Iota = {}, global['node-fetch']));
}(this, (function (exports, require$$0) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    // Fetch
    if (!globalThis.fetch) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        globalThis.fetch = require$$0__default['default'];
    }

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /* eslint-disable no-bitwise */
    /**
     * Class to help with Blake2B Signature scheme.
     * TypeScript conversion from https://github.com/dcposch/blakejs.
     */
    class Blake2b {
        /**
         * Create a new instance of Blake2b.
         * @internal
         */
        constructor() {
            this._v = new Uint32Array(32);
            this._m = new Uint32Array(32);
        }
        /**
         * Perform Sum 256 on the data.
         * @param data The data to operate on.
         * @param key Optional key for the hash.
         * @returns The sum 256 of the data.
         */
        static sum256(data, key) {
            const b2b = new Blake2b();
            const ctx = b2b.init(Blake2b.SIZE_256, key);
            b2b.update(ctx, data);
            return b2b.final(ctx);
        }
        /**
         * Perform Sum 512 on the data.
         * @param data The data to operate on.
         * @param key Optional key for the hash.
         * @returns The sum 512 of the data.
         */
        static sum512(data, key) {
            const b2b = new Blake2b();
            const ctx = b2b.init(Blake2b.SIZE_512, key);
            b2b.update(ctx, data);
            return b2b.final(ctx);
        }
        /**
         * Compression.
         * Note we're representing 16 uint64s as 32 uint32s
         * @param ctx The context.
         * @param ctx.b Array.
         * @param ctx.h Array.
         * @param ctx.t Number.
         * @param ctx.c Number.
         * @param ctx.outlen The output length.
         * @param last Is this the last block.
         * @internal
         */
        compress(ctx, last) {
            let i = 0;
            // init work variables
            for (i = 0; i < 16; i++) {
                this._v[i] = ctx.h[i];
                this._v[i + 16] = Blake2b.BLAKE2B_IV32[i];
            }
            // low 64 bits of offset
            this._v[24] ^= ctx.t;
            this._v[25] ^= ctx.t / 0x100000000;
            // high 64 bits not supported, offset may not be higher than 2**53-1
            // last block flag set ?
            if (last) {
                this._v[28] = ~this._v[28];
                this._v[29] = ~this._v[29];
            }
            // get little-endian words
            for (i = 0; i < 32; i++) {
                this._m[i] = this.b2bGet32(ctx.b, 4 * i);
            }
            // twelve rounds of mixing
            for (i = 0; i < 12; i++) {
                this.b2bG(0, 8, 16, 24, Blake2b.SIGMA82[(i * 16) + 0], Blake2b.SIGMA82[(i * 16) + 1]);
                this.b2bG(2, 10, 18, 26, Blake2b.SIGMA82[(i * 16) + 2], Blake2b.SIGMA82[(i * 16) + 3]);
                this.b2bG(4, 12, 20, 28, Blake2b.SIGMA82[(i * 16) + 4], Blake2b.SIGMA82[(i * 16) + 5]);
                this.b2bG(6, 14, 22, 30, Blake2b.SIGMA82[(i * 16) + 6], Blake2b.SIGMA82[(i * 16) + 7]);
                this.b2bG(0, 10, 20, 30, Blake2b.SIGMA82[(i * 16) + 8], Blake2b.SIGMA82[(i * 16) + 9]);
                this.b2bG(2, 12, 22, 24, Blake2b.SIGMA82[(i * 16) + 10], Blake2b.SIGMA82[(i * 16) + 11]);
                this.b2bG(4, 14, 16, 26, Blake2b.SIGMA82[(i * 16) + 12], Blake2b.SIGMA82[(i * 16) + 13]);
                this.b2bG(6, 8, 18, 28, Blake2b.SIGMA82[(i * 16) + 14], Blake2b.SIGMA82[(i * 16) + 15]);
            }
            for (i = 0; i < 16; i++) {
                ctx.h[i] = ctx.h[i] ^ this._v[i] ^ this._v[i + 16];
            }
        }
        /**
         * Creates a BLAKE2b hashing context.
         * @param outlen Output length between 1 and 64 bytes.
         * @param key Optional key.
         * @returns The initialized context.
         * @internal
         */
        init(outlen, key) {
            if (outlen <= 0 || outlen > 64) {
                throw new Error("Illegal output length, expected 0 < length <= 64");
            }
            if (key && key.length > 64) {
                throw new Error("Illegal key, expected Uint8Array with 0 < length <= 64");
            }
            // state, 'param block'
            const ctx = {
                b: new Uint8Array(128),
                h: new Uint32Array(16),
                t: 0,
                c: 0,
                outlen // output length in bytes
            };
            // initialize hash state
            for (let i = 0; i < 16; i++) {
                ctx.h[i] = Blake2b.BLAKE2B_IV32[i];
            }
            const keylen = key ? key.length : 0;
            ctx.h[0] ^= 0x01010000 ^ (keylen << 8) ^ outlen;
            // key the hash, if applicable
            if (key) {
                this.update(ctx, key);
                // at the end
                ctx.c = 128;
            }
            return ctx;
        }
        /**
         * Updates a BLAKE2b streaming hash.
         * @param ctx The context.
         * @param ctx.b Array.
         * @param ctx.h Array.
         * @param ctx.t Number.
         * @param ctx.c Number.
         * @param ctx.outlen The output length.
         * @param input The data to hash.
         * @internal
         */
        update(ctx, input) {
            for (let i = 0; i < input.length; i++) {
                if (ctx.c === 128) { // buffer full ?
                    ctx.t += ctx.c; // add counters
                    this.compress(ctx, false); // compress (not last)
                    ctx.c = 0; // counter to zero
                }
                ctx.b[ctx.c++] = input[i];
            }
        }
        /**
         * Completes a BLAKE2b streaming hash.
         * @param ctx The context.
         * @param ctx.b Array.
         * @param ctx.h Array.
         * @param ctx.t Number.
         * @param ctx.c Number.
         * @param ctx.outlen The output length.
         * @returns The final data.
         * @internal
         */
        final(ctx) {
            ctx.t += ctx.c; // mark last block offset
            while (ctx.c < 128) { // fill up with zeros
                ctx.b[ctx.c++] = 0;
            }
            this.compress(ctx, true); // final block flag = 1
            // little endian convert and store
            const out = new Uint8Array(ctx.outlen);
            for (let i = 0; i < ctx.outlen; i++) {
                out[i] = ctx.h[i >> 2] >> (8 * (i & 3));
            }
            return out;
        }
        /**
         * 64-bit unsigned addition
         * Sets v[a,a+1] += v[b,b+1]
         * @param v The array.
         * @param a The a index.
         * @param b The b index.
         * @internal
         */
        add64AA(v, a, b) {
            const o0 = v[a] + v[b];
            let o1 = v[a + 1] + v[b + 1];
            if (o0 >= 0x100000000) {
                o1++;
            }
            v[a] = o0;
            v[a + 1] = o1;
        }
        /**
         * 64-bit unsigned addition.
         * Sets v[a,a+1] += b.
         * @param v The array of data to work on.
         * @param a The index to use.
         * @param b0 Is the low 32 bits.
         * @param b1 Represents the high 32 bits.
         * @internal
         */
        add64AC(v, a, b0, b1) {
            let o0 = v[a] + b0;
            if (b0 < 0) {
                o0 += 0x100000000;
            }
            let o1 = v[a + 1] + b1;
            if (o0 >= 0x100000000) {
                o1++;
            }
            v[a] = o0;
            v[a + 1] = o1;
        }
        /**
         * Little endian read byte 32;
         * @param arr The array to read from .
         * @param i The index to start reading from.
         * @returns The value.
         * @internal
         */
        b2bGet32(arr, i) {
            return (arr[i] ^
                (arr[i + 1] << 8) ^
                (arr[i + 2] << 16) ^
                (arr[i + 3] << 24));
        }
        /**
         * G Mixing function.
         * The ROTRs are inlined for speed.
         * @param a The a value.
         * @param b The b value.
         * @param c The c value.
         * @param d The d value.
         * @param ix The ix value.
         * @param iy The iy value.
         * @internal
         */
        b2bG(a, b, c, d, ix, iy) {
            const x0 = this._m[ix];
            const x1 = this._m[ix + 1];
            const y0 = this._m[iy];
            const y1 = this._m[iy + 1];
            this.add64AA(this._v, a, b); // v[a,a+1] += v[b,b+1] ... in JS we must store a uint64 as two uint32s
            this.add64AC(this._v, a, x0, x1); // v[a, a+1] += x ... x0 is the low 32 bits of x, x1 is the high 32 bits
            // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated to the right by 32 bits
            let xor0 = this._v[d] ^ this._v[a];
            let xor1 = this._v[d + 1] ^ this._v[a + 1];
            this._v[d] = xor1;
            this._v[d + 1] = xor0;
            this.add64AA(this._v, c, d);
            // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 24 bits
            xor0 = this._v[b] ^ this._v[c];
            xor1 = this._v[b + 1] ^ this._v[c + 1];
            this._v[b] = (xor0 >>> 24) ^ (xor1 << 8);
            this._v[b + 1] = (xor1 >>> 24) ^ (xor0 << 8);
            this.add64AA(this._v, a, b);
            this.add64AC(this._v, a, y0, y1);
            // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated right by 16 bits
            xor0 = this._v[d] ^ this._v[a];
            xor1 = this._v[d + 1] ^ this._v[a + 1];
            this._v[d] = (xor0 >>> 16) ^ (xor1 << 16);
            this._v[d + 1] = (xor1 >>> 16) ^ (xor0 << 16);
            this.add64AA(this._v, c, d);
            // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 63 bits
            xor0 = this._v[b] ^ this._v[c];
            xor1 = this._v[b + 1] ^ this._v[c + 1];
            this._v[b] = (xor1 >>> 31) ^ (xor0 << 1);
            this._v[b + 1] = (xor0 >>> 31) ^ (xor1 << 1);
        }
    }
    /**
     * Blake2b 256.
     */
    Blake2b.SIZE_256 = 32;
    /**
     * Blake2b 512.
     */
    Blake2b.SIZE_512 = 64;
    /**
     * Initialization Vector.
     * @internal
     */
    Blake2b.BLAKE2B_IV32 = new Uint32Array([
        0xF3BCC908, 0x6A09E667, 0x84CAA73B, 0xBB67AE85,
        0xFE94F82B, 0x3C6EF372, 0x5F1D36F1, 0xA54FF53A,
        0xADE682D1, 0x510E527F, 0x2B3E6C1F, 0x9B05688C,
        0xFB41BD6B, 0x1F83D9AB, 0x137E2179, 0x5BE0CD19
    ]);
    /**
     * Initialization Vector.
     * @internal
     */
    Blake2b.SIGMA8 = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
        11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
        7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
        9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
        2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
        12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
        13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
        6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
        10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3
    ];
    /**
     * These are offsets into a uint64 buffer.
     * Multiply them all by 2 to make them offsets into a uint32 buffer,
     * because this is Javascript and we don't have uint64s
     * @internal
     */
    Blake2b.SIGMA82 = new Uint8Array(Blake2b.SIGMA8.map(x => x * 2));

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /**
     * Array helper methods.
     */
    class ArrayHelper {
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

    // Copyright 2020 IOTA Stiftung
    /**
     * Class to help with Ed25519 Signature scheme.
     */
    class Ed25519Address {
        /**
         * Create a new instance of Ed25519Address.
         * @param publicKey The public key for the address.
         */
        constructor(publicKey) {
            this._publicKey = publicKey;
        }
        /**
         * Convert the public key to an address.
         * @returns The address.
         */
        toAddress() {
            return Blake2b.sum256(this._publicKey);
        }
        /**
         * Use the public key to validate the address.
         * @param address The address to verify.
         * @returns True if the data and address is verified.
         */
        verify(address) {
            return ArrayHelper.equal(this.toAddress(), address);
        }
    }
    /**
     * Address size.
     * @internal
     */
    Ed25519Address.ADDRESS_LENGTH = Blake2b.SIZE_256;

    /**
     * The global type for the address type.
     */
    const ED25519_ADDRESS_TYPE = 0;

    // Copyright 2020 IOTA Stiftung
    /**
     * Byte length for a byte field.
     */
    const BYTE_SIZE = 1;
    /**
     * Byte length for a uint16 field.
     */
    const UINT16_SIZE = 2;
    /**
     * Byte length for a uint32 field.
     */
    const UINT32_SIZE = 4;
    /**
     * Byte length for a uint64 field.
     */
    const UINT64_SIZE = 8;
    /**
     * Byte length for a message id.
     */
    const MESSAGE_ID_LENGTH = Blake2b.SIZE_256;
    /**
     * Byte length for a transaction id.
     */
    const TRANSACTION_ID_LENGTH = Blake2b.SIZE_256;
    /**
     * Byte length for a merkle prrof.
     */
    const MERKLE_PROOF_LENGTH = Blake2b.SIZE_256;
    /**
     * Byte length for a type length.
     */
    const TYPE_LENGTH = UINT32_SIZE;
    /**
     * Byte length for a small type length.
     */
    const SMALL_TYPE_LENGTH = BYTE_SIZE;
    /**
     * Byte length for a string length.
     */
    const STRING_LENGTH = UINT16_SIZE;
    /**
     * Byte length for an array length.
     */
    const ARRAY_LENGTH = UINT16_SIZE;

    // Copyright 2020 IOTA Stiftung
    /**
     * The minimum length of an address binary representation.
     */
    const MIN_ADDRESS_LENGTH = SMALL_TYPE_LENGTH;
    /**
     * The minimum length of an ed25519 address binary representation.
     */
    const MIN_ED25519_ADDRESS_LENGTH = MIN_ADDRESS_LENGTH + Ed25519Address.ADDRESS_LENGTH;
    /**
     * Deserialize the address from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeAddress(readStream) {
        if (!readStream.hasRemaining(MIN_ADDRESS_LENGTH)) {
            throw new Error(`Address data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ADDRESS_LENGTH}`);
        }
        const type = readStream.readByte("address.type", false);
        let address;
        if (type === ED25519_ADDRESS_TYPE) {
            address = deserializeEd25519Address(readStream);
        }
        else {
            throw new Error(`Unrecognized address type ${type}`);
        }
        return address;
    }
    /**
     * Serialize the address to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeAddress(writeStream, object) {
        if (object.type === ED25519_ADDRESS_TYPE) {
            serializeEd25519Address(writeStream, object);
        }
        else {
            throw new Error(`Unrecognized address type ${object.type}`);
        }
    }
    /**
     * Deserialize the Ed25519 address from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeEd25519Address(readStream) {
        if (!readStream.hasRemaining(MIN_ED25519_ADDRESS_LENGTH)) {
            throw new Error(`Ed25519 address data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ED25519_ADDRESS_LENGTH}`);
        }
        const type = readStream.readByte("ed25519Address.type");
        if (type !== ED25519_ADDRESS_TYPE) {
            throw new Error(`Type mismatch in ed25519Address ${type}`);
        }
        const address = readStream.readFixedHex("ed25519Address.address", Ed25519Address.ADDRESS_LENGTH);
        return {
            type: ED25519_ADDRESS_TYPE,
            address
        };
    }
    /**
     * Serialize the ed25519 address to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeEd25519Address(writeStream, object) {
        writeStream.writeByte("ed25519Address.type", object.type);
        writeStream.writeFixedHex("ed25519Address.address", Ed25519Address.ADDRESS_LENGTH, object.address);
    }

    /**
     * The length of the tail hash length in bytes.
     */
    const TAIL_HASH_LENGTH = 49;
    /**
     * The minimum length of a migrated fund binary representation.
     */
    const MIN_MIGRATED_FUNDS_LENGTH = TAIL_HASH_LENGTH + // tailTransactionHash
        MIN_ED25519_ADDRESS_LENGTH + // address
        UINT64_SIZE; // deposit
    /**
     * The maximum number of funds.
     */
    const MAX_FUNDS_COUNT = 127;
    /**
     * Deserialize the receipt payload funds from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeFunds(readStream) {
        const numFunds = readStream.readUInt16("funds.numFunds");
        const funds = [];
        for (let i = 0; i < numFunds; i++) {
            funds.push(deserializeMigratedFunds(readStream));
        }
        return funds;
    }
    /**
     * Serialize the receipt payload funds to binary.
     * @param writeStream The stream to write the data to.
     * @param objects The objects to serialize.
     */
    function serializeFunds(writeStream, objects) {
        if (objects.length > MAX_FUNDS_COUNT) {
            throw new Error(`The maximum number of funds is ${MAX_FUNDS_COUNT}, you have provided ${objects.length}`);
        }
        writeStream.writeUInt16("funds.numFunds", objects.length);
        for (let i = 0; i < objects.length; i++) {
            serializeMigratedFunds(writeStream, objects[i]);
        }
    }
    /**
     * Deserialize the migrated fund from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeMigratedFunds(readStream) {
        if (!readStream.hasRemaining(MIN_MIGRATED_FUNDS_LENGTH)) {
            throw new Error(`Migrated funds data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_MIGRATED_FUNDS_LENGTH}`);
        }
        const tailTransactionHash = readStream.readFixedHex("migratedFunds.tailTransactionHash", TAIL_HASH_LENGTH);
        const address = deserializeAddress(readStream);
        const deposit = readStream.readUInt64("migratedFunds.deposit");
        return {
            tailTransactionHash,
            address,
            deposit: Number(deposit)
        };
    }
    /**
     * Serialize the migrated funds to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeMigratedFunds(writeStream, object) {
        writeStream.writeFixedHex("migratedFunds.tailTransactionHash", TAIL_HASH_LENGTH, object.tailTransactionHash);
        serializeAddress(writeStream, object.address);
        writeStream.writeUInt64("migratedFunds.deposit", BigInt(object.deposit));
    }

    /**
     * The global type for the treasury input.
     */
    const TREASURY_INPUT_TYPE = 1;

    /**
     * The global type for the input.
     */
    const UTXO_INPUT_TYPE = 0;

    // Copyright 2020 IOTA Stiftung
    /**
     * The minimum length of an input binary representation.
     */
    const MIN_INPUT_LENGTH = SMALL_TYPE_LENGTH;
    /**
     * The minimum length of a utxo input binary representation.
     */
    const MIN_UTXO_INPUT_LENGTH = MIN_INPUT_LENGTH + TRANSACTION_ID_LENGTH + UINT16_SIZE;
    /**
     * The minimum length of a treasury input binary representation.
     */
    const MIN_TREASURY_INPUT_LENGTH = MIN_INPUT_LENGTH + TRANSACTION_ID_LENGTH;
    /**
     * The minimum number of inputs.
     */
    const MIN_INPUT_COUNT = 1;
    /**
     * The maximum number of inputs.
     */
    const MAX_INPUT_COUNT = 127;
    /**
     * Deserialize the inputs from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeInputs(readStream) {
        const numInputs = readStream.readUInt16("inputs.numInputs");
        const inputs = [];
        for (let i = 0; i < numInputs; i++) {
            inputs.push(deserializeInput(readStream));
        }
        return inputs;
    }
    /**
     * Serialize the inputs to binary.
     * @param writeStream The stream to write the data to.
     * @param objects The objects to serialize.
     */
    function serializeInputs(writeStream, objects) {
        if (objects.length < MIN_INPUT_COUNT) {
            throw new Error(`The minimum number of inputs is ${MIN_INPUT_COUNT}, you have provided ${objects.length}`);
        }
        if (objects.length > MAX_INPUT_COUNT) {
            throw new Error(`The maximum number of inputs is ${MAX_INPUT_COUNT}, you have provided ${objects.length}`);
        }
        writeStream.writeUInt16("inputs.numInputs", objects.length);
        for (let i = 0; i < objects.length; i++) {
            serializeInput(writeStream, objects[i]);
        }
    }
    /**
     * Deserialize the input from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeInput(readStream) {
        if (!readStream.hasRemaining(MIN_INPUT_LENGTH)) {
            throw new Error(`Input data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_INPUT_LENGTH}`);
        }
        const type = readStream.readByte("input.type", false);
        let input;
        if (type === UTXO_INPUT_TYPE) {
            input = deserializeUTXOInput(readStream);
        }
        else if (type === TREASURY_INPUT_TYPE) {
            input = deserializeTreasuryInput(readStream);
        }
        else {
            throw new Error(`Unrecognized input type ${type}`);
        }
        return input;
    }
    /**
     * Serialize the input to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeInput(writeStream, object) {
        if (object.type === UTXO_INPUT_TYPE) {
            serializeUTXOInput(writeStream, object);
        }
        else if (object.type === TREASURY_INPUT_TYPE) {
            serializeTreasuryInput(writeStream, object);
        }
        else {
            throw new Error(`Unrecognized input type ${object.type}`);
        }
    }
    /**
     * Deserialize the utxo input from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeUTXOInput(readStream) {
        if (!readStream.hasRemaining(MIN_UTXO_INPUT_LENGTH)) {
            throw new Error(`UTXO Input data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_UTXO_INPUT_LENGTH}`);
        }
        const type = readStream.readByte("utxoInput.type");
        if (type !== UTXO_INPUT_TYPE) {
            throw new Error(`Type mismatch in utxoInput ${type}`);
        }
        const transactionId = readStream.readFixedHex("utxoInput.transactionId", TRANSACTION_ID_LENGTH);
        const transactionOutputIndex = readStream.readUInt16("utxoInput.transactionOutputIndex");
        return {
            type: UTXO_INPUT_TYPE,
            transactionId,
            transactionOutputIndex
        };
    }
    /**
     * Serialize the utxo input to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeUTXOInput(writeStream, object) {
        writeStream.writeByte("utxoInput.type", object.type);
        writeStream.writeFixedHex("utxoInput.transactionId", TRANSACTION_ID_LENGTH, object.transactionId);
        writeStream.writeUInt16("utxoInput.transactionOutputIndex", object.transactionOutputIndex);
    }
    /**
     * Deserialize the treasury input from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeTreasuryInput(readStream) {
        if (!readStream.hasRemaining(MIN_TREASURY_INPUT_LENGTH)) {
            throw new Error(`Treasury Input data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TREASURY_INPUT_LENGTH}`);
        }
        const type = readStream.readByte("treasuryInput.type");
        if (type !== TREASURY_INPUT_TYPE) {
            throw new Error(`Type mismatch in treasuryInput ${type}`);
        }
        const milestoneId = readStream.readFixedHex("treasuryInput.milestoneId", TRANSACTION_ID_LENGTH);
        return {
            type: TREASURY_INPUT_TYPE,
            milestoneId
        };
    }
    /**
     * Serialize the treasury input to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeTreasuryInput(writeStream, object) {
        writeStream.writeByte("treasuryInput.type", object.type);
        writeStream.writeFixedHex("treasuryInput.milestoneId", TRANSACTION_ID_LENGTH, object.milestoneId);
    }

    /**
     * The global type for the payload.
     */
    const INDEXATION_PAYLOAD_TYPE = 2;

    /**
     * The global type for the payload.
     */
    const MILESTONE_PAYLOAD_TYPE = 1;

    /**
     * The global type for the payload.
     */
    const RECEIPT_PAYLOAD_TYPE = 3;

    /**
     * The global type for the payload.
     */
    const TRANSACTION_PAYLOAD_TYPE = 0;

    /**
     * The global type for the payload.
     */
    const TREASURY_TRANSACTION_PAYLOAD_TYPE = 4;

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /* eslint-disable no-bitwise */
    /**
     * Class to help with Sha512 scheme
     * TypeScript conversion from https://github.com/emn178/js-sha512.
     */
    class Sha512 {
        /**
         * Create a new instance of Sha512.
         * @param bits The number of bits.
         */
        constructor(bits = Sha512.SIZE_512) {
            /**
             * Blocks.
             * @internal
             */
            this._blocks = [];
            if (bits !== Sha512.SIZE_224 &&
                bits !== Sha512.SIZE_256 &&
                bits !== Sha512.SIZE_384 &&
                bits !== Sha512.SIZE_512) {
                throw new Error("Only 224, 256, 384 or 512 bits are supported");
            }
            this._blocks = [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ];
            if (bits === Sha512.SIZE_384) {
                this._h0h = 0xCBBB9D5D;
                this._h0l = 0xC1059ED8;
                this._h1h = 0x629A292A;
                this._h1l = 0x367CD507;
                this._h2h = 0x9159015A;
                this._h2l = 0x3070DD17;
                this._h3h = 0x152FECD8;
                this._h3l = 0xF70E5939;
                this._h4h = 0x67332667;
                this._h4l = 0xFFC00B31;
                this._h5h = 0x8EB44A87;
                this._h5l = 0x68581511;
                this._h6h = 0xDB0C2E0D;
                this._h6l = 0x64F98FA7;
                this._h7h = 0x47B5481D;
                this._h7l = 0xBEFA4FA4;
            }
            else if (bits === Sha512.SIZE_256) {
                this._h0h = 0x22312194;
                this._h0l = 0xFC2BF72C;
                this._h1h = 0x9F555FA3;
                this._h1l = 0xC84C64C2;
                this._h2h = 0x2393B86B;
                this._h2l = 0x6F53B151;
                this._h3h = 0x96387719;
                this._h3l = 0x5940EABD;
                this._h4h = 0x96283EE2;
                this._h4l = 0xA88EFFE3;
                this._h5h = 0xBE5E1E25;
                this._h5l = 0x53863992;
                this._h6h = 0x2B0199FC;
                this._h6l = 0x2C85B8AA;
                this._h7h = 0x0EB72DDC;
                this._h7l = 0x81C52CA2;
            }
            else if (bits === Sha512.SIZE_224) {
                this._h0h = 0x8C3D37C8;
                this._h0l = 0x19544DA2;
                this._h1h = 0x73E19966;
                this._h1l = 0x89DCD4D6;
                this._h2h = 0x1DFAB7AE;
                this._h2l = 0x32FF9C82;
                this._h3h = 0x679DD514;
                this._h3l = 0x582F9FCF;
                this._h4h = 0x0F6D2B69;
                this._h4l = 0x7BD44DA8;
                this._h5h = 0x77E36F73;
                this._h5l = 0x04C48942;
                this._h6h = 0x3F9D85A8;
                this._h6l = 0x6A1D36C8;
                this._h7h = 0x1112E6AD;
                this._h7l = 0x91D692A1;
            }
            else { // 512
                this._h0h = 0x6A09E667;
                this._h0l = 0xF3BCC908;
                this._h1h = 0xBB67AE85;
                this._h1l = 0x84CAA73B;
                this._h2h = 0x3C6EF372;
                this._h2l = 0xFE94F82B;
                this._h3h = 0xA54FF53A;
                this._h3l = 0x5F1D36F1;
                this._h4h = 0x510E527F;
                this._h4l = 0xADE682D1;
                this._h5h = 0x9B05688C;
                this._h5l = 0x2B3E6C1F;
                this._h6h = 0x1F83D9AB;
                this._h6l = 0xFB41BD6B;
                this._h7h = 0x5BE0CD19;
                this._h7l = 0x137E2179;
            }
            this._bits = bits;
            this._block = 0;
            this._start = 0;
            this._bytes = 0;
            this._hBytes = 0;
            this._lastByteIndex = 0;
            this._finalized = false;
            this._hashed = false;
        }
        /**
         * Perform Sum 512 on the data.
         * @param data The data to operate on.
         * @returns The sum 512 of the data.
         */
        static sum512(data) {
            const b2b = new Sha512(Sha512.SIZE_512);
            b2b.update(data);
            return b2b.digest();
        }
        /**
         * Update the hash with the data.
         * @param message The data to update the hash with.
         * @returns The instance for chaining.
         */
        update(message) {
            if (this._finalized) {
                throw new Error("The hash has already been finalized.");
            }
            let index = 0;
            let i;
            const length = message.length;
            const blocks = this._blocks;
            while (index < length) {
                if (this._hashed) {
                    this._hashed = false;
                    blocks[0] = this._block;
                    blocks[1] = 0;
                    blocks[2] = 0;
                    blocks[3] = 0;
                    blocks[4] = 0;
                    blocks[5] = 0;
                    blocks[6] = 0;
                    blocks[7] = 0;
                    blocks[8] = 0;
                    blocks[9] = 0;
                    blocks[10] = 0;
                    blocks[11] = 0;
                    blocks[12] = 0;
                    blocks[13] = 0;
                    blocks[14] = 0;
                    blocks[15] = 0;
                    blocks[16] = 0;
                    blocks[17] = 0;
                    blocks[18] = 0;
                    blocks[19] = 0;
                    blocks[20] = 0;
                    blocks[21] = 0;
                    blocks[22] = 0;
                    blocks[23] = 0;
                    blocks[24] = 0;
                    blocks[25] = 0;
                    blocks[26] = 0;
                    blocks[27] = 0;
                    blocks[28] = 0;
                    blocks[29] = 0;
                    blocks[30] = 0;
                    blocks[31] = 0;
                    blocks[32] = 0;
                }
                for (i = this._start; index < length && i < 128; ++index) {
                    blocks[i >> 2] |= message[index] << Sha512.SHIFT[i++ & 3];
                }
                this._lastByteIndex = i;
                this._bytes += i - this._start;
                if (i >= 128) {
                    this._block = blocks[32];
                    this._start = i - 128;
                    this.hash();
                    this._hashed = true;
                }
                else {
                    this._start = i;
                }
            }
            if (this._bytes > 4294967295) {
                this._hBytes += Math.trunc(this._bytes / 4294967296);
                this._bytes %= 4294967296;
            }
            return this;
        }
        /**
         * Get the digest.
         * @returns The digest.
         */
        digest() {
            this.finalize();
            const h0h = this._h0h;
            const h0l = this._h0l;
            const h1h = this._h1h;
            const h1l = this._h1l;
            const h2h = this._h2h;
            const h2l = this._h2l;
            const h3h = this._h3h;
            const h3l = this._h3l;
            const h4h = this._h4h;
            const h4l = this._h4l;
            const h5h = this._h5h;
            const h5l = this._h5l;
            const h6h = this._h6h;
            const h6l = this._h6l;
            const h7h = this._h7h;
            const h7l = this._h7l;
            const bits = this._bits;
            const arr = [
                (h0h >> 24) & 0xFF, (h0h >> 16) & 0xFF, (h0h >> 8) & 0xFF, h0h & 0xFF,
                (h0l >> 24) & 0xFF, (h0l >> 16) & 0xFF, (h0l >> 8) & 0xFF, h0l & 0xFF,
                (h1h >> 24) & 0xFF, (h1h >> 16) & 0xFF, (h1h >> 8) & 0xFF, h1h & 0xFF,
                (h1l >> 24) & 0xFF, (h1l >> 16) & 0xFF, (h1l >> 8) & 0xFF, h1l & 0xFF,
                (h2h >> 24) & 0xFF, (h2h >> 16) & 0xFF, (h2h >> 8) & 0xFF, h2h & 0xFF,
                (h2l >> 24) & 0xFF, (h2l >> 16) & 0xFF, (h2l >> 8) & 0xFF, h2l & 0xFF,
                (h3h >> 24) & 0xFF, (h3h >> 16) & 0xFF, (h3h >> 8) & 0xFF, h3h & 0xFF
            ];
            if (bits >= Sha512.SIZE_256) {
                arr.push((h3l >> 24) & 0xFF, (h3l >> 16) & 0xFF, (h3l >> 8) & 0xFF, h3l & 0xFF);
            }
            if (bits >= Sha512.SIZE_384) {
                arr.push((h4h >> 24) & 0xFF, (h4h >> 16) & 0xFF, (h4h >> 8) & 0xFF, h4h & 0xFF, (h4l >> 24) & 0xFF, (h4l >> 16) & 0xFF, (h4l >> 8) & 0xFF, h4l & 0xFF, (h5h >> 24) & 0xFF, (h5h >> 16) & 0xFF, (h5h >> 8) & 0xFF, h5h & 0xFF, (h5l >> 24) & 0xFF, (h5l >> 16) & 0xFF, (h5l >> 8) & 0xFF, h5l & 0xFF);
            }
            if (bits === Sha512.SIZE_512) {
                arr.push((h6h >> 24) & 0xFF, (h6h >> 16) & 0xFF, (h6h >> 8) & 0xFF, h6h & 0xFF, (h6l >> 24) & 0xFF, (h6l >> 16) & 0xFF, (h6l >> 8) & 0xFF, h6l & 0xFF, (h7h >> 24) & 0xFF, (h7h >> 16) & 0xFF, (h7h >> 8) & 0xFF, h7h & 0xFF, (h7l >> 24) & 0xFF, (h7l >> 16) & 0xFF, (h7l >> 8) & 0xFF, h7l & 0xFF);
            }
            return Uint8Array.from(arr);
        }
        /**
         * Finalize the hash.
         * @internal
         */
        finalize() {
            if (this._finalized) {
                return;
            }
            this._finalized = true;
            const blocks = this._blocks;
            const i = this._lastByteIndex;
            blocks[32] = this._block;
            blocks[i >> 2] |= Sha512.EXTRA[i & 3];
            this._block = blocks[32];
            if (i >= 112) {
                if (!this._hashed) {
                    this.hash();
                }
                blocks[0] = this._block;
                blocks[1] = 0;
                blocks[2] = 0;
                blocks[3] = 0;
                blocks[4] = 0;
                blocks[5] = 0;
                blocks[6] = 0;
                blocks[7] = 0;
                blocks[8] = 0;
                blocks[9] = 0;
                blocks[10] = 0;
                blocks[11] = 0;
                blocks[12] = 0;
                blocks[13] = 0;
                blocks[14] = 0;
                blocks[15] = 0;
                blocks[16] = 0;
                blocks[17] = 0;
                blocks[18] = 0;
                blocks[19] = 0;
                blocks[20] = 0;
                blocks[21] = 0;
                blocks[22] = 0;
                blocks[23] = 0;
                blocks[24] = 0;
                blocks[25] = 0;
                blocks[26] = 0;
                blocks[27] = 0;
                blocks[28] = 0;
                blocks[29] = 0;
                blocks[30] = 0;
                blocks[31] = 0;
                blocks[32] = 0;
            }
            blocks[30] = (this._hBytes << 3) | (this._bytes >>> 29);
            blocks[31] = this._bytes << 3;
            this.hash();
        }
        /**
         * Perform the hash.
         * @internal
         */
        hash() {
            const h0h = this._h0h;
            const h0l = this._h0l;
            const h1h = this._h1h;
            const h1l = this._h1l;
            const h2h = this._h2h;
            const h2l = this._h2l;
            const h3h = this._h3h;
            const h3l = this._h3l;
            const h4h = this._h4h;
            const h4l = this._h4l;
            const h5h = this._h5h;
            const h5l = this._h5l;
            const h6h = this._h6h;
            const h6l = this._h6l;
            const h7h = this._h7h;
            const h7l = this._h7l;
            const blocks = this._blocks;
            let j;
            let s0h;
            let s0l;
            let s1h;
            let s1l;
            let c1;
            let c2;
            let c3;
            let c4;
            let abh;
            let abl;
            let dah;
            let dal;
            let cdh;
            let cdl;
            let bch;
            let bcl;
            let majh;
            let majl;
            let t1h;
            let t1l;
            let t2h;
            let t2l;
            let chh;
            let chl;
            for (j = 32; j < 160; j += 2) {
                t1h = blocks[j - 30];
                t1l = blocks[j - 29];
                s0h = ((t1h >>> 1) | (t1l << 31)) ^ ((t1h >>> 8) | (t1l << 24)) ^ (t1h >>> 7);
                s0l = ((t1l >>> 1) | (t1h << 31)) ^ ((t1l >>> 8) | (t1h << 24)) ^ ((t1l >>> 7) | (t1h << 25));
                t1h = blocks[j - 4];
                t1l = blocks[j - 3];
                s1h = ((t1h >>> 19) | (t1l << 13)) ^ ((t1l >>> 29) | (t1h << 3)) ^ (t1h >>> 6);
                s1l = ((t1l >>> 19) | (t1h << 13)) ^ ((t1h >>> 29) | (t1l << 3)) ^ ((t1l >>> 6) | (t1h << 26));
                t1h = blocks[j - 32];
                t1l = blocks[j - 31];
                t2h = blocks[j - 14];
                t2l = blocks[j - 13];
                c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (s0l & 0xFFFF) + (s1l & 0xFFFF);
                c2 = (t2l >>> 16) + (t1l >>> 16) + (s0l >>> 16) + (s1l >>> 16) + (c1 >>> 16);
                c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (s0h & 0xFFFF) + (s1h & 0xFFFF) + (c2 >>> 16);
                c4 = (t2h >>> 16) + (t1h >>> 16) + (s0h >>> 16) + (s1h >>> 16) + (c3 >>> 16);
                blocks[j] = (c4 << 16) | (c3 & 0xFFFF);
                blocks[j + 1] = (c2 << 16) | (c1 & 0xFFFF);
            }
            let ah = h0h;
            let al = h0l;
            let bh = h1h;
            let bl = h1l;
            let ch = h2h;
            let cl = h2l;
            let dh = h3h;
            let dl = h3l;
            let eh = h4h;
            let el = h4l;
            let fh = h5h;
            let fl = h5l;
            let gh = h6h;
            let gl = h6l;
            let hh = h7h;
            let hl = h7l;
            bch = bh & ch;
            bcl = bl & cl;
            for (j = 0; j < 160; j += 8) {
                s0h = ((ah >>> 28) | (al << 4)) ^ ((al >>> 2) | (ah << 30)) ^ ((al >>> 7) | (ah << 25));
                s0l = ((al >>> 28) | (ah << 4)) ^ ((ah >>> 2) | (al << 30)) ^ ((ah >>> 7) | (al << 25));
                s1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((el >>> 9) | (eh << 23));
                s1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((eh >>> 9) | (el << 23));
                abh = ah & bh;
                abl = al & bl;
                majh = abh ^ (ah & ch) ^ bch;
                majl = abl ^ (al & cl) ^ bcl;
                chh = (eh & fh) ^ (~eh & gh);
                chl = (el & fl) ^ (~el & gl);
                t1h = blocks[j];
                t1l = blocks[j + 1];
                t2h = Sha512.K[j];
                t2l = Sha512.K[j + 1];
                c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (hl & 0xFFFF);
                c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (hl >>> 16) + (c1 >>> 16);
                c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (hh & 0xFFFF) + (c2 >>> 16);
                c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (hh >>> 16) + (c3 >>> 16);
                t1h = (c4 << 16) | (c3 & 0xFFFF);
                t1l = (c2 << 16) | (c1 & 0xFFFF);
                c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
                c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
                c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
                c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);
                t2h = (c4 << 16) | (c3 & 0xFFFF);
                t2l = (c2 << 16) | (c1 & 0xFFFF);
                c1 = (dl & 0xFFFF) + (t1l & 0xFFFF);
                c2 = (dl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
                c3 = (dh & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
                c4 = (dh >>> 16) + (t1h >>> 16) + (c3 >>> 16);
                hh = (c4 << 16) | (c3 & 0xFFFF);
                hl = (c2 << 16) | (c1 & 0xFFFF);
                c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
                c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
                c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
                c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);
                dh = (c4 << 16) | (c3 & 0xFFFF);
                dl = (c2 << 16) | (c1 & 0xFFFF);
                s0h = ((dh >>> 28) | (dl << 4)) ^ ((dl >>> 2) | (dh << 30)) ^ ((dl >>> 7) | (dh << 25));
                s0l = ((dl >>> 28) | (dh << 4)) ^ ((dh >>> 2) | (dl << 30)) ^ ((dh >>> 7) | (dl << 25));
                s1h = ((hh >>> 14) | (hl << 18)) ^ ((hh >>> 18) | (hl << 14)) ^ ((hl >>> 9) | (hh << 23));
                s1l = ((hl >>> 14) | (hh << 18)) ^ ((hl >>> 18) | (hh << 14)) ^ ((hh >>> 9) | (hl << 23));
                dah = dh & ah;
                dal = dl & al;
                majh = dah ^ (dh & bh) ^ abh;
                majl = dal ^ (dl & bl) ^ abl;
                chh = (hh & eh) ^ (~hh & fh);
                chl = (hl & el) ^ (~hl & fl);
                t1h = blocks[j + 2];
                t1l = blocks[j + 3];
                t2h = Sha512.K[j + 2];
                t2l = Sha512.K[j + 3];
                c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (gl & 0xFFFF);
                c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (gl >>> 16) + (c1 >>> 16);
                c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (gh & 0xFFFF) + (c2 >>> 16);
                c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (gh >>> 16) + (c3 >>> 16);
                t1h = (c4 << 16) | (c3 & 0xFFFF);
                t1l = (c2 << 16) | (c1 & 0xFFFF);
                c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
                c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
                c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
                c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);
                t2h = (c4 << 16) | (c3 & 0xFFFF);
                t2l = (c2 << 16) | (c1 & 0xFFFF);
                c1 = (cl & 0xFFFF) + (t1l & 0xFFFF);
                c2 = (cl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
                c3 = (ch & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
                c4 = (ch >>> 16) + (t1h >>> 16) + (c3 >>> 16);
                gh = (c4 << 16) | (c3 & 0xFFFF);
                gl = (c2 << 16) | (c1 & 0xFFFF);
                c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
                c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
                c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
                c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);
                ch = (c4 << 16) | (c3 & 0xFFFF);
                cl = (c2 << 16) | (c1 & 0xFFFF);
                s0h = ((ch >>> 28) | (cl << 4)) ^ ((cl >>> 2) | (ch << 30)) ^ ((cl >>> 7) | (ch << 25));
                s0l = ((cl >>> 28) | (ch << 4)) ^ ((ch >>> 2) | (cl << 30)) ^ ((ch >>> 7) | (cl << 25));
                s1h = ((gh >>> 14) | (gl << 18)) ^ ((gh >>> 18) | (gl << 14)) ^ ((gl >>> 9) | (gh << 23));
                s1l = ((gl >>> 14) | (gh << 18)) ^ ((gl >>> 18) | (gh << 14)) ^ ((gh >>> 9) | (gl << 23));
                cdh = ch & dh;
                cdl = cl & dl;
                majh = cdh ^ (ch & ah) ^ dah;
                majl = cdl ^ (cl & al) ^ dal;
                chh = (gh & hh) ^ (~gh & eh);
                chl = (gl & hl) ^ (~gl & el);
                t1h = blocks[j + 4];
                t1l = blocks[j + 5];
                t2h = Sha512.K[j + 4];
                t2l = Sha512.K[j + 5];
                c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (fl & 0xFFFF);
                c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (fl >>> 16) + (c1 >>> 16);
                c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (fh & 0xFFFF) + (c2 >>> 16);
                c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (fh >>> 16) + (c3 >>> 16);
                t1h = (c4 << 16) | (c3 & 0xFFFF);
                t1l = (c2 << 16) | (c1 & 0xFFFF);
                c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
                c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
                c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
                c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);
                t2h = (c4 << 16) | (c3 & 0xFFFF);
                t2l = (c2 << 16) | (c1 & 0xFFFF);
                c1 = (bl & 0xFFFF) + (t1l & 0xFFFF);
                c2 = (bl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
                c3 = (bh & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
                c4 = (bh >>> 16) + (t1h >>> 16) + (c3 >>> 16);
                fh = (c4 << 16) | (c3 & 0xFFFF);
                fl = (c2 << 16) | (c1 & 0xFFFF);
                c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
                c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
                c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
                c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);
                bh = (c4 << 16) | (c3 & 0xFFFF);
                bl = (c2 << 16) | (c1 & 0xFFFF);
                s0h = ((bh >>> 28) | (bl << 4)) ^ ((bl >>> 2) | (bh << 30)) ^ ((bl >>> 7) | (bh << 25));
                s0l = ((bl >>> 28) | (bh << 4)) ^ ((bh >>> 2) | (bl << 30)) ^ ((bh >>> 7) | (bl << 25));
                s1h = ((fh >>> 14) | (fl << 18)) ^ ((fh >>> 18) | (fl << 14)) ^ ((fl >>> 9) | (fh << 23));
                s1l = ((fl >>> 14) | (fh << 18)) ^ ((fl >>> 18) | (fh << 14)) ^ ((fh >>> 9) | (fl << 23));
                bch = bh & ch;
                bcl = bl & cl;
                majh = bch ^ (bh & dh) ^ cdh;
                majl = bcl ^ (bl & dl) ^ cdl;
                chh = (fh & gh) ^ (~fh & hh);
                chl = (fl & gl) ^ (~fl & hl);
                t1h = blocks[j + 6];
                t1l = blocks[j + 7];
                t2h = Sha512.K[j + 6];
                t2l = Sha512.K[j + 7];
                c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (el & 0xFFFF);
                c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (el >>> 16) + (c1 >>> 16);
                c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (eh & 0xFFFF) + (c2 >>> 16);
                c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (eh >>> 16) + (c3 >>> 16);
                t1h = (c4 << 16) | (c3 & 0xFFFF);
                t1l = (c2 << 16) | (c1 & 0xFFFF);
                c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
                c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
                c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
                c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);
                t2h = (c4 << 16) | (c3 & 0xFFFF);
                t2l = (c2 << 16) | (c1 & 0xFFFF);
                c1 = (al & 0xFFFF) + (t1l & 0xFFFF);
                c2 = (al >>> 16) + (t1l >>> 16) + (c1 >>> 16);
                c3 = (ah & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
                c4 = (ah >>> 16) + (t1h >>> 16) + (c3 >>> 16);
                eh = (c4 << 16) | (c3 & 0xFFFF);
                el = (c2 << 16) | (c1 & 0xFFFF);
                c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
                c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
                c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
                c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);
                ah = (c4 << 16) | (c3 & 0xFFFF);
                al = (c2 << 16) | (c1 & 0xFFFF);
            }
            c1 = (h0l & 0xFFFF) + (al & 0xFFFF);
            c2 = (h0l >>> 16) + (al >>> 16) + (c1 >>> 16);
            c3 = (h0h & 0xFFFF) + (ah & 0xFFFF) + (c2 >>> 16);
            c4 = (h0h >>> 16) + (ah >>> 16) + (c3 >>> 16);
            this._h0h = (c4 << 16) | (c3 & 0xFFFF);
            this._h0l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (h1l & 0xFFFF) + (bl & 0xFFFF);
            c2 = (h1l >>> 16) + (bl >>> 16) + (c1 >>> 16);
            c3 = (h1h & 0xFFFF) + (bh & 0xFFFF) + (c2 >>> 16);
            c4 = (h1h >>> 16) + (bh >>> 16) + (c3 >>> 16);
            this._h1h = (c4 << 16) | (c3 & 0xFFFF);
            this._h1l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (h2l & 0xFFFF) + (cl & 0xFFFF);
            c2 = (h2l >>> 16) + (cl >>> 16) + (c1 >>> 16);
            c3 = (h2h & 0xFFFF) + (ch & 0xFFFF) + (c2 >>> 16);
            c4 = (h2h >>> 16) + (ch >>> 16) + (c3 >>> 16);
            this._h2h = (c4 << 16) | (c3 & 0xFFFF);
            this._h2l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (h3l & 0xFFFF) + (dl & 0xFFFF);
            c2 = (h3l >>> 16) + (dl >>> 16) + (c1 >>> 16);
            c3 = (h3h & 0xFFFF) + (dh & 0xFFFF) + (c2 >>> 16);
            c4 = (h3h >>> 16) + (dh >>> 16) + (c3 >>> 16);
            this._h3h = (c4 << 16) | (c3 & 0xFFFF);
            this._h3l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (h4l & 0xFFFF) + (el & 0xFFFF);
            c2 = (h4l >>> 16) + (el >>> 16) + (c1 >>> 16);
            c3 = (h4h & 0xFFFF) + (eh & 0xFFFF) + (c2 >>> 16);
            c4 = (h4h >>> 16) + (eh >>> 16) + (c3 >>> 16);
            this._h4h = (c4 << 16) | (c3 & 0xFFFF);
            this._h4l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (h5l & 0xFFFF) + (fl & 0xFFFF);
            c2 = (h5l >>> 16) + (fl >>> 16) + (c1 >>> 16);
            c3 = (h5h & 0xFFFF) + (fh & 0xFFFF) + (c2 >>> 16);
            c4 = (h5h >>> 16) + (fh >>> 16) + (c3 >>> 16);
            this._h5h = (c4 << 16) | (c3 & 0xFFFF);
            this._h5l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (h6l & 0xFFFF) + (gl & 0xFFFF);
            c2 = (h6l >>> 16) + (gl >>> 16) + (c1 >>> 16);
            c3 = (h6h & 0xFFFF) + (gh & 0xFFFF) + (c2 >>> 16);
            c4 = (h6h >>> 16) + (gh >>> 16) + (c3 >>> 16);
            this._h6h = (c4 << 16) | (c3 & 0xFFFF);
            this._h6l = (c2 << 16) | (c1 & 0xFFFF);
            c1 = (h7l & 0xFFFF) + (hl & 0xFFFF);
            c2 = (h7l >>> 16) + (hl >>> 16) + (c1 >>> 16);
            c3 = (h7h & 0xFFFF) + (hh & 0xFFFF) + (c2 >>> 16);
            c4 = (h7h >>> 16) + (hh >>> 16) + (c3 >>> 16);
            this._h7h = (c4 << 16) | (c3 & 0xFFFF);
            this._h7l = (c2 << 16) | (c1 & 0xFFFF);
        }
    }
    /**
     * Sha512 224.
     */
    Sha512.SIZE_224 = 224;
    /**
     * Sha512 256.
     */
    Sha512.SIZE_256 = 256;
    /**
     * Sha512 384.
     */
    Sha512.SIZE_384 = 384;
    /**
     * Sha512 512.
     */
    Sha512.SIZE_512 = 512;
    /**
     * Extra constants.
     * @internal
     */
    Sha512.EXTRA = [-2147483648, 8388608, 32768, 128];
    /**
     * Shift constants.
     * @internal
     */
    Sha512.SHIFT = [24, 16, 8, 0];
    /**
     * K.
     * @internal
     */
    Sha512.K = Uint32Array.from([
        0x428A2F98, 0xD728AE22, 0x71374491, 0x23EF65CD,
        0xB5C0FBCF, 0xEC4D3B2F, 0xE9B5DBA5, 0x8189DBBC,
        0x3956C25B, 0xF348B538, 0x59F111F1, 0xB605D019,
        0x923F82A4, 0xAF194F9B, 0xAB1C5ED5, 0xDA6D8118,
        0xD807AA98, 0xA3030242, 0x12835B01, 0x45706FBE,
        0x243185BE, 0x4EE4B28C, 0x550C7DC3, 0xD5FFB4E2,
        0x72BE5D74, 0xF27B896F, 0x80DEB1FE, 0x3B1696B1,
        0x9BDC06A7, 0x25C71235, 0xC19BF174, 0xCF692694,
        0xE49B69C1, 0x9EF14AD2, 0xEFBE4786, 0x384F25E3,
        0x0FC19DC6, 0x8B8CD5B5, 0x240CA1CC, 0x77AC9C65,
        0x2DE92C6F, 0x592B0275, 0x4A7484AA, 0x6EA6E483,
        0x5CB0A9DC, 0xBD41FBD4, 0x76F988DA, 0x831153B5,
        0x983E5152, 0xEE66DFAB, 0xA831C66D, 0x2DB43210,
        0xB00327C8, 0x98FB213F, 0xBF597FC7, 0xBEEF0EE4,
        0xC6E00BF3, 0x3DA88FC2, 0xD5A79147, 0x930AA725,
        0x06CA6351, 0xE003826F, 0x14292967, 0x0A0E6E70,
        0x27B70A85, 0x46D22FFC, 0x2E1B2138, 0x5C26C926,
        0x4D2C6DFC, 0x5AC42AED, 0x53380D13, 0x9D95B3DF,
        0x650A7354, 0x8BAF63DE, 0x766A0ABB, 0x3C77B2A8,
        0x81C2C92E, 0x47EDAEE6, 0x92722C85, 0x1482353B,
        0xA2BFE8A1, 0x4CF10364, 0xA81A664B, 0xBC423001,
        0xC24B8B70, 0xD0F89791, 0xC76C51A3, 0x0654BE30,
        0xD192E819, 0xD6EF5218, 0xD6990624, 0x5565A910,
        0xF40E3585, 0x5771202A, 0x106AA070, 0x32BBD1B8,
        0x19A4C116, 0xB8D2D0C8, 0x1E376C08, 0x5141AB53,
        0x2748774C, 0xDF8EEB99, 0x34B0BCB5, 0xE19B48A8,
        0x391C0CB3, 0xC5C95A63, 0x4ED8AA4A, 0xE3418ACB,
        0x5B9CCA4F, 0x7763E373, 0x682E6FF3, 0xD6B2B8A3,
        0x748F82EE, 0x5DEFB2FC, 0x78A5636F, 0x43172F60,
        0x84C87814, 0xA1F0AB72, 0x8CC70208, 0x1A6439EC,
        0x90BEFFFA, 0x23631E28, 0xA4506CEB, 0xDE82BDE9,
        0xBEF9A3F7, 0xB2C67915, 0xC67178F2, 0xE372532B,
        0xCA273ECE, 0xEA26619C, 0xD186B8C7, 0x21C0C207,
        0xEADA7DD6, 0xCDE0EB1E, 0xF57D4F7F, 0xEE6ED178,
        0x06F067AA, 0x72176FBA, 0x0A637DC5, 0xA2C898A6,
        0x113F9804, 0xBEF90DAE, 0x1B710B35, 0x131C471B,
        0x28DB77F5, 0x23047D84, 0x32CAAB7B, 0x40C72493,
        0x3C9EBE0A, 0x15C9BEBC, 0x431D67C4, 0x9C100D4C,
        0x4CC5D4BE, 0xCB3E42B6, 0x597F299C, 0xFC657E2A,
        0x5FCB6FAB, 0x3AD6FAEC, 0x6C44198C, 0x4A475817
    ]);

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /**
     * Class to help with random generation.
     */
    class RandomHelper {
        /**
         * Generate a new random array.
         * @param length The length of buffer to create.
         * @returns The random array.
         */
        static generate(length) {
            {
                // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
                const crypto = require("crypto");
                return crypto.randomBytes(length);
            }
        }
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Helper methods for bigints.
     */
    class BigIntHelper {
        /**
         * Load 3 bytes from array as bigint.
         * @param data The input array.
         * @param byteOffset The start index to read from.
         * @returns The bigint.
         */
        static read3(data, byteOffset) {
            const v0 = (data[byteOffset + 0] +
                (data[byteOffset + 1] << 8) +
                (data[byteOffset + 2] << 16)) >>> 0;
            return BigInt(v0);
        }
        /**
         * Load 4 bytes from array as bigint.
         * @param data The input array.
         * @param byteOffset The start index to read from.
         * @returns The bigint.
         */
        static read4(data, byteOffset) {
            const v0 = (data[byteOffset + 0] +
                (data[byteOffset + 1] << 8) +
                (data[byteOffset + 2] << 16) +
                (data[byteOffset + 3] << 24)) >>> 0;
            return BigInt(v0);
        }
        /**
         * Load 8 bytes from array as bigint.
         * @param data The data to read from.
         * @param byteOffset The start index to read from.
         * @returns The bigint.
         */
        static read8(data, byteOffset) {
            const v0 = (data[byteOffset + 0] +
                (data[byteOffset + 1] << 8) +
                (data[byteOffset + 2] << 16) +
                (data[byteOffset + 3] << 24)) >>> 0;
            const v1 = (data[byteOffset + 4] +
                (data[byteOffset + 5] << 8) +
                (data[byteOffset + 6] << 16) +
                (data[byteOffset + 7] << 24)) >>> 0;
            return (BigInt(v1) << BigIntHelper.BIG_32) | BigInt(v0);
        }
        /**
         * Convert a big int to bytes.
         * @param value The bigint.
         * @param data The buffer to write into.
         * @param byteOffset The start index to write from.
         */
        static write8(value, data, byteOffset) {
            const v0 = Number(value & BigIntHelper.BIG_32_MASK);
            const v1 = Number((value >> BigIntHelper.BIG_32) & BigIntHelper.BIG_32_MASK);
            data[byteOffset] = v0 & 0xFF;
            data[byteOffset + 1] = (v0 >> 8) & 0xFF;
            data[byteOffset + 2] = (v0 >> 16) & 0xFF;
            data[byteOffset + 3] = (v0 >> 24) & 0xFF;
            data[byteOffset + 4] = v1 & 0xFF;
            data[byteOffset + 5] = (v1 >> 8) & 0xFF;
            data[byteOffset + 6] = (v1 >> 16) & 0xFF;
            data[byteOffset + 7] = (v1 >> 24) & 0xFF;
        }
        /**
         * Generate a random bigint.
         * @returns The bitint.
         */
        static random() {
            return BigIntHelper.read8(RandomHelper.generate(8), 0);
        }
    }
    // @internal
    BigIntHelper.BIG_32 = BigInt(32);
    // @internal
    BigIntHelper.BIG_32_MASK = BigInt(0xFFFFFFFF);

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /* eslint-disable no-bitwise */
    /**
     * This is a port of the Go code from https://github.com/hdevalence/ed25519consensus
     * which is an extension of https://github.com/golang/crypto/tree/master/ed25519
     * which is in turn a port of the “ref10” implementation of ed25519 from SUPERCOP.
     */
    // @internal
    const BIG_1_SHIFTL_20 = BigInt(1) << BigInt(20);
    // @internal
    const BIG_1_SHIFTL_24 = BigInt(1) << BigInt(24);
    // @internal
    const BIG_1_SHIFTL_25 = BigInt(1) << BigInt(25);
    // @internal
    const BIG_ARR = [
        BigInt(0), BigInt(1), BigInt(2), BigInt(3), BigInt(4), BigInt(5),
        BigInt(6), BigInt(7), BigInt(8), BigInt(9), BigInt(10), BigInt(11),
        BigInt(12), BigInt(13), BigInt(14), BigInt(15), BigInt(16), BigInt(17),
        BigInt(18), BigInt(19), BigInt(20), BigInt(21), BigInt(22), BigInt(23),
        BigInt(24), BigInt(25), BigInt(26)
    ];
    // @internal
    const BIG_38 = BigInt(38);
    // @internal
    const BIG_666643 = BigInt(666643);
    // @internal
    const BIG_470296 = BigInt(470296);
    // @internal
    const BIG_654183 = BigInt(654183);
    // @internal
    const BIG_997805 = BigInt(997805);
    // @internal
    const BIG_136657 = BigInt(136657);
    // @internal
    const BIG_683901 = BigInt(683901);
    // @internal
    const BIG_2097151 = BigInt(2097151);
    // @internal
    const BIG_8388607 = BigInt(8388607);

    // Copyright 2020 IOTA Stiftung
    /**
     * Class for field element operations.
     * FieldElement represents an element of the field GF(2^255 - 19).  An element
     * t, entries t[0]...t[9], represents the integer t[0]+2^26 t[1]+2^51 t[2]+2^77
     * t[3]+2^102 t[4]+...+2^230 t[9].  Bounds on each t[i] vary depending on
     * context.
     */
    class FieldElement {
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

    // Copyright 2020 IOTA Stiftung
    /**
     * Cached group element.
     */
    class CachedGroupElement {
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

    // Copyright 2020 IOTA Stiftung
    /**
     * Group elements are members of the elliptic curve -x^2 + y^2 = 1 + d * x^2 *
     * y^2 where d = -121665/121666.
     * CompletedGroupElement: ((X:Z),(Y:T)) satisfying x=X/Z, y=Y/T.
     */
    class CompletedGroupElement {
        /**
         * Create a new instance of CompletedGroupElement.
         * @param X The X element.
         * @param Y The Y Element.
         * @param Z The Z Element.
         * @param T The T Element.
         */
        constructor(X, Y, Z, T) {
            this.X = X !== null && X !== void 0 ? X : new FieldElement();
            this.Y = Y !== null && Y !== void 0 ? Y : new FieldElement();
            this.Z = Z !== null && Z !== void 0 ? Z : new FieldElement();
            this.T = T !== null && T !== void 0 ? T : new FieldElement();
        }
        /**
         * Group Element add.
         * @param p The extended group element.
         * @param q The cached group element.
         */
        add(p, q) {
            const t0 = new FieldElement();
            this.X.add(p.Y, p.X);
            this.Y.sub(p.Y, p.X);
            this.Z.mul(this.X, q.yPlusX);
            this.Y.mul(this.Y, q.yMinusX);
            this.T.mul(q.T2d, p.T);
            this.X.mul(p.Z, q.Z);
            t0.add(this.X, this.X);
            this.X.sub(this.Z, this.Y);
            this.Y.add(this.Z, this.Y);
            this.Z.add(t0, this.T);
            this.T.sub(t0, this.T);
        }
        /**
         * Group Element substract.
         * @param p The p.
         * @param q The q.
         */
        sub(p, q) {
            const t0 = new FieldElement();
            this.X.add(p.Y, p.X);
            this.Y.sub(p.Y, p.X);
            this.Z.mul(this.X, q.yMinusX);
            this.Y.mul(this.Y, q.yPlusX);
            this.T.mul(q.T2d, p.T);
            this.X.mul(p.Z, q.Z);
            t0.add(this.X, this.X);
            this.X.sub(this.Z, this.Y);
            this.Y.add(this.Z, this.Y);
            this.Z.sub(t0, this.T);
            this.T.add(t0, this.T);
        }
        /**
         * Mixed add.
         * @param p The p.
         * @param q The q.
         */
        mixedAdd(p, q) {
            const t0 = new FieldElement();
            this.X.add(p.Y, p.X);
            this.Y.sub(p.Y, p.X);
            this.Z.mul(this.X, q.yPlusX);
            this.Y.mul(this.Y, q.yMinusX);
            this.T.mul(q.xy2d, p.T);
            t0.add(p.Z, p.Z);
            this.X.sub(this.Z, this.Y);
            this.Y.add(this.Z, this.Y);
            this.Z.add(t0, this.T);
            this.T.sub(t0, this.T);
        }
        /**
         * Mixed subtract.
         * @param p The p.
         * @param q The q.
         */
        mixedSub(p, q) {
            const t0 = new FieldElement();
            this.X.add(p.Y, p.X);
            this.Y.sub(p.Y, p.X);
            this.Z.mul(this.X, q.yMinusX);
            this.Y.mul(this.Y, q.yPlusX);
            this.T.mul(q.xy2d, p.T);
            t0.add(p.Z, p.Z);
            this.X.sub(this.Z, this.Y);
            this.Y.add(this.Z, this.Y);
            this.Z.sub(t0, this.T);
            this.T.add(t0, this.T);
        }
        /**
         * Convert to projective element.
         * @param p The projective element to fill.
         */
        toProjective(p) {
            p.X.mul(this.X, this.T);
            p.Y.mul(this.Y, this.Z);
            p.Z.mul(this.Z, this.T);
        }
        /**
         * Convert to extended element.
         * @param e The extended element to fill.
         */
        toExtended(e) {
            e.X.mul(this.X, this.T);
            e.Y.mul(this.Y, this.Z);
            e.Z.mul(this.Z, this.T);
            e.T.mul(this.X, this.Y);
        }
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Group elements are members of the elliptic curve -x^2 + y^2 = 1 + d * x^2 *
     * y^2 where d = -121665/121666.
     * PreComputedGroupElement: (y+x,y-x,2dxy).
     */
    class PreComputedGroupElement {
        /**
         * Create a new instance of PreComputedGroupElement.
         * @param yPlusX Y + X Element.
         * @param yMinusX Y - X Element.
         * @param xy2d XY2d Element.
         */
        constructor(yPlusX, yMinusX, xy2d) {
            this.yPlusX = yPlusX !== null && yPlusX !== void 0 ? yPlusX : new FieldElement();
            this.yMinusX = yMinusX !== null && yMinusX !== void 0 ? yMinusX : new FieldElement();
            this.xy2d = xy2d !== null && xy2d !== void 0 ? xy2d : new FieldElement();
        }
        /**
         * Set the elements to zero.
         */
        zero() {
            this.yPlusX.one();
            this.yMinusX.one();
            this.xy2d.zero();
        }
        /**
         * CMove the pre computed element.
         * @param u The u.
         * @param b The b.
         */
        cMove(u, b) {
            this.yPlusX.cMove(u.yPlusX, b);
            this.yMinusX.cMove(u.yMinusX, b);
            this.xy2d.cMove(u.xy2d, b);
        }
        /**
         * Select point.
         * @param pos The position.
         * @param b The index.
         */
        selectPoint(pos, b) {
            const minusT = new PreComputedGroupElement();
            const bNegative = this.negative(b);
            const bAbs = b - (((-bNegative) & b) << 1);
            this.zero();
            for (let i = 0; i < 8; i++) {
                this.cMove(CONST_BASE[pos][i], this.equal(bAbs, i + 1));
            }
            minusT.yPlusX = this.yMinusX.clone();
            minusT.yMinusX = this.yPlusX.clone();
            minusT.xy2d = this.xy2d.clone();
            minusT.xy2d.neg();
            this.cMove(minusT, bNegative);
        }
        /**
         * Negative returns 1 if b < 0 and 0 otherwise.
         * @param b The b.
         * @returns 1 if b < 0 and 0.
         */
        negative(b) {
            return (b >> 31) & 1;
        }
        /**
         * Equal returns 1 if b == c and 0 otherwise, assuming that b and c are
         * non-negative.
         * @param b The b.
         * @param c The c.
         * @returns 1 if b == c and 0.
         */
        equal(b, c) {
            let x = (b ^ c) & 0xFFFFFFFF;
            x--;
            return Math.abs(x >> 31);
        }
    }

    // Copyright 2020 IOTA Stiftung
    // d is a constant in the Edwards curve equation.
    const CONST_D = new FieldElement([-10913610, 13857413, -15372611, 6949391, 114729, -8787816, -6275908, -3247719, -18696448, -12055116]);
    // d2 is 2*d.
    const CONST_D2 = new FieldElement([-21827239, -5839606, -30745221, 13898782, 229458, 15978800, -12551817, -6495438, 29715968, 9444199]);
    // SqrtM1 is the square-root of -1 in the field.
    const CONST_SQRT_M1 = new FieldElement([-32595792, -7943725, 9377950, 3500415, 12389472, -272473, -25146209, -2005654, 326686, 11406482]);
    // A is a constant in the Montgomery-form of curve25519.
    new FieldElement([486662, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    // order is the order of Curve25519 in little-endian form.
    const CONST_ORDER = [BigInt(0x5812631A5CF5D3ED), BigInt(0x14DEF9DEA2F79CD6), BIG_ARR[0], BigInt(0x1000000000000000)];
    // bi contains precomputed multiples of the base-point. See the Ed25519 paper
    // for a discussion about how these values are used.
    const CONST_BI = [
        new PreComputedGroupElement(new FieldElement([25967493, -14356035, 29566456, 3660896, -12694345, 4014787, 27544626, -11754271, -6079156, 2047605]), new FieldElement([-12545711, 934262, -2722910, 3049990, -727428, 9406986, 12720692, 5043384, 19500929, -15469378]), new FieldElement([-8738181, 4489570, 9688441, -14785194, 10184609, -12363380, 29287919, 11864899, -24514362, -4438546])),
        new PreComputedGroupElement(new FieldElement([15636291, -9688557, 24204773, -7912398, 616977, -16685262, 27787600, -14772189, 28944400, -1550024]), new FieldElement([16568933, 4717097, -11556148, -1102322, 15682896, -11807043, 16354577, -11775962, 7689662, 11199574]), new FieldElement([30464156, -5976125, -11779434, -15670865, 23220365, 15915852, 7512774, 10017326, -17749093, -9920357])),
        new PreComputedGroupElement(new FieldElement([10861363, 11473154, 27284546, 1981175, -30064349, 12577861, 32867885, 14515107, -15438304, 10819380]), new FieldElement([4708026, 6336745, 20377586, 9066809, -11272109, 6594696, -25653668, 12483688, -12668491, 5581306]), new FieldElement([19563160, 16186464, -29386857, 4097519, 10237984, -4348115, 28542350, 13850243, -23678021, -15815942])),
        new PreComputedGroupElement(new FieldElement([5153746, 9909285, 1723747, -2777874, 30523605, 5516873, 19480852, 5230134, -23952439, -15175766]), new FieldElement([-30269007, -3463509, 7665486, 10083793, 28475525, 1649722, 20654025, 16520125, 30598449, 7715701]), new FieldElement([28881845, 14381568, 9657904, 3680757, -20181635, 7843316, -31400660, 1370708, 29794553, -1409300])),
        new PreComputedGroupElement(new FieldElement([-22518993, -6692182, 14201702, -8745502, -23510406, 8844726, 18474211, -1361450, -13062696, 13821877]), new FieldElement([-6455177, -7839871, 3374702, -4740862, -27098617, -10571707, 31655028, -7212327, 18853322, -14220951]), new FieldElement([4566830, -12963868, -28974889, -12240689, -7602672, -2830569, -8514358, -10431137, 2207753, -3209784])),
        new PreComputedGroupElement(new FieldElement([-25154831, -4185821, 29681144, 7868801, -6854661, -9423865, -12437364, -663000, -31111463, -16132436]), new FieldElement([25576264, -2703214, 7349804, -11814844, 16472782, 9300885, 3844789, 15725684, 171356, 6466918]), new FieldElement([23103977, 13316479, 9739013, -16149481, 817875, -15038942, 8965339, -14088058, -30714912, 16193877])),
        new PreComputedGroupElement(new FieldElement([-33521811, 3180713, -2394130, 14003687, -16903474, -16270840, 17238398, 4729455, -18074513, 9256800]), new FieldElement([-25182317, -4174131, 32336398, 5036987, -21236817, 11360617, 22616405, 9761698, -19827198, 630305]), new FieldElement([-13720693, 2639453, -24237460, -7406481, 9494427, -5774029, -6554551, -15960994, -2449256, -14291300])),
        new PreComputedGroupElement(new FieldElement([-3151181, -5046075, 9282714, 6866145, -31907062, -863023, -18940575, 15033784, 25105118, -7894876]), new FieldElement([-24326370, 15950226, -31801215, -14592823, -11662737, -5090925, 1573892, -2625887, 2198790, -15804619]), new FieldElement([-3099351, 10324967, -2241613, 7453183, -5446979, -2735503, -13812022, -16236442, -32461234, -12290683]))
    ];
    // base contains precomputed multiples of the base-point. See the Ed25519 paper
    // for a discussion about how these values are used.
    const CONST_BASE = [
        [
            new PreComputedGroupElement(new FieldElement([25967493, -14356035, 29566456, 3660896, -12694345, 4014787, 27544626, -11754271, -6079156, 2047605]), new FieldElement([-12545711, 934262, -2722910, 3049990, -727428, 9406986, 12720692, 5043384, 19500929, -15469378]), new FieldElement([-8738181, 4489570, 9688441, -14785194, 10184609, -12363380, 29287919, 11864899, -24514362, -4438546])),
            new PreComputedGroupElement(new FieldElement([-12815894, -12976347, -21581243, 11784320, -25355658, -2750717, -11717903, -3814571, -358445, -10211303]), new FieldElement([-21703237, 6903825, 27185491, 6451973, -29577724, -9554005, -15616551, 11189268, -26829678, -5319081]), new FieldElement([26966642, 11152617, 32442495, 15396054, 14353839, -12752335, -3128826, -9541118, -15472047, -4166697])),
            new PreComputedGroupElement(new FieldElement([15636291, -9688557, 24204773, -7912398, 616977, -16685262, 27787600, -14772189, 28944400, -1550024]), new FieldElement([16568933, 4717097, -11556148, -1102322, 15682896, -11807043, 16354577, -11775962, 7689662, 11199574]), new FieldElement([30464156, -5976125, -11779434, -15670865, 23220365, 15915852, 7512774, 10017326, -17749093, -9920357])),
            new PreComputedGroupElement(new FieldElement([-17036878, 13921892, 10945806, -6033431, 27105052, -16084379, -28926210, 15006023, 3284568, -6276540]), new FieldElement([23599295, -8306047, -11193664, -7687416, 13236774, 10506355, 7464579, 9656445, 13059162, 10374397]), new FieldElement([7798556, 16710257, 3033922, 2874086, 28997861, 2835604, 32406664, -3839045, -641708, -101325])),
            new PreComputedGroupElement(new FieldElement([10861363, 11473154, 27284546, 1981175, -30064349, 12577861, 32867885, 14515107, -15438304, 10819380]), new FieldElement([4708026, 6336745, 20377586, 9066809, -11272109, 6594696, -25653668, 12483688, -12668491, 5581306]), new FieldElement([19563160, 16186464, -29386857, 4097519, 10237984, -4348115, 28542350, 13850243, -23678021, -15815942])),
            new PreComputedGroupElement(new FieldElement([-15371964, -12862754, 32573250, 4720197, -26436522, 5875511, -19188627, -15224819, -9818940, -12085777]), new FieldElement([-8549212, 109983, 15149363, 2178705, 22900618, 4543417, 3044240, -15689887, 1762328, 14866737]), new FieldElement([-18199695, -15951423, -10473290, 1707278, -17185920, 3916101, -28236412, 3959421, 27914454, 4383652])),
            new PreComputedGroupElement(new FieldElement([5153746, 9909285, 1723747, -2777874, 30523605, 5516873, 19480852, 5230134, -23952439, -15175766]), new FieldElement([-30269007, -3463509, 7665486, 10083793, 28475525, 1649722, 20654025, 16520125, 30598449, 7715701]), new FieldElement([28881845, 14381568, 9657904, 3680757, -20181635, 7843316, -31400660, 1370708, 29794553, -1409300])),
            new PreComputedGroupElement(new FieldElement([14499471, -2729599, -33191113, -4254652, 28494862, 14271267, 30290735, 10876454, -33154098, 2381726]), new FieldElement([-7195431, -2655363, -14730155, 462251, -27724326, 3941372, -6236617, 3696005, -32300832, 15351955]), new FieldElement([27431194, 8222322, 16448760, -3907995, -18707002, 11938355, -32961401, -2970515, 29551813, 10109425]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-13657040, -13155431, -31283750, 11777098, 21447386, 6519384, -2378284, -1627556, 10092783, -4764171]), new FieldElement([27939166, 14210322, 4677035, 16277044, -22964462, -12398139, -32508754, 12005538, -17810127, 12803510]), new FieldElement([17228999, -15661624, -1233527, 300140, -1224870, -11714777, 30364213, -9038194, 18016357, 4397660])),
            new PreComputedGroupElement(new FieldElement([-10958843, -7690207, 4776341, -14954238, 27850028, -15602212, -26619106, 14544525, -17477504, 982639]), new FieldElement([29253598, 15796703, -2863982, -9908884, 10057023, 3163536, 7332899, -4120128, -21047696, 9934963]), new FieldElement([5793303, 16271923, -24131614, -10116404, 29188560, 1206517, -14747930, 4559895, -30123922, -10897950])),
            new PreComputedGroupElement(new FieldElement([-27643952, -11493006, 16282657, -11036493, 28414021, -15012264, 24191034, 4541697, -13338309, 5500568]), new FieldElement([12650548, -1497113, 9052871, 11355358, -17680037, -8400164, -17430592, 12264343, 10874051, 13524335]), new FieldElement([25556948, -3045990, 714651, 2510400, 23394682, -10415330, 33119038, 5080568, -22528059, 5376628])),
            new PreComputedGroupElement(new FieldElement([-26088264, -4011052, -17013699, -3537628, -6726793, 1920897, -22321305, -9447443, 4535768, 1569007]), new FieldElement([-2255422, 14606630, -21692440, -8039818, 28430649, 8775819, -30494562, 3044290, 31848280, 12543772]), new FieldElement([-22028579, 2943893, -31857513, 6777306, 13784462, -4292203, -27377195, -2062731, 7718482, 14474653])),
            new PreComputedGroupElement(new FieldElement([2385315, 2454213, -22631320, 46603, -4437935, -15680415, 656965, -7236665, 24316168, -5253567]), new FieldElement([13741529, 10911568, -33233417, -8603737, -20177830, -1033297, 33040651, -13424532, -20729456, 8321686]), new FieldElement([21060490, -2212744, 15712757, -4336099, 1639040, 10656336, 23845965, -11874838, -9984458, 608372])),
            new PreComputedGroupElement(new FieldElement([-13672732, -15087586, -10889693, -7557059, -6036909, 11305547, 1123968, -6780577, 27229399, 23887]), new FieldElement([-23244140, -294205, -11744728, 14712571, -29465699, -2029617, 12797024, -6440308, -1633405, 16678954]), new FieldElement([-29500620, 4770662, -16054387, 14001338, 7830047, 9564805, -1508144, -4795045, -17169265, 4904953])),
            new PreComputedGroupElement(new FieldElement([24059557, 14617003, 19037157, -15039908, 19766093, -14906429, 5169211, 16191880, 2128236, -4326833]), new FieldElement([-16981152, 4124966, -8540610, -10653797, 30336522, -14105247, -29806336, 916033, -6882542, -2986532]), new FieldElement([-22630907, 12419372, -7134229, -7473371, -16478904, 16739175, 285431, 2763829, 15736322, 4143876])),
            new PreComputedGroupElement(new FieldElement([2379352, 11839345, -4110402, -5988665, 11274298, 794957, 212801, -14594663, 23527084, -16458268]), new FieldElement([33431127, -11130478, -17838966, -15626900, 8909499, 8376530, -32625340, 4087881, -15188911, -14416214]), new FieldElement([1767683, 7197987, -13205226, -2022635, -13091350, 448826, 5799055, 4357868, -4774191, -16323038]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([6721966, 13833823, -23523388, -1551314, 26354293, -11863321, 23365147, -3949732, 7390890, 2759800]), new FieldElement([4409041, 2052381, 23373853, 10530217, 7676779, -12885954, 21302353, -4264057, 1244380, -12919645]), new FieldElement([-4421239, 7169619, 4982368, -2957590, 30256825, -2777540, 14086413, 9208236, 15886429, 16489664])),
            new PreComputedGroupElement(new FieldElement([1996075, 10375649, 14346367, 13311202, -6874135, -16438411, -13693198, 398369, -30606455, -712933]), new FieldElement([-25307465, 9795880, -2777414, 14878809, -33531835, 14780363, 13348553, 12076947, -30836462, 5113182]), new FieldElement([-17770784, 11797796, 31950843, 13929123, -25888302, 12288344, -30341101, -7336386, 13847711, 5387222])),
            new PreComputedGroupElement(new FieldElement([-18582163, -3416217, 17824843, -2340966, 22744343, -10442611, 8763061, 3617786, -19600662, 10370991]), new FieldElement([20246567, -14369378, 22358229, -543712, 18507283, -10413996, 14554437, -8746092, 32232924, 16763880]), new FieldElement([9648505, 10094563, 26416693, 14745928, -30374318, -6472621, 11094161, 15689506, 3140038, -16510092])),
            new PreComputedGroupElement(new FieldElement([-16160072, 5472695, 31895588, 4744994, 8823515, 10365685, -27224800, 9448613, -28774454, 366295]), new FieldElement([19153450, 11523972, -11096490, -6503142, -24647631, 5420647, 28344573, 8041113, 719605, 11671788]), new FieldElement([8678025, 2694440, -6808014, 2517372, 4964326, 11152271, -15432916, -15266516, 27000813, -10195553])),
            new PreComputedGroupElement(new FieldElement([-15157904, 7134312, 8639287, -2814877, -7235688, 10421742, 564065, 5336097, 6750977, -14521026]), new FieldElement([11836410, -3979488, 26297894, 16080799, 23455045, 15735944, 1695823, -8819122, 8169720, 16220347]), new FieldElement([-18115838, 8653647, 17578566, -6092619, -8025777, -16012763, -11144307, -2627664, -5990708, -14166033])),
            new PreComputedGroupElement(new FieldElement([-23308498, -10968312, 15213228, -10081214, -30853605, -11050004, 27884329, 2847284, 2655861, 1738395]), new FieldElement([-27537433, -14253021, -25336301, -8002780, -9370762, 8129821, 21651608, -3239336, -19087449, -11005278]), new FieldElement([1533110, 3437855, 23735889, 459276, 29970501, 11335377, 26030092, 5821408, 10478196, 8544890])),
            new PreComputedGroupElement(new FieldElement([32173121, -16129311, 24896207, 3921497, 22579056, -3410854, 19270449, 12217473, 17789017, -3395995]), new FieldElement([-30552961, -2228401, -15578829, -10147201, 13243889, 517024, 15479401, -3853233, 30460520, 1052596]), new FieldElement([-11614875, 13323618, 32618793, 8175907, -15230173, 12596687, 27491595, -4612359, 3179268, -9478891])),
            new PreComputedGroupElement(new FieldElement([31947069, -14366651, -4640583, -15339921, -15125977, -6039709, -14756777, -16411740, 19072640, -9511060]), new FieldElement([11685058, 11822410, 3158003, -13952594, 33402194, -4165066, 5977896, -5215017, 473099, 5040608]), new FieldElement([-20290863, 8198642, -27410132, 11602123, 1290375, -2799760, 28326862, 1721092, -19558642, -3131606]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([7881532, 10687937, 7578723, 7738378, -18951012, -2553952, 21820786, 8076149, -27868496, 11538389]), new FieldElement([-19935666, 3899861, 18283497, -6801568, -15728660, -11249211, 8754525, 7446702, -5676054, 5797016]), new FieldElement([-11295600, -3793569, -15782110, -7964573, 12708869, -8456199, 2014099, -9050574, -2369172, -5877341])),
            new PreComputedGroupElement(new FieldElement([-22472376, -11568741, -27682020, 1146375, 18956691, 16640559, 1192730, -3714199, 15123619, 10811505]), new FieldElement([14352098, -3419715, -18942044, 10822655, 32750596, 4699007, -70363, 15776356, -28886779, -11974553]), new FieldElement([-28241164, -8072475, -4978962, -5315317, 29416931, 1847569, -20654173, -16484855, 4714547, -9600655])),
            new PreComputedGroupElement(new FieldElement([15200332, 8368572, 19679101, 15970074, -31872674, 1959451, 24611599, -4543832, -11745876, 12340220]), new FieldElement([12876937, -10480056, 33134381, 6590940, -6307776, 14872440, 9613953, 8241152, 15370987, 9608631]), new FieldElement([-4143277, -12014408, 8446281, -391603, 4407738, 13629032, -7724868, 15866074, -28210621, -8814099])),
            new PreComputedGroupElement(new FieldElement([26660628, -15677655, 8393734, 358047, -7401291, 992988, -23904233, 858697, 20571223, 8420556]), new FieldElement([14620715, 13067227, -15447274, 8264467, 14106269, 15080814, 33531827, 12516406, -21574435, -12476749]), new FieldElement([236881, 10476226, 57258, -14677024, 6472998, 2466984, 17258519, 7256740, 8791136, 15069930])),
            new PreComputedGroupElement(new FieldElement([1276410, -9371918, 22949635, -16322807, -23493039, -5702186, 14711875, 4874229, -30663140, -2331391]), new FieldElement([5855666, 4990204, -13711848, 7294284, -7804282, 1924647, -1423175, -7912378, -33069337, 9234253]), new FieldElement([20590503, -9018988, 31529744, -7352666, -2706834, 10650548, 31559055, -11609587, 18979186, 13396066])),
            new PreComputedGroupElement(new FieldElement([24474287, 4968103, 22267082, 4407354, 24063882, -8325180, -18816887, 13594782, 33514650, 7021958]), new FieldElement([-11566906, -6565505, -21365085, 15928892, -26158305, 4315421, -25948728, -3916677, -21480480, 12868082]), new FieldElement([-28635013, 13504661, 19988037, -2132761, 21078225, 6443208, -21446107, 2244500, -12455797, -8089383])),
            new PreComputedGroupElement(new FieldElement([-30595528, 13793479, -5852820, 319136, -25723172, -6263899, 33086546, 8957937, -15233648, 5540521]), new FieldElement([-11630176, -11503902, -8119500, -7643073, 2620056, 1022908, -23710744, -1568984, -16128528, -14962807]), new FieldElement([23152971, 775386, 27395463, 14006635, -9701118, 4649512, 1689819, 892185, -11513277, -15205948])),
            new PreComputedGroupElement(new FieldElement([9770129, 9586738, 26496094, 4324120, 1556511, -3550024, 27453819, 4763127, -19179614, 5867134]), new FieldElement([-32765025, 1927590, 31726409, -4753295, 23962434, -16019500, 27846559, 5931263, -29749703, -16108455]), new FieldElement([27461885, -2977536, 22380810, 1815854, -23033753, -3031938, 7283490, -15148073, -19526700, 7734629]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-8010264, -9590817, -11120403, 6196038, 29344158, -13430885, 7585295, -3176626, 18549497, 15302069]), new FieldElement([-32658337, -6171222, -7672793, -11051681, 6258878, 13504381, 10458790, -6418461, -8872242, 8424746]), new FieldElement([24687205, 8613276, -30667046, -3233545, 1863892, -1830544, 19206234, 7134917, -11284482, -828919])),
            new PreComputedGroupElement(new FieldElement([11334899, -9218022, 8025293, 12707519, 17523892, -10476071, 10243738, -14685461, -5066034, 16498837]), new FieldElement([8911542, 6887158, -9584260, -6958590, 11145641, -9543680, 17303925, -14124238, 6536641, 10543906]), new FieldElement([-28946384, 15479763, -17466835, 568876, -1497683, 11223454, -2669190, -16625574, -27235709, 8876771])),
            new PreComputedGroupElement(new FieldElement([-25742899, -12566864, -15649966, -846607, -33026686, -796288, -33481822, 15824474, -604426, -9039817]), new FieldElement([10330056, 70051, 7957388, -9002667, 9764902, 15609756, 27698697, -4890037, 1657394, 3084098]), new FieldElement([10477963, -7470260, 12119566, -13250805, 29016247, -5365589, 31280319, 14396151, -30233575, 15272409])),
            new PreComputedGroupElement(new FieldElement([-12288309, 3169463, 28813183, 16658753, 25116432, -5630466, -25173957, -12636138, -25014757, 1950504]), new FieldElement([-26180358, 9489187, 11053416, -14746161, -31053720, 5825630, -8384306, -8767532, 15341279, 8373727]), new FieldElement([28685821, 7759505, -14378516, -12002860, -31971820, 4079242, 298136, -10232602, -2878207, 15190420])),
            new PreComputedGroupElement(new FieldElement([-32932876, 13806336, -14337485, -15794431, -24004620, 10940928, 8669718, 2742393, -26033313, -6875003]), new FieldElement([-1580388, -11729417, -25979658, -11445023, -17411874, -10912854, 9291594, -16247779, -12154742, 6048605]), new FieldElement([-30305315, 14843444, 1539301, 11864366, 20201677, 1900163, 13934231, 5128323, 11213262, 9168384])),
            new PreComputedGroupElement(new FieldElement([-26280513, 11007847, 19408960, -940758, -18592965, -4328580, -5088060, -11105150, 20470157, -16398701]), new FieldElement([-23136053, 9282192, 14855179, -15390078, -7362815, -14408560, -22783952, 14461608, 14042978, 5230683]), new FieldElement([29969567, -2741594, -16711867, -8552442, 9175486, -2468974, 21556951, 3506042, -5933891, -12449708])),
            new PreComputedGroupElement(new FieldElement([-3144746, 8744661, 19704003, 4581278, -20430686, 6830683, -21284170, 8971513, -28539189, 15326563]), new FieldElement([-19464629, 10110288, -17262528, -3503892, -23500387, 1355669, -15523050, 15300988, -20514118, 9168260]), new FieldElement([-5353335, 4488613, -23803248, 16314347, 7780487, -15638939, -28948358, 9601605, 33087103, -9011387])),
            new PreComputedGroupElement(new FieldElement([-19443170, -15512900, -20797467, -12445323, -29824447, 10229461, -27444329, -15000531, -5996870, 15664672]), new FieldElement([23294591, -16632613, -22650781, -8470978, 27844204, 11461195, 13099750, -2460356, 18151676, 13417686]), new FieldElement([-24722913, -4176517, -31150679, 5988919, -26858785, 6685065, 1661597, -12551441, 15271676, -15452665]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([11433042, -13228665, 8239631, -5279517, -1985436, -725718, -18698764, 2167544, -6921301, -13440182]), new FieldElement([-31436171, 15575146, 30436815, 12192228, -22463353, 9395379, -9917708, -8638997, 12215110, 12028277]), new FieldElement([14098400, 6555944, 23007258, 5757252, -15427832, -12950502, 30123440, 4617780, -16900089, -655628])),
            new PreComputedGroupElement(new FieldElement([-4026201, -15240835, 11893168, 13718664, -14809462, 1847385, -15819999, 10154009, 23973261, -12684474]), new FieldElement([-26531820, -3695990, -1908898, 2534301, -31870557, -16550355, 18341390, -11419951, 32013174, -10103539]), new FieldElement([-25479301, 10876443, -11771086, -14625140, -12369567, 1838104, 21911214, 6354752, 4425632, -837822])),
            new PreComputedGroupElement(new FieldElement([-10433389, -14612966, 22229858, -3091047, -13191166, 776729, -17415375, -12020462, 4725005, 14044970]), new FieldElement([19268650, -7304421, 1555349, 8692754, -21474059, -9910664, 6347390, -1411784, -19522291, -16109756]), new FieldElement([-24864089, 12986008, -10898878, -5558584, -11312371, -148526, 19541418, 8180106, 9282262, 10282508])),
            new PreComputedGroupElement(new FieldElement([-26205082, 4428547, -8661196, -13194263, 4098402, -14165257, 15522535, 8372215, 5542595, -10702683]), new FieldElement([-10562541, 14895633, 26814552, -16673850, -17480754, -2489360, -2781891, 6993761, -18093885, 10114655]), new FieldElement([-20107055, -929418, 31422704, 10427861, -7110749, 6150669, -29091755, -11529146, 25953725, -106158])),
            new PreComputedGroupElement(new FieldElement([-4234397, -8039292, -9119125, 3046000, 2101609, -12607294, 19390020, 6094296, -3315279, 12831125]), new FieldElement([-15998678, 7578152, 5310217, 14408357, -33548620, -224739, 31575954, 6326196, 7381791, -2421839]), new FieldElement([-20902779, 3296811, 24736065, -16328389, 18374254, 7318640, 6295303, 8082724, -15362489, 12339664])),
            new PreComputedGroupElement(new FieldElement([27724736, 2291157, 6088201, -14184798, 1792727, 5857634, 13848414, 15768922, 25091167, 14856294]), new FieldElement([-18866652, 8331043, 24373479, 8541013, -701998, -9269457, 12927300, -12695493, -22182473, -9012899]), new FieldElement([-11423429, -5421590, 11632845, 3405020, 30536730, -11674039, -27260765, 13866390, 30146206, 9142070])),
            new PreComputedGroupElement(new FieldElement([3924129, -15307516, -13817122, -10054960, 12291820, -668366, -27702774, 9326384, -8237858, 4171294]), new FieldElement([-15921940, 16037937, 6713787, 16606682, -21612135, 2790944, 26396185, 3731949, 345228, -5462949]), new FieldElement([-21327538, 13448259, 25284571, 1143661, 20614966, -8849387, 2031539, -12391231, -16253183, -13582083])),
            new PreComputedGroupElement(new FieldElement([31016211, -16722429, 26371392, -14451233, -5027349, 14854137, 17477601, 3842657, 28012650, -16405420]), new FieldElement([-5075835, 9368966, -8562079, -4600902, -15249953, 6970560, -9189873, 16292057, -8867157, 3507940]), new FieldElement([29439664, 3537914, 23333589, 6997794, -17555561, -11018068, -15209202, -15051267, -9164929, 6580396]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-12185861, -7679788, 16438269, 10826160, -8696817, -6235611, 17860444, -9273846, -2095802, 9304567]), new FieldElement([20714564, -4336911, 29088195, 7406487, 11426967, -5095705, 14792667, -14608617, 5289421, -477127]), new FieldElement([-16665533, -10650790, -6160345, -13305760, 9192020, -1802462, 17271490, 12349094, 26939669, -3752294])),
            new PreComputedGroupElement(new FieldElement([-12889898, 9373458, 31595848, 16374215, 21471720, 13221525, -27283495, -12348559, -3698806, 117887]), new FieldElement([22263325, -6560050, 3984570, -11174646, -15114008, -566785, 28311253, 5358056, -23319780, 541964]), new FieldElement([16259219, 3261970, 2309254, -15534474, -16885711, -4581916, 24134070, -16705829, -13337066, -13552195])),
            new PreComputedGroupElement(new FieldElement([9378160, -13140186, -22845982, -12745264, 28198281, -7244098, -2399684, -717351, 690426, 14876244]), new FieldElement([24977353, -314384, -8223969, -13465086, 28432343, -1176353, -13068804, -12297348, -22380984, 6618999]), new FieldElement([-1538174, 11685646, 12944378, 13682314, -24389511, -14413193, 8044829, -13817328, 32239829, -5652762])),
            new PreComputedGroupElement(new FieldElement([-18603066, 4762990, -926250, 8885304, -28412480, -3187315, 9781647, -10350059, 32779359, 5095274]), new FieldElement([-33008130, -5214506, -32264887, -3685216, 9460461, -9327423, -24601656, 14506724, 21639561, -2630236]), new FieldElement([-16400943, -13112215, 25239338, 15531969, 3987758, -4499318, -1289502, -6863535, 17874574, 558605])),
            new PreComputedGroupElement(new FieldElement([-13600129, 10240081, 9171883, 16131053, -20869254, 9599700, 33499487, 5080151, 2085892, 5119761]), new FieldElement([-22205145, -2519528, -16381601, 414691, -25019550, 2170430, 30634760, -8363614, -31999993, -5759884]), new FieldElement([-6845704, 15791202, 8550074, -1312654, 29928809, -12092256, 27534430, -7192145, -22351378, 12961482])),
            new PreComputedGroupElement(new FieldElement([-24492060, -9570771, 10368194, 11582341, -23397293, -2245287, 16533930, 8206996, -30194652, -5159638]), new FieldElement([-11121496, -3382234, 2307366, 6362031, -135455, 8868177, -16835630, 7031275, 7589640, 8945490]), new FieldElement([-32152748, 8917967, 6661220, -11677616, -1192060, -15793393, 7251489, -11182180, 24099109, -14456170])),
            new PreComputedGroupElement(new FieldElement([5019558, -7907470, 4244127, -14714356, -26933272, 6453165, -19118182, -13289025, -6231896, -10280736]), new FieldElement([10853594, 10721687, 26480089, 5861829, -22995819, 1972175, -1866647, -10557898, -3363451, -6441124]), new FieldElement([-17002408, 5906790, 221599, -6563147, 7828208, -13248918, 24362661, -2008168, -13866408, 7421392])),
            new PreComputedGroupElement(new FieldElement([8139927, -6546497, 32257646, -5890546, 30375719, 1886181, -21175108, 15441252, 28826358, -4123029]), new FieldElement([6267086, 9695052, 7709135, -16603597, -32869068, -1886135, 14795160, -7840124, 13746021, -1742048]), new FieldElement([28584902, 7787108, -6732942, -15050729, 22846041, -7571236, -3181936, -363524, 4771362, -8419958]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([24949256, 6376279, -27466481, -8174608, -18646154, -9930606, 33543569, -12141695, 3569627, 11342593]), new FieldElement([26514989, 4740088, 27912651, 3697550, 19331575, -11472339, 6809886, 4608608, 7325975, -14801071]), new FieldElement([-11618399, -14554430, -24321212, 7655128, -1369274, 5214312, -27400540, 10258390, -17646694, -8186692])),
            new PreComputedGroupElement(new FieldElement([11431204, 15823007, 26570245, 14329124, 18029990, 4796082, -31446179, 15580664, 9280358, -3973687]), new FieldElement([-160783, -10326257, -22855316, -4304997, -20861367, -13621002, -32810901, -11181622, -15545091, 4387441]), new FieldElement([-20799378, 12194512, 3937617, -5805892, -27154820, 9340370, -24513992, 8548137, 20617071, -7482001])),
            new PreComputedGroupElement(new FieldElement([-938825, -3930586, -8714311, 16124718, 24603125, -6225393, -13775352, -11875822, 24345683, 10325460]), new FieldElement([-19855277, -1568885, -22202708, 8714034, 14007766, 6928528, 16318175, -1010689, 4766743, 3552007]), new FieldElement([-21751364, -16730916, 1351763, -803421, -4009670, 3950935, 3217514, 14481909, 10988822, -3994762])),
            new PreComputedGroupElement(new FieldElement([15564307, -14311570, 3101243, 5684148, 30446780, -8051356, 12677127, -6505343, -8295852, 13296005]), new FieldElement([-9442290, 6624296, -30298964, -11913677, -4670981, -2057379, 31521204, 9614054, -30000824, 12074674]), new FieldElement([4771191, -135239, 14290749, -13089852, 27992298, 14998318, -1413936, -1556716, 29832613, -16391035])),
            new PreComputedGroupElement(new FieldElement([7064884, -7541174, -19161962, -5067537, -18891269, -2912736, 25825242, 5293297, -27122660, 13101590]), new FieldElement([-2298563, 2439670, -7466610, 1719965, -27267541, -16328445, 32512469, -5317593, -30356070, -4190957]), new FieldElement([-30006540, 10162316, -33180176, 3981723, -16482138, -13070044, 14413974, 9515896, 19568978, 9628812])),
            new PreComputedGroupElement(new FieldElement([33053803, 199357, 15894591, 1583059, 27380243, -4580435, -17838894, -6106839, -6291786, 3437740]), new FieldElement([-18978877, 3884493, 19469877, 12726490, 15913552, 13614290, -22961733, 70104, 7463304, 4176122]), new FieldElement([-27124001, 10659917, 11482427, -16070381, 12771467, -6635117, -32719404, -5322751, 24216882, 5944158])),
            new PreComputedGroupElement(new FieldElement([8894125, 7450974, -2664149, -9765752, -28080517, -12389115, 19345746, 14680796, 11632993, 5847885]), new FieldElement([26942781, -2315317, 9129564, -4906607, 26024105, 11769399, -11518837, 6367194, -9727230, 4782140]), new FieldElement([19916461, -4828410, -22910704, -11414391, 25606324, -5972441, 33253853, 8220911, 6358847, -1873857])),
            new PreComputedGroupElement(new FieldElement([801428, -2081702, 16569428, 11065167, 29875704, 96627, 7908388, -4480480, -13538503, 1387155]), new FieldElement([19646058, 5720633, -11416706, 12814209, 11607948, 12749789, 14147075, 15156355, -21866831, 11835260]), new FieldElement([19299512, 1155910, 28703737, 14890794, 2925026, 7269399, 26121523, 15467869, -26560550, 5052483]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-3017432, 10058206, 1980837, 3964243, 22160966, 12322533, -6431123, -12618185, 12228557, -7003677]), new FieldElement([32944382, 14922211, -22844894, 5188528, 21913450, -8719943, 4001465, 13238564, -6114803, 8653815]), new FieldElement([22865569, -4652735, 27603668, -12545395, 14348958, 8234005, 24808405, 5719875, 28483275, 2841751])),
            new PreComputedGroupElement(new FieldElement([-16420968, -1113305, -327719, -12107856, 21886282, -15552774, -1887966, -315658, 19932058, -12739203]), new FieldElement([-11656086, 10087521, -8864888, -5536143, -19278573, -3055912, 3999228, 13239134, -4777469, -13910208]), new FieldElement([1382174, -11694719, 17266790, 9194690, -13324356, 9720081, 20403944, 11284705, -14013818, 3093230])),
            new PreComputedGroupElement(new FieldElement([16650921, -11037932, -1064178, 1570629, -8329746, 7352753, -302424, 16271225, -24049421, -6691850]), new FieldElement([-21911077, -5927941, -4611316, -5560156, -31744103, -10785293, 24123614, 15193618, -21652117, -16739389]), new FieldElement([-9935934, -4289447, -25279823, 4372842, 2087473, 10399484, 31870908, 14690798, 17361620, 11864968])),
            new PreComputedGroupElement(new FieldElement([-11307610, 6210372, 13206574, 5806320, -29017692, -13967200, -12331205, -7486601, -25578460, -16240689]), new FieldElement([14668462, -12270235, 26039039, 15305210, 25515617, 4542480, 10453892, 6577524, 9145645, -6443880]), new FieldElement([5974874, 3053895, -9433049, -10385191, -31865124, 3225009, -7972642, 3936128, -5652273, -3050304])),
            new PreComputedGroupElement(new FieldElement([30625386, -4729400, -25555961, -12792866, -20484575, 7695099, 17097188, -16303496, -27999779, 1803632]), new FieldElement([-3553091, 9865099, -5228566, 4272701, -5673832, -16689700, 14911344, 12196514, -21405489, 7047412]), new FieldElement([20093277, 9920966, -11138194, -5343857, 13161587, 12044805, -32856851, 4124601, -32343828, -10257566])),
            new PreComputedGroupElement(new FieldElement([-20788824, 14084654, -13531713, 7842147, 19119038, -13822605, 4752377, -8714640, -21679658, 2288038]), new FieldElement([-26819236, -3283715, 29965059, 3039786, -14473765, 2540457, 29457502, 14625692, -24819617, 12570232]), new FieldElement([-1063558, -11551823, 16920318, 12494842, 1278292, -5869109, -21159943, -3498680, -11974704, 4724943])),
            new PreComputedGroupElement(new FieldElement([17960970, -11775534, -4140968, -9702530, -8876562, -1410617, -12907383, -8659932, -29576300, 1903856]), new FieldElement([23134274, -14279132, -10681997, -1611936, 20684485, 15770816, -12989750, 3190296, 26955097, 14109738]), new FieldElement([15308788, 5320727, -30113809, -14318877, 22902008, 7767164, 29425325, -11277562, 31960942, 11934971])),
            new PreComputedGroupElement(new FieldElement([-27395711, 8435796, 4109644, 12222639, -24627868, 14818669, 20638173, 4875028, 10491392, 1379718]), new FieldElement([-13159415, 9197841, 3875503, -8936108, -1383712, -5879801, 33518459, 16176658, 21432314, 12180697]), new FieldElement([-11787308, 11500838, 13787581, -13832590, -22430679, 10140205, 1465425, 12689540, -10301319, -13872883]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([5414091, -15386041, -21007664, 9643570, 12834970, 1186149, -2622916, -1342231, 26128231, 6032912]), new FieldElement([-26337395, -13766162, 32496025, -13653919, 17847801, -12669156, 3604025, 8316894, -25875034, -10437358]), new FieldElement([3296484, 6223048, 24680646, -12246460, -23052020, 5903205, -8862297, -4639164, 12376617, 3188849])),
            new PreComputedGroupElement(new FieldElement([29190488, -14659046, 27549113, -1183516, 3520066, -10697301, 32049515, -7309113, -16109234, -9852307]), new FieldElement([-14744486, -9309156, 735818, -598978, -20407687, -5057904, 25246078, -15795669, 18640741, -960977]), new FieldElement([-6928835, -16430795, 10361374, 5642961, 4910474, 12345252, -31638386, -494430, 10530747, 1053335])),
            new PreComputedGroupElement(new FieldElement([-29265967, -14186805, -13538216, -12117373, -19457059, -10655384, -31462369, -2948985, 24018831, 15026644]), new FieldElement([-22592535, -3145277, -2289276, 5953843, -13440189, 9425631, 25310643, 13003497, -2314791, -15145616]), new FieldElement([-27419985, -603321, -8043984, -1669117, -26092265, 13987819, -27297622, 187899, -23166419, -2531735])),
            new PreComputedGroupElement(new FieldElement([-21744398, -13810475, 1844840, 5021428, -10434399, -15911473, 9716667, 16266922, -5070217, 726099]), new FieldElement([29370922, -6053998, 7334071, -15342259, 9385287, 2247707, -13661962, -4839461, 30007388, -15823341]), new FieldElement([-936379, 16086691, 23751945, -543318, -1167538, -5189036, 9137109, 730663, 9835848, 4555336])),
            new PreComputedGroupElement(new FieldElement([-23376435, 1410446, -22253753, -12899614, 30867635, 15826977, 17693930, 544696, -11985298, 12422646]), new FieldElement([31117226, -12215734, -13502838, 6561947, -9876867, -12757670, -5118685, -4096706, 29120153, 13924425]), new FieldElement([-17400879, -14233209, 19675799, -2734756, -11006962, -5858820, -9383939, -11317700, 7240931, -237388])),
            new PreComputedGroupElement(new FieldElement([-31361739, -11346780, -15007447, -5856218, -22453340, -12152771, 1222336, 4389483, 3293637, -15551743]), new FieldElement([-16684801, -14444245, 11038544, 11054958, -13801175, -3338533, -24319580, 7733547, 12796905, -6335822]), new FieldElement([-8759414, -10817836, -25418864, 10783769, -30615557, -9746811, -28253339, 3647836, 3222231, -11160462])),
            new PreComputedGroupElement(new FieldElement([18606113, 1693100, -25448386, -15170272, 4112353, 10045021, 23603893, -2048234, -7550776, 2484985]), new FieldElement([9255317, -3131197, -12156162, -1004256, 13098013, -9214866, 16377220, -2102812, -19802075, -3034702]), new FieldElement([-22729289, 7496160, -5742199, 11329249, 19991973, -3347502, -31718148, 9936966, -30097688, -10618797])),
            new PreComputedGroupElement(new FieldElement([21878590, -5001297, 4338336, 13643897, -3036865, 13160960, 19708896, 5415497, -7360503, -4109293]), new FieldElement([27736861, 10103576, 12500508, 8502413, -3413016, -9633558, 10436918, -1550276, -23659143, -8132100]), new FieldElement([19492550, -12104365, -29681976, -852630, -3208171, 12403437, 30066266, 8367329, 13243957, 8709688]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([12015105, 2801261, 28198131, 10151021, 24818120, -4743133, -11194191, -5645734, 5150968, 7274186]), new FieldElement([2831366, -12492146, 1478975, 6122054, 23825128, -12733586, 31097299, 6083058, 31021603, -9793610]), new FieldElement([-2529932, -2229646, 445613, 10720828, -13849527, -11505937, -23507731, 16354465, 15067285, -14147707])),
            new PreComputedGroupElement(new FieldElement([7840942, 14037873, -33364863, 15934016, -728213, -3642706, 21403988, 1057586, -19379462, -12403220]), new FieldElement([915865, -16469274, 15608285, -8789130, -24357026, 6060030, -17371319, 8410997, -7220461, 16527025]), new FieldElement([32922597, -556987, 20336074, -16184568, 10903705, -5384487, 16957574, 52992, 23834301, 6588044])),
            new PreComputedGroupElement(new FieldElement([32752030, 11232950, 3381995, -8714866, 22652988, -10744103, 17159699, 16689107, -20314580, -1305992]), new FieldElement([-4689649, 9166776, -25710296, -10847306, 11576752, 12733943, 7924251, -2752281, 1976123, -7249027]), new FieldElement([21251222, 16309901, -2983015, -6783122, 30810597, 12967303, 156041, -3371252, 12331345, -8237197])),
            new PreComputedGroupElement(new FieldElement([8651614, -4477032, -16085636, -4996994, 13002507, 2950805, 29054427, -5106970, 10008136, -4667901]), new FieldElement([31486080, 15114593, -14261250, 12951354, 14369431, -7387845, 16347321, -13662089, 8684155, -10532952]), new FieldElement([19443825, 11385320, 24468943, -9659068, -23919258, 2187569, -26263207, -6086921, 31316348, 14219878])),
            new PreComputedGroupElement(new FieldElement([-28594490, 1193785, 32245219, 11392485, 31092169, 15722801, 27146014, 6992409, 29126555, 9207390]), new FieldElement([32382935, 1110093, 18477781, 11028262, -27411763, -7548111, -4980517, 10843782, -7957600, -14435730]), new FieldElement([2814918, 7836403, 27519878, -7868156, -20894015, -11553689, -21494559, 8550130, 28346258, 1994730])),
            new PreComputedGroupElement(new FieldElement([-19578299, 8085545, -14000519, -3948622, 2785838, -16231307, -19516951, 7174894, 22628102, 8115180]), new FieldElement([-30405132, 955511, -11133838, -15078069, -32447087, -13278079, -25651578, 3317160, -9943017, 930272]), new FieldElement([-15303681, -6833769, 28856490, 1357446, 23421993, 1057177, 24091212, -1388970, -22765376, -10650715])),
            new PreComputedGroupElement(new FieldElement([-22751231, -5303997, -12907607, -12768866, -15811511, -7797053, -14839018, -16554220, -1867018, 8398970]), new FieldElement([-31969310, 2106403, -4736360, 1362501, 12813763, 16200670, 22981545, -6291273, 18009408, -15772772]), new FieldElement([-17220923, -9545221, -27784654, 14166835, 29815394, 7444469, 29551787, -3727419, 19288549, 1325865])),
            new PreComputedGroupElement(new FieldElement([15100157, -15835752, -23923978, -1005098, -26450192, 15509408, 12376730, -3479146, 33166107, -8042750]), new FieldElement([20909231, 13023121, -9209752, 16251778, -5778415, -8094914, 12412151, 10018715, 2213263, -13878373]), new FieldElement([32529814, -11074689, 30361439, -16689753, -9135940, 1513226, 22922121, 6382134, -5766928, 8371348]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([9923462, 11271500, 12616794, 3544722, -29998368, -1721626, 12891687, -8193132, -26442943, 10486144]), new FieldElement([-22597207, -7012665, 8587003, -8257861, 4084309, -12970062, 361726, 2610596, -23921530, -11455195]), new FieldElement([5408411, -1136691, -4969122, 10561668, 24145918, 14240566, 31319731, -4235541, 19985175, -3436086])),
            new PreComputedGroupElement(new FieldElement([-13994457, 16616821, 14549246, 3341099, 32155958, 13648976, -17577068, 8849297, 65030, 8370684]), new FieldElement([-8320926, -12049626, 31204563, 5839400, -20627288, -1057277, -19442942, 6922164, 12743482, -9800518]), new FieldElement([-2361371, 12678785, 28815050, 4759974, -23893047, 4884717, 23783145, 11038569, 18800704, 255233])),
            new PreComputedGroupElement(new FieldElement([-5269658, -1773886, 13957886, 7990715, 23132995, 728773, 13393847, 9066957, 19258688, -14753793]), new FieldElement([-2936654, -10827535, -10432089, 14516793, -3640786, 4372541, -31934921, 2209390, -1524053, 2055794]), new FieldElement([580882, 16705327, 5468415, -2683018, -30926419, -14696000, -7203346, -8994389, -30021019, 7394435])),
            new PreComputedGroupElement(new FieldElement([23838809, 1822728, -15738443, 15242727, 8318092, -3733104, -21672180, -3492205, -4821741, 14799921]), new FieldElement([13345610, 9759151, 3371034, -16137791, 16353039, 8577942, 31129804, 13496856, -9056018, 7402518]), new FieldElement([2286874, -4435931, -20042458, -2008336, -13696227, 5038122, 11006906, -15760352, 8205061, 1607563])),
            new PreComputedGroupElement(new FieldElement([14414086, -8002132, 3331830, -3208217, 22249151, -5594188, 18364661, -2906958, 30019587, -9029278]), new FieldElement([-27688051, 1585953, -10775053, 931069, -29120221, -11002319, -14410829, 12029093, 9944378, 8024]), new FieldElement([4368715, -3709630, 29874200, -15022983, -20230386, -11410704, -16114594, -999085, -8142388, 5640030])),
            new PreComputedGroupElement(new FieldElement([10299610, 13746483, 11661824, 16234854, 7630238, 5998374, 9809887, -16694564, 15219798, -14327783]), new FieldElement([27425505, -5719081, 3055006, 10660664, 23458024, 595578, -15398605, -1173195, -18342183, 9742717]), new FieldElement([6744077, 2427284, 26042789, 2720740, -847906, 1118974, 32324614, 7406442, 12420155, 1994844])),
            new PreComputedGroupElement(new FieldElement([14012521, -5024720, -18384453, -9578469, -26485342, -3936439, -13033478, -10909803, 24319929, -6446333]), new FieldElement([16412690, -4507367, 10772641, 15929391, -17068788, -4658621, 10555945, -10484049, -30102368, -4739048]), new FieldElement([22397382, -7767684, -9293161, -12792868, 17166287, -9755136, -27333065, 6199366, 21880021, -12250760])),
            new PreComputedGroupElement(new FieldElement([-4283307, 5368523, -31117018, 8163389, -30323063, 3209128, 16557151, 8890729, 8840445, 4957760]), new FieldElement([-15447727, 709327, -6919446, -10870178, -29777922, 6522332, -21720181, 12130072, -14796503, 5005757]), new FieldElement([-2114751, -14308128, 23019042, 15765735, -25269683, 6002752, 10183197, -13239326, -16395286, -2176112]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-19025756, 1632005, 13466291, -7995100, -23640451, 16573537, -32013908, -3057104, 22208662, 2000468]), new FieldElement([3065073, -1412761, -25598674, -361432, -17683065, -5703415, -8164212, 11248527, -3691214, -7414184]), new FieldElement([10379208, -6045554, 8877319, 1473647, -29291284, -12507580, 16690915, 2553332, -3132688, 16400289])),
            new PreComputedGroupElement(new FieldElement([15716668, 1254266, -18472690, 7446274, -8448918, 6344164, -22097271, -7285580, 26894937, 9132066]), new FieldElement([24158887, 12938817, 11085297, -8177598, -28063478, -4457083, -30576463, 64452, -6817084, -2692882]), new FieldElement([13488534, 7794716, 22236231, 5989356, 25426474, -12578208, 2350710, -3418511, -4688006, 2364226])),
            new PreComputedGroupElement(new FieldElement([16335052, 9132434, 25640582, 6678888, 1725628, 8517937, -11807024, -11697457, 15445875, -7798101]), new FieldElement([29004207, -7867081, 28661402, -640412, -12794003, -7943086, 31863255, -4135540, -278050, -15759279]), new FieldElement([-6122061, -14866665, -28614905, 14569919, -10857999, -3591829, 10343412, -6976290, -29828287, -10815811])),
            new PreComputedGroupElement(new FieldElement([27081650, 3463984, 14099042, -4517604, 1616303, -6205604, 29542636, 15372179, 17293797, 960709]), new FieldElement([20263915, 11434237, -5765435, 11236810, 13505955, -10857102, -16111345, 6493122, -19384511, 7639714]), new FieldElement([-2830798, -14839232, 25403038, -8215196, -8317012, -16173699, 18006287, -16043750, 29994677, -15808121])),
            new PreComputedGroupElement(new FieldElement([9769828, 5202651, -24157398, -13631392, -28051003, -11561624, -24613141, -13860782, -31184575, 709464]), new FieldElement([12286395, 13076066, -21775189, -1176622, -25003198, 4057652, -32018128, -8890874, 16102007, 13205847]), new FieldElement([13733362, 5599946, 10557076, 3195751, -5557991, 8536970, -25540170, 8525972, 10151379, 10394400])),
            new PreComputedGroupElement(new FieldElement([4024660, -16137551, 22436262, 12276534, -9099015, -2686099, 19698229, 11743039, -33302334, 8934414]), new FieldElement([-15879800, -4525240, -8580747, -2934061, 14634845, -698278, -9449077, 3137094, -11536886, 11721158]), new FieldElement([17555939, -5013938, 8268606, 2331751, -22738815, 9761013, 9319229, 8835153, -9205489, -1280045])),
            new PreComputedGroupElement(new FieldElement([-461409, -7830014, 20614118, 16688288, -7514766, -4807119, 22300304, 505429, 6108462, -6183415]), new FieldElement([-5070281, 12367917, -30663534, 3234473, 32617080, -8422642, 29880583, -13483331, -26898490, -7867459]), new FieldElement([-31975283, 5726539, 26934134, 10237677, -3173717, -605053, 24199304, 3795095, 7592688, -14992079])),
            new PreComputedGroupElement(new FieldElement([21594432, -14964228, 17466408, -4077222, 32537084, 2739898, 6407723, 12018833, -28256052, 4298412]), new FieldElement([-20650503, -11961496, -27236275, 570498, 3767144, -1717540, 13891942, -1569194, 13717174, 10805743]), new FieldElement([-14676630, -15644296, 15287174, 11927123, 24177847, -8175568, -796431, 14860609, -26938930, -5863836]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([12962541, 5311799, -10060768, 11658280, 18855286, -7954201, 13286263, -12808704, -4381056, 9882022]), new FieldElement([18512079, 11319350, -20123124, 15090309, 18818594, 5271736, -22727904, 3666879, -23967430, -3299429]), new FieldElement([-6789020, -3146043, 16192429, 13241070, 15898607, -14206114, -10084880, -6661110, -2403099, 5276065])),
            new PreComputedGroupElement(new FieldElement([30169808, -5317648, 26306206, -11750859, 27814964, 7069267, 7152851, 3684982, 1449224, 13082861]), new FieldElement([10342826, 3098505, 2119311, 193222, 25702612, 12233820, 23697382, 15056736, -21016438, -8202000]), new FieldElement([-33150110, 3261608, 22745853, 7948688, 19370557, -15177665, -26171976, 6482814, -10300080, -11060101])),
            new PreComputedGroupElement(new FieldElement([32869458, -5408545, 25609743, 15678670, -10687769, -15471071, 26112421, 2521008, -22664288, 6904815]), new FieldElement([29506923, 4457497, 3377935, -9796444, -30510046, 12935080, 1561737, 3841096, -29003639, -6657642]), new FieldElement([10340844, -6630377, -18656632, -2278430, 12621151, -13339055, 30878497, -11824370, -25584551, 5181966])),
            new PreComputedGroupElement(new FieldElement([25940115, -12658025, 17324188, -10307374, -8671468, 15029094, 24396252, -16450922, -2322852, -12388574]), new FieldElement([-21765684, 9916823, -1300409, 4079498, -1028346, 11909559, 1782390, 12641087, 20603771, -6561742]), new FieldElement([-18882287, -11673380, 24849422, 11501709, 13161720, -4768874, 1925523, 11914390, 4662781, 7820689])),
            new PreComputedGroupElement(new FieldElement([12241050, -425982, 8132691, 9393934, 32846760, -1599620, 29749456, 12172924, 16136752, 15264020]), new FieldElement([-10349955, -14680563, -8211979, 2330220, -17662549, -14545780, 10658213, 6671822, 19012087, 3772772]), new FieldElement([3753511, -3421066, 10617074, 2028709, 14841030, -6721664, 28718732, -15762884, 20527771, 12988982])),
            new PreComputedGroupElement(new FieldElement([-14822485, -5797269, -3707987, 12689773, -898983, -10914866, -24183046, -10564943, 3299665, -12424953]), new FieldElement([-16777703, -15253301, -9642417, 4978983, 3308785, 8755439, 6943197, 6461331, -25583147, 8991218]), new FieldElement([-17226263, 1816362, -1673288, -6086439, 31783888, -8175991, -32948145, 7417950, -30242287, 1507265])),
            new PreComputedGroupElement(new FieldElement([29692663, 6829891, -10498800, 4334896, 20945975, -11906496, -28887608, 8209391, 14606362, -10647073]), new FieldElement([-3481570, 8707081, 32188102, 5672294, 22096700, 1711240, -33020695, 9761487, 4170404, -2085325]), new FieldElement([-11587470, 14855945, -4127778, -1531857, -26649089, 15084046, 22186522, 16002000, -14276837, -8400798])),
            new PreComputedGroupElement(new FieldElement([-4811456, 13761029, -31703877, -2483919, -3312471, 7869047, -7113572, -9620092, 13240845, 10965870]), new FieldElement([-7742563, -8256762, -14768334, -13656260, -23232383, 12387166, 4498947, 14147411, 29514390, 4302863]), new FieldElement([-13413405, -12407859, 20757302, -13801832, 14785143, 8976368, -5061276, -2144373, 17846988, -13971927]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-2244452, -754728, -4597030, -1066309, -6247172, 1455299, -21647728, -9214789, -5222701, 12650267]), new FieldElement([-9906797, -16070310, 21134160, 12198166, -27064575, 708126, 387813, 13770293, -19134326, 10958663]), new FieldElement([22470984, 12369526, 23446014, -5441109, -21520802, -9698723, -11772496, -11574455, -25083830, 4271862])),
            new PreComputedGroupElement(new FieldElement([-25169565, -10053642, -19909332, 15361595, -5984358, 2159192, 75375, -4278529, -32526221, 8469673]), new FieldElement([15854970, 4148314, -8893890, 7259002, 11666551, 13824734, -30531198, 2697372, 24154791, -9460943]), new FieldElement([15446137, -15806644, 29759747, 14019369, 30811221, -9610191, -31582008, 12840104, 24913809, 9815020])),
            new PreComputedGroupElement(new FieldElement([-4709286, -5614269, -31841498, -12288893, -14443537, 10799414, -9103676, 13438769, 18735128, 9466238]), new FieldElement([11933045, 9281483, 5081055, -5183824, -2628162, -4905629, -7727821, -10896103, -22728655, 16199064]), new FieldElement([14576810, 379472, -26786533, -8317236, -29426508, -10812974, -102766, 1876699, 30801119, 2164795])),
            new PreComputedGroupElement(new FieldElement([15995086, 3199873, 13672555, 13712240, -19378835, -4647646, -13081610, -15496269, -13492807, 1268052]), new FieldElement([-10290614, -3659039, -3286592, 10948818, 23037027, 3794475, -3470338, -12600221, -17055369, 3565904]), new FieldElement([29210088, -9419337, -5919792, -4952785, 10834811, -13327726, -16512102, -10820713, -27162222, -14030531])),
            new PreComputedGroupElement(new FieldElement([-13161890, 15508588, 16663704, -8156150, -28349942, 9019123, -29183421, -3769423, 2244111, -14001979]), new FieldElement([-5152875, -3800936, -9306475, -6071583, 16243069, 14684434, -25673088, -16180800, 13491506, 4641841]), new FieldElement([10813417, 643330, -19188515, -728916, 30292062, -16600078, 27548447, -7721242, 14476989, -12767431])),
            new PreComputedGroupElement(new FieldElement([10292079, 9984945, 6481436, 8279905, -7251514, 7032743, 27282937, -1644259, -27912810, 12651324]), new FieldElement([-31185513, -813383, 22271204, 11835308, 10201545, 15351028, 17099662, 3988035, 21721536, -3148940]), new FieldElement([10202177, -6545839, -31373232, -9574638, -32150642, -8119683, -12906320, 3852694, 13216206, 14842320])),
            new PreComputedGroupElement(new FieldElement([-15815640, -10601066, -6538952, -7258995, -6984659, -6581778, -31500847, 13765824, -27434397, 9900184]), new FieldElement([14465505, -13833331, -32133984, -14738873, -27443187, 12990492, 33046193, 15796406, -7051866, -8040114]), new FieldElement([30924417, -8279620, 6359016, -12816335, 16508377, 9071735, -25488601, 15413635, 9524356, -7018878])),
            new PreComputedGroupElement(new FieldElement([12274201, -13175547, 32627641, -1785326, 6736625, 13267305, 5237659, -5109483, 15663516, 4035784]), new FieldElement([-2951309, 8903985, 17349946, 601635, -16432815, -4612556, -13732739, -15889334, -22258478, 4659091]), new FieldElement([-16916263, -4952973, -30393711, -15158821, 20774812, 15897498, 5736189, 15026997, -2178256, -13455585]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-8858980, -2219056, 28571666, -10155518, -474467, -10105698, -3801496, 278095, 23440562, -290208]), new FieldElement([10226241, -5928702, 15139956, 120818, -14867693, 5218603, 32937275, 11551483, -16571960, -7442864]), new FieldElement([17932739, -12437276, -24039557, 10749060, 11316803, 7535897, 22503767, 5561594, -3646624, 3898661])),
            new PreComputedGroupElement(new FieldElement([7749907, -969567, -16339731, -16464, -25018111, 15122143, -1573531, 7152530, 21831162, 1245233]), new FieldElement([26958459, -14658026, 4314586, 8346991, -5677764, 11960072, -32589295, -620035, -30402091, -16716212]), new FieldElement([-12165896, 9166947, 33491384, 13673479, 29787085, 13096535, 6280834, 14587357, -22338025, 13987525])),
            new PreComputedGroupElement(new FieldElement([-24349909, 7778775, 21116000, 15572597, -4833266, -5357778, -4300898, -5124639, -7469781, -2858068]), new FieldElement([9681908, -6737123, -31951644, 13591838, -6883821, 386950, 31622781, 6439245, -14581012, 4091397]), new FieldElement([-8426427, 1470727, -28109679, -1596990, 3978627, -5123623, -19622683, 12092163, 29077877, -14741988])),
            new PreComputedGroupElement(new FieldElement([5269168, -6859726, -13230211, -8020715, 25932563, 1763552, -5606110, -5505881, -20017847, 2357889]), new FieldElement([32264008, -15407652, -5387735, -1160093, -2091322, -3946900, 23104804, -12869908, 5727338, 189038]), new FieldElement([14609123, -8954470, -6000566, -16622781, -14577387, -7743898, -26745169, 10942115, -25888931, -14884697])),
            new PreComputedGroupElement(new FieldElement([20513500, 5557931, -15604613, 7829531, 26413943, -2019404, -21378968, 7471781, 13913677, -5137875]), new FieldElement([-25574376, 11967826, 29233242, 12948236, -6754465, 4713227, -8940970, 14059180, 12878652, 8511905]), new FieldElement([-25656801, 3393631, -2955415, -7075526, -2250709, 9366908, -30223418, 6812974, 5568676, -3127656])),
            new PreComputedGroupElement(new FieldElement([11630004, 12144454, 2116339, 13606037, 27378885, 15676917, -17408753, -13504373, -14395196, 8070818]), new FieldElement([27117696, -10007378, -31282771, -5570088, 1127282, 12772488, -29845906, 10483306, -11552749, -1028714]), new FieldElement([10637467, -5688064, 5674781, 1072708, -26343588, -6982302, -1683975, 9177853, -27493162, 15431203])),
            new PreComputedGroupElement(new FieldElement([20525145, 10892566, -12742472, 12779443, -29493034, 16150075, -28240519, 14943142, -15056790, -7935931]), new FieldElement([-30024462, 5626926, -551567, -9981087, 753598, 11981191, 25244767, -3239766, -3356550, 9594024]), new FieldElement([-23752644, 2636870, -5163910, -10103818, 585134, 7877383, 11345683, -6492290, 13352335, -10977084])),
            new PreComputedGroupElement(new FieldElement([-1931799, -5407458, 3304649, -12884869, 17015806, -4877091, -29783850, -7752482, -13215537, -319204]), new FieldElement([20239939, 6607058, 6203985, 3483793, -18386976, -779229, -20723742, 15077870, -22750759, 14523817]), new FieldElement([27406042, -6041657, 27423596, -4497394, 4996214, 10002360, -28842031, -4545494, -30172742, -4805667]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([11374242, 12660715, 17861383, -12540833, 10935568, 1099227, -13886076, -9091740, -27727044, 11358504]), new FieldElement([-12730809, 10311867, 1510375, 10778093, -2119455, -9145702, 32676003, 11149336, -26123651, 4985768]), new FieldElement([-19096303, 341147, -6197485, -239033, 15756973, -8796662, -983043, 13794114, -19414307, -15621255])),
            new PreComputedGroupElement(new FieldElement([6490081, 11940286, 25495923, -7726360, 8668373, -8751316, 3367603, 6970005, -1691065, -9004790]), new FieldElement([1656497, 13457317, 15370807, 6364910, 13605745, 8362338, -19174622, -5475723, -16796596, -5031438]), new FieldElement([-22273315, -13524424, -64685, -4334223, -18605636, -10921968, -20571065, -7007978, -99853, -10237333])),
            new PreComputedGroupElement(new FieldElement([17747465, 10039260, 19368299, -4050591, -20630635, -16041286, 31992683, -15857976, -29260363, -5511971]), new FieldElement([31932027, -4986141, -19612382, 16366580, 22023614, 88450, 11371999, -3744247, 4882242, -10626905]), new FieldElement([29796507, 37186, 19818052, 10115756, -11829032, 3352736, 18551198, 3272828, -5190932, -4162409])),
            new PreComputedGroupElement(new FieldElement([12501286, 4044383, -8612957, -13392385, -32430052, 5136599, -19230378, -3529697, 330070, -3659409]), new FieldElement([6384877, 2899513, 17807477, 7663917, -2358888, 12363165, 25366522, -8573892, -271295, 12071499]), new FieldElement([-8365515, -4042521, 25133448, -4517355, -6211027, 2265927, -32769618, 1936675, -5159697, 3829363])),
            new PreComputedGroupElement(new FieldElement([28425966, -5835433, -577090, -4697198, -14217555, 6870930, 7921550, -6567787, 26333140, 14267664]), new FieldElement([-11067219, 11871231, 27385719, -10559544, -4585914, -11189312, 10004786, -8709488, -21761224, 8930324]), new FieldElement([-21197785, -16396035, 25654216, -1725397, 12282012, 11008919, 1541940, 4757911, -26491501, -16408940])),
            new PreComputedGroupElement(new FieldElement([13537262, -7759490, -20604840, 10961927, -5922820, -13218065, -13156584, 6217254, -15943699, 13814990]), new FieldElement([-17422573, 15157790, 18705543, 29619, 24409717, -260476, 27361681, 9257833, -1956526, -1776914]), new FieldElement([-25045300, -10191966, 15366585, 15166509, -13105086, 8423556, -29171540, 12361135, -18685978, 4578290])),
            new PreComputedGroupElement(new FieldElement([24579768, 3711570, 1342322, -11180126, -27005135, 14124956, -22544529, 14074919, 21964432, 8235257]), new FieldElement([-6528613, -2411497, 9442966, -5925588, 12025640, -1487420, -2981514, -1669206, 13006806, 2355433]), new FieldElement([-16304899, -13605259, -6632427, -5142349, 16974359, -10911083, 27202044, 1719366, 1141648, -12796236])),
            new PreComputedGroupElement(new FieldElement([-12863944, -13219986, -8318266, -11018091, -6810145, -4843894, 13475066, -3133972, 32674895, 13715045]), new FieldElement([11423335, -5468059, 32344216, 8962751, 24989809, 9241752, -13265253, 16086212, -28740881, -15642093]), new FieldElement([-1409668, 12530728, -6368726, 10847387, 19531186, -14132160, -11709148, 7791794, -27245943, 4383347]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-28970898, 5271447, -1266009, -9736989, -12455236, 16732599, -4862407, -4906449, 27193557, 6245191]), new FieldElement([-15193956, 5362278, -1783893, 2695834, 4960227, 12840725, 23061898, 3260492, 22510453, 8577507]), new FieldElement([-12632451, 11257346, -32692994, 13548177, -721004, 10879011, 31168030, 13952092, -29571492, -3635906])),
            new PreComputedGroupElement(new FieldElement([3877321, -9572739, 32416692, 5405324, -11004407, -13656635, 3759769, 11935320, 5611860, 8164018]), new FieldElement([-16275802, 14667797, 15906460, 12155291, -22111149, -9039718, 32003002, -8832289, 5773085, -8422109]), new FieldElement([-23788118, -8254300, 1950875, 8937633, 18686727, 16459170, -905725, 12376320, 31632953, 190926])),
            new PreComputedGroupElement(new FieldElement([-24593607, -16138885, -8423991, 13378746, 14162407, 6901328, -8288749, 4508564, -25341555, -3627528]), new FieldElement([8884438, -5884009, 6023974, 10104341, -6881569, -4941533, 18722941, -14786005, -1672488, 827625]), new FieldElement([-32720583, -16289296, -32503547, 7101210, 13354605, 2659080, -1800575, -14108036, -24878478, 1541286])),
            new PreComputedGroupElement(new FieldElement([2901347, -1117687, 3880376, -10059388, -17620940, -3612781, -21802117, -3567481, 20456845, -1885033]), new FieldElement([27019610, 12299467, -13658288, -1603234, -12861660, -4861471, -19540150, -5016058, 29439641, 15138866]), new FieldElement([21536104, -6626420, -32447818, -10690208, -22408077, 5175814, -5420040, -16361163, 7779328, 109896])),
            new PreComputedGroupElement(new FieldElement([30279744, 14648750, -8044871, 6425558, 13639621, -743509, 28698390, 12180118, 23177719, -554075]), new FieldElement([26572847, 3405927, -31701700, 12890905, -19265668, 5335866, -6493768, 2378492, 4439158, -13279347]), new FieldElement([-22716706, 3489070, -9225266, -332753, 18875722, -1140095, 14819434, -12731527, -17717757, -5461437])),
            new PreComputedGroupElement(new FieldElement([-5056483, 16566551, 15953661, 3767752, -10436499, 15627060, -820954, 2177225, 8550082, -15114165]), new FieldElement([-18473302, 16596775, -381660, 15663611, 22860960, 15585581, -27844109, -3582739, -23260460, -8428588]), new FieldElement([-32480551, 15707275, -8205912, -5652081, 29464558, 2713815, -22725137, 15860482, -21902570, 1494193])),
            new PreComputedGroupElement(new FieldElement([-19562091, -14087393, -25583872, -9299552, 13127842, 759709, 21923482, 16529112, 8742704, 12967017]), new FieldElement([-28464899, 1553205, 32536856, -10473729, -24691605, -406174, -8914625, -2933896, -29903758, 15553883]), new FieldElement([21877909, 3230008, 9881174, 10539357, -4797115, 2841332, 11543572, 14513274, 19375923, -12647961])),
            new PreComputedGroupElement(new FieldElement([8832269, -14495485, 13253511, 5137575, 5037871, 4078777, 24880818, -6222716, 2862653, 9455043]), new FieldElement([29306751, 5123106, 20245049, -14149889, 9592566, 8447059, -2077124, -2990080, 15511449, 4789663]), new FieldElement([-20679756, 7004547, 8824831, -9434977, -4045704, -3750736, -5754762, 108893, 23513200, 16652362]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-33256173, 4144782, -4476029, -6579123, 10770039, -7155542, -6650416, -12936300, -18319198, 10212860]), new FieldElement([2756081, 8598110, 7383731, -6859892, 22312759, -1105012, 21179801, 2600940, -9988298, -12506466]), new FieldElement([-24645692, 13317462, -30449259, -15653928, 21365574, -10869657, 11344424, 864440, -2499677, -16710063])),
            new PreComputedGroupElement(new FieldElement([-26432803, 6148329, -17184412, -14474154, 18782929, -275997, -22561534, 211300, 2719757, 4940997]), new FieldElement([-1323882, 3911313, -6948744, 14759765, -30027150, 7851207, 21690126, 8518463, 26699843, 5276295]), new FieldElement([-13149873, -6429067, 9396249, 365013, 24703301, -10488939, 1321586, 149635, -15452774, 7159369])),
            new PreComputedGroupElement(new FieldElement([9987780, -3404759, 17507962, 9505530, 9731535, -2165514, 22356009, 8312176, 22477218, -8403385]), new FieldElement([18155857, -16504990, 19744716, 9006923, 15154154, -10538976, 24256460, -4864995, -22548173, 9334109]), new FieldElement([2986088, -4911893, 10776628, -3473844, 10620590, -7083203, -21413845, 14253545, -22587149, 536906])),
            new PreComputedGroupElement(new FieldElement([4377756, 8115836, 24567078, 15495314, 11625074, 13064599, 7390551, 10589625, 10838060, -15420424]), new FieldElement([-19342404, 867880, 9277171, -3218459, -14431572, -1986443, 19295826, -15796950, 6378260, 699185]), new FieldElement([7895026, 4057113, -7081772, -13077756, -17886831, -323126, -716039, 15693155, -5045064, -13373962])),
            new PreComputedGroupElement(new FieldElement([-7737563, -5869402, -14566319, -7406919, 11385654, 13201616, 31730678, -10962840, -3918636, -9669325]), new FieldElement([10188286, -15770834, -7336361, 13427543, 22223443, 14896287, 30743455, 7116568, -21786507, 5427593]), new FieldElement([696102, 13206899, 27047647, -10632082, 15285305, -9853179, 10798490, -4578720, 19236243, 12477404])),
            new PreComputedGroupElement(new FieldElement([-11229439, 11243796, -17054270, -8040865, -788228, -8167967, -3897669, 11180504, -23169516, 7733644]), new FieldElement([17800790, -14036179, -27000429, -11766671, 23887827, 3149671, 23466177, -10538171, 10322027, 15313801]), new FieldElement([26246234, 11968874, 32263343, -5468728, 6830755, -13323031, -15794704, -101982, -24449242, 10890804])),
            new PreComputedGroupElement(new FieldElement([-31365647, 10271363, -12660625, -6267268, 16690207, -13062544, -14982212, 16484931, 25180797, -5334884]), new FieldElement([-586574, 10376444, -32586414, -11286356, 19801893, 10997610, 2276632, 9482883, 316878, 13820577]), new FieldElement([-9882808, -4510367, -2115506, 16457136, -11100081, 11674996, 30756178, -7515054, 30696930, -3712849])),
            new PreComputedGroupElement(new FieldElement([32988917, -9603412, 12499366, 7910787, -10617257, -11931514, -7342816, -9985397, -32349517, 7392473]), new FieldElement([-8855661, 15927861, 9866406, -3649411, -2396914, -16655781, -30409476, -9134995, 25112947, -2926644]), new FieldElement([-2504044, -436966, 25621774, -5678772, 15085042, -5479877, -24884878, -13526194, 5537438, -13914319]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-11225584, 2320285, -9584280, 10149187, -33444663, 5808648, -14876251, -1729667, 31234590, 6090599]), new FieldElement([-9633316, 116426, 26083934, 2897444, -6364437, -2688086, 609721, 15878753, -6970405, -9034768]), new FieldElement([-27757857, 247744, -15194774, -9002551, 23288161, -10011936, -23869595, 6503646, 20650474, 1804084])),
            new PreComputedGroupElement(new FieldElement([-27589786, 15456424, 8972517, 8469608, 15640622, 4439847, 3121995, -10329713, 27842616, -202328]), new FieldElement([-15306973, 2839644, 22530074, 10026331, 4602058, 5048462, 28248656, 5031932, -11375082, 12714369]), new FieldElement([20807691, -7270825, 29286141, 11421711, -27876523, -13868230, -21227475, 1035546, -19733229, 12796920])),
            new PreComputedGroupElement(new FieldElement([12076899, -14301286, -8785001, -11848922, -25012791, 16400684, -17591495, -12899438, 3480665, -15182815]), new FieldElement([-32361549, 5457597, 28548107, 7833186, 7303070, -11953545, -24363064, -15921875, -33374054, 2771025]), new FieldElement([-21389266, 421932, 26597266, 6860826, 22486084, -6737172, -17137485, -4210226, -24552282, 15673397])),
            new PreComputedGroupElement(new FieldElement([-20184622, 2338216, 19788685, -9620956, -4001265, -8740893, -20271184, 4733254, 3727144, -12934448]), new FieldElement([6120119, 814863, -11794402, -622716, 6812205, -15747771, 2019594, 7975683, 31123697, -10958981]), new FieldElement([30069250, -11435332, 30434654, 2958439, 18399564, -976289, 12296869, 9204260, -16432438, 9648165])),
            new PreComputedGroupElement(new FieldElement([32705432, -1550977, 30705658, 7451065, -11805606, 9631813, 3305266, 5248604, -26008332, -11377501]), new FieldElement([17219865, 2375039, -31570947, -5575615, -19459679, 9219903, 294711, 15298639, 2662509, -16297073]), new FieldElement([-1172927, -7558695, -4366770, -4287744, -21346413, -8434326, 32087529, -1222777, 32247248, -14389861])),
            new PreComputedGroupElement(new FieldElement([14312628, 1221556, 17395390, -8700143, -4945741, -8684635, -28197744, -9637817, -16027623, -13378845]), new FieldElement([-1428825, -9678990, -9235681, 6549687, -7383069, -468664, 23046502, 9803137, 17597934, 2346211]), new FieldElement([18510800, 15337574, 26171504, 981392, -22241552, 7827556, -23491134, -11323352, 3059833, -11782870])),
            new PreComputedGroupElement(new FieldElement([10141598, 6082907, 17829293, -1947643, 9830092, 13613136, -25556636, -5544586, -33502212, 3592096]), new FieldElement([33114168, -15889352, -26525686, -13343397, 33076705, 8716171, 1151462, 1521897, -982665, -6837803]), new FieldElement([-32939165, -4255815, 23947181, -324178, -33072974, -12305637, -16637686, 3891704, 26353178, 693168])),
            new PreComputedGroupElement(new FieldElement([30374239, 1595580, -16884039, 13186931, 4600344, 406904, 9585294, -400668, 31375464, 14369965]), new FieldElement([-14370654, -7772529, 1510301, 6434173, -18784789, -6262728, 32732230, -13108839, 17901441, 16011505]), new FieldElement([18171223, -11934626, -12500402, 15197122, -11038147, -15230035, -19172240, -16046376, 8764035, 12309598]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([5975908, -5243188, -19459362, -9681747, -11541277, 14015782, -23665757, 1228319, 17544096, -10593782]), new FieldElement([5811932, -1715293, 3442887, -2269310, -18367348, -8359541, -18044043, -15410127, -5565381, 12348900]), new FieldElement([-31399660, 11407555, 25755363, 6891399, -3256938, 14872274, -24849353, 8141295, -10632534, -585479])),
            new PreComputedGroupElement(new FieldElement([-12675304, 694026, -5076145, 13300344, 14015258, -14451394, -9698672, -11329050, 30944593, 1130208]), new FieldElement([8247766, -6710942, -26562381, -7709309, -14401939, -14648910, 4652152, 2488540, 23550156, -271232]), new FieldElement([17294316, -3788438, 7026748, 15626851, 22990044, 113481, 2267737, -5908146, -408818, -137719])),
            new PreComputedGroupElement(new FieldElement([16091085, -16253926, 18599252, 7340678, 2137637, -1221657, -3364161, 14550936, 3260525, -7166271]), new FieldElement([-4910104, -13332887, 18550887, 10864893, -16459325, -7291596, -23028869, -13204905, -12748722, 2701326]), new FieldElement([-8574695, 16099415, 4629974, -16340524, -20786213, -6005432, -10018363, 9276971, 11329923, 1862132])),
            new PreComputedGroupElement(new FieldElement([14763076, -15903608, -30918270, 3689867, 3511892, 10313526, -21951088, 12219231, -9037963, -940300]), new FieldElement([8894987, -3446094, 6150753, 3013931, 301220, 15693451, -31981216, -2909717, -15438168, 11595570]), new FieldElement([15214962, 3537601, -26238722, -14058872, 4418657, -15230761, 13947276, 10730794, -13489462, -4363670])),
            new PreComputedGroupElement(new FieldElement([-2538306, 7682793, 32759013, 263109, -29984731, -7955452, -22332124, -10188635, 977108, 699994]), new FieldElement([-12466472, 4195084, -9211532, 550904, -15565337, 12917920, 19118110, -439841, -30534533, -14337913]), new FieldElement([31788461, -14507657, 4799989, 7372237, 8808585, -14747943, 9408237, -10051775, 12493932, -5409317])),
            new PreComputedGroupElement(new FieldElement([-25680606, 5260744, -19235809, -6284470, -3695942, 16566087, 27218280, 2607121, 29375955, 6024730]), new FieldElement([842132, -2794693, -4763381, -8722815, 26332018, -12405641, 11831880, 6985184, -9940361, 2854096]), new FieldElement([-4847262, -7969331, 2516242, -5847713, 9695691, -7221186, 16512645, 960770, 12121869, 16648078])),
            new PreComputedGroupElement(new FieldElement([-15218652, 14667096, -13336229, 2013717, 30598287, -464137, -31504922, -7882064, 20237806, 2838411]), new FieldElement([-19288047, 4453152, 15298546, -16178388, 22115043, -15972604, 12544294, -13470457, 1068881, -12499905]), new FieldElement([-9558883, -16518835, 33238498, 13506958, 30505848, -1114596, -8486907, -2630053, 12521378, 4845654])),
            new PreComputedGroupElement(new FieldElement([-28198521, 10744108, -2958380, 10199664, 7759311, -13088600, 3409348, -873400, -6482306, -12885870]), new FieldElement([-23561822, 6230156, -20382013, 10655314, -24040585, -11621172, 10477734, -1240216, -3113227, 13974498]), new FieldElement([12966261, 15550616, -32038948, -1615346, 21025980, -629444, 5642325, 7188737, 18895762, 12629579]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([14741879, -14946887, 22177208, -11721237, 1279741, 8058600, 11758140, 789443, 32195181, 3895677]), new FieldElement([10758205, 15755439, -4509950, 9243698, -4879422, 6879879, -2204575, -3566119, -8982069, 4429647]), new FieldElement([-2453894, 15725973, -20436342, -10410672, -5803908, -11040220, -7135870, -11642895, 18047436, -15281743])),
            new PreComputedGroupElement(new FieldElement([-25173001, -11307165, 29759956, 11776784, -22262383, -15820455, 10993114, -12850837, -17620701, -9408468]), new FieldElement([21987233, 700364, -24505048, 14972008, -7774265, -5718395, 32155026, 2581431, -29958985, 8773375]), new FieldElement([-25568350, 454463, -13211935, 16126715, 25240068, 8594567, 20656846, 12017935, -7874389, -13920155])),
            new PreComputedGroupElement(new FieldElement([6028182, 6263078, -31011806, -11301710, -818919, 2461772, -31841174, -5468042, -1721788, -2776725]), new FieldElement([-12278994, 16624277, 987579, -5922598, 32908203, 1248608, 7719845, -4166698, 28408820, 6816612]), new FieldElement([-10358094, -8237829, 19549651, -12169222, 22082623, 16147817, 20613181, 13982702, -10339570, 5067943])),
            new PreComputedGroupElement(new FieldElement([-30505967, -3821767, 12074681, 13582412, -19877972, 2443951, -19719286, 12746132, 5331210, -10105944]), new FieldElement([30528811, 3601899, -1957090, 4619785, -27361822, -15436388, 24180793, -12570394, 27679908, -1648928]), new FieldElement([9402404, -13957065, 32834043, 10838634, -26580150, -13237195, 26653274, -8685565, 22611444, -12715406])),
            new PreComputedGroupElement(new FieldElement([22190590, 1118029, 22736441, 15130463, -30460692, -5991321, 19189625, -4648942, 4854859, 6622139]), new FieldElement([-8310738, -2953450, -8262579, -3388049, -10401731, -271929, 13424426, -3567227, 26404409, 13001963]), new FieldElement([-31241838, -15415700, -2994250, 8939346, 11562230, -12840670, -26064365, -11621720, -15405155, 11020693])),
            new PreComputedGroupElement(new FieldElement([1866042, -7949489, -7898649, -10301010, 12483315, 13477547, 3175636, -12424163, 28761762, 1406734]), new FieldElement([-448555, -1777666, 13018551, 3194501, -9580420, -11161737, 24760585, -4347088, 25577411, -13378680]), new FieldElement([-24290378, 4759345, -690653, -1852816, 2066747, 10693769, -29595790, 9884936, -9368926, 4745410])),
            new PreComputedGroupElement(new FieldElement([-9141284, 6049714, -19531061, -4341411, -31260798, 9944276, -15462008, -11311852, 10931924, -11931931]), new FieldElement([-16561513, 14112680, -8012645, 4817318, -8040464, -11414606, -22853429, 10856641, -20470770, 13434654]), new FieldElement([22759489, -10073434, -16766264, -1871422, 13637442, -10168091, 1765144, -12654326, 28445307, -5364710])),
            new PreComputedGroupElement(new FieldElement([29875063, 12493613, 2795536, -3786330, 1710620, 15181182, -10195717, -8788675, 9074234, 1167180]), new FieldElement([-26205683, 11014233, -9842651, -2635485, -26908120, 7532294, -18716888, -9535498, 3843903, 9367684]), new FieldElement([-10969595, -6403711, 9591134, 9582310, 11349256, 108879, 16235123, 8601684, -139197, 4242895]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([22092954, -13191123, -2042793, -11968512, 32186753, -11517388, -6574341, 2470660, -27417366, 16625501]), new FieldElement([-11057722, 3042016, 13770083, -9257922, 584236, -544855, -7770857, 2602725, -27351616, 14247413]), new FieldElement([6314175, -10264892, -32772502, 15957557, -10157730, 168750, -8618807, 14290061, 27108877, -1180880])),
            new PreComputedGroupElement(new FieldElement([-8586597, -7170966, 13241782, 10960156, -32991015, -13794596, 33547976, -11058889, -27148451, 981874]), new FieldElement([22833440, 9293594, -32649448, -13618667, -9136966, 14756819, -22928859, -13970780, -10479804, -16197962]), new FieldElement([-7768587, 3326786, -28111797, 10783824, 19178761, 14905060, 22680049, 13906969, -15933690, 3797899])),
            new PreComputedGroupElement(new FieldElement([21721356, -4212746, -12206123, 9310182, -3882239, -13653110, 23740224, -2709232, 20491983, -8042152]), new FieldElement([9209270, -15135055, -13256557, -6167798, -731016, 15289673, 25947805, 15286587, 30997318, -6703063]), new FieldElement([7392032, 16618386, 23946583, -8039892, -13265164, -1533858, -14197445, -2321576, 17649998, -250080])),
            new PreComputedGroupElement(new FieldElement([-9301088, -14193827, 30609526, -3049543, -25175069, -1283752, -15241566, -9525724, -2233253, 7662146]), new FieldElement([-17558673, 1763594, -33114336, 15908610, -30040870, -12174295, 7335080, -8472199, -3174674, 3440183]), new FieldElement([-19889700, -5977008, -24111293, -9688870, 10799743, -16571957, 40450, -4431835, 4862400, 1133])),
            new PreComputedGroupElement(new FieldElement([-32856209, -7873957, -5422389, 14860950, -16319031, 7956142, 7258061, 311861, -30594991, -7379421]), new FieldElement([-3773428, -1565936, 28985340, 7499440, 24445838, 9325937, 29727763, 16527196, 18278453, 15405622]), new FieldElement([-4381906, 8508652, -19898366, -3674424, -5984453, 15149970, -13313598, 843523, -21875062, 13626197])),
            new PreComputedGroupElement(new FieldElement([2281448, -13487055, -10915418, -2609910, 1879358, 16164207, -10783882, 3953792, 13340839, 15928663]), new FieldElement([31727126, -7179855, -18437503, -8283652, 2875793, -16390330, -25269894, -7014826, -23452306, 5964753]), new FieldElement([4100420, -5959452, -17179337, 6017714, -18705837, 12227141, -26684835, 11344144, 2538215, -7570755])),
            new PreComputedGroupElement(new FieldElement([-9433605, 6123113, 11159803, -2156608, 30016280, 14966241, -20474983, 1485421, -629256, -15958862]), new FieldElement([-26804558, 4260919, 11851389, 9658551, -32017107, 16367492, -20205425, -13191288, 11659922, -11115118]), new FieldElement([26180396, 10015009, -30844224, -8581293, 5418197, 9480663, 2231568, -10170080, 33100372, -1306171])),
            new PreComputedGroupElement(new FieldElement([15121113, -5201871, -10389905, 15427821, -27509937, -15992507, 21670947, 4486675, -5931810, -14466380]), new FieldElement([16166486, -9483733, -11104130, 6023908, -31926798, -1364923, 2340060, -16254968, -10735770, -10039824]), new FieldElement([28042865, -3557089, -12126526, 12259706, -3717498, -6945899, 6766453, -8689599, 18036436, 5803270]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-817581, 6763912, 11803561, 1585585, 10958447, -2671165, 23855391, 4598332, -6159431, -14117438]), new FieldElement([-31031306, -14256194, 17332029, -2383520, 31312682, -5967183, 696309, 50292, -20095739, 11763584]), new FieldElement([-594563, -2514283, -32234153, 12643980, 12650761, 14811489, 665117, -12613632, -19773211, -10713562])),
            new PreComputedGroupElement(new FieldElement([30464590, -11262872, -4127476, -12734478, 19835327, -7105613, -24396175, 2075773, -17020157, 992471]), new FieldElement([18357185, -6994433, 7766382, 16342475, -29324918, 411174, 14578841, 8080033, -11574335, -10601610]), new FieldElement([19598397, 10334610, 12555054, 2555664, 18821899, -10339780, 21873263, 16014234, 26224780, 16452269])),
            new PreComputedGroupElement(new FieldElement([-30223925, 5145196, 5944548, 16385966, 3976735, 2009897, -11377804, -7618186, -20533829, 3698650]), new FieldElement([14187449, 3448569, -10636236, -10810935, -22663880, -3433596, 7268410, -10890444, 27394301, 12015369]), new FieldElement([19695761, 16087646, 28032085, 12999827, 6817792, 11427614, 20244189, -1312777, -13259127, -3402461])),
            new PreComputedGroupElement(new FieldElement([30860103, 12735208, -1888245, -4699734, -16974906, 2256940, -8166013, 12298312, -8550524, -10393462]), new FieldElement([-5719826, -11245325, -1910649, 15569035, 26642876, -7587760, -5789354, -15118654, -4976164, 12651793]), new FieldElement([-2848395, 9953421, 11531313, -5282879, 26895123, -12697089, -13118820, -16517902, 9768698, -2533218])),
            new PreComputedGroupElement(new FieldElement([-24719459, 1894651, -287698, -4704085, 15348719, -8156530, 32767513, 12765450, 4940095, 10678226]), new FieldElement([18860224, 15980149, -18987240, -1562570, -26233012, -11071856, -7843882, 13944024, -24372348, 16582019]), new FieldElement([-15504260, 4970268, -29893044, 4175593, -20993212, -2199756, -11704054, 15444560, -11003761, 7989037])),
            new PreComputedGroupElement(new FieldElement([31490452, 5568061, -2412803, 2182383, -32336847, 4531686, -32078269, 6200206, -19686113, -14800171]), new FieldElement([-17308668, -15879940, -31522777, -2831, -32887382, 16375549, 8680158, -16371713, 28550068, -6857132]), new FieldElement([-28126887, -5688091, 16837845, -1820458, -6850681, 12700016, -30039981, 4364038, 1155602, 5988841])),
            new PreComputedGroupElement(new FieldElement([21890435, -13272907, -12624011, 12154349, -7831873, 15300496, 23148983, -4470481, 24618407, 8283181]), new FieldElement([-33136107, -10512751, 9975416, 6841041, -31559793, 16356536, 3070187, -7025928, 1466169, 10740210]), new FieldElement([-1509399, -15488185, -13503385, -10655916, 32799044, 909394, -13938903, -5779719, -32164649, -15327040])),
            new PreComputedGroupElement(new FieldElement([3960823, -14267803, -28026090, -15918051, -19404858, 13146868, 15567327, 951507, -3260321, -573935]), new FieldElement([24740841, 5052253, -30094131, 8961361, 25877428, 6165135, -24368180, 14397372, -7380369, -6144105]), new FieldElement([-28888365, 3510803, -28103278, -1158478, -11238128, -10631454, -15441463, -14453128, -1625486, -6494814]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([793299, -9230478, 8836302, -6235707, -27360908, -2369593, 33152843, -4885251, -9906200, -621852]), new FieldElement([5666233, 525582, 20782575, -8038419, -24538499, 14657740, 16099374, 1468826, -6171428, -15186581]), new FieldElement([-4859255, -3779343, -2917758, -6748019, 7778750, 11688288, -30404353, -9871238, -1558923, -9863646])),
            new PreComputedGroupElement(new FieldElement([10896332, -7719704, 824275, 472601, -19460308, 3009587, 25248958, 14783338, -30581476, -15757844]), new FieldElement([10566929, 12612572, -31944212, 11118703, -12633376, 12362879, 21752402, 8822496, 24003793, 14264025]), new FieldElement([27713862, -7355973, -11008240, 9227530, 27050101, 2504721, 23886875, -13117525, 13958495, -5732453])),
            new PreComputedGroupElement(new FieldElement([-23481610, 4867226, -27247128, 3900521, 29838369, -8212291, -31889399, -10041781, 7340521, -15410068]), new FieldElement([4646514, -8011124, -22766023, -11532654, 23184553, 8566613, 31366726, -1381061, -15066784, -10375192]), new FieldElement([-17270517, 12723032, -16993061, 14878794, 21619651, -6197576, 27584817, 3093888, -8843694, 3849921])),
            new PreComputedGroupElement(new FieldElement([-9064912, 2103172, 25561640, -15125738, -5239824, 9582958, 32477045, -9017955, 5002294, -15550259]), new FieldElement([-12057553, -11177906, 21115585, -13365155, 8808712, -12030708, 16489530, 13378448, -25845716, 12741426]), new FieldElement([-5946367, 10645103, -30911586, 15390284, -3286982, -7118677, 24306472, 15852464, 28834118, -7646072])),
            new PreComputedGroupElement(new FieldElement([-17335748, -9107057, -24531279, 9434953, -8472084, -583362, -13090771, 455841, 20461858, 5491305]), new FieldElement([13669248, -16095482, -12481974, -10203039, -14569770, -11893198, -24995986, 11293807, -28588204, -9421832]), new FieldElement([28497928, 6272777, -33022994, 14470570, 8906179, -1225630, 18504674, -14165166, 29867745, -8795943])),
            new PreComputedGroupElement(new FieldElement([-16207023, 13517196, -27799630, -13697798, 24009064, -6373891, -6367600, -13175392, 22853429, -4012011]), new FieldElement([24191378, 16712145, -13931797, 15217831, 14542237, 1646131, 18603514, -11037887, 12876623, -2112447]), new FieldElement([17902668, 4518229, -411702, -2829247, 26878217, 5258055, -12860753, 608397, 16031844, 3723494])),
            new PreComputedGroupElement(new FieldElement([-28632773, 12763728, -20446446, 7577504, 33001348, -13017745, 17558842, -7872890, 23896954, -4314245]), new FieldElement([-20005381, -12011952, 31520464, 605201, 2543521, 5991821, -2945064, 7229064, -9919646, -8826859]), new FieldElement([28816045, 298879, -28165016, -15920938, 19000928, -1665890, -12680833, -2949325, -18051778, -2082915])),
            new PreComputedGroupElement(new FieldElement([16000882, -344896, 3493092, -11447198, -29504595, -13159789, 12577740, 16041268, -19715240, 7847707]), new FieldElement([10151868, 10572098, 27312476, 7922682, 14825339, 4723128, -32855931, -6519018, -10020567, 3852848]), new FieldElement([-11430470, 15697596, -21121557, -4420647, 5386314, 15063598, 16514493, -15932110, 29330899, -15076224]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-25499735, -4378794, -15222908, -6901211, 16615731, 2051784, 3303702, 15490, -27548796, 12314391]), new FieldElement([15683520, -6003043, 18109120, -9980648, 15337968, -5997823, -16717435, 15921866, 16103996, -3731215]), new FieldElement([-23169824, -10781249, 13588192, -1628807, -3798557, -1074929, -19273607, 5402699, -29815713, -9841101])),
            new PreComputedGroupElement(new FieldElement([23190676, 2384583, -32714340, 3462154, -29903655, -1529132, -11266856, 8911517, -25205859, 2739713]), new FieldElement([21374101, -3554250, -33524649, 9874411, 15377179, 11831242, -33529904, 6134907, 4931255, 11987849]), new FieldElement([-7732, -2978858, -16223486, 7277597, 105524, -322051, -31480539, 13861388, -30076310, 10117930])),
            new PreComputedGroupElement(new FieldElement([-29501170, -10744872, -26163768, 13051539, -25625564, 5089643, -6325503, 6704079, 12890019, 15728940]), new FieldElement([-21972360, -11771379, -951059, -4418840, 14704840, 2695116, 903376, -10428139, 12885167, 8311031]), new FieldElement([-17516482, 5352194, 10384213, -13811658, 7506451, 13453191, 26423267, 4384730, 1888765, -5435404])),
            new PreComputedGroupElement(new FieldElement([-25817338, -3107312, -13494599, -3182506, 30896459, -13921729, -32251644, -12707869, -19464434, -3340243]), new FieldElement([-23607977, -2665774, -526091, 4651136, 5765089, 4618330, 6092245, 14845197, 17151279, -9854116]), new FieldElement([-24830458, -12733720, -15165978, 10367250, -29530908, -265356, 22825805, -7087279, -16866484, 16176525])),
            new PreComputedGroupElement(new FieldElement([-23583256, 6564961, 20063689, 3798228, -4740178, 7359225, 2006182, -10363426, -28746253, -10197509]), new FieldElement([-10626600, -4486402, -13320562, -5125317, 3432136, -6393229, 23632037, -1940610, 32808310, 1099883]), new FieldElement([15030977, 5768825, -27451236, -2887299, -6427378, -15361371, -15277896, -6809350, 2051441, -15225865])),
            new PreComputedGroupElement(new FieldElement([-3362323, -7239372, 7517890, 9824992, 23555850, 295369, 5148398, -14154188, -22686354, 16633660]), new FieldElement([4577086, -16752288, 13249841, -15304328, 19958763, -14537274, 18559670, -10759549, 8402478, -9864273]), new FieldElement([-28406330, -1051581, -26790155, -907698, -17212414, -11030789, 9453451, -14980072, 17983010, 9967138])),
            new PreComputedGroupElement(new FieldElement([-25762494, 6524722, 26585488, 9969270, 24709298, 1220360, -1677990, 7806337, 17507396, 3651560]), new FieldElement([-10420457, -4118111, 14584639, 15971087, -15768321, 8861010, 26556809, -5574557, -18553322, -11357135]), new FieldElement([2839101, 14284142, 4029895, 3472686, 14402957, 12689363, -26642121, 8459447, -5605463, -7621941])),
            new PreComputedGroupElement(new FieldElement([-4839289, -3535444, 9744961, 2871048, 25113978, 3187018, -25110813, -849066, 17258084, -7977739]), new FieldElement([18164541, -10595176, -17154882, -1542417, 19237078, -9745295, 23357533, -15217008, 26908270, 12150756]), new FieldElement([-30264870, -7647865, 5112249, -7036672, -1499807, -6974257, 43168, -5537701, -32302074, 16215819]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-6898905, 9824394, -12304779, -4401089, -31397141, -6276835, 32574489, 12532905, -7503072, -8675347]), new FieldElement([-27343522, -16515468, -27151524, -10722951, 946346, 16291093, 254968, 7168080, 21676107, -1943028]), new FieldElement([21260961, -8424752, -16831886, -11920822, -23677961, 3968121, -3651949, -6215466, -3556191, -7913075])),
            new PreComputedGroupElement(new FieldElement([16544754, 13250366, -16804428, 15546242, -4583003, 12757258, -2462308, -8680336, -18907032, -9662799]), new FieldElement([-2415239, -15577728, 18312303, 4964443, -15272530, -12653564, 26820651, 16690659, 25459437, -4564609]), new FieldElement([-25144690, 11425020, 28423002, -11020557, -6144921, -15826224, 9142795, -2391602, -6432418, -1644817])),
            new PreComputedGroupElement(new FieldElement([-23104652, 6253476, 16964147, -3768872, -25113972, -12296437, -27457225, -16344658, 6335692, 7249989]), new FieldElement([-30333227, 13979675, 7503222, -12368314, -11956721, -4621693, -30272269, 2682242, 25993170, -12478523]), new FieldElement([4364628, 5930691, 32304656, -10044554, -8054781, 15091131, 22857016, -10598955, 31820368, 15075278])),
            new PreComputedGroupElement(new FieldElement([31879134, -8918693, 17258761, 90626, -8041836, -4917709, 24162788, -9650886, -17970238, 12833045]), new FieldElement([19073683, 14851414, -24403169, -11860168, 7625278, 11091125, -19619190, 2074449, -9413939, 14905377]), new FieldElement([24483667, -11935567, -2518866, -11547418, -1553130, 15355506, -25282080, 9253129, 27628530, -7555480])),
            new PreComputedGroupElement(new FieldElement([17597607, 8340603, 19355617, 552187, 26198470, -3176583, 4593324, -9157582, -14110875, 15297016]), new FieldElement([510886, 14337390, -31785257, 16638632, 6328095, 2713355, -20217417, -11864220, 8683221, 2921426]), new FieldElement([18606791, 11874196, 27155355, -5281482, -24031742, 6265446, -25178240, -1278924, 4674690, 13890525])),
            new PreComputedGroupElement(new FieldElement([13609624, 13069022, -27372361, -13055908, 24360586, 9592974, 14977157, 9835105, 4389687, 288396]), new FieldElement([9922506, -519394, 13613107, 5883594, -18758345, -434263, -12304062, 8317628, 23388070, 16052080]), new FieldElement([12720016, 11937594, -31970060, -5028689, 26900120, 8561328, -20155687, -11632979, -14754271, -10812892])),
            new PreComputedGroupElement(new FieldElement([15961858, 14150409, 26716931, -665832, -22794328, 13603569, 11829573, 7467844, -28822128, 929275]), new FieldElement([11038231, -11582396, -27310482, -7316562, -10498527, -16307831, -23479533, -9371869, -21393143, 2465074]), new FieldElement([20017163, -4323226, 27915242, 1529148, 12396362, 15675764, 13817261, -9658066, 2463391, -4622140])),
            new PreComputedGroupElement(new FieldElement([-16358878, -12663911, -12065183, 4996454, -1256422, 1073572, 9583558, 12851107, 4003896, 12673717]), new FieldElement([-1731589, -15155870, -3262930, 16143082, 19294135, 13385325, 14741514, -9103726, 7903886, 2348101]), new FieldElement([24536016, -16515207, 12715592, -3862155, 1511293, 10047386, -3842346, -7129159, -28377538, 10048127]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-12622226, -6204820, 30718825, 2591312, -10617028, 12192840, 18873298, -7297090, -32297756, 15221632]), new FieldElement([-26478122, -11103864, 11546244, -1852483, 9180880, 7656409, -21343950, 2095755, 29769758, 6593415]), new FieldElement([-31994208, -2907461, 4176912, 3264766, 12538965, -868111, 26312345, -6118678, 30958054, 8292160])),
            new PreComputedGroupElement(new FieldElement([31429822, -13959116, 29173532, 15632448, 12174511, -2760094, 32808831, 3977186, 26143136, -3148876]), new FieldElement([22648901, 1402143, -22799984, 13746059, 7936347, 365344, -8668633, -1674433, -3758243, -2304625]), new FieldElement([-15491917, 8012313, -2514730, -12702462, -23965846, -10254029, -1612713, -1535569, -16664475, 8194478])),
            new PreComputedGroupElement(new FieldElement([27338066, -7507420, -7414224, 10140405, -19026427, -6589889, 27277191, 8855376, 28572286, 3005164]), new FieldElement([26287124, 4821776, 25476601, -4145903, -3764513, -15788984, -18008582, 1182479, -26094821, -13079595]), new FieldElement([-7171154, 3178080, 23970071, 6201893, -17195577, -4489192, -21876275, -13982627, 32208683, -1198248])),
            new PreComputedGroupElement(new FieldElement([-16657702, 2817643, -10286362, 14811298, 6024667, 13349505, -27315504, -10497842, -27672585, -11539858]), new FieldElement([15941029, -9405932, -21367050, 8062055, 31876073, -238629, -15278393, -1444429, 15397331, -4130193]), new FieldElement([8934485, -13485467, -23286397, -13423241, -32446090, 14047986, 31170398, -1441021, -27505566, 15087184])),
            new PreComputedGroupElement(new FieldElement([-18357243, -2156491, 24524913, -16677868, 15520427, -6360776, -15502406, 11461896, 16788528, -5868942]), new FieldElement([-1947386, 16013773, 21750665, 3714552, -17401782, -16055433, -3770287, -10323320, 31322514, -11615635]), new FieldElement([21426655, -5650218, -13648287, -5347537, -28812189, -4920970, -18275391, -14621414, 13040862, -12112948])),
            new PreComputedGroupElement(new FieldElement([11293895, 12478086, -27136401, 15083750, -29307421, 14748872, 14555558, -13417103, 1613711, 4896935]), new FieldElement([-25894883, 15323294, -8489791, -8057900, 25967126, -13425460, 2825960, -4897045, -23971776, -11267415]), new FieldElement([-15924766, -5229880, -17443532, 6410664, 3622847, 10243618, 20615400, 12405433, -23753030, -8436416])),
            new PreComputedGroupElement(new FieldElement([-7091295, 12556208, -20191352, 9025187, -17072479, 4333801, 4378436, 2432030, 23097949, -566018]), new FieldElement([4565804, -16025654, 20084412, -7842817, 1724999, 189254, 24767264, 10103221, -18512313, 2424778]), new FieldElement([366633, -11976806, 8173090, -6890119, 30788634, 5745705, -7168678, 1344109, -3642553, 12412659])),
            new PreComputedGroupElement(new FieldElement([-24001791, 7690286, 14929416, -168257, -32210835, -13412986, 24162697, -15326504, -3141501, 11179385]), new FieldElement([18289522, -14724954, 8056945, 16430056, -21729724, 7842514, -6001441, -1486897, -18684645, -11443503]), new FieldElement([476239, 6601091, -6152790, -9723375, 17503545, -4863900, 27672959, 13403813, 11052904, 5219329]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([20678546, -8375738, -32671898, 8849123, -5009758, 14574752, 31186971, -3973730, 9014762, -8579056]), new FieldElement([-13644050, -10350239, -15962508, 5075808, -1514661, -11534600, -33102500, 9160280, 8473550, -3256838]), new FieldElement([24900749, 14435722, 17209120, -15292541, -22592275, 9878983, -7689309, -16335821, -24568481, 11788948])),
            new PreComputedGroupElement(new FieldElement([-3118155, -11395194, -13802089, 14797441, 9652448, -6845904, -20037437, 10410733, -24568470, -1458691]), new FieldElement([-15659161, 16736706, -22467150, 10215878, -9097177, 7563911, 11871841, -12505194, -18513325, 8464118]), new FieldElement([-23400612, 8348507, -14585951, -861714, -3950205, -6373419, 14325289, 8628612, 33313881, -8370517])),
            new PreComputedGroupElement(new FieldElement([-20186973, -4967935, 22367356, 5271547, -1097117, -4788838, -24805667, -10236854, -8940735, -5818269]), new FieldElement([-6948785, -1795212, -32625683, -16021179, 32635414, -7374245, 15989197, -12838188, 28358192, -4253904]), new FieldElement([-23561781, -2799059, -32351682, -1661963, -9147719, 10429267, -16637684, 4072016, -5351664, 5596589])),
            new PreComputedGroupElement(new FieldElement([-28236598, -3390048, 12312896, 6213178, 3117142, 16078565, 29266239, 2557221, 1768301, 15373193]), new FieldElement([-7243358, -3246960, -4593467, -7553353, -127927, -912245, -1090902, -4504991, -24660491, 3442910]), new FieldElement([-30210571, 5124043, 14181784, 8197961, 18964734, -11939093, 22597931, 7176455, -18585478, 13365930])),
            new PreComputedGroupElement(new FieldElement([-7877390, -1499958, 8324673, 4690079, 6261860, 890446, 24538107, -8570186, -9689599, -3031667]), new FieldElement([25008904, -10771599, -4305031, -9638010, 16265036, 15721635, 683793, -11823784, 15723479, -15163481]), new FieldElement([-9660625, 12374379, -27006999, -7026148, -7724114, -12314514, 11879682, 5400171, 519526, -1235876])),
            new PreComputedGroupElement(new FieldElement([22258397, -16332233, -7869817, 14613016, -22520255, -2950923, -20353881, 7315967, 16648397, 7605640]), new FieldElement([-8081308, -8464597, -8223311, 9719710, 19259459, -15348212, 23994942, -5281555, -9468848, 4763278]), new FieldElement([-21699244, 9220969, -15730624, 1084137, -25476107, -2852390, 31088447, -7764523, -11356529, 728112])),
            new PreComputedGroupElement(new FieldElement([26047220, -11751471, -6900323, -16521798, 24092068, 9158119, -4273545, -12555558, -29365436, -5498272]), new FieldElement([17510331, -322857, 5854289, 8403524, 17133918, -3112612, -28111007, 12327945, 10750447, 10014012]), new FieldElement([-10312768, 3936952, 9156313, -8897683, 16498692, -994647, -27481051, -666732, 3424691, 7540221])),
            new PreComputedGroupElement(new FieldElement([30322361, -6964110, 11361005, -4143317, 7433304, 4989748, -7071422, -16317219, -9244265, 15258046]), new FieldElement([13054562, -2779497, 19155474, 469045, -12482797, 4566042, 5631406, 2711395, 1062915, -5136345]), new FieldElement([-19240248, -11254599, -29509029, -7499965, -5835763, 13005411, -6066489, 12194497, 32960380, 1459310]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([19852034, 7027924, 23669353, 10020366, 8586503, -6657907, 394197, -6101885, 18638003, -11174937]), new FieldElement([31395534, 15098109, 26581030, 8030562, -16527914, -5007134, 9012486, -7584354, -6643087, -5442636]), new FieldElement([-9192165, -2347377, -1997099, 4529534, 25766844, 607986, -13222, 9677543, -32294889, -6456008])),
            new PreComputedGroupElement(new FieldElement([-2444496, -149937, 29348902, 8186665, 1873760, 12489863, -30934579, -7839692, -7852844, -8138429]), new FieldElement([-15236356, -15433509, 7766470, 746860, 26346930, -10221762, -27333451, 10754588, -9431476, 5203576]), new FieldElement([31834314, 14135496, -770007, 5159118, 20917671, -16768096, -7467973, -7337524, 31809243, 7347066])),
            new PreComputedGroupElement(new FieldElement([-9606723, -11874240, 20414459, 13033986, 13716524, -11691881, 19797970, -12211255, 15192876, -2087490]), new FieldElement([-12663563, -2181719, 1168162, -3804809, 26747877, -14138091, 10609330, 12694420, 33473243, -13382104]), new FieldElement([33184999, 11180355, 15832085, -11385430, -1633671, 225884, 15089336, -11023903, -6135662, 14480053])),
            new PreComputedGroupElement(new FieldElement([31308717, -5619998, 31030840, -1897099, 15674547, -6582883, 5496208, 13685227, 27595050, 8737275]), new FieldElement([-20318852, -15150239, 10933843, -16178022, 8335352, -7546022, -31008351, -12610604, 26498114, 66511]), new FieldElement([22644454, -8761729, -16671776, 4884562, -3105614, -13559366, 30540766, -4286747, -13327787, -7515095])),
            new PreComputedGroupElement(new FieldElement([-28017847, 9834845, 18617207, -2681312, -3401956, -13307506, 8205540, 13585437, -17127465, 15115439]), new FieldElement([23711543, -672915, 31206561, -8362711, 6164647, -9709987, -33535882, -1426096, 8236921, 16492939]), new FieldElement([-23910559, -13515526, -26299483, -4503841, 25005590, -7687270, 19574902, 10071562, 6708380, -6222424])),
            new PreComputedGroupElement(new FieldElement([2101391, -4930054, 19702731, 2367575, -15427167, 1047675, 5301017, 9328700, 29955601, -11678310]), new FieldElement([3096359, 9271816, -21620864, -15521844, -14847996, -7592937, -25892142, -12635595, -9917575, 6216608]), new FieldElement([-32615849, 338663, -25195611, 2510422, -29213566, -13820213, 24822830, -6146567, -26767480, 7525079])),
            new PreComputedGroupElement(new FieldElement([-23066649, -13985623, 16133487, -7896178, -3389565, 778788, -910336, -2782495, -19386633, 11994101]), new FieldElement([21691500, -13624626, -641331, -14367021, 3285881, -3483596, -25064666, 9718258, -7477437, 13381418]), new FieldElement([18445390, -4202236, 14979846, 11622458, -1727110, -3582980, 23111648, -6375247, 28535282, 15779576])),
            new PreComputedGroupElement(new FieldElement([30098053, 3089662, -9234387, 16662135, -21306940, 11308411, -14068454, 12021730, 9955285, -16303356]), new FieldElement([9734894, -14576830, -7473633, -9138735, 2060392, 11313496, -18426029, 9924399, 20194861, 13380996]), new FieldElement([-26378102, -7965207, -22167821, 15789297, -18055342, -6168792, -1984914, 15707771, 26342023, 10146099]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([-26016874, -219943, 21339191, -41388, 19745256, -2878700, -29637280, 2227040, 21612326, -545728]), new FieldElement([-13077387, 1184228, 23562814, -5970442, -20351244, -6348714, 25764461, 12243797, -20856566, 11649658]), new FieldElement([-10031494, 11262626, 27384172, 2271902, 26947504, -15997771, 39944, 6114064, 33514190, 2333242])),
            new PreComputedGroupElement(new FieldElement([-21433588, -12421821, 8119782, 7219913, -21830522, -9016134, -6679750, -12670638, 24350578, -13450001]), new FieldElement([-4116307, -11271533, -23886186, 4843615, -30088339, 690623, -31536088, -10406836, 8317860, 12352766]), new FieldElement([18200138, -14475911, -33087759, -2696619, -23702521, -9102511, -23552096, -2287550, 20712163, 6719373])),
            new PreComputedGroupElement(new FieldElement([26656208, 6075253, -7858556, 1886072, -28344043, 4262326, 11117530, -3763210, 26224235, -3297458]), new FieldElement([-17168938, -14854097, -3395676, -16369877, -19954045, 14050420, 21728352, 9493610, 18620611, -16428628]), new FieldElement([-13323321, 13325349, 11432106, 5964811, 18609221, 6062965, -5269471, -9725556, -30701573, -16479657])),
            new PreComputedGroupElement(new FieldElement([-23860538, -11233159, 26961357, 1640861, -32413112, -16737940, 12248509, -5240639, 13735342, 1934062]), new FieldElement([25089769, 6742589, 17081145, -13406266, 21909293, -16067981, -15136294, -3765346, -21277997, 5473616]), new FieldElement([31883677, -7961101, 1083432, -11572403, 22828471, 13290673, -7125085, 12469656, 29111212, -5451014])),
            new PreComputedGroupElement(new FieldElement([24244947, -15050407, -26262976, 2791540, -14997599, 16666678, 24367466, 6388839, -10295587, 452383]), new FieldElement([-25640782, -3417841, 5217916, 16224624, 19987036, -4082269, -24236251, -5915248, 15766062, 8407814]), new FieldElement([-20406999, 13990231, 15495425, 16395525, 5377168, 15166495, -8917023, -4388953, -8067909, 2276718])),
            new PreComputedGroupElement(new FieldElement([30157918, 12924066, -17712050, 9245753, 19895028, 3368142, -23827587, 5096219, 22740376, -7303417]), new FieldElement([2041139, -14256350, 7783687, 13876377, -25946985, -13352459, 24051124, 13742383, -15637599, 13295222]), new FieldElement([33338237, -8505733, 12532113, 7977527, 9106186, -1715251, -17720195, -4612972, -4451357, -14669444])),
            new PreComputedGroupElement(new FieldElement([-20045281, 5454097, -14346548, 6447146, 28862071, 1883651, -2469266, -4141880, 7770569, 9620597]), new FieldElement([23208068, 7979712, 33071466, 8149229, 1758231, -10834995, 30945528, -1694323, -33502340, -14767970]), new FieldElement([1439958, -16270480, -1079989, -793782, 4625402, 10647766, -5043801, 1220118, 30494170, -11440799])),
            new PreComputedGroupElement(new FieldElement([-5037580, -13028295, -2970559, -3061767, 15640974, -6701666, -26739026, 926050, -1684339, -13333647]), new FieldElement([13908495, -3549272, 30919928, -6273825, -21521863, 7989039, 9021034, 9078865, 3353509, 4033511]), new FieldElement([-29663431, -15113610, 32259991, -344482, 24295849, -12912123, 23161163, 8839127, 27485041, 7356032]))
        ],
        [
            new PreComputedGroupElement(new FieldElement([9661027, 705443, 11980065, -5370154, -1628543, 14661173, -6346142, 2625015, 28431036, -16771834]), new FieldElement([-23839233, -8311415, -25945511, 7480958, -17681669, -8354183, -22545972, 14150565, 15970762, 4099461]), new FieldElement([29262576, 16756590, 26350592, -8793563, 8529671, -11208050, 13617293, -9937143, 11465739, 8317062])),
            new PreComputedGroupElement(new FieldElement([-25493081, -6962928, 32500200, -9419051, -23038724, -2302222, 14898637, 3848455, 20969334, -5157516]), new FieldElement([-20384450, -14347713, -18336405, 13884722, -33039454, 2842114, -21610826, -3649888, 11177095, 14989547]), new FieldElement([-24496721, -11716016, 16959896, 2278463, 12066309, 10137771, 13515641, 2581286, -28487508, 9930240])),
            new PreComputedGroupElement(new FieldElement([-17751622, -2097826, 16544300, -13009300, -15914807, -14949081, 18345767, -13403753, 16291481, -5314038]), new FieldElement([-33229194, 2553288, 32678213, 9875984, 8534129, 6889387, -9676774, 6957617, 4368891, 9788741]), new FieldElement([16660756, 7281060, -10830758, 12911820, 20108584, -8101676, -21722536, -8613148, 16250552, -11111103])),
            new PreComputedGroupElement(new FieldElement([-19765507, 2390526, -16551031, 14161980, 1905286, 6414907, 4689584, 10604807, -30190403, 4782747]), new FieldElement([-1354539, 14736941, -7367442, -13292886, 7710542, -14155590, -9981571, 4383045, 22546403, 437323]), new FieldElement([31665577, -12180464, -16186830, 1491339, -18368625, 3294682, 27343084, 2786261, -30633590, -14097016])),
            new PreComputedGroupElement(new FieldElement([-14467279, -683715, -33374107, 7448552, 19294360, 14334329, -19690631, 2355319, -19284671, -6114373]), new FieldElement([15121312, -15796162, 6377020, -6031361, -10798111, -12957845, 18952177, 15496498, -29380133, 11754228]), new FieldElement([-2637277, -13483075, 8488727, -14303896, 12728761, -1622493, 7141596, 11724556, 22761615, -10134141])),
            new PreComputedGroupElement(new FieldElement([16918416, 11729663, -18083579, 3022987, -31015732, -13339659, -28741185, -12227393, 32851222, 11717399]), new FieldElement([11166634, 7338049, -6722523, 4531520, -29468672, -7302055, 31474879, 3483633, -1193175, -4030831]), new FieldElement([-185635, 9921305, 31456609, -13536438, -12013818, 13348923, 33142652, 6546660, -19985279, -3948376])),
            new PreComputedGroupElement(new FieldElement([-32460596, 11266712, -11197107, -7899103, 31703694, 3855903, -8537131, -12833048, -30772034, -15486313]), new FieldElement([-18006477, 12709068, 3991746, -6479188, -21491523, -10550425, -31135347, -16049879, 10928917, 3011958]), new FieldElement([-6957757, -15594337, 31696059, 334240, 29576716, 14796075, -30831056, -12805180, 18008031, 10258577])),
            new PreComputedGroupElement(new FieldElement([-22448644, 15655569, 7018479, -4410003, -30314266, -1201591, -1853465, 1367120, 25127874, 6671743]), new FieldElement([29701166, -14373934, -10878120, 9279288, -17568, 13127210, 21382910, 11042292, 25838796, 4642684]), new FieldElement([-20430234, 14955537, -24126347, 8124619, -5369288, -5990470, 30468147, -13900640, 18423289, 4177476]))
        ]
    ];

    // Copyright 2020 IOTA Stiftung
    /**
     * Group elements are members of the elliptic curve -x^2 + y^2 = 1 + d * x^2 *
     * y^2 where d = -121665/121666
     * ProjectiveGroupElement: (X:Y:Z) satisfying x=X/Z, y=Y/Z.
     */
    class ProjectiveGroupElement {
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

    // Copyright 2020 IOTA Stiftung
    /**
     * Group elements are members of the elliptic curve -x^2 + y^2 = 1 + d * x^2 * y^2 where d = -121665/121666.
     * ExtendedGroupElement: (X:Y:Z:T) satisfying x=X/Z, y=Y/Z, XY=ZT.
     */
    class ExtendedGroupElement {
        /**
         * Create a new instance of ExtendedGroupElement.
         * @param X The X element.
         * @param Y The Y Element.
         * @param Z The Z Element.
         * @param T The T Element.
         */
        constructor(X, Y, Z, T) {
            this.X = X !== null && X !== void 0 ? X : new FieldElement();
            this.Y = Y !== null && Y !== void 0 ? Y : new FieldElement();
            this.Z = Z !== null && Z !== void 0 ? Z : new FieldElement();
            this.T = T !== null && T !== void 0 ? T : new FieldElement();
        }
        /**
         * Zero the elements.
         */
        zero() {
            this.X.zero();
            this.Y.one();
            this.Z.one();
            this.T.zero();
        }
        /**
         * Double the element.
         * @param cachedGroupElement The element to populate.
         */
        double(cachedGroupElement) {
            const q = new ProjectiveGroupElement();
            this.toProjective(q);
            q.double(cachedGroupElement);
        }
        /**
         * Convert to a cached group element.
         * @param cacheGroupElement The element to populate.
         */
        toCached(cacheGroupElement) {
            cacheGroupElement.yPlusX.add(this.Y, this.X);
            cacheGroupElement.yMinusX.sub(this.Y, this.X);
            cacheGroupElement.Z = this.Z.clone();
            cacheGroupElement.T2d.mul(this.T, CONST_D2);
        }
        /**
         * Convert to a projective group element.
         * @param projectiveGroupElement The element to populate.
         */
        toProjective(projectiveGroupElement) {
            projectiveGroupElement.X = this.X.clone();
            projectiveGroupElement.Y = this.Y.clone();
            projectiveGroupElement.Z = this.Z.clone();
        }
        /**
         * Convert the element to bytes.
         * @param bytes The array to store the bytes in.
         */
        toBytes(bytes) {
            const recip = new FieldElement();
            const x = new FieldElement();
            const y = new FieldElement();
            recip.invert(this.Z);
            x.mul(this.X, recip);
            y.mul(this.Y, recip);
            y.toBytes(bytes);
            bytes[31] ^= x.isNegative() << 7;
        }
        /**
         * Populate the element from bytes.
         * @param bytes The butes to populate from.
         * @returns False is non-zero check.
         */
        fromBytes(bytes) {
            const u = new FieldElement();
            const v = new FieldElement();
            const v3 = new FieldElement();
            const vxx = new FieldElement();
            const check = new FieldElement();
            let i;
            this.Y.fromBytes(bytes);
            this.Z.one();
            u.square(this.Y);
            v.mul(u, CONST_D);
            u.sub(u, this.Z); // y = y^2-1
            v.add(v, this.Z); // v = dy^2+1
            v3.square(v);
            v3.mul(v3, v); // v3 = v^3
            this.X.square(v3);
            this.X.mul(this.X, v);
            this.X.mul(this.X, u); // x = uv^7
            this.X.pow22523(this.X); // x = (uv^7)^((q-5)/8)
            this.X.mul(this.X, v3);
            this.X.mul(this.X, u); // x = uv^3(uv^7)^((q-5)/8)
            const tmpX = new Uint8Array(32);
            const tmp2 = new Uint8Array(32);
            vxx.square(this.X);
            vxx.mul(vxx, v);
            check.sub(vxx, u); // vx^2-u
            if (check.isNonZero() === 1) {
                check.add(vxx, u); // vx^2+u
                if (check.isNonZero() === 1) {
                    return false;
                }
                this.X.mul(this.X, CONST_SQRT_M1);
                this.X.toBytes(tmpX);
                for (i = 0; i < tmpX.length; i++) {
                    tmp2[31 - i] = tmpX[i];
                }
            }
            if (this.X.isNegative() !== (bytes[31] >> 7)) {
                this.X.neg();
            }
            this.T.mul(this.X, this.Y);
            return true;
        }
        /**
         * GeScalarMultBase computes h = a*B, where
         * a = a[0]+256*a[1]+...+256^31 a[31]
         * b is the Ed25519 base point (x,4/5) with x positive.
         *
         * Preconditions:
         * A[31] <= 127.
         * @param a The a.
         */
        scalarMultBase(a) {
            const e = new Int8Array(64);
            for (let i = 0; i < a.length; i++) {
                e[2 * i] = a[i] & 15;
                e[(2 * i) + 1] = (a[i] >> 4) & 15;
            }
            // each e[i] is between 0 and 15 and e[63] is between 0 and 7.
            let carry = 0;
            for (let i = 0; i < 63; i++) {
                e[i] += carry;
                carry = (e[i] + 8) >> 4;
                e[i] -= carry << 4;
            }
            e[63] += carry;
            // each e[i] is between -8 and 8.
            this.zero();
            const t = new PreComputedGroupElement();
            const r = new CompletedGroupElement();
            for (let i = 1; i < 64; i += 2) {
                t.selectPoint(Math.floor(i / 2), e[i]);
                r.mixedAdd(this, t);
                r.toExtended(this);
            }
            const s = new ProjectiveGroupElement();
            this.double(r);
            r.toProjective(s);
            s.double(r);
            r.toProjective(s);
            s.double(r);
            r.toProjective(s);
            s.double(r);
            r.toExtended(this);
            for (let i = 0; i < 64; i += 2) {
                t.selectPoint(i / 2, e[i]);
                r.mixedAdd(this, t);
                r.toExtended(this);
            }
        }
        /**
         * CofactorEqual checks whether p, q are equal up to cofactor multiplication
         * ie if their difference is of small order.
         * @param q The extended group element.
         * @returns True if they are equal.
         */
        cofactorEqual(q) {
            const t1 = new CachedGroupElement();
            const t2 = new CompletedGroupElement();
            const t3 = new ProjectiveGroupElement();
            q.toCached(t1);
            t2.sub(this, t1); // t2 =    (P - Q)
            t2.toProjective(t3); // t3 =    (P - Q)
            t3.double(t2); // t2 = [2](P - Q)
            t2.toProjective(t3); // t3 = [2](P - Q)
            t3.double(t2); // t2 = [4](P - Q)
            t2.toProjective(t3); // t3 = [4](P - Q)
            t3.double(t2); // t2 = [8](P - Q)
            t2.toProjective(t3); // t3 = [8](P - Q)
            // Now we want to check whether the point t3 is the identity.
            // In projective coordinates this is (X:Y:Z) ~ (0:1:0)
            // ie. X/Z = 0, Y/Z = 1
            // <=> X = 0, Y = Z
            const zero = new Uint8Array(32);
            const xBytes = new Uint8Array(32);
            const yBytes = new Uint8Array(32);
            const zBytes = new Uint8Array(32);
            t3.X.toBytes(xBytes);
            t3.Y.toBytes(yBytes);
            t3.Z.toBytes(zBytes);
            return ArrayHelper.equal(zero, xBytes) && ArrayHelper.equal(yBytes, zBytes);
        }
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * The scalars are GF(2^252 + 27742317777372353535851937790883648493).
     *
     * Input
     * a[0]+256*a[1]+...+256^31*a[31] = a
     * b[0]+256*b[1]+...+256^31*b[31] = b
     * c[0]+256*c[1]+...+256^31*c[31] = c.
     *
     * Output
     * s[0]+256*s[1]+...+256^31*s[31] = (ab+c) mod l
     * where l = 2^252 + 27742317777372353535851937790883648493.
     * @param s The scalar.
     * @param a The a.
     * @param b The b.
     * @param c The c.
     */
    function scalarMulAdd(s, a, b, c) {
        const a0 = BIG_2097151 & BigIntHelper.read3(a, 0);
        const a1 = BIG_2097151 & (BigIntHelper.read4(a, 2) >> BIG_ARR[5]);
        const a2 = BIG_2097151 & (BigIntHelper.read3(a, 5) >> BIG_ARR[2]);
        const a3 = BIG_2097151 & (BigIntHelper.read4(a, 7) >> BIG_ARR[7]);
        const a4 = BIG_2097151 & (BigIntHelper.read4(a, 10) >> BIG_ARR[4]);
        const a5 = BIG_2097151 & (BigIntHelper.read3(a, 13) >> BIG_ARR[1]);
        const a6 = BIG_2097151 & (BigIntHelper.read4(a, 15) >> BIG_ARR[6]);
        const a7 = BIG_2097151 & (BigIntHelper.read3(a, 18) >> BIG_ARR[3]);
        const a8 = BIG_2097151 & BigIntHelper.read3(a, 21);
        const a9 = BIG_2097151 & (BigIntHelper.read4(a, 23) >> BIG_ARR[5]);
        const a10 = BIG_2097151 & (BigIntHelper.read3(a, 26) >> BIG_ARR[2]);
        const a11 = (BigIntHelper.read4(a, 28) >> BIG_ARR[7]);
        const b0 = BIG_2097151 & BigIntHelper.read3(b, 0);
        const b1 = BIG_2097151 & (BigIntHelper.read4(b, 2) >> BIG_ARR[5]);
        const b2 = BIG_2097151 & (BigIntHelper.read3(b, 5) >> BIG_ARR[2]);
        const b3 = BIG_2097151 & (BigIntHelper.read4(b, 7) >> BIG_ARR[7]);
        const b4 = BIG_2097151 & (BigIntHelper.read4(b, 10) >> BIG_ARR[4]);
        const b5 = BIG_2097151 & (BigIntHelper.read3(b, 13) >> BIG_ARR[1]);
        const b6 = BIG_2097151 & (BigIntHelper.read4(b, 15) >> BIG_ARR[6]);
        const b7 = BIG_2097151 & (BigIntHelper.read3(b, 18) >> BIG_ARR[3]);
        const b8 = BIG_2097151 & BigIntHelper.read3(b, 21);
        const b9 = BIG_2097151 & (BigIntHelper.read4(b, 23) >> BIG_ARR[5]);
        const b10 = BIG_2097151 & (BigIntHelper.read3(b, 26) >> BIG_ARR[2]);
        const b11 = (BigIntHelper.read4(b, 28) >> BIG_ARR[7]);
        const c0 = BIG_2097151 & BigIntHelper.read3(c, 0);
        const c1 = BIG_2097151 & (BigIntHelper.read4(c, 2) >> BIG_ARR[5]);
        const c2 = BIG_2097151 & (BigIntHelper.read3(c, 5) >> BIG_ARR[2]);
        const c3 = BIG_2097151 & (BigIntHelper.read4(c, 7) >> BIG_ARR[7]);
        const c4 = BIG_2097151 & (BigIntHelper.read4(c, 10) >> BIG_ARR[4]);
        const c5 = BIG_2097151 & (BigIntHelper.read3(c, 13) >> BIG_ARR[1]);
        const c6 = BIG_2097151 & (BigIntHelper.read4(c, 15) >> BIG_ARR[6]);
        const c7 = BIG_2097151 & (BigIntHelper.read3(c, 18) >> BIG_ARR[3]);
        const c8 = BIG_2097151 & BigIntHelper.read3(c, 21);
        const c9 = BIG_2097151 & (BigIntHelper.read4(c, 23) >> BIG_ARR[5]);
        const c10 = BIG_2097151 & (BigIntHelper.read3(c, 26) >> BIG_ARR[2]);
        const c11 = (BigIntHelper.read4(c, 28) >> BIG_ARR[7]);
        const carry = new BigInt64Array(32);
        let s0 = c0 + (a0 * b0);
        let s1 = c1 + (a0 * b1) + (a1 * b0);
        let s2 = c2 + (a0 * b2) + (a1 * b1) + (a2 * b0);
        let s3 = c3 + (a0 * b3) + (a1 * b2) + (a2 * b1) + (a3 * b0);
        let s4 = c4 + (a0 * b4) + (a1 * b3) + (a2 * b2) + (a3 * b1) + (a4 * b0);
        let s5 = c5 + (a0 * b5) + (a1 * b4) + (a2 * b3) + (a3 * b2) + (a4 * b1) + (a5 * b0);
        let s6 = c6 + (a0 * b6) + (a1 * b5) + (a2 * b4) + (a3 * b3) + (a4 * b2) + (a5 * b1) + (a6 * b0);
        let s7 = c7 + (a0 * b7) + (a1 * b6) + (a2 * b5) + (a3 * b4) + (a4 * b3) + (a5 * b2) + (a6 * b1) + (a7 * b0);
        let s8 = c8 + (a0 * b8) + (a1 * b7) + (a2 * b6) + (a3 * b5) +
            (a4 * b4) + (a5 * b3) + (a6 * b2) + (a7 * b1) + (a8 * b0);
        let s9 = c9 + (a0 * b9) + (a1 * b8) + (a2 * b7) + (a3 * b6) +
            (a4 * b5) + (a5 * b4) + (a6 * b3) + (a7 * b2) + (a8 * b1) + (a9 * b0);
        let s10 = c10 + (a0 * b10) + (a1 * b9) + (a2 * b8) + (a3 * b7) + (a4 * b6) +
            (a5 * b5) + (a6 * b4) + (a7 * b3) + (a8 * b2) + (a9 * b1) + (a10 * b0);
        let s11 = c11 + (a0 * b11) + (a1 * b10) + (a2 * b9) + (a3 * b8) + (a4 * b7) +
            (a5 * b6) + (a6 * b5) + (a7 * b4) + (a8 * b3) + (a9 * b2) + (a10 * b1) + (a11 * b0);
        let s12 = (a1 * b11) + (a2 * b10) + (a3 * b9) + (a4 * b8) + (a5 * b7) +
            (a6 * b6) + (a7 * b5) + (a8 * b4) + (a9 * b3) + (a10 * b2) + (a11 * b1);
        let s13 = (a2 * b11) + (a3 * b10) + (a4 * b9) + (a5 * b8) + (a6 * b7) +
            (a7 * b6) + (a8 * b5) + (a9 * b4) + (a10 * b3) + (a11 * b2);
        let s14 = (a3 * b11) + (a4 * b10) + (a5 * b9) + (a6 * b8) + (a7 * b7) +
            (a8 * b6) + (a9 * b5) + (a10 * b4) + (a11 * b3);
        let s15 = (a4 * b11) + (a5 * b10) + (a6 * b9) + (a7 * b8) + (a8 * b7) + (a9 * b6) + (a10 * b5) + (a11 * b4);
        let s16 = (a5 * b11) + (a6 * b10) + (a7 * b9) + (a8 * b8) + (a9 * b7) + (a10 * b6) + (a11 * b5);
        let s17 = (a6 * b11) + (a7 * b10) + (a8 * b9) + (a9 * b8) + (a10 * b7) + (a11 * b6);
        let s18 = (a7 * b11) + (a8 * b10) + (a9 * b9) + (a10 * b8) + (a11 * b7);
        let s19 = (a8 * b11) + (a9 * b10) + (a10 * b9) + (a11 * b8);
        let s20 = (a9 * b11) + (a10 * b10) + (a11 * b9);
        let s21 = (a10 * b11) + (a11 * b10);
        let s22 = (a11 * b11);
        let s23 = BIG_ARR[0];
        carry[0] = (s0 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s1 += carry[0];
        s0 -= carry[0] << BIG_ARR[21];
        carry[2] = (s2 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s3 += carry[2];
        s2 -= carry[2] << BIG_ARR[21];
        carry[4] = (s4 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s5 += carry[4];
        s4 -= carry[4] << BIG_ARR[21];
        carry[6] = (s6 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s7 += carry[6];
        s6 -= carry[6] << BIG_ARR[21];
        carry[8] = (s8 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s9 += carry[8];
        s8 -= carry[8] << BIG_ARR[21];
        carry[10] = (s10 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s11 += carry[10];
        s10 -= carry[10] << BIG_ARR[21];
        carry[12] = (s12 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s13 += carry[12];
        s12 -= carry[12] << BIG_ARR[21];
        carry[14] = (s14 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s15 += carry[14];
        s14 -= carry[14] << BIG_ARR[21];
        carry[16] = (s16 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s17 += carry[16];
        s16 -= carry[16] << BIG_ARR[21];
        carry[18] = (s18 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s19 += carry[18];
        s18 -= carry[18] << BIG_ARR[21];
        carry[20] = (s20 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s21 += carry[20];
        s20 -= carry[20] << BIG_ARR[21];
        carry[22] = (s22 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s23 += carry[22];
        s22 -= carry[22] << BIG_ARR[21];
        carry[1] = (s1 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s2 += carry[1];
        s1 -= carry[1] << BIG_ARR[21];
        carry[3] = (s3 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s4 += carry[3];
        s3 -= carry[3] << BIG_ARR[21];
        carry[5] = (s5 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s6 += carry[5];
        s5 -= carry[5] << BIG_ARR[21];
        carry[7] = (s7 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s8 += carry[7];
        s7 -= carry[7] << BIG_ARR[21];
        carry[9] = (s9 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s10 += carry[9];
        s9 -= carry[9] << BIG_ARR[21];
        carry[11] = (s11 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s12 += carry[11];
        s11 -= carry[11] << BIG_ARR[21];
        carry[13] = (s13 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s14 += carry[13];
        s13 -= carry[13] << BIG_ARR[21];
        carry[15] = (s15 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s16 += carry[15];
        s15 -= carry[15] << BIG_ARR[21];
        carry[17] = (s17 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s18 += carry[17];
        s17 -= carry[17] << BIG_ARR[21];
        carry[19] = (s19 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s20 += carry[19];
        s19 -= carry[19] << BIG_ARR[21];
        carry[21] = (s21 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s22 += carry[21];
        s21 -= carry[21] << BIG_ARR[21];
        s11 += s23 * BIG_666643;
        s12 += s23 * BIG_470296;
        s13 += s23 * BIG_654183;
        s14 -= s23 * BIG_997805;
        s15 += s23 * BIG_136657;
        s16 -= s23 * BIG_683901;
        s23 = BIG_ARR[0];
        s10 += s22 * BIG_666643;
        s11 += s22 * BIG_470296;
        s12 += s22 * BIG_654183;
        s13 -= s22 * BIG_997805;
        s14 += s22 * BIG_136657;
        s15 -= s22 * BIG_683901;
        s22 = BIG_ARR[0];
        s9 += s21 * BIG_666643;
        s10 += s21 * BIG_470296;
        s11 += s21 * BIG_654183;
        s12 -= s21 * BIG_997805;
        s13 += s21 * BIG_136657;
        s14 -= s21 * BIG_683901;
        s21 = BIG_ARR[0];
        s8 += s20 * BIG_666643;
        s9 += s20 * BIG_470296;
        s10 += s20 * BIG_654183;
        s11 -= s20 * BIG_997805;
        s12 += s20 * BIG_136657;
        s13 -= s20 * BIG_683901;
        s20 = BIG_ARR[0];
        s7 += s19 * BIG_666643;
        s8 += s19 * BIG_470296;
        s9 += s19 * BIG_654183;
        s10 -= s19 * BIG_997805;
        s11 += s19 * BIG_136657;
        s12 -= s19 * BIG_683901;
        s19 = BIG_ARR[0];
        s6 += s18 * BIG_666643;
        s7 += s18 * BIG_470296;
        s8 += s18 * BIG_654183;
        s9 -= s18 * BIG_997805;
        s10 += s18 * BIG_136657;
        s11 -= s18 * BIG_683901;
        s18 = BIG_ARR[0];
        carry[6] = (s6 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s7 += carry[6];
        s6 -= carry[6] << BIG_ARR[21];
        carry[8] = (s8 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s9 += carry[8];
        s8 -= carry[8] << BIG_ARR[21];
        carry[10] = (s10 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s11 += carry[10];
        s10 -= carry[10] << BIG_ARR[21];
        carry[12] = (s12 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s13 += carry[12];
        s12 -= carry[12] << BIG_ARR[21];
        carry[14] = (s14 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s15 += carry[14];
        s14 -= carry[14] << BIG_ARR[21];
        carry[16] = (s16 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s17 += carry[16];
        s16 -= carry[16] << BIG_ARR[21];
        carry[7] = (s7 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s8 += carry[7];
        s7 -= carry[7] << BIG_ARR[21];
        carry[9] = (s9 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s10 += carry[9];
        s9 -= carry[9] << BIG_ARR[21];
        carry[11] = (s11 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s12 += carry[11];
        s11 -= carry[11] << BIG_ARR[21];
        carry[13] = (s13 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s14 += carry[13];
        s13 -= carry[13] << BIG_ARR[21];
        carry[15] = (s15 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s16 += carry[15];
        s15 -= carry[15] << BIG_ARR[21];
        s5 += s17 * BIG_666643;
        s6 += s17 * BIG_470296;
        s7 += s17 * BIG_654183;
        s8 -= s17 * BIG_997805;
        s9 += s17 * BIG_136657;
        s10 -= s17 * BIG_683901;
        s17 = BIG_ARR[0];
        s4 += s16 * BIG_666643;
        s5 += s16 * BIG_470296;
        s6 += s16 * BIG_654183;
        s7 -= s16 * BIG_997805;
        s8 += s16 * BIG_136657;
        s9 -= s16 * BIG_683901;
        s16 = BIG_ARR[0];
        s3 += s15 * BIG_666643;
        s4 += s15 * BIG_470296;
        s5 += s15 * BIG_654183;
        s6 -= s15 * BIG_997805;
        s7 += s15 * BIG_136657;
        s8 -= s15 * BIG_683901;
        s15 = BIG_ARR[0];
        s2 += s14 * BIG_666643;
        s3 += s14 * BIG_470296;
        s4 += s14 * BIG_654183;
        s5 -= s14 * BIG_997805;
        s6 += s14 * BIG_136657;
        s7 -= s14 * BIG_683901;
        s14 = BIG_ARR[0];
        s1 += s13 * BIG_666643;
        s2 += s13 * BIG_470296;
        s3 += s13 * BIG_654183;
        s4 -= s13 * BIG_997805;
        s5 += s13 * BIG_136657;
        s6 -= s13 * BIG_683901;
        s13 = BIG_ARR[0];
        s0 += s12 * BIG_666643;
        s1 += s12 * BIG_470296;
        s2 += s12 * BIG_654183;
        s3 -= s12 * BIG_997805;
        s4 += s12 * BIG_136657;
        s5 -= s12 * BIG_683901;
        s12 = BIG_ARR[0];
        carry[0] = (s0 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s1 += carry[0];
        s0 -= carry[0] << BIG_ARR[21];
        carry[2] = (s2 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s3 += carry[2];
        s2 -= carry[2] << BIG_ARR[21];
        carry[4] = (s4 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s5 += carry[4];
        s4 -= carry[4] << BIG_ARR[21];
        carry[6] = (s6 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s7 += carry[6];
        s6 -= carry[6] << BIG_ARR[21];
        carry[8] = (s8 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s9 += carry[8];
        s8 -= carry[8] << BIG_ARR[21];
        carry[10] = (s10 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s11 += carry[10];
        s10 -= carry[10] << BIG_ARR[21];
        carry[1] = (s1 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s2 += carry[1];
        s1 -= carry[1] << BIG_ARR[21];
        carry[3] = (s3 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s4 += carry[3];
        s3 -= carry[3] << BIG_ARR[21];
        carry[5] = (s5 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s6 += carry[5];
        s5 -= carry[5] << BIG_ARR[21];
        carry[7] = (s7 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s8 += carry[7];
        s7 -= carry[7] << BIG_ARR[21];
        carry[9] = (s9 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s10 += carry[9];
        s9 -= carry[9] << BIG_ARR[21];
        carry[11] = (s11 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s12 += carry[11];
        s11 -= carry[11] << BIG_ARR[21];
        s0 += s12 * BIG_666643;
        s1 += s12 * BIG_470296;
        s2 += s12 * BIG_654183;
        s3 -= s12 * BIG_997805;
        s4 += s12 * BIG_136657;
        s5 -= s12 * BIG_683901;
        s12 = BIG_ARR[0];
        carry[0] = s0 >> BIG_ARR[21];
        s1 += carry[0];
        s0 -= carry[0] << BIG_ARR[21];
        carry[1] = s1 >> BIG_ARR[21];
        s2 += carry[1];
        s1 -= carry[1] << BIG_ARR[21];
        carry[2] = s2 >> BIG_ARR[21];
        s3 += carry[2];
        s2 -= carry[2] << BIG_ARR[21];
        carry[3] = s3 >> BIG_ARR[21];
        s4 += carry[3];
        s3 -= carry[3] << BIG_ARR[21];
        carry[4] = s4 >> BIG_ARR[21];
        s5 += carry[4];
        s4 -= carry[4] << BIG_ARR[21];
        carry[5] = s5 >> BIG_ARR[21];
        s6 += carry[5];
        s5 -= carry[5] << BIG_ARR[21];
        carry[6] = s6 >> BIG_ARR[21];
        s7 += carry[6];
        s6 -= carry[6] << BIG_ARR[21];
        carry[7] = s7 >> BIG_ARR[21];
        s8 += carry[7];
        s7 -= carry[7] << BIG_ARR[21];
        carry[8] = s8 >> BIG_ARR[21];
        s9 += carry[8];
        s8 -= carry[8] << BIG_ARR[21];
        carry[9] = s9 >> BIG_ARR[21];
        s10 += carry[9];
        s9 -= carry[9] << BIG_ARR[21];
        carry[10] = s10 >> BIG_ARR[21];
        s11 += carry[10];
        s10 -= carry[10] << BIG_ARR[21];
        carry[11] = s11 >> BIG_ARR[21];
        s12 += carry[11];
        s11 -= carry[11] << BIG_ARR[21];
        s0 += s12 * BIG_666643;
        s1 += s12 * BIG_470296;
        s2 += s12 * BIG_654183;
        s3 -= s12 * BIG_997805;
        s4 += s12 * BIG_136657;
        s5 -= s12 * BIG_683901;
        s12 = BIG_ARR[0];
        carry[0] = s0 >> BIG_ARR[21];
        s1 += carry[0];
        s0 -= carry[0] << BIG_ARR[21];
        carry[1] = s1 >> BIG_ARR[21];
        s2 += carry[1];
        s1 -= carry[1] << BIG_ARR[21];
        carry[2] = s2 >> BIG_ARR[21];
        s3 += carry[2];
        s2 -= carry[2] << BIG_ARR[21];
        carry[3] = s3 >> BIG_ARR[21];
        s4 += carry[3];
        s3 -= carry[3] << BIG_ARR[21];
        carry[4] = s4 >> BIG_ARR[21];
        s5 += carry[4];
        s4 -= carry[4] << BIG_ARR[21];
        carry[5] = s5 >> BIG_ARR[21];
        s6 += carry[5];
        s5 -= carry[5] << BIG_ARR[21];
        carry[6] = s6 >> BIG_ARR[21];
        s7 += carry[6];
        s6 -= carry[6] << BIG_ARR[21];
        carry[7] = s7 >> BIG_ARR[21];
        s8 += carry[7];
        s7 -= carry[7] << BIG_ARR[21];
        carry[8] = s8 >> BIG_ARR[21];
        s9 += carry[8];
        s8 -= carry[8] << BIG_ARR[21];
        carry[9] = s9 >> BIG_ARR[21];
        s10 += carry[9];
        s9 -= carry[9] << BIG_ARR[21];
        carry[10] = s10 >> BIG_ARR[21];
        s11 += carry[10];
        s10 -= carry[10] << BIG_ARR[21];
        s[0] = Number(s0 >> BIG_ARR[0]);
        s[1] = Number(s0 >> BIG_ARR[8]);
        s[2] = Number((s0 >> BIG_ARR[16]) | (s1 << BIG_ARR[5]));
        s[3] = Number(s1 >> BIG_ARR[3]);
        s[4] = Number(s1 >> BIG_ARR[11]);
        s[5] = Number((s1 >> BIG_ARR[19]) | (s2 << BIG_ARR[2]));
        s[6] = Number(s2 >> BIG_ARR[6]);
        s[7] = Number((s2 >> BIG_ARR[14]) | (s3 << BIG_ARR[7]));
        s[8] = Number(s3 >> BIG_ARR[1]);
        s[9] = Number(s3 >> BIG_ARR[9]);
        s[10] = Number((s3 >> BIG_ARR[17]) | (s4 << BIG_ARR[4]));
        s[11] = Number(s4 >> BIG_ARR[4]);
        s[12] = Number(s4 >> BIG_ARR[12]);
        s[13] = Number((s4 >> BIG_ARR[20]) | (s5 << BIG_ARR[1]));
        s[14] = Number(s5 >> BIG_ARR[7]);
        s[15] = Number((s5 >> BIG_ARR[15]) | (s6 << BIG_ARR[6]));
        s[16] = Number(s6 >> BIG_ARR[2]);
        s[17] = Number(s6 >> BIG_ARR[10]);
        s[18] = Number((s6 >> BIG_ARR[18]) | (s7 << BIG_ARR[3]));
        s[19] = Number(s7 >> BIG_ARR[5]);
        s[20] = Number(s7 >> BIG_ARR[13]);
        s[21] = Number(s8 >> BIG_ARR[0]);
        s[22] = Number(s8 >> BIG_ARR[8]);
        s[23] = Number((s8 >> BIG_ARR[16]) | (s9 << BIG_ARR[5]));
        s[24] = Number(s9 >> BIG_ARR[3]);
        s[25] = Number(s9 >> BIG_ARR[11]);
        s[26] = Number((s9 >> BIG_ARR[19]) | (s10 << BIG_ARR[2]));
        s[27] = Number(s10 >> BIG_ARR[6]);
        s[28] = Number((s10 >> BIG_ARR[14]) | (s11 << BIG_ARR[7]));
        s[29] = Number(s11 >> BIG_ARR[1]);
        s[30] = Number(s11 >> BIG_ARR[9]);
        s[31] = Number(s11 >> BIG_ARR[17]);
    }
    /**
     * Scalar reduce
     * where l = 2^252 + 27742317777372353535851937790883648493.
     * @param out Where s[0]+256*s[1]+...+256^31*s[31] = s mod l.
     * @param s Where s[0]+256*s[1]+...+256^63*s[63] = s.
     */
    function scalarReduce(out, s) {
        let s0 = BIG_2097151 & BigIntHelper.read3(s, 0);
        let s1 = BIG_2097151 & (BigIntHelper.read4(s, 2) >> BIG_ARR[5]);
        let s2 = BIG_2097151 & (BigIntHelper.read3(s, 5) >> BIG_ARR[2]);
        let s3 = BIG_2097151 & (BigIntHelper.read4(s, 7) >> BIG_ARR[7]);
        let s4 = BIG_2097151 & (BigIntHelper.read4(s, 10) >> BIG_ARR[4]);
        let s5 = BIG_2097151 & (BigIntHelper.read3(s, 13) >> BIG_ARR[1]);
        let s6 = BIG_2097151 & (BigIntHelper.read4(s, 15) >> BIG_ARR[6]);
        let s7 = BIG_2097151 & (BigIntHelper.read3(s, 18) >> BIG_ARR[3]);
        let s8 = BIG_2097151 & BigIntHelper.read3(s, 21);
        let s9 = BIG_2097151 & (BigIntHelper.read4(s, 23) >> BIG_ARR[5]);
        let s10 = BIG_2097151 & (BigIntHelper.read3(s, 26) >> BIG_ARR[2]);
        let s11 = BIG_2097151 & (BigIntHelper.read4(s, 28) >> BIG_ARR[7]);
        let s12 = BIG_2097151 & (BigIntHelper.read4(s, 31) >> BIG_ARR[4]);
        let s13 = BIG_2097151 & (BigIntHelper.read3(s, 34) >> BIG_ARR[1]);
        let s14 = BIG_2097151 & (BigIntHelper.read4(s, 36) >> BIG_ARR[6]);
        let s15 = BIG_2097151 & (BigIntHelper.read3(s, 39) >> BIG_ARR[3]);
        let s16 = BIG_2097151 & BigIntHelper.read3(s, 42);
        let s17 = BIG_2097151 & (BigIntHelper.read4(s, 44) >> BIG_ARR[5]);
        let s18 = BIG_2097151 & (BigIntHelper.read3(s, 47) >> BIG_ARR[2]);
        let s19 = BIG_2097151 & (BigIntHelper.read4(s, 49) >> BIG_ARR[7]);
        let s20 = BIG_2097151 & (BigIntHelper.read4(s, 52) >> BIG_ARR[4]);
        let s21 = BIG_2097151 & (BigIntHelper.read3(s, 55) >> BIG_ARR[1]);
        let s22 = BIG_2097151 & (BigIntHelper.read4(s, 57) >> BIG_ARR[6]);
        let s23 = (BigIntHelper.read4(s, 60) >> BIG_ARR[3]);
        s11 += s23 * BIG_666643;
        s12 += s23 * BIG_470296;
        s13 += s23 * BIG_654183;
        s14 -= s23 * BIG_997805;
        s15 += s23 * BIG_136657;
        s16 -= s23 * BIG_683901;
        s23 = BIG_ARR[0];
        s10 += s22 * BIG_666643;
        s11 += s22 * BIG_470296;
        s12 += s22 * BIG_654183;
        s13 -= s22 * BIG_997805;
        s14 += s22 * BIG_136657;
        s15 -= s22 * BIG_683901;
        s22 = BIG_ARR[0];
        s9 += s21 * BIG_666643;
        s10 += s21 * BIG_470296;
        s11 += s21 * BIG_654183;
        s12 -= s21 * BIG_997805;
        s13 += s21 * BIG_136657;
        s14 -= s21 * BIG_683901;
        s21 = BIG_ARR[0];
        s8 += s20 * BIG_666643;
        s9 += s20 * BIG_470296;
        s10 += s20 * BIG_654183;
        s11 -= s20 * BIG_997805;
        s12 += s20 * BIG_136657;
        s13 -= s20 * BIG_683901;
        s20 = BIG_ARR[0];
        s7 += s19 * BIG_666643;
        s8 += s19 * BIG_470296;
        s9 += s19 * BIG_654183;
        s10 -= s19 * BIG_997805;
        s11 += s19 * BIG_136657;
        s12 -= s19 * BIG_683901;
        s19 = BIG_ARR[0];
        s6 += s18 * BIG_666643;
        s7 += s18 * BIG_470296;
        s8 += s18 * BIG_654183;
        s9 -= s18 * BIG_997805;
        s10 += s18 * BIG_136657;
        s11 -= s18 * BIG_683901;
        s18 = BIG_ARR[0];
        const carry = new BigInt64Array(17);
        carry[6] = (s6 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s7 += carry[6];
        s6 -= carry[6] << BIG_ARR[21];
        carry[8] = (s8 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s9 += carry[8];
        s8 -= carry[8] << BIG_ARR[21];
        carry[10] = (s10 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s11 += carry[10];
        s10 -= carry[10] << BIG_ARR[21];
        carry[12] = (s12 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s13 += carry[12];
        s12 -= carry[12] << BIG_ARR[21];
        carry[14] = (s14 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s15 += carry[14];
        s14 -= carry[14] << BIG_ARR[21];
        carry[16] = (s16 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s17 += carry[16];
        s16 -= carry[16] << BIG_ARR[21];
        carry[7] = (s7 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s8 += carry[7];
        s7 -= carry[7] << BIG_ARR[21];
        carry[9] = (s9 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s10 += carry[9];
        s9 -= carry[9] << BIG_ARR[21];
        carry[11] = (s11 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s12 += carry[11];
        s11 -= carry[11] << BIG_ARR[21];
        carry[13] = (s13 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s14 += carry[13];
        s13 -= carry[13] << BIG_ARR[21];
        carry[15] = (s15 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s16 += carry[15];
        s15 -= carry[15] << BIG_ARR[21];
        s5 += s17 * BIG_666643;
        s6 += s17 * BIG_470296;
        s7 += s17 * BIG_654183;
        s8 -= s17 * BIG_997805;
        s9 += s17 * BIG_136657;
        s10 -= s17 * BIG_683901;
        s17 = BIG_ARR[0];
        s4 += s16 * BIG_666643;
        s5 += s16 * BIG_470296;
        s6 += s16 * BIG_654183;
        s7 -= s16 * BIG_997805;
        s8 += s16 * BIG_136657;
        s9 -= s16 * BIG_683901;
        s16 = BIG_ARR[0];
        s3 += s15 * BIG_666643;
        s4 += s15 * BIG_470296;
        s5 += s15 * BIG_654183;
        s6 -= s15 * BIG_997805;
        s7 += s15 * BIG_136657;
        s8 -= s15 * BIG_683901;
        s15 = BIG_ARR[0];
        s2 += s14 * BIG_666643;
        s3 += s14 * BIG_470296;
        s4 += s14 * BIG_654183;
        s5 -= s14 * BIG_997805;
        s6 += s14 * BIG_136657;
        s7 -= s14 * BIG_683901;
        s14 = BIG_ARR[0];
        s1 += s13 * BIG_666643;
        s2 += s13 * BIG_470296;
        s3 += s13 * BIG_654183;
        s4 -= s13 * BIG_997805;
        s5 += s13 * BIG_136657;
        s6 -= s13 * BIG_683901;
        s13 = BIG_ARR[0];
        s0 += s12 * BIG_666643;
        s1 += s12 * BIG_470296;
        s2 += s12 * BIG_654183;
        s3 -= s12 * BIG_997805;
        s4 += s12 * BIG_136657;
        s5 -= s12 * BIG_683901;
        s12 = BIG_ARR[0];
        carry[0] = (s0 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s1 += carry[0];
        s0 -= carry[0] << BIG_ARR[21];
        carry[2] = (s2 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s3 += carry[2];
        s2 -= carry[2] << BIG_ARR[21];
        carry[4] = (s4 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s5 += carry[4];
        s4 -= carry[4] << BIG_ARR[21];
        carry[6] = (s6 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s7 += carry[6];
        s6 -= carry[6] << BIG_ARR[21];
        carry[8] = (s8 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s9 += carry[8];
        s8 -= carry[8] << BIG_ARR[21];
        carry[10] = (s10 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s11 += carry[10];
        s10 -= carry[10] << BIG_ARR[21];
        carry[1] = (s1 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s2 += carry[1];
        s1 -= carry[1] << BIG_ARR[21];
        carry[3] = (s3 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s4 += carry[3];
        s3 -= carry[3] << BIG_ARR[21];
        carry[5] = (s5 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s6 += carry[5];
        s5 -= carry[5] << BIG_ARR[21];
        carry[7] = (s7 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s8 += carry[7];
        s7 -= carry[7] << BIG_ARR[21];
        carry[9] = (s9 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s10 += carry[9];
        s9 -= carry[9] << BIG_ARR[21];
        carry[11] = (s11 + BIG_1_SHIFTL_20) >> BIG_ARR[21];
        s12 += carry[11];
        s11 -= carry[11] << BIG_ARR[21];
        s0 += s12 * BIG_666643;
        s1 += s12 * BIG_470296;
        s2 += s12 * BIG_654183;
        s3 -= s12 * BIG_997805;
        s4 += s12 * BIG_136657;
        s5 -= s12 * BIG_683901;
        s12 = BIG_ARR[0];
        carry[0] = s0 >> BIG_ARR[21];
        s1 += carry[0];
        s0 -= carry[0] << BIG_ARR[21];
        carry[1] = s1 >> BIG_ARR[21];
        s2 += carry[1];
        s1 -= carry[1] << BIG_ARR[21];
        carry[2] = s2 >> BIG_ARR[21];
        s3 += carry[2];
        s2 -= carry[2] << BIG_ARR[21];
        carry[3] = s3 >> BIG_ARR[21];
        s4 += carry[3];
        s3 -= carry[3] << BIG_ARR[21];
        carry[4] = s4 >> BIG_ARR[21];
        s5 += carry[4];
        s4 -= carry[4] << BIG_ARR[21];
        carry[5] = s5 >> BIG_ARR[21];
        s6 += carry[5];
        s5 -= carry[5] << BIG_ARR[21];
        carry[6] = s6 >> BIG_ARR[21];
        s7 += carry[6];
        s6 -= carry[6] << BIG_ARR[21];
        carry[7] = s7 >> BIG_ARR[21];
        s8 += carry[7];
        s7 -= carry[7] << BIG_ARR[21];
        carry[8] = s8 >> BIG_ARR[21];
        s9 += carry[8];
        s8 -= carry[8] << BIG_ARR[21];
        carry[9] = s9 >> BIG_ARR[21];
        s10 += carry[9];
        s9 -= carry[9] << BIG_ARR[21];
        carry[10] = s10 >> BIG_ARR[21];
        s11 += carry[10];
        s10 -= carry[10] << BIG_ARR[21];
        carry[11] = s11 >> BIG_ARR[21];
        s12 += carry[11];
        s11 -= carry[11] << BIG_ARR[21];
        s0 += s12 * BIG_666643;
        s1 += s12 * BIG_470296;
        s2 += s12 * BIG_654183;
        s3 -= s12 * BIG_997805;
        s4 += s12 * BIG_136657;
        s5 -= s12 * BIG_683901;
        s12 = BIG_ARR[0];
        carry[0] = s0 >> BIG_ARR[21];
        s1 += carry[0];
        s0 -= carry[0] << BIG_ARR[21];
        carry[1] = s1 >> BIG_ARR[21];
        s2 += carry[1];
        s1 -= carry[1] << BIG_ARR[21];
        carry[2] = s2 >> BIG_ARR[21];
        s3 += carry[2];
        s2 -= carry[2] << BIG_ARR[21];
        carry[3] = s3 >> BIG_ARR[21];
        s4 += carry[3];
        s3 -= carry[3] << BIG_ARR[21];
        carry[4] = s4 >> BIG_ARR[21];
        s5 += carry[4];
        s4 -= carry[4] << BIG_ARR[21];
        carry[5] = s5 >> BIG_ARR[21];
        s6 += carry[5];
        s5 -= carry[5] << BIG_ARR[21];
        carry[6] = s6 >> BIG_ARR[21];
        s7 += carry[6];
        s6 -= carry[6] << BIG_ARR[21];
        carry[7] = s7 >> BIG_ARR[21];
        s8 += carry[7];
        s7 -= carry[7] << BIG_ARR[21];
        carry[8] = s8 >> BIG_ARR[21];
        s9 += carry[8];
        s8 -= carry[8] << BIG_ARR[21];
        carry[9] = s9 >> BIG_ARR[21];
        s10 += carry[9];
        s9 -= carry[9] << BIG_ARR[21];
        carry[10] = s10 >> BIG_ARR[21];
        s11 += carry[10];
        s10 -= carry[10] << BIG_ARR[21];
        out[0] = Number(s0 >> BIG_ARR[0]);
        out[1] = Number(s0 >> BIG_ARR[8]);
        out[2] = Number((s0 >> BIG_ARR[16]) | (s1 << BIG_ARR[5]));
        out[3] = Number(s1 >> BIG_ARR[3]);
        out[4] = Number(s1 >> BIG_ARR[11]);
        out[5] = Number((s1 >> BIG_ARR[19]) | (s2 << BIG_ARR[2]));
        out[6] = Number(s2 >> BIG_ARR[6]);
        out[7] = Number((s2 >> BIG_ARR[14]) | (s3 << BIG_ARR[7]));
        out[8] = Number(s3 >> BIG_ARR[1]);
        out[9] = Number(s3 >> BIG_ARR[9]);
        out[10] = Number((s3 >> BIG_ARR[17]) | (s4 << BIG_ARR[4]));
        out[11] = Number(s4 >> BIG_ARR[4]);
        out[12] = Number(s4 >> BIG_ARR[12]);
        out[13] = Number((s4 >> BIG_ARR[20]) | (s5 << BIG_ARR[1]));
        out[14] = Number(s5 >> BIG_ARR[7]);
        out[15] = Number((s5 >> BIG_ARR[15]) | (s6 << BIG_ARR[6]));
        out[16] = Number(s6 >> BIG_ARR[2]);
        out[17] = Number(s6 >> BIG_ARR[10]);
        out[18] = Number((s6 >> BIG_ARR[18]) | (s7 << BIG_ARR[3]));
        out[19] = Number(s7 >> BIG_ARR[5]);
        out[20] = Number(s7 >> BIG_ARR[13]);
        out[21] = Number(s8 >> BIG_ARR[0]);
        out[22] = Number(s8 >> BIG_ARR[8]);
        out[23] = Number((s8 >> BIG_ARR[16]) | (s9 << BIG_ARR[5]));
        out[24] = Number(s9 >> BIG_ARR[3]);
        out[25] = Number(s9 >> BIG_ARR[11]);
        out[26] = Number((s9 >> BIG_ARR[19]) | (s10 << BIG_ARR[2]));
        out[27] = Number(s10 >> BIG_ARR[6]);
        out[28] = Number((s10 >> BIG_ARR[14]) | (s11 << BIG_ARR[7]));
        out[29] = Number(s11 >> BIG_ARR[1]);
        out[30] = Number(s11 >> BIG_ARR[9]);
        out[31] = Number(s11 >> BIG_ARR[17]);
    }
    /**
     * Scalar Minimal returns true if the given scalar is less than the order of the Curve.
     * @param scalar The scalar.
     * @returns True if the given scalar is less than the order of the Curve.
     */
    function scalarMinimal(scalar) {
        for (let i = 3; i >= 0; i--) {
            const v = BigIntHelper.read8(scalar, i * 8);
            if (v > CONST_ORDER[i]) {
                return false;
            }
            else if (v < CONST_ORDER[i]) {
                break;
            }
            else if (i === 0) {
                return false;
            }
        }
        return true;
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Implementation of Ed25519.
     */
    class Ed25519 {
        /**
         * Public returns the PublicKey corresponding to priv.
         * @param privateKey The private key to get the corresponding public key.
         * @returns The public key.
         */
        static publicKeyFromPrivateKey(privateKey) {
            return privateKey.subarray(32).slice();
        }
        /**
         * Generate the key pair from the seed.
         * @param seed The seed to generate the key pair for.
         * @returns The key pair.
         */
        static keyPairFromSeed(seed) {
            const privateKey = Ed25519.privateKeyFromSeed(seed.slice(0, Ed25519.SEED_SIZE));
            return {
                privateKey,
                publicKey: Ed25519.publicKeyFromPrivateKey(privateKey)
            };
        }
        /**
         * Calculates a private key from a seed.
         * @param seed The seed to generate the private key from.
         * @returns The private key.
         */
        static privateKeyFromSeed(seed) {
            if (!seed || seed.length !== Ed25519.SEED_SIZE) {
                throw new Error(`The seed length is incorrect, it should be ${Ed25519.SEED_SIZE} but is ${seed ? seed.length : 0}`);
            }
            const sha512 = new Sha512();
            sha512.update(seed);
            const digest = sha512.digest();
            digest[0] &= 248;
            digest[31] &= 127;
            digest[31] |= 64;
            const A = new ExtendedGroupElement();
            A.scalarMultBase(digest);
            const publicKeyBytes = new Uint8Array(32);
            A.toBytes(publicKeyBytes);
            const privateKey = new Uint8Array(Ed25519.PRIVATE_KEY_SIZE);
            privateKey.set(seed);
            privateKey.set(publicKeyBytes, 32);
            return privateKey;
        }
        /**
         * Sign the message with privateKey and returns a signature.
         * @param privateKey The private key.
         * @param message The message to sign.
         * @returns The signature.
         */
        static sign(privateKey, message) {
            if (!privateKey || privateKey.length !== Ed25519.PRIVATE_KEY_SIZE) {
                throw new Error("Bad private key length");
            }
            let sha512 = new Sha512();
            sha512.update(privateKey.subarray(0, 32));
            const digest1 = sha512.digest();
            const expandedSecretKey = digest1.slice();
            expandedSecretKey[0] &= 248;
            expandedSecretKey[31] &= 63;
            expandedSecretKey[31] |= 64;
            sha512 = new Sha512();
            sha512.update(digest1.subarray(32));
            sha512.update(message);
            const messageDigest = sha512.digest();
            const messageDigestReduced = new Uint8Array(32);
            scalarReduce(messageDigestReduced, messageDigest);
            const R = new ExtendedGroupElement();
            R.scalarMultBase(messageDigestReduced);
            const encodedR = new Uint8Array(32);
            R.toBytes(encodedR);
            sha512 = new Sha512();
            sha512.update(encodedR);
            sha512.update(privateKey.subarray(32));
            sha512.update(message);
            const hramDigest = sha512.digest();
            const hramDigestReduced = new Uint8Array(32);
            scalarReduce(hramDigestReduced, hramDigest);
            const s = new Uint8Array(32);
            scalarMulAdd(s, hramDigestReduced, expandedSecretKey, messageDigestReduced);
            const signature = new Uint8Array(Ed25519.SIGNATURE_SIZE);
            signature.set(encodedR);
            signature.set(s, 32);
            return signature;
        }
        /**
         * Verify reports whether sig is a valid signature of message by publicKey.
         * @param publicKey The public key to verify the signature.
         * @param message The message for the signature.
         * @param sig The signature.
         * @returns True if the signature matches.
         */
        static verify(publicKey, message, sig) {
            if (!publicKey || publicKey.length !== Ed25519.PUBLIC_KEY_SIZE) {
                return false;
            }
            if (!sig || sig.length !== Ed25519.SIGNATURE_SIZE || ((sig[63] & 224) !== 0)) {
                return false;
            }
            const A = new ExtendedGroupElement();
            if (!A.fromBytes(publicKey)) {
                return false;
            }
            A.X.neg();
            A.T.neg();
            const h = new Sha512();
            h.update(sig.subarray(0, 32));
            h.update(publicKey);
            h.update(message);
            const digest = h.digest();
            const hReduced = new Uint8Array(32);
            scalarReduce(hReduced, digest);
            const R = new ProjectiveGroupElement();
            const s = sig.subarray(32).slice();
            // https://tools.ietf.org/html/rfc8032#section-5.1.7 requires that s be in
            // the range [0, order) in order to prevent signature malleability.
            if (!scalarMinimal(s)) {
                return false;
            }
            R.doubleScalarMultVartime(hReduced, A, s);
            const checkR = new Uint8Array(32);
            R.toBytes(checkR);
            return ArrayHelper.equal(sig.subarray(0, 32), checkR);
        }
    }
    /**
     * PublicKeySize is the size, in bytes, of public keys as used in this package.
     */
    Ed25519.PUBLIC_KEY_SIZE = 32;
    /**
     * PrivateKeySize is the size, in bytes, of private keys as used in this package.
     */
    Ed25519.PRIVATE_KEY_SIZE = 64;
    /**
     * SignatureSize is the size, in bytes, of signatures generated and verified by this package.
     */
    Ed25519.SIGNATURE_SIZE = 64;
    /**
     * SeedSize is the size, in bytes, of private key seeds. These are the private key representations used by RFC 8032.
     */
    Ed25519.SEED_SIZE = 32;

    /**
     * The global type for the transaction essence.
     */
    const TRANSACTION_ESSENCE_TYPE = 0;

    /**
     * The global type for the sig locked dust allowance output.
     */
    const SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE = 1;

    /**
     * The global type for the sig locked single output.
     */
    const SIG_LOCKED_SINGLE_OUTPUT_TYPE = 0;

    /**
     * The global type for the treasury output.
     */
    const TREASURY_OUTPUT_TYPE = 2;

    // Copyright 2020 IOTA Stiftung
    /**
     * The minimum length of an output binary representation.
     */
    const MIN_OUTPUT_LENGTH = SMALL_TYPE_LENGTH;
    /**
     * The minimum length of a sig locked single output binary representation.
     */
    const MIN_SIG_LOCKED_SINGLE_OUTPUT_LENGTH = MIN_OUTPUT_LENGTH + MIN_ADDRESS_LENGTH + MIN_ED25519_ADDRESS_LENGTH;
    /**
     * The minimum length of a sig locked dust allowance output binary representation.
     */
    const MIN_SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_LENGTH = MIN_OUTPUT_LENGTH + MIN_ADDRESS_LENGTH + MIN_ED25519_ADDRESS_LENGTH;
    /**
     * The minimum length of a treasury output binary representation.
     */
    const MIN_TREASURY_OUTPUT_LENGTH = MIN_OUTPUT_LENGTH + UINT64_SIZE;
    /**
     * The minimum number of outputs.
     */
    const MIN_OUTPUT_COUNT = 1;
    /**
     * The maximum number of outputs.
     */
    const MAX_OUTPUT_COUNT = 127;
    /**
     * Deserialize the outputs from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeOutputs(readStream) {
        const numOutputs = readStream.readUInt16("outputs.numOutputs");
        const inputs = [];
        for (let i = 0; i < numOutputs; i++) {
            inputs.push(deserializeOutput(readStream));
        }
        return inputs;
    }
    /**
     * Serialize the outputs to binary.
     * @param writeStream The stream to write the data to.
     * @param objects The objects to serialize.
     */
    function serializeOutputs(writeStream, objects) {
        if (objects.length < MIN_OUTPUT_COUNT) {
            throw new Error(`The minimum number of outputs is ${MIN_OUTPUT_COUNT}, you have provided ${objects.length}`);
        }
        if (objects.length > MAX_OUTPUT_COUNT) {
            throw new Error(`The maximum number of outputs is ${MAX_OUTPUT_COUNT}, you have provided ${objects.length}`);
        }
        writeStream.writeUInt16("outputs.numOutputs", objects.length);
        for (let i = 0; i < objects.length; i++) {
            serializeOutput(writeStream, objects[i]);
        }
    }
    /**
     * Deserialize the output from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeOutput(readStream) {
        if (!readStream.hasRemaining(MIN_OUTPUT_LENGTH)) {
            throw new Error(`Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_OUTPUT_LENGTH}`);
        }
        const type = readStream.readByte("output.type", false);
        let input;
        if (type === SIG_LOCKED_SINGLE_OUTPUT_TYPE) {
            input = deserializeSigLockedSingleOutput(readStream);
        }
        else if (type === SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
            input = deserializeSigLockedDustAllowanceOutput(readStream);
        }
        else if (type === TREASURY_OUTPUT_TYPE) {
            input = deserializeTreasuryOutput(readStream);
        }
        else {
            throw new Error(`Unrecognized output type ${type}`);
        }
        return input;
    }
    /**
     * Serialize the output to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeOutput(writeStream, object) {
        if (object.type === SIG_LOCKED_SINGLE_OUTPUT_TYPE) {
            serializeSigLockedSingleOutput(writeStream, object);
        }
        else if (object.type === SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
            serializeSigLockedDustAllowanceOutput(writeStream, object);
        }
        else if (object.type === TREASURY_OUTPUT_TYPE) {
            serializeTreasuryOutput(writeStream, object);
        }
        else {
            throw new Error(`Unrecognized output type ${object.type}`);
        }
    }
    /**
     * Deserialize the signature locked single output from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeSigLockedSingleOutput(readStream) {
        if (!readStream.hasRemaining(MIN_SIG_LOCKED_SINGLE_OUTPUT_LENGTH)) {
            throw new Error(`Signature Locked Single Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_SIG_LOCKED_SINGLE_OUTPUT_LENGTH}`);
        }
        const type = readStream.readByte("sigLockedSingleOutput.type");
        if (type !== SIG_LOCKED_SINGLE_OUTPUT_TYPE) {
            throw new Error(`Type mismatch in sigLockedSingleOutput ${type}`);
        }
        const address = deserializeAddress(readStream);
        const amount = readStream.readUInt64("sigLockedSingleOutput.amount");
        return {
            type: SIG_LOCKED_SINGLE_OUTPUT_TYPE,
            address,
            amount: Number(amount)
        };
    }
    /**
     * Serialize the signature locked single output to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeSigLockedSingleOutput(writeStream, object) {
        writeStream.writeByte("sigLockedSingleOutput.type", object.type);
        serializeAddress(writeStream, object.address);
        writeStream.writeUInt64("sigLockedSingleOutput.amount", BigInt(object.amount));
    }
    /**
     * Deserialize the signature locked dust allowance output from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeSigLockedDustAllowanceOutput(readStream) {
        if (!readStream.hasRemaining(MIN_SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_LENGTH)) {
            throw new Error(`Signature Locked Dust Allowance Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_LENGTH}`);
        }
        const type = readStream.readByte("sigLockedDustAllowanceOutput.type");
        if (type !== SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
            throw new Error(`Type mismatch in sigLockedDustAllowanceOutput ${type}`);
        }
        const address = deserializeAddress(readStream);
        const amount = readStream.readUInt64("sigLockedDustAllowanceOutput.amount");
        return {
            type: SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE,
            address,
            amount: Number(amount)
        };
    }
    /**
     * Serialize the signature locked dust allowance output to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeSigLockedDustAllowanceOutput(writeStream, object) {
        writeStream.writeByte("sigLockedDustAllowanceOutput.type", object.type);
        serializeAddress(writeStream, object.address);
        writeStream.writeUInt64("sigLockedDustAllowanceOutput.amount", BigInt(object.amount));
    }
    /**
     * Deserialize the treasury output from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeTreasuryOutput(readStream) {
        if (!readStream.hasRemaining(MIN_TREASURY_OUTPUT_LENGTH)) {
            throw new Error(`Treasury Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TREASURY_OUTPUT_LENGTH}`);
        }
        const type = readStream.readByte("treasuryOutput.type");
        if (type !== TREASURY_OUTPUT_TYPE) {
            throw new Error(`Type mismatch in treasuryOutput ${type}`);
        }
        const amount = readStream.readUInt64("treasuryOutput.amount");
        return {
            type: TREASURY_OUTPUT_TYPE,
            amount: Number(amount)
        };
    }
    /**
     * Serialize the treasury output to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeTreasuryOutput(writeStream, object) {
        writeStream.writeByte("treasuryOutput.type", object.type);
        writeStream.writeUInt64("treasuryOutput.amount", BigInt(object.amount));
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * The minimum length of a transaction essence binary representation.
     */
    const MIN_TRANSACTION_ESSENCE_LENGTH = SMALL_TYPE_LENGTH + (2 * ARRAY_LENGTH) + UINT32_SIZE;
    /**
     * Deserialize the transaction essence from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeTransactionEssence(readStream) {
        if (!readStream.hasRemaining(MIN_TRANSACTION_ESSENCE_LENGTH)) {
            throw new Error(`Transaction essence data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TRANSACTION_ESSENCE_LENGTH}`);
        }
        const type = readStream.readByte("transactionEssence.type");
        if (type !== TRANSACTION_ESSENCE_TYPE) {
            throw new Error(`Type mismatch in transactionEssence ${type}`);
        }
        const inputs = deserializeInputs(readStream);
        const outputs = deserializeOutputs(readStream);
        const payload = deserializePayload(readStream);
        if (payload && payload.type !== INDEXATION_PAYLOAD_TYPE) {
            throw new Error("Transaction essence can only contain embedded Indexation Payload");
        }
        for (const input of inputs) {
            if (input.type !== UTXO_INPUT_TYPE) {
                throw new Error("Transaction essence can only contain UTXO Inputs");
            }
        }
        for (const output of outputs) {
            if (output.type !== SIG_LOCKED_SINGLE_OUTPUT_TYPE &&
                output.type !== SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
                throw new Error("Transaction essence can only contain sig locked single input or sig locked dust allowance outputs");
            }
        }
        return {
            type: TRANSACTION_ESSENCE_TYPE,
            inputs: inputs,
            outputs: outputs,
            payload
        };
    }
    /**
     * Serialize the transaction essence to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeTransactionEssence(writeStream, object) {
        writeStream.writeByte("transactionEssence.type", object.type);
        for (const input of object.inputs) {
            if (input.type !== UTXO_INPUT_TYPE) {
                throw new Error("Transaction essence can only contain UTXO Inputs");
            }
        }
        serializeInputs(writeStream, object.inputs);
        for (const output of object.outputs) {
            if (output.type !== SIG_LOCKED_SINGLE_OUTPUT_TYPE &&
                output.type !== SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
                throw new Error("Transaction essence can only contain sig locked single input or sig locked dust allowance outputs");
            }
        }
        serializeOutputs(writeStream, object.outputs);
        serializePayload(writeStream, object.payload);
    }

    /**
     * The global type for the unlock block.
     */
    const REFERENCE_UNLOCK_BLOCK_TYPE = 1;

    /**
     * The global type for the unlock block.
     */
    const SIGNATURE_UNLOCK_BLOCK_TYPE = 0;

    /**
     * The global type for the signature type.
     */
    const ED25519_SIGNATURE_TYPE = 0;

    // Copyright 2020 IOTA Stiftung
    /**
     * The minimum length of a signature binary representation.
     */
    const MIN_SIGNATURE_LENGTH = SMALL_TYPE_LENGTH;
    /**
     * The minimum length of an ed25519 signature binary representation.
     */
    const MIN_ED25519_SIGNATURE_LENGTH = MIN_SIGNATURE_LENGTH + Ed25519.SIGNATURE_SIZE + Ed25519.PUBLIC_KEY_SIZE;
    /**
     * Deserialize the signature from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeSignature(readStream) {
        if (!readStream.hasRemaining(MIN_SIGNATURE_LENGTH)) {
            throw new Error(`Signature data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_SIGNATURE_LENGTH}`);
        }
        const type = readStream.readByte("signature.type", false);
        let input;
        if (type === ED25519_SIGNATURE_TYPE) {
            input = deserializeEd25519Signature(readStream);
        }
        else {
            throw new Error(`Unrecognized signature type ${type}`);
        }
        return input;
    }
    /**
     * Serialize the signature to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeSignature(writeStream, object) {
        if (object.type === ED25519_SIGNATURE_TYPE) {
            serializeEd25519Signature(writeStream, object);
        }
        else {
            throw new Error(`Unrecognized signature type ${object.type}`);
        }
    }
    /**
     * Deserialize the Ed25519 signature from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeEd25519Signature(readStream) {
        if (!readStream.hasRemaining(MIN_ED25519_SIGNATURE_LENGTH)) {
            throw new Error(`Ed25519 signature data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ED25519_SIGNATURE_LENGTH}`);
        }
        const type = readStream.readByte("ed25519Signature.type");
        if (type !== ED25519_SIGNATURE_TYPE) {
            throw new Error(`Type mismatch in ed25519Signature ${type}`);
        }
        const publicKey = readStream.readFixedHex("ed25519Signature.publicKey", Ed25519.PUBLIC_KEY_SIZE);
        const signature = readStream.readFixedHex("ed25519Signature.signature", Ed25519.SIGNATURE_SIZE);
        return {
            type: ED25519_SIGNATURE_TYPE,
            publicKey,
            signature
        };
    }
    /**
     * Serialize the Ed25519 signature to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeEd25519Signature(writeStream, object) {
        writeStream.writeByte("ed25519Signature.type", object.type);
        writeStream.writeFixedHex("ed25519Signature.publicKey", Ed25519.PUBLIC_KEY_SIZE, object.publicKey);
        writeStream.writeFixedHex("ed25519Signature.signature", Ed25519.SIGNATURE_SIZE, object.signature);
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * The minimum length of an unlock block binary representation.
     */
    const MIN_UNLOCK_BLOCK_LENGTH = SMALL_TYPE_LENGTH;
    /**
     * The minimum length of a signature unlock block binary representation.
     */
    const MIN_SIGNATURE_UNLOCK_BLOCK_LENGTH = MIN_UNLOCK_BLOCK_LENGTH + MIN_SIGNATURE_LENGTH;
    /**
     * The minimum length of a reference unlock block binary representation.
     */
    const MIN_REFERENCE_UNLOCK_BLOCK_LENGTH = MIN_UNLOCK_BLOCK_LENGTH + UINT16_SIZE;
    /**
     * Deserialize the unlock blocks from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeUnlockBlocks(readStream) {
        const numUnlockBlocks = readStream.readUInt16("transactionEssence.numUnlockBlocks");
        const unlockBlocks = [];
        for (let i = 0; i < numUnlockBlocks; i++) {
            unlockBlocks.push(deserializeUnlockBlock(readStream));
        }
        return unlockBlocks;
    }
    /**
     * Serialize the unlock blocks to binary.
     * @param writeStream The stream to write the data to.
     * @param objects The objects to serialize.
     */
    function serializeUnlockBlocks(writeStream, objects) {
        writeStream.writeUInt16("transactionEssence.numUnlockBlocks", objects.length);
        for (let i = 0; i < objects.length; i++) {
            serializeUnlockBlock(writeStream, objects[i]);
        }
    }
    /**
     * Deserialize the unlock block from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeUnlockBlock(readStream) {
        if (!readStream.hasRemaining(MIN_UNLOCK_BLOCK_LENGTH)) {
            throw new Error(`Unlock Block data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_UNLOCK_BLOCK_LENGTH}`);
        }
        const type = readStream.readByte("unlockBlock.type", false);
        let unlockBlock;
        if (type === SIGNATURE_UNLOCK_BLOCK_TYPE) {
            unlockBlock = deserializeSignatureUnlockBlock(readStream);
        }
        else if (type === REFERENCE_UNLOCK_BLOCK_TYPE) {
            unlockBlock = deserializeReferenceUnlockBlock(readStream);
        }
        else {
            throw new Error(`Unrecognized unlock block type ${type}`);
        }
        return unlockBlock;
    }
    /**
     * Serialize the unlock block to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeUnlockBlock(writeStream, object) {
        if (object.type === SIGNATURE_UNLOCK_BLOCK_TYPE) {
            serializeSignatureUnlockBlock(writeStream, object);
        }
        else if (object.type === REFERENCE_UNLOCK_BLOCK_TYPE) {
            serializeReferenceUnlockBlock(writeStream, object);
        }
        else {
            throw new Error(`Unrecognized unlock block type ${object.type}`);
        }
    }
    /**
     * Deserialize the signature unlock block from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeSignatureUnlockBlock(readStream) {
        if (!readStream.hasRemaining(MIN_SIGNATURE_UNLOCK_BLOCK_LENGTH)) {
            throw new Error(`Signature Unlock Block data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_SIGNATURE_UNLOCK_BLOCK_LENGTH}`);
        }
        const type = readStream.readByte("signatureUnlockBlock.type");
        if (type !== SIGNATURE_UNLOCK_BLOCK_TYPE) {
            throw new Error(`Type mismatch in signatureUnlockBlock ${type}`);
        }
        const signature = deserializeSignature(readStream);
        return {
            type: SIGNATURE_UNLOCK_BLOCK_TYPE,
            signature
        };
    }
    /**
     * Serialize the signature unlock block to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeSignatureUnlockBlock(writeStream, object) {
        writeStream.writeByte("signatureUnlockBlock.type", object.type);
        serializeSignature(writeStream, object.signature);
    }
    /**
     * Deserialize the reference unlock block from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeReferenceUnlockBlock(readStream) {
        if (!readStream.hasRemaining(MIN_REFERENCE_UNLOCK_BLOCK_LENGTH)) {
            throw new Error(`Reference Unlock Block data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_REFERENCE_UNLOCK_BLOCK_LENGTH}`);
        }
        const type = readStream.readByte("referenceUnlockBlock.type");
        if (type !== REFERENCE_UNLOCK_BLOCK_TYPE) {
            throw new Error(`Type mismatch in referenceUnlockBlock ${type}`);
        }
        const reference = readStream.readUInt16("referenceUnlockBlock.reference");
        return {
            type: REFERENCE_UNLOCK_BLOCK_TYPE,
            reference
        };
    }
    /**
     * Serialize the reference unlock block to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeReferenceUnlockBlock(writeStream, object) {
        writeStream.writeByte("referenceUnlockBlock.type", object.type);
        writeStream.writeUInt16("referenceUnlockBlock.reference", object.reference);
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * The minimum length of a payload binary representation.
     */
    const MIN_PAYLOAD_LENGTH = TYPE_LENGTH;
    /**
     * The minimum length of a milestone payload binary representation.
     */
    const MIN_MILESTONE_PAYLOAD_LENGTH = MIN_PAYLOAD_LENGTH + // min payload
        UINT32_SIZE + // index
        UINT64_SIZE + // timestamp
        MESSAGE_ID_LENGTH + // parent 1
        MESSAGE_ID_LENGTH + // parent 2
        MERKLE_PROOF_LENGTH + // merkle proof
        (2 * UINT32_SIZE) + // Next pow score and pow score milestone index
        BYTE_SIZE + // publicKeysCount
        Ed25519.PUBLIC_KEY_SIZE + // 1 public key
        BYTE_SIZE + // signatureCount
        Ed25519.SIGNATURE_SIZE; // 1 signature
    /**
     * The minimum length of an indexation payload binary representation.
     */
    const MIN_INDEXATION_PAYLOAD_LENGTH = MIN_PAYLOAD_LENGTH + // min payload
        STRING_LENGTH + // index length
        1 + // index min 1 byte
        STRING_LENGTH; // data length
    /**
     * The minimum length of a transaction payload binary representation.
     */
    const MIN_TRANSACTION_PAYLOAD_LENGTH = MIN_PAYLOAD_LENGTH + // min payload
        UINT32_SIZE; // essence type
    /**
     * The minimum length of a receipt payload binary representation.
     */
    const MIN_RECEIPT_PAYLOAD_LENGTH = MIN_PAYLOAD_LENGTH +
        UINT32_SIZE + // migratedAt
        UINT16_SIZE + // numFunds
        MIN_MIGRATED_FUNDS_LENGTH; // 1 Fund
    /**
     * The minimum length of a treasure transaction payload binary representation.
     */
    const MIN_TREASURY_TRANSACTION_PAYLOAD_LENGTH = MIN_PAYLOAD_LENGTH +
        MIN_TREASURY_INPUT_LENGTH +
        MIN_TREASURY_OUTPUT_LENGTH;
    /**
     * The minimum length of a indexation key.
     */
    const MIN_INDEXATION_KEY_LENGTH = 1;
    /**
     * The maximum length of a indexation key.
     */
    const MAX_INDEXATION_KEY_LENGTH = 64;
    /**
     * Deserialize the payload from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializePayload(readStream) {
        const payloadLength = readStream.readUInt32("payload.length");
        if (!readStream.hasRemaining(payloadLength)) {
            throw new Error(`Payload length ${payloadLength} exceeds the remaining data ${readStream.unused()}`);
        }
        let payload;
        if (payloadLength > 0) {
            const payloadType = readStream.readUInt32("payload.type", false);
            if (payloadType === TRANSACTION_PAYLOAD_TYPE) {
                payload = deserializeTransactionPayload(readStream);
            }
            else if (payloadType === MILESTONE_PAYLOAD_TYPE) {
                payload = deserializeMilestonePayload(readStream);
            }
            else if (payloadType === INDEXATION_PAYLOAD_TYPE) {
                payload = deserializeIndexationPayload(readStream);
            }
            else if (payloadType === RECEIPT_PAYLOAD_TYPE) {
                payload = deserializeReceiptPayload(readStream);
            }
            else if (payloadType === TREASURY_TRANSACTION_PAYLOAD_TYPE) {
                payload = deserializeTreasuryTransactionPayload(readStream);
            }
            else {
                throw new Error(`Unrecognized payload type ${payloadType}`);
            }
        }
        return payload;
    }
    /**
     * Serialize the payload essence to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializePayload(writeStream, object) {
        // Store the location for the payload length and write 0
        // we will rewind and fill in once the size of the payload is known
        const payloadLengthWriteIndex = writeStream.getWriteIndex();
        writeStream.writeUInt32("payload.length", 0);
        if (!object) ;
        else if (object.type === TRANSACTION_PAYLOAD_TYPE) {
            serializeTransactionPayload(writeStream, object);
        }
        else if (object.type === MILESTONE_PAYLOAD_TYPE) {
            serializeMilestonePayload(writeStream, object);
        }
        else if (object.type === INDEXATION_PAYLOAD_TYPE) {
            serializeIndexationPayload(writeStream, object);
        }
        else if (object.type === RECEIPT_PAYLOAD_TYPE) {
            serializeReceiptPayload(writeStream, object);
        }
        else if (object.type === TREASURY_TRANSACTION_PAYLOAD_TYPE) {
            serializeTreasuryTransactionPayload(writeStream, object);
        }
        else {
            throw new Error(`Unrecognized transaction type ${object.type}`);
        }
        const endOfPayloadWriteIndex = writeStream.getWriteIndex();
        writeStream.setWriteIndex(payloadLengthWriteIndex);
        writeStream.writeUInt32("payload.length", endOfPayloadWriteIndex - payloadLengthWriteIndex - UINT32_SIZE);
        writeStream.setWriteIndex(endOfPayloadWriteIndex);
    }
    /**
     * Deserialize the transaction payload from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeTransactionPayload(readStream) {
        if (!readStream.hasRemaining(MIN_TRANSACTION_PAYLOAD_LENGTH)) {
            throw new Error(`Transaction Payload data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TRANSACTION_PAYLOAD_LENGTH}`);
        }
        const type = readStream.readUInt32("payloadTransaction.type");
        if (type !== TRANSACTION_PAYLOAD_TYPE) {
            throw new Error(`Type mismatch in payloadTransaction ${type}`);
        }
        const essenceType = readStream.readByte("payloadTransaction.essenceType", false);
        let essence;
        let unlockBlocks;
        if (essenceType === TRANSACTION_ESSENCE_TYPE) {
            essence = deserializeTransactionEssence(readStream);
            unlockBlocks = deserializeUnlockBlocks(readStream);
        }
        else {
            throw new Error(`Unrecognized transaction essence type ${type}`);
        }
        return {
            type: TRANSACTION_PAYLOAD_TYPE,
            essence,
            unlockBlocks
        };
    }
    /**
     * Serialize the transaction payload to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeTransactionPayload(writeStream, object) {
        writeStream.writeUInt32("payloadMilestone.type", object.type);
        if (object.type === TRANSACTION_PAYLOAD_TYPE) {
            serializeTransactionEssence(writeStream, object.essence);
            serializeUnlockBlocks(writeStream, object.unlockBlocks);
        }
        else {
            throw new Error(`Unrecognized transaction type ${object.type}`);
        }
    }
    /**
     * Deserialize the milestone payload from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeMilestonePayload(readStream) {
        if (!readStream.hasRemaining(MIN_MILESTONE_PAYLOAD_LENGTH)) {
            throw new Error(`Milestone Payload data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_MILESTONE_PAYLOAD_LENGTH}`);
        }
        const type = readStream.readUInt32("payloadMilestone.type");
        if (type !== MILESTONE_PAYLOAD_TYPE) {
            throw new Error(`Type mismatch in payloadMilestone ${type}`);
        }
        const index = readStream.readUInt32("payloadMilestone.index");
        const timestamp = readStream.readUInt64("payloadMilestone.timestamp");
        const numParents = readStream.readByte("payloadMilestone.numParents");
        const parentMessageIds = [];
        for (let i = 0; i < numParents; i++) {
            const parentMessageId = readStream.readFixedHex(`payloadMilestone.parentMessageId${i + 1}`, MESSAGE_ID_LENGTH);
            parentMessageIds.push(parentMessageId);
        }
        const inclusionMerkleProof = readStream.readFixedHex("payloadMilestone.inclusionMerkleProof", MERKLE_PROOF_LENGTH);
        const nextPoWScore = readStream.readUInt32("payloadMilestone.nextPoWScore");
        const nextPoWScoreMilestoneIndex = readStream.readUInt32("payloadMilestone.nextPoWScoreMilestoneIndex");
        const publicKeysCount = readStream.readByte("payloadMilestone.publicKeysCount");
        const publicKeys = [];
        for (let i = 0; i < publicKeysCount; i++) {
            publicKeys.push(readStream.readFixedHex("payloadMilestone.publicKey", Ed25519.PUBLIC_KEY_SIZE));
        }
        const receipt = deserializePayload(readStream);
        if (receipt && receipt.type !== RECEIPT_PAYLOAD_TYPE) {
            throw new Error("Milestones only support embedded receipt payload type");
        }
        const signaturesCount = readStream.readByte("payloadMilestone.signaturesCount");
        const signatures = [];
        for (let i = 0; i < signaturesCount; i++) {
            signatures.push(readStream.readFixedHex("payloadMilestone.signature", Ed25519.SIGNATURE_SIZE));
        }
        return {
            type: MILESTONE_PAYLOAD_TYPE,
            index,
            timestamp: Number(timestamp),
            parentMessageIds,
            inclusionMerkleProof,
            nextPoWScore,
            nextPoWScoreMilestoneIndex,
            publicKeys,
            receipt,
            signatures
        };
    }
    /**
     * Serialize the milestone payload to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeMilestonePayload(writeStream, object) {
        writeStream.writeUInt32("payloadMilestone.type", object.type);
        writeStream.writeUInt32("payloadMilestone.index", object.index);
        writeStream.writeUInt64("payloadMilestone.timestamp", BigInt(object.timestamp));
        if (object.parentMessageIds.length < MIN_NUMBER_PARENTS) {
            throw new Error(`A minimum of ${MIN_NUMBER_PARENTS} parents is allowed, you provided ${object.parentMessageIds.length}`);
        }
        if (object.parentMessageIds.length > MAX_NUMBER_PARENTS) {
            throw new Error(`A maximum of ${MAX_NUMBER_PARENTS} parents is allowed, you provided ${object.parentMessageIds.length}`);
        }
        if ((new Set(object.parentMessageIds)).size !== object.parentMessageIds.length) {
            throw new Error("The milestone parents must be unique");
        }
        const sorted = object.parentMessageIds.slice().sort();
        writeStream.writeByte("payloadMilestone.numParents", object.parentMessageIds.length);
        for (let i = 0; i < object.parentMessageIds.length; i++) {
            if (sorted[i] !== object.parentMessageIds[i]) {
                throw new Error("The milestone parents must be lexographically sorted");
            }
            writeStream.writeFixedHex(`payloadMilestone.parentMessageId${i + 1}`, MESSAGE_ID_LENGTH, object.parentMessageIds[i]);
        }
        writeStream.writeFixedHex("payloadMilestone.inclusionMerkleProof", MERKLE_PROOF_LENGTH, object.inclusionMerkleProof);
        writeStream.writeUInt32("payloadMilestone.nextPoWScore", object.nextPoWScore);
        writeStream.writeUInt32("payloadMilestone.nextPoWScoreMilestoneIndex", object.nextPoWScoreMilestoneIndex);
        writeStream.writeByte("payloadMilestone.publicKeysCount", object.publicKeys.length);
        for (let i = 0; i < object.publicKeys.length; i++) {
            writeStream.writeFixedHex("payloadMilestone.publicKey", Ed25519.PUBLIC_KEY_SIZE, object.publicKeys[i]);
        }
        serializePayload(writeStream, object.receipt);
        writeStream.writeByte("payloadMilestone.signaturesCount", object.signatures.length);
        for (let i = 0; i < object.signatures.length; i++) {
            writeStream.writeFixedHex("payloadMilestone.signature", Ed25519.SIGNATURE_SIZE, object.signatures[i]);
        }
    }
    /**
     * Deserialize the indexation payload from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeIndexationPayload(readStream) {
        if (!readStream.hasRemaining(MIN_INDEXATION_PAYLOAD_LENGTH)) {
            throw new Error(`Indexation Payload data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_INDEXATION_PAYLOAD_LENGTH}`);
        }
        const type = readStream.readUInt32("payloadIndexation.type");
        if (type !== INDEXATION_PAYLOAD_TYPE) {
            throw new Error(`Type mismatch in payloadIndexation ${type}`);
        }
        const indexLength = readStream.readUInt16("payloadIndexation.indexLength");
        const index = readStream.readFixedHex("payloadIndexation.index", indexLength);
        const dataLength = readStream.readUInt32("payloadIndexation.dataLength");
        const data = readStream.readFixedHex("payloadIndexation.data", dataLength);
        return {
            type: INDEXATION_PAYLOAD_TYPE,
            index,
            data
        };
    }
    /**
     * Serialize the indexation payload to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeIndexationPayload(writeStream, object) {
        if (object.index.length < MIN_INDEXATION_KEY_LENGTH) {
            throw new Error(`The indexation key length is ${object.index.length}, which is below the minimum size of ${MIN_INDEXATION_KEY_LENGTH}`);
        }
        if (object.index.length / 2 > MAX_INDEXATION_KEY_LENGTH) {
            throw new Error(`The indexation key length is ${object.index.length / 2}, which exceeds the maximum size of ${MAX_INDEXATION_KEY_LENGTH}`);
        }
        writeStream.writeUInt32("payloadIndexation.type", object.type);
        writeStream.writeUInt16("payloadIndexation.indexLength", object.index.length / 2);
        writeStream.writeFixedHex("payloadIndexation.index", object.index.length / 2, object.index);
        if (object.data) {
            writeStream.writeUInt32("payloadIndexation.dataLength", object.data.length / 2);
            writeStream.writeFixedHex("payloadIndexation.data", object.data.length / 2, object.data);
        }
        else {
            writeStream.writeUInt32("payloadIndexation.dataLength", 0);
        }
    }
    /**
     * Deserialize the receipt payload from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeReceiptPayload(readStream) {
        if (!readStream.hasRemaining(MIN_RECEIPT_PAYLOAD_LENGTH)) {
            throw new Error(`Receipt Payload data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_RECEIPT_PAYLOAD_LENGTH}`);
        }
        const type = readStream.readUInt32("payloadReceipt.type");
        if (type !== RECEIPT_PAYLOAD_TYPE) {
            throw new Error(`Type mismatch in payloadReceipt ${type}`);
        }
        const migratedAt = readStream.readUInt32("payloadReceipt.migratedAt");
        const final = readStream.readBoolean("payloadReceipt.final");
        const funds = deserializeFunds(readStream);
        const treasuryTransactionPayload = deserializePayload(readStream);
        if (!treasuryTransactionPayload || treasuryTransactionPayload.type !== TREASURY_TRANSACTION_PAYLOAD_TYPE) {
            throw new Error(`payloadReceipts can only contain treasury payloads ${type}`);
        }
        return {
            type: RECEIPT_PAYLOAD_TYPE,
            migratedAt,
            final,
            funds,
            transaction: treasuryTransactionPayload
        };
    }
    /**
     * Serialize the receipt payload to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeReceiptPayload(writeStream, object) {
        writeStream.writeUInt32("payloadReceipt.type", object.type);
        writeStream.writeUInt32("payloadReceipt.migratedAt", object.migratedAt);
        writeStream.writeBoolean("payloadReceipt.final", object.final);
        serializeFunds(writeStream, object.funds);
        serializePayload(writeStream, object.transaction);
    }
    /**
     * Deserialize the treasury transaction payload from binary.
     * @param readStream The stream to read the data from.
     * @returns The deserialized object.
     */
    function deserializeTreasuryTransactionPayload(readStream) {
        if (!readStream.hasRemaining(MIN_TREASURY_TRANSACTION_PAYLOAD_LENGTH)) {
            throw new Error(`Treasure Transaction Payload data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TREASURY_TRANSACTION_PAYLOAD_LENGTH}`);
        }
        const type = readStream.readUInt32("payloadTreasuryTransaction.type");
        if (type !== TREASURY_TRANSACTION_PAYLOAD_TYPE) {
            throw new Error(`Type mismatch in payloadTreasuryTransaction ${type}`);
        }
        const input = deserializeTreasuryInput(readStream);
        const output = deserializeTreasuryOutput(readStream);
        return {
            type: TREASURY_TRANSACTION_PAYLOAD_TYPE,
            input,
            output
        };
    }
    /**
     * Serialize the treasury transaction payload to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeTreasuryTransactionPayload(writeStream, object) {
        writeStream.writeUInt32("payloadTreasuryTransaction.type", object.type);
        serializeTreasuryInput(writeStream, object.input);
        serializeTreasuryOutput(writeStream, object.output);
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * The minimum length of a message binary representation.
     */
    const MIN_MESSAGE_LENGTH = UINT64_SIZE + // Network id
        BYTE_SIZE + // Parent count
        MESSAGE_ID_LENGTH + // Single parent
        MIN_PAYLOAD_LENGTH + // Min payload length
        UINT64_SIZE; // Nonce
    /**
     * The maximum length of a message.
     */
    const MAX_MESSAGE_LENGTH = 32768;
    /**
     * The maximum number of parents.
     */
    const MAX_NUMBER_PARENTS = 8;
    /**
     * The minimum number of parents.
     */
    const MIN_NUMBER_PARENTS = 1;
    /**
     * Deserialize the message from binary.
     * @param readStream The message to deserialize.
     * @returns The deserialized message.
     */
    function deserializeMessage(readStream) {
        if (!readStream.hasRemaining(MIN_MESSAGE_LENGTH)) {
            throw new Error(`Message data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_MESSAGE_LENGTH}`);
        }
        const networkId = readStream.readUInt64("message.networkId");
        const numParents = readStream.readByte("message.numParents");
        const parents = [];
        for (let i = 0; i < numParents; i++) {
            const parentMessageId = readStream.readFixedHex(`message.parentMessageId${i}`, MESSAGE_ID_LENGTH);
            parents.push(parentMessageId);
        }
        const payload = deserializePayload(readStream);
        if (payload &&
            (payload.type === RECEIPT_PAYLOAD_TYPE ||
                payload.type === TREASURY_TRANSACTION_PAYLOAD_TYPE)) {
            throw new Error("Messages can not contain receipt or treasury transaction payloads");
        }
        const nonce = readStream.readUInt64("message.nonce");
        const unused = readStream.unused();
        if (unused !== 0) {
            throw new Error(`Message data length ${readStream.length()} has unused data ${unused}`);
        }
        return {
            networkId: networkId.toString(10),
            parentMessageIds: parents,
            payload,
            nonce: nonce.toString(10)
        };
    }
    /**
     * Serialize the message essence to binary.
     * @param writeStream The stream to write the data to.
     * @param object The object to serialize.
     */
    function serializeMessage(writeStream, object) {
        var _a, _b, _c, _d;
        writeStream.writeUInt64("message.networkId", BigInt((_a = object.networkId) !== null && _a !== void 0 ? _a : 0));
        const numParents = (_c = (_b = object.parentMessageIds) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
        writeStream.writeByte("message.numParents", numParents);
        if (object.parentMessageIds) {
            if (numParents > MAX_NUMBER_PARENTS) {
                throw new Error(`A maximum of ${MAX_NUMBER_PARENTS} parents is allowed, you provided ${numParents}`);
            }
            if ((new Set(object.parentMessageIds)).size !== numParents) {
                throw new Error("The message parents must be unique");
            }
            const sorted = object.parentMessageIds.slice().sort();
            for (let i = 0; i < numParents; i++) {
                if (sorted[i] !== object.parentMessageIds[i]) {
                    throw new Error("The message parents must be lexographically sorted");
                }
                writeStream.writeFixedHex(`message.parentMessageId${i + 1}`, MESSAGE_ID_LENGTH, object.parentMessageIds[i]);
            }
        }
        if (object.payload &&
            object.payload.type !== TRANSACTION_PAYLOAD_TYPE &&
            object.payload.type !== INDEXATION_PAYLOAD_TYPE &&
            object.payload.type !== MILESTONE_PAYLOAD_TYPE) {
            throw new Error("Messages can only contain transaction, indexation or milestone payloads");
        }
        serializePayload(writeStream, object.payload);
        writeStream.writeUInt64("message.nonce", BigInt((_d = object.nonce) !== null && _d !== void 0 ? _d : 0));
    }

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /**
     * Class to represent errors from Client.
     */
    class ClientError extends Error {
        /**
         * Create a new instance of ClientError.
         * @param message The message for the error.
         * @param route The route the request was made to.
         * @param httpStatus The http status code.
         * @param code The code in the payload.
         */
        constructor(message, route, httpStatus, code) {
            super(message);
            this.route = route;
            this.httpStatus = httpStatus;
            this.code = code;
        }
    }

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /* eslint-disable no-bitwise */
    /**
     * Class to help with base64 Encoding/Decoding.
     * Sourced from https://github.com/beatgammit/base64-js.
     */
    class Base64 {
        /**
         * Get the byte length of the data.
         * @param base64 The base64 string.
         * @returns The bytle length of the data.
         */
        static byteLength(base64) {
            const lens = Base64.getLengths(base64);
            return Base64.calcByteLength(lens[0], lens[1]);
        }
        /**
         * Convert the base 64 string to a byte array.
         * @param base64 The base64 string to convert.
         * @returns The byte array.
         */
        static decode(base64) {
            let tmp;
            const lens = Base64.getLengths(base64);
            const validLen = lens[0];
            const placeHoldersLen = lens[1];
            const arr = new Uint8Array(Base64.calcByteLength(validLen, placeHoldersLen));
            let curByte = 0;
            // if there are placeholders, only get up to the last complete 4 chars
            const len = placeHoldersLen > 0 ? validLen - 4 : validLen;
            let i;
            for (i = 0; i < len; i += 4) {
                tmp =
                    (Base64._REVERSE_LOOKUP[base64.charCodeAt(i)] << 18) |
                        (Base64._REVERSE_LOOKUP[base64.charCodeAt(i + 1)] << 12) |
                        (Base64._REVERSE_LOOKUP[base64.charCodeAt(i + 2)] << 6) |
                        Base64._REVERSE_LOOKUP[base64.charCodeAt(i + 3)];
                arr[curByte++] = (tmp >> 16) & 0xFF;
                arr[curByte++] = (tmp >> 8) & 0xFF;
                arr[curByte++] = tmp & 0xFF;
            }
            if (placeHoldersLen === 2) {
                tmp =
                    (Base64._REVERSE_LOOKUP[base64.charCodeAt(i)] << 2) |
                        (Base64._REVERSE_LOOKUP[base64.charCodeAt(i + 1)] >> 4);
                arr[curByte++] = tmp & 0xFF;
            }
            if (placeHoldersLen === 1) {
                tmp =
                    (Base64._REVERSE_LOOKUP[base64.charCodeAt(i)] << 10) |
                        (Base64._REVERSE_LOOKUP[base64.charCodeAt(i + 1)] << 4) |
                        (Base64._REVERSE_LOOKUP[base64.charCodeAt(i + 2)] >> 2);
                arr[curByte++] = (tmp >> 8) & 0xFF;
                arr[curByte++] = tmp & 0xFF;
            }
            return arr;
        }
        /**
         * Convert a byte array to base 64.
         * @param bytes The byte array to convert.
         * @returns The data as bas64 string.
         */
        static encode(bytes) {
            let tmp;
            const len = bytes.length;
            const extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
            const parts = [];
            const maxChunkLength = 16383; // must be multiple of 3
            // go through the array every three bytes, we'll deal with trailing stuff later
            for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                parts.push(Base64.encodeChunk(bytes, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
            }
            // pad the end with zeros, but make sure to not forget the extra bytes
            if (extraBytes === 1) {
                tmp = bytes[len - 1];
                parts.push(`${Base64._LOOKUP[tmp >> 2] + Base64._LOOKUP[(tmp << 4) & 0x3F]}==`);
            }
            else if (extraBytes === 2) {
                tmp = (bytes[len - 2] << 8) + bytes[len - 1];
                parts.push(`${Base64._LOOKUP[tmp >> 10] +
                Base64._LOOKUP[(tmp >> 4) & 0x3F] +
                Base64._LOOKUP[(tmp << 2) & 0x3F]}=`);
            }
            return parts.join("");
        }
        /**
         * Calculate the byte length.
         * @param validLen The valid length.
         * @param placeHoldersLen The placeholder length.
         * @returns The length.
         */
        static calcByteLength(validLen, placeHoldersLen) {
            return (((validLen + placeHoldersLen) * 3) / 4) - placeHoldersLen;
        }
        /**
         * Get the valid and placeholder lengths from a bas64 string.
         * @param base64 The base64 string.
         * @returns The lengths.
         */
        static getLengths(base64) {
            const len = base64.length;
            if (len % 4 > 0) {
                throw new Error("Invalid string. Length must be a multiple of 4");
            }
            // Trim off extra bytes after placeholder bytes are found
            // See: https://github.com/beatgammit/base64-js/issues/42
            let validLen = base64.indexOf("=");
            if (validLen === -1) {
                validLen = len;
            }
            const placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4);
            return [validLen, placeHoldersLen];
        }
        /**
         * Convert the triplet to base 64.
         * @param num The number to convert.
         * @returns The base64 erncoding.
         */
        static tripletToBase64(num) {
            return Base64._LOOKUP[(num >> 18) & 0x3F] +
                Base64._LOOKUP[(num >> 12) & 0x3F] +
                Base64._LOOKUP[(num >> 6) & 0x3F] +
                Base64._LOOKUP[num & 0x3F];
        }
        /**
         * Encode a chunk.
         * @param bytes The byte array.
         * @param start The start index in the buffer.
         * @param end The end index in the buffer.
         * @returns The encoded chunk.
         */
        static encodeChunk(bytes, start, end) {
            let tmp;
            const output = [];
            for (let i = start; i < end; i += 3) {
                tmp =
                    ((bytes[i] << 16) & 0xFF0000) +
                        ((bytes[i + 1] << 8) & 0xFF00) +
                        (bytes[i + 2] & 0xFF);
                output.push(Base64.tripletToBase64(tmp));
            }
            return output.join("");
        }
    }
    /**
     * Alphabet table for encoding.
     * @internal
     */
    Base64._LOOKUP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    /**
     * Alphabet table for decoding.
     * @internal
     */
    Base64._REVERSE_LOOKUP = {
        "43": 62, "45": 62, "47": 63, "48": 52, "49": 53, "50": 54, "51": 55, "52": 56,
        "53": 57, "54": 58, "55": 59, "56": 60, "57": 61, "65": 0, "66": 1, "67": 2,
        "68": 3, "69": 4, "70": 5, "71": 6, "72": 7, "73": 8, "74": 9, "75": 10, "76": 11,
        "77": 12, "78": 13, "79": 14, "80": 15, "81": 16, "82": 17, "83": 18, "84": 19,
        "85": 20, "86": 21, "87": 22, "88": 23, "89": 24, "90": 25, "95": 63, "97": 26,
        "98": 27, "99": 28, "100": 29, "101": 30, "102": 31, "103": 32, "104": 33, "105": 34,
        "106": 35, "107": 36, "108": 37, "109": 38, "110": 39, "111": 40, "112": 41, "113": 42,
        "114": 43, "115": 44, "116": 45, "117": 46, "118": 47, "119": 48, "120": 49, "121": 50, "122": 51
    };

    // Copyright 2020 IOTA Stiftung
    /**
     * Convert arrays to and from different formats.
     */
    class Converter {
        /**
         * Encode a raw array to UTF8 string.
         * @param array The bytes to encode.
         * @param startIndex The index to start in the bytes.
         * @param length The length of bytes to read.
         * @returns The array formated as UTF8.
         */
        static bytesToUtf8(array, startIndex, length) {
            const start = startIndex !== null && startIndex !== void 0 ? startIndex : 0;
            const len = length !== null && length !== void 0 ? length : array.length;
            let str = "";
            for (let i = start; i < start + len; i++) {
                const value = array[i];
                if (value < 0x80) {
                    str += String.fromCharCode(value);
                }
                else if (value > 0xBF && value < 0xE0) {
                    str += String.fromCharCode(((value & 0x1F) << 6) | (array[i + 1] & 0x3F));
                    i += 1;
                }
                else if (value > 0xDF && value < 0xF0) {
                    str += String.fromCharCode(((value & 0x0F) << 12) | ((array[i + 1] & 0x3F) << 6) | (array[i + 2] & 0x3F));
                    i += 2;
                }
                else {
                    // surrogate pair
                    const charCode = (((value & 0x07) << 18) |
                        ((array[i + 1] & 0x3F) << 12) |
                        ((array[i + 2] & 0x3F) << 6) |
                        (array[i + 3] & 0x3F)) - 0x010000;
                    str += String.fromCharCode((charCode >> 10) | 0xD800, (charCode & 0x03FF) | 0xDC00);
                    i += 3;
                }
            }
            return str;
        }
        /**
         * Convert a UTF8 string to raw array.
         * @param utf8 The text to decode.
         * @returns The array.
         */
        static utf8ToBytes(utf8) {
            const bytes = [];
            for (let i = 0; i < utf8.length; i++) {
                let charcode = utf8.charCodeAt(i);
                if (charcode < 0x80) {
                    bytes.push(charcode);
                }
                else if (charcode < 0x800) {
                    bytes.push(0xC0 | (charcode >> 6), 0x80 | (charcode & 0x3F));
                }
                else if (charcode < 0xD800 || charcode >= 0xE000) {
                    bytes.push(0xE0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3F), 0x80 | (charcode & 0x3F));
                }
                else {
                    // surrogate pair
                    i++;
                    // UTF-16 encodes 0x10000-0x10FFFF by
                    // subtracting 0x10000 and splitting the
                    // 20 bits of 0x0-0xFFFFF into two halves
                    charcode = 0x10000 + (((charcode & 0x3FF) << 10) | (utf8.charCodeAt(i) & 0x3FF));
                    bytes.push(0xF0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3F), 0x80 | ((charcode >> 6) & 0x3F), 0x80 | (charcode & 0x3F));
                }
            }
            return Uint8Array.from(bytes);
        }
        /**
         * Encode a raw array to hex string.
         * @param array The bytes to encode.
         * @param startIndex The index to start in the bytes.
         * @param length The length of bytes to read.
         * @param reverse Reverse the combine direction.
         * @returns The array formated as hex.
         */
        static bytesToHex(array, startIndex, length, reverse) {
            let hex = "";
            this.buildHexLookups();
            if (Converter.ENCODE_LOOKUP) {
                const len = length !== null && length !== void 0 ? length : array.length;
                const start = startIndex !== null && startIndex !== void 0 ? startIndex : 0;
                if (reverse) {
                    for (let i = 0; i < len; i++) {
                        hex = Converter.ENCODE_LOOKUP[array[start + i]] + hex;
                    }
                }
                else {
                    for (let i = 0; i < len; i++) {
                        hex += Converter.ENCODE_LOOKUP[array[start + i]];
                    }
                }
            }
            return hex;
        }
        /**
         * Decode a hex string to raw array.
         * @param hex The hex to decode.
         * @param reverse Store the characters in reverse.
         * @returns The array.
         */
        static hexToBytes(hex, reverse) {
            const sizeof = hex.length >> 1;
            const length = sizeof << 1;
            const array = new Uint8Array(sizeof);
            this.buildHexLookups();
            if (Converter.DECODE_LOOKUP) {
                let i = 0;
                let n = 0;
                while (i < length) {
                    array[n++] =
                        (Converter.DECODE_LOOKUP[hex.charCodeAt(i++)] << 4) |
                            Converter.DECODE_LOOKUP[hex.charCodeAt(i++)];
                }
                if (reverse) {
                    array.reverse();
                }
            }
            return array;
        }
        /**
         * Convert the UTF8 to hex.
         * @param utf8 The text to convert.
         * @returns The hex version of the bytes.
         */
        static utf8ToHex(utf8) {
            return Converter.bytesToHex(Converter.utf8ToBytes(utf8));
        }
        /**
         * Convert the hex text to text.
         * @param hex The hex to convert.
         * @returns The UTF8 version of the bytes.
         */
        static hexToUtf8(hex) {
            return Converter.bytesToUtf8(Converter.hexToBytes(hex));
        }
        /**
         * Is the data hex format.
         * @param value The value to test.
         * @returns True if the string is hex.
         */
        static isHex(value) {
            if (value.length % 2 === 1) {
                return false;
            }
            return /^[\da-f]+$/g.test(value);
        }
        /**
         * Convert bytes to binary string.
         * @param bytes The bytes to convert.
         * @returns A binary string of the bytes.
         */
        static bytesToBinary(bytes) {
            const b = [];
            for (let i = 0; i < bytes.length; i++) {
                b.push(bytes[i].toString(2).padStart(8, "0"));
            }
            return b.join("");
        }
        /**
         * Convert a binary string to bytes.
         * @param binary The binary string.
         * @returns The bytes.
         */
        static binaryToBytes(binary) {
            const bytes = new Uint8Array(Math.ceil(binary.length / 8));
            for (let i = 0; i < bytes.length; i++) {
                bytes[i] = Number.parseInt(binary.slice((i * 8), (i + 1) * 8), 2);
            }
            return bytes;
        }
        /**
         * Convert bytes to base64 string.
         * @param bytes The bytes to convert.
         * @returns A base64 string of the bytes.
         */
        static bytesToBase64(bytes) {
            return Base64.encode(bytes);
        }
        /**
         * Convert a base64 string to bytes.
         * @param base64 The base64 string.
         * @returns The bytes.
         */
        static base64ToBytes(base64) {
            return Base64.decode(base64);
        }
        /**
         * Build the static lookup tables.
         * @internal
         */
        static buildHexLookups() {
            if (!Converter.ENCODE_LOOKUP || !Converter.DECODE_LOOKUP) {
                const alphabet = "0123456789abcdef";
                Converter.ENCODE_LOOKUP = [];
                Converter.DECODE_LOOKUP = [];
                for (let i = 0; i < 256; i++) {
                    Converter.ENCODE_LOOKUP[i] = alphabet[(i >> 4) & 0xF] + alphabet[i & 0xF];
                    if (i < 16) {
                        if (i < 10) {
                            Converter.DECODE_LOOKUP[0x30 + i] = i;
                        }
                        else {
                            Converter.DECODE_LOOKUP[0x61 - 10 + i] = i;
                        }
                    }
                }
            }
        }
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Keep track of the write index within a stream.
     */
    class WriteStream {
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

    // Copyright 2020 IOTA Stiftung
    /**
     * Client for API communication.
     */
    class SingleNodeClient {
        /**
         * Create a new instance of client.
         * @param endpoint The endpoint.
         * @param options Options for the client.
         */
        constructor(endpoint, options) {
            var _a, _b, _c;
            if (!endpoint) {
                throw new Error("The endpoint can not be empty");
            }
            this._endpoint = endpoint.replace(/\/+$/, "");
            this._basePath = (_a = options === null || options === void 0 ? void 0 : options.basePath) !== null && _a !== void 0 ? _a : "/api/v1/";
            this._powProvider = options === null || options === void 0 ? void 0 : options.powProvider;
            this._timeout = options === null || options === void 0 ? void 0 : options.timeout;
            this._userName = options === null || options === void 0 ? void 0 : options.userName;
            this._password = options === null || options === void 0 ? void 0 : options.password;
            this._headers = options === null || options === void 0 ? void 0 : options.headers;
            if (this._userName && this._password && !this._endpoint.startsWith("https")) {
                throw new Error("Basic authentication requires the endpoint to be https");
            }
            if (this._userName && this._password && (((_b = this._headers) === null || _b === void 0 ? void 0 : _b.authorization) || ((_c = this._headers) === null || _c === void 0 ? void 0 : _c.Authorization))) {
                throw new Error("You can not supply both user/pass and authorization header");
            }
        }
        /**
         * Get the health of the node.
         * @returns True if the node is healthy.
         */
        async health() {
            const status = await this.fetchStatus("/health");
            if (status === 200) {
                return true;
            }
            else if (status === 503) {
                return false;
            }
            throw new ClientError("Unexpected response code", "/health", status);
        }
        /**
         * Get the info about the node.
         * @returns The node information.
         */
        async info() {
            return this.fetchJson("get", "info");
        }
        /**
         * Get the tips from the node.
         * @returns The tips.
         */
        async tips() {
            return this.fetchJson("get", "tips");
        }
        /**
         * Get the message data by id.
         * @param messageId The message to get the data for.
         * @returns The message data.
         */
        async message(messageId) {
            return this.fetchJson("get", `messages/${messageId}`);
        }
        /**
         * Get the message metadata by id.
         * @param messageId The message to get the metadata for.
         * @returns The message metadata.
         */
        async messageMetadata(messageId) {
            return this.fetchJson("get", `messages/${messageId}/metadata`);
        }
        /**
         * Get the message raw data by id.
         * @param messageId The message to get the data for.
         * @returns The message raw data.
         */
        async messageRaw(messageId) {
            return this.fetchBinary("get", `messages/${messageId}/raw`);
        }
        /**
         * Submit message.
         * @param message The message to submit.
         * @returns The messageId.
         */
        async messageSubmit(message) {
            let minPoWScore = 0;
            if (this._powProvider) {
                // If there is a local pow provider and no networkId or parent message ids
                // we must populate them, so that the they are not filled in by the
                // node causing invalid pow calculation
                const powInfo = await this.getPoWInfo();
                minPoWScore = powInfo.minPoWScore;
                if (!message.parentMessageIds || message.parentMessageIds.length === 0) {
                    const tips = await this.tips();
                    message.parentMessageIds = tips.tipMessageIds;
                }
                if (!message.networkId || message.networkId.length === 0) {
                    message.networkId = powInfo.networkId.toString();
                }
            }
            const writeStream = new WriteStream();
            serializeMessage(writeStream, message);
            const messageBytes = writeStream.finalBytes();
            if (messageBytes.length > MAX_MESSAGE_LENGTH) {
                throw new Error(`The message length is ${messageBytes.length}, which exceeds the maximum size of ${MAX_MESSAGE_LENGTH}`);
            }
            if (this._powProvider) {
                const nonce = await this._powProvider.pow(messageBytes, minPoWScore);
                message.nonce = nonce.toString(10);
            }
            const response = await this.fetchJson("post", "messages", message);
            return response.messageId;
        }
        /**
         * Submit message in raw format.
         * @param message The message to submit.
         * @returns The messageId.
         */
        async messageSubmitRaw(message) {
            if (message.length > MAX_MESSAGE_LENGTH) {
                throw new Error(`The message length is ${message.length}, which exceeds the maximum size of ${MAX_MESSAGE_LENGTH}`);
            }
            if (this._powProvider && ArrayHelper.equal(message.slice(-8), SingleNodeClient.NONCE_ZERO)) {
                const { networkId, minPoWScore } = await this.getPoWInfo();
                BigIntHelper.write8(networkId, message, 0);
                const nonce = await this._powProvider.pow(message, minPoWScore);
                BigIntHelper.write8(nonce, message, message.length - 8);
            }
            const response = await this.fetchBinary("post", "messages", message);
            return response.messageId;
        }
        /**
         * Find messages by index.
         * @param indexationKey The index value as a byte array or UTF8 string.
         * @returns The messageId.
         */
        async messagesFind(indexationKey) {
            return this.fetchJson("get", `messages?index=${typeof indexationKey === "string"
            ? Converter.utf8ToHex(indexationKey)
            : Converter.bytesToHex(indexationKey)}`);
        }
        /**
         * Get the children of a message.
         * @param messageId The id of the message to get the children for.
         * @returns The messages children.
         */
        async messageChildren(messageId) {
            return this.fetchJson("get", `messages/${messageId}/children`);
        }
        /**
         * Get the message that was included in the ledger for a transaction.
         * @param transactionId The id of the transaction to get the included message for.
         * @returns The message.
         */
        async transactionIncludedMessage(transactionId) {
            return this.fetchJson("get", `transactions/${transactionId}/included-message`);
        }
        /**
         * Find an output by its identifier.
         * @param outputId The id of the output to get.
         * @returns The output details.
         */
        async output(outputId) {
            return this.fetchJson("get", `outputs/${outputId}`);
        }
        /**
         * Get the address details.
         * @param addressBech32 The address to get the details for.
         * @returns The address details.
         */
        async address(addressBech32) {
            return this.fetchJson("get", `addresses/${addressBech32}`);
        }
        /**
         * Get the address outputs.
         * @param addressBech32 The address to get the outputs for.
         * @param type Filter the type of outputs you are looking up, defaults to all.
         * @param includeSpent Filter the type of outputs you are looking up, defaults to false.
         * @returns The address outputs.
         */
        async addressOutputs(addressBech32, type, includeSpent) {
            const queryParams = [];
            if (type !== undefined) {
                queryParams.push(`type=${type}`);
            }
            if (includeSpent !== undefined) {
                queryParams.push(`include-spent=${includeSpent}`);
            }
            return this.fetchJson("get", `addresses/${addressBech32}/outputs${this.combineQueryParams(queryParams)}`);
        }
        /**
         * Get the address detail using ed25519 address.
         * @param addressEd25519 The address to get the details for.
         * @returns The address details.
         */
        async addressEd25519(addressEd25519) {
            if (!Converter.isHex(addressEd25519)) {
                throw new Error("The supplied address does not appear to be hex format");
            }
            return this.fetchJson("get", `addresses/ed25519/${addressEd25519}`);
        }
        /**
         * Get the address outputs using ed25519 address.
         * @param addressEd25519 The address to get the outputs for.
         * @param type Filter the type of outputs you are looking up, defaults to all.
         * @param includeSpent Filter the type of outputs you are looking up, defaults to false.
         * @returns The address outputs.
         */
        async addressEd25519Outputs(addressEd25519, type, includeSpent) {
            if (!Converter.isHex(addressEd25519)) {
                throw new Error("The supplied address does not appear to be hex format");
            }
            const queryParams = [];
            if (type !== undefined) {
                queryParams.push(`type=${type}`);
            }
            if (includeSpent !== undefined) {
                queryParams.push(`include-spent=${includeSpent}`);
            }
            return this.fetchJson("get", `addresses/ed25519/${addressEd25519}/outputs${this.combineQueryParams(queryParams)}`);
        }
        /**
         * Get the requested milestone.
         * @param index The index of the milestone to get.
         * @returns The milestone details.
         */
        async milestone(index) {
            return this.fetchJson("get", `milestones/${index}`);
        }
        /**
         * Get the requested milestone utxo changes.
         * @param index The index of the milestone to request the changes for.
         * @returns The milestone utxo changes details.
         */
        async milestoneUtxoChanges(index) {
            return this.fetchJson("get", `milestones/${index}/utxo-changes`);
        }
        /**
         * Get the current treasury output.
         * @returns The details for the treasury.
         */
        async treasury() {
            return this.fetchJson("get", "treasury");
        }
        /**
         * Get all the stored receipts or those for a given migrated at index.
         * @param migratedAt The index the receipts were migrated at, if not supplied returns all stored receipts.
         * @returns The stored receipts.
         */
        async receipts(migratedAt) {
            return this.fetchJson("get", `receipts${migratedAt !== undefined ? `/${migratedAt}` : ""}`);
        }
        /**
         * Get the list of peers.
         * @returns The list of peers.
         */
        async peers() {
            return this.fetchJson("get", "peers");
        }
        /**
         * Add a new peer.
         * @param multiAddress The address of the peer to add.
         * @param alias An optional alias for the peer.
         * @returns The details for the created peer.
         */
        async peerAdd(multiAddress, alias) {
            return this.fetchJson("post", "peers", {
                multiAddress,
                alias
            });
        }
        /**
         * Delete a peer.
         * @param peerId The peer to delete.
         * @returns Nothing.
         */
        async peerDelete(peerId) {
            // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
            return this.fetchJson("delete", `peers/${peerId}`);
        }
        /**
         * Get a peer.
         * @param peerId The peer to delete.
         * @returns The details for the created peer.
         */
        async peer(peerId) {
            return this.fetchJson("get", `peers/${peerId}`);
        }
        /**
         * Perform a request and just return the status.
         * @param route The route of the request.
         * @returns The response.
         */
        async fetchStatus(route) {
            const response = await this.fetchWithTimeout("get", route);
            return response.status;
        }
        /**
         * Perform a request in json format.
         * @param method The http method.
         * @param route The route of the request.
         * @param requestData Request to send to the endpoint.
         * @returns The response.
         */
        async fetchJson(method, route, requestData) {
            const response = await this.fetchWithTimeout(method, `${this._basePath}${route}`, { "Content-Type": "application/json" }, requestData ? JSON.stringify(requestData) : undefined);
            let errorMessage;
            let errorCode;
            if (response.ok) {
                if (response.status === 204) {
                    // No content
                    return {};
                }
                try {
                    const responseData = await response.json();
                    if (responseData.error) {
                        errorMessage = responseData.error.message;
                        errorCode = responseData.error.code;
                    }
                    else {
                        return responseData.data;
                    }
                }
                catch {
                }
            }
            if (!errorMessage) {
                try {
                    const json = await response.json();
                    if (json.error) {
                        errorMessage = json.error.message;
                        errorCode = json.error.code;
                    }
                }
                catch { }
            }
            if (!errorMessage) {
                try {
                    const text = await response.text();
                    if (text.length > 0) {
                        const match = /code=(\d+), message=(.*)/.exec(text);
                        if ((match === null || match === void 0 ? void 0 : match.length) === 3) {
                            errorCode = match[1];
                            errorMessage = match[2];
                        }
                        else {
                            errorMessage = text;
                        }
                    }
                }
                catch { }
            }
            throw new ClientError(errorMessage !== null && errorMessage !== void 0 ? errorMessage : response.statusText, route, response.status, errorCode !== null && errorCode !== void 0 ? errorCode : response.status.toString());
        }
        /**
         * Perform a request for binary data.
         * @param method The http method.
         * @param route The route of the request.
         * @param requestData Request to send to the endpoint.
         * @returns The response.
         */
        async fetchBinary(method, route, requestData) {
            var _a, _b, _c;
            const response = await this.fetchWithTimeout(method, `${this._basePath}${route}`, { "Content-Type": "application/octet-stream" }, requestData);
            let responseData;
            if (response.ok) {
                if (method === "get") {
                    return new Uint8Array(await response.arrayBuffer());
                }
                responseData = await response.json();
                if (!(responseData === null || responseData === void 0 ? void 0 : responseData.error)) {
                    return responseData === null || responseData === void 0 ? void 0 : responseData.data;
                }
            }
            if (!responseData) {
                responseData = await response.json();
            }
            throw new ClientError((_b = (_a = responseData === null || responseData === void 0 ? void 0 : responseData.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : response.statusText, route, response.status, (_c = responseData === null || responseData === void 0 ? void 0 : responseData.error) === null || _c === void 0 ? void 0 : _c.code);
        }
        /**
         * Perform a fetch request.
         * @param method The http method.
         * @param route The route of the request.
         * @param headers The headers for the request.
         * @param requestData Request to send to the endpoint.
         * @returns The response.
         * @internal
         */
        async fetchWithTimeout(method, route, headers, body) {
            let controller;
            let timerId;
            if (this._timeout !== undefined) {
                controller = new AbortController();
                timerId = setTimeout(() => {
                    if (controller) {
                        controller.abort();
                    }
                }, this._timeout);
            }
            const finalHeaders = {};
            if (this._headers) {
                for (const header in this._headers) {
                    finalHeaders[header] = this._headers[header];
                }
            }
            if (headers) {
                for (const header in headers) {
                    finalHeaders[header] = headers[header];
                }
            }
            if (this._userName && this._password) {
                const userPass = Converter.bytesToBase64(Converter.utf8ToBytes(`${this._userName}:${this._password}`));
                finalHeaders.Authorization = `Basic ${userPass}`;
            }
            try {
                const response = await fetch(`${this._endpoint}${route}`, {
                    method,
                    headers: finalHeaders,
                    body,
                    signal: controller ? controller.signal : undefined
                });
                return response;
            }
            catch (err) {
                throw err.name === "AbortError" ? new Error("Timeout") : err;
            }
            finally {
                if (timerId) {
                    clearTimeout(timerId);
                }
            }
        }
        /**
         * Combine the query params.
         * @param queryParams The quer params to combine.
         * @returns The combined query params.
         */
        combineQueryParams(queryParams) {
            return queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
        }
        /**
         * Get the pow info from the node.
         * @returns The networkId and the minPoWScore.
         * @internal
         */
        async getPoWInfo() {
            const nodeInfo = await this.info();
            const networkIdBytes = Blake2b.sum256(Converter.utf8ToBytes(nodeInfo.networkId));
            return {
                networkId: BigIntHelper.read8(networkIdBytes, 0),
                minPoWScore: nodeInfo.minPoWScore
            };
        }
    }
    /**
     * A zero nonce.
     * @internal
     */
    SingleNodeClient.NONCE_ZERO = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /* eslint-disable no-bitwise */
    /**
     * Class to help with Bech32 encoding/decoding.
     * Based on reference implementation https://github.com/sipa/bech32/blob/master/ref/javascript/bech32.js.
     */
    class Bech32 {
        /**
         * Encode the buffer.
         * @param humanReadablePart The header.
         * @param data The data to encode.
         * @returns The encoded data.
         */
        static encode(humanReadablePart, data) {
            return Bech32.encode5BitArray(humanReadablePart, Bech32.to5Bit(data));
        }
        /**
         * Encode the 5 bit data buffer.
         * @param humanReadablePart The header.
         * @param data5Bit The data to encode.
         * @returns The encoded data.
         */
        static encode5BitArray(humanReadablePart, data5Bit) {
            const checksum = Bech32.createChecksum(humanReadablePart, data5Bit);
            let ret = `${humanReadablePart}${Bech32.SEPARATOR}`;
            for (let i = 0; i < data5Bit.length; i++) {
                ret += Bech32.CHARSET.charAt(data5Bit[i]);
            }
            for (let i = 0; i < checksum.length; i++) {
                ret += Bech32.CHARSET.charAt(checksum[i]);
            }
            return ret;
        }
        /**
         * Decode a bech32 string.
         * @param bech The text to decode.
         * @returns The decoded data or undefined if it could not be decoded.
         */
        static decode(bech) {
            const result = Bech32.decodeTo5BitArray(bech);
            return result ? {
                humanReadablePart: result.humanReadablePart,
                data: Bech32.from5Bit(result.data)
            } : undefined;
        }
        /**
         * Decode a bech32 string to 5 bit array.
         * @param bech The text to decode.
         * @returns The decoded data or undefined if it could not be decoded.
         */
        static decodeTo5BitArray(bech) {
            bech = bech.toLowerCase();
            const separatorPos = bech.lastIndexOf(Bech32.SEPARATOR);
            if (separatorPos === -1) {
                throw new Error(`There is no separator character ${Bech32.SEPARATOR} in the data`);
            }
            if (separatorPos < 1) {
                throw new Error(`The separator position is ${separatorPos}, which is too early in the string`);
            }
            if (separatorPos + 7 > bech.length) {
                throw new Error(`The separator position is ${separatorPos}, which doesn't leave enough space for data`);
            }
            const data = new Uint8Array(bech.length - separatorPos - 1);
            let idx = 0;
            for (let i = separatorPos + 1; i < bech.length; i++) {
                const d = Bech32.CHARSET.indexOf(bech.charAt(i));
                if (d === -1) {
                    throw new Error(`Data contains characters not in the charset ${bech.charAt(i)}`);
                }
                data[idx++] = Bech32.CHARSET.indexOf(bech.charAt(i));
            }
            const humanReadablePart = bech.slice(0, separatorPos);
            if (!Bech32.verifyChecksum(humanReadablePart, data)) {
                return;
            }
            return { humanReadablePart, data: data.slice(0, -6) };
        }
        /**
         * Convert the input bytes into 5 bit data.
         * @param bytes The bytes to convert.
         * @returns The data in 5 bit form.
         */
        static to5Bit(bytes) {
            return Bech32.convertBits(bytes, 8, 5, true);
        }
        /**
         * Convert the 5 bit data to 8 bit.
         * @param fiveBit The 5 bit data to convert.
         * @returns The 5 bit data converted to 8 bit.
         */
        static from5Bit(fiveBit) {
            return Bech32.convertBits(fiveBit, 5, 8, false);
        }
        /**
         * Does the given string match the bech32 pattern.
         * @param humanReadablePart The human readable part.
         * @param bech32Text The text to test.
         * @returns True if this is potentially a match.
         */
        static matches(humanReadablePart, bech32Text) {
            if (!bech32Text) {
                return false;
            }
            const regEx = new RegExp(`^${humanReadablePart}1[${Bech32.CHARSET}]{6,}$`);
            return regEx.test(bech32Text);
        }
        /**
         * Create the checksum from the human redable part and the data.
         * @param humanReadablePart The human readable part.
         * @param data The data.
         * @returns The checksum.
         * @internal
         */
        static createChecksum(humanReadablePart, data) {
            const expanded = Bech32.humanReadablePartExpand(humanReadablePart);
            const values = new Uint8Array(expanded.length + data.length + 6);
            values.set(expanded, 0);
            values.set(data, expanded.length);
            values.set([0, 0, 0, 0, 0, 0], expanded.length + data.length);
            const mod = Bech32.polymod(values) ^ 1;
            const ret = new Uint8Array(6);
            for (let i = 0; i < 6; i++) {
                ret[i] = (mod >> 5 * (5 - i)) & 31;
            }
            return ret;
        }
        /**
         * Verify the checksum given the humarn readable part and data.
         * @param humanReadablePart The human redable part to validate the checksum.
         * @param data The data to validate the checksum.
         * @returns True if the checksum was verified.
         * @internal
         */
        static verifyChecksum(humanReadablePart, data) {
            const expanded = Bech32.humanReadablePartExpand(humanReadablePart);
            const values = new Uint8Array(expanded.length + data.length);
            values.set(expanded, 0);
            values.set(data, expanded.length);
            return Bech32.polymod(values) === 1;
        }
        /**
         * Calculate the polymod of the values.
         * @param values The values to calculate the polymod for.
         * @returns The polymod of the values.
         * @internal
         */
        static polymod(values) {
            let chk = 1;
            for (let p = 0; p < values.length; p++) {
                const top = chk >> 25;
                chk = ((chk & 0x1FFFFFF) << 5) ^ values[p];
                for (let i = 0; i < 5; ++i) {
                    if ((top >> i) & 1) {
                        chk ^= Bech32.GENERATOR[i];
                    }
                }
            }
            return chk;
        }
        /**
         * Expand the human readable part.
         * @param humanReadablePart The human readable part to expand.
         * @returns The expanded human readable part.
         * @internal
         */
        static humanReadablePartExpand(humanReadablePart) {
            const ret = new Uint8Array((humanReadablePart.length * 2) + 1);
            let idx = 0;
            for (let i = 0; i < humanReadablePart.length; i++) {
                ret[idx++] = humanReadablePart.charCodeAt(i) >> 5;
            }
            ret[idx++] = 0;
            for (let i = 0; i < humanReadablePart.length; i++) {
                ret[idx++] = humanReadablePart.charCodeAt(i) & 31;
            }
            return ret;
        }
        /**
         * Convert input data from one bit resolution to another.
         * @param data The data to convert.
         * @param fromBits The resolution of the input data.
         * @param toBits The required resolution of the output data.
         * @param padding Include padding in the output.
         * @returns The converted data,
         * @internal
         */
        static convertBits(data, fromBits, toBits, padding) {
            let value = 0;
            let bits = 0;
            const maxV = (1 << toBits) - 1;
            const res = [];
            for (let i = 0; i < data.length; i++) {
                value = (value << fromBits) | data[i];
                bits += fromBits;
                while (bits >= toBits) {
                    bits -= toBits;
                    res.push((value >> bits) & maxV);
                }
            }
            if (padding) {
                if (bits > 0) {
                    res.push((value << (toBits - bits)) & maxV);
                }
            }
            else {
                if (bits >= fromBits) {
                    throw new Error("Excess padding");
                }
                if ((value << (toBits - bits)) & maxV) {
                    throw new Error("Non-zero padding");
                }
            }
            return new Uint8Array(res);
        }
    }
    /**
     * The alphabet to use.
     * @internal
     */
    Bech32.CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
    /**
     * The separator between human readable part and data.
     * @internal
     */
    Bech32.SEPARATOR = "1";
    /**
     * The generator constants;
     * @internal
     */
    Bech32.GENERATOR = Uint32Array.from([
        0x3B6A57B2,
        0x26508E6D,
        0x1EA119FA,
        0x3D4233DD,
        0x2A1462B3
    ]);

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /**
     * Class to help with bip32 paths.
     */
    class Bip32Path {
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

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /* eslint-disable no-bitwise */
    /* eslint-disable unicorn/prefer-math-trunc */
    /**
     * Class to help with Sha256 scheme.
     * TypeScript conversion from https://github.com/emn178/js-sha256.
     */
    class Sha256 {
        /**
         * Create a new instance of Sha256.
         * @param bits The number of bits.
         */
        constructor(bits = Sha256.SIZE_256) {
            /**
             * Blocks.
             * @internal
             */
            this._blocks = [];
            if (bits !== Sha256.SIZE_224 && bits !== Sha256.SIZE_256) {
                throw new Error("Only 224 or 256 bits are supported");
            }
            this._blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            if (bits === Sha256.SIZE_224) {
                this._h0 = 0xC1059ED8;
                this._h1 = 0x367CD507;
                this._h2 = 0x3070DD17;
                this._h3 = 0xF70E5939;
                this._h4 = 0xFFC00B31;
                this._h5 = 0x68581511;
                this._h6 = 0x64F98FA7;
                this._h7 = 0xBEFA4FA4;
            }
            else {
                this._h0 = 0x6A09E667;
                this._h1 = 0xBB67AE85;
                this._h2 = 0x3C6EF372;
                this._h3 = 0xA54FF53A;
                this._h4 = 0x510E527F;
                this._h5 = 0x9B05688C;
                this._h6 = 0x1F83D9AB;
                this._h7 = 0x5BE0CD19;
            }
            this._bits = bits;
            this._block = 0;
            this._start = 0;
            this._bytes = 0;
            this._hBytes = 0;
            this._lastByteIndex = 0;
            this._finalized = false;
            this._hashed = false;
            this._first = true;
        }
        /**
         * Perform Sum 256 on the data.
         * @param data The data to operate on.
         * @returns The sum 256 of the data.
         */
        static sum256(data) {
            const b2b = new Sha256(Sha256.SIZE_256);
            b2b.update(data);
            return b2b.digest();
        }
        /**
         * Perform Sum 224 on the data.
         * @param data The data to operate on.
         * @returns The sum 224 of the data.
         */
        static sum224(data) {
            const b2b = new Sha256(Sha256.SIZE_224);
            b2b.update(data);
            return b2b.digest();
        }
        /**
         * Update the hash with the data.
         * @param message The data to update the hash with.
         * @returns The instance for chaining.
         */
        update(message) {
            if (this._finalized) {
                throw new Error("The hash has already been finalized.");
            }
            let index = 0;
            let i;
            const length = message.length;
            const blocks = this._blocks;
            while (index < length) {
                if (this._hashed) {
                    this._hashed = false;
                    blocks[0] = this._block;
                    blocks[1] = 0;
                    blocks[2] = 0;
                    blocks[3] = 0;
                    blocks[4] = 0;
                    blocks[5] = 0;
                    blocks[6] = 0;
                    blocks[7] = 0;
                    blocks[8] = 0;
                    blocks[9] = 0;
                    blocks[10] = 0;
                    blocks[11] = 0;
                    blocks[12] = 0;
                    blocks[13] = 0;
                    blocks[14] = 0;
                    blocks[15] = 0;
                    blocks[16] = 0;
                }
                for (i = this._start; index < length && i < 64; ++index) {
                    blocks[i >> 2] |= message[index] << Sha256.SHIFT[i++ & 3];
                }
                this._lastByteIndex = i;
                this._bytes += i - this._start;
                if (i >= 64) {
                    this._block = blocks[16];
                    this._start = i - 64;
                    this.hash();
                    this._hashed = true;
                }
                else {
                    this._start = i;
                }
            }
            if (this._bytes > 4294967295) {
                this._hBytes += Math.trunc(this._bytes / 4294967296);
                this._bytes %= 4294967296;
            }
            return this;
        }
        /**
         * Get the digest.
         * @returns The digest.
         */
        digest() {
            this.finalize();
            const h0 = this._h0;
            const h1 = this._h1;
            const h2 = this._h2;
            const h3 = this._h3;
            const h4 = this._h4;
            const h5 = this._h5;
            const h6 = this._h6;
            const h7 = this._h7;
            const arr = [
                (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
                (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
                (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
                (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
                (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF,
                (h5 >> 24) & 0xFF, (h5 >> 16) & 0xFF, (h5 >> 8) & 0xFF, h5 & 0xFF,
                (h6 >> 24) & 0xFF, (h6 >> 16) & 0xFF, (h6 >> 8) & 0xFF, h6 & 0xFF
            ];
            if (this._bits === Sha256.SIZE_256) {
                arr.push((h7 >> 24) & 0xFF, (h7 >> 16) & 0xFF, (h7 >> 8) & 0xFF, h7 & 0xFF);
            }
            return Uint8Array.from(arr);
        }
        /**
         * Finalize the hash.
         * @internal
         */
        finalize() {
            if (this._finalized) {
                return;
            }
            this._finalized = true;
            const blocks = this._blocks;
            const i = this._lastByteIndex;
            blocks[16] = this._block;
            blocks[i >> 2] |= Sha256.EXTRA[i & 3];
            this._block = blocks[16];
            if (i >= 56) {
                if (!this._hashed) {
                    this.hash();
                }
                blocks[0] = this._block;
                blocks[1] = 0;
                blocks[2] = 0;
                blocks[3] = 0;
                blocks[4] = 0;
                blocks[5] = 0;
                blocks[6] = 0;
                blocks[7] = 0;
                blocks[8] = 0;
                blocks[9] = 0;
                blocks[10] = 0;
                blocks[11] = 0;
                blocks[12] = 0;
                blocks[13] = 0;
                blocks[14] = 0;
                blocks[15] = 0;
                blocks[16] = 0;
            }
            blocks[14] = (this._hBytes << 3) | (this._bytes >>> 29);
            blocks[15] = this._bytes << 3;
            this.hash();
        }
        /**
         * Perform the hash.
         * @internal
         */
        hash() {
            let a = this._h0;
            let b = this._h1;
            let c = this._h2;
            let d = this._h3;
            let e = this._h4;
            let f = this._h5;
            let g = this._h6;
            let h = this._h7;
            const blocks = this._blocks;
            let j;
            let s0;
            let s1;
            let maj;
            let t1;
            let t2;
            let ch;
            let ab;
            let da;
            let cd;
            let bc;
            for (j = 16; j < 64; ++j) {
                // rightrotate
                t1 = blocks[j - 15];
                s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
                t1 = blocks[j - 2];
                s1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
                blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
            }
            bc = b & c;
            for (j = 0; j < 64; j += 4) {
                if (this._first) {
                    if (this._bits === Sha256.SIZE_224) {
                        ab = 300032;
                        t1 = blocks[0] - 1413257819;
                        h = t1 - 150054599 << 0;
                        d = t1 + 24177077 << 0;
                    }
                    else {
                        ab = 704751109;
                        t1 = blocks[0] - 210244248;
                        h = t1 - 1521486534 << 0;
                        d = t1 + 143694565 << 0;
                    }
                    this._first = false;
                }
                else {
                    s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
                    s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
                    ab = a & b;
                    maj = ab ^ (a & c) ^ bc;
                    ch = (e & f) ^ (~e & g);
                    t1 = h + s1 + ch + Sha256.K[j] + blocks[j];
                    t2 = s0 + maj;
                    h = d + t1 << 0;
                    d = t1 + t2 << 0;
                }
                s0 = ((d >>> 2) | (d << 30)) ^ ((d >>> 13) | (d << 19)) ^ ((d >>> 22) | (d << 10));
                s1 = ((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7));
                da = d & a;
                maj = da ^ (d & b) ^ ab;
                ch = (h & e) ^ (~h & f);
                t1 = g + s1 + ch + Sha256.K[j + 1] + blocks[j + 1];
                t2 = s0 + maj;
                g = c + t1 << 0;
                c = t1 + t2 << 0;
                s0 = ((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10));
                s1 = ((g >>> 6) | (g << 26)) ^ ((g >>> 11) | (g << 21)) ^ ((g >>> 25) | (g << 7));
                cd = c & d;
                maj = cd ^ (c & a) ^ da;
                ch = (g & h) ^ (~g & e);
                t1 = f + s1 + ch + Sha256.K[j + 2] + blocks[j + 2];
                t2 = s0 + maj;
                f = b + t1 << 0;
                b = t1 + t2 << 0;
                s0 = ((b >>> 2) | (b << 30)) ^ ((b >>> 13) | (b << 19)) ^ ((b >>> 22) | (b << 10));
                s1 = ((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7));
                bc = b & c;
                maj = bc ^ (b & d) ^ cd;
                ch = (f & g) ^ (~f & h);
                t1 = e + s1 + ch + Sha256.K[j + 3] + blocks[j + 3];
                t2 = s0 + maj;
                e = a + t1 << 0;
                a = t1 + t2 << 0;
            }
            this._h0 += Math.trunc(a);
            this._h1 += Math.trunc(b);
            this._h2 += Math.trunc(c);
            this._h3 += Math.trunc(d);
            this._h4 += Math.trunc(e);
            this._h5 += Math.trunc(f);
            this._h6 += Math.trunc(g);
            this._h7 += Math.trunc(h);
        }
    }
    /**
     * Sha256 256.
     */
    Sha256.SIZE_256 = 256;
    /**
     * Sha256 224.
     */
    Sha256.SIZE_224 = 224;
    /**
     * Extra constants.
     * @internal
     */
    Sha256.EXTRA = [-2147483648, 8388608, 32768, 128];
    /**
     * Shift constants.
     * @internal
     */
    Sha256.SHIFT = [24, 16, 8, 0];
    /**
     * K.
     * @internal
     */
    Sha256.K = Uint32Array.from([
        0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
        0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
        0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
        0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
        0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
        0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
        0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
        0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
    ]);

    // Copyright 2020 IOTA Stiftung
    /**
     * Class to help with HmacSha256 scheme.
     * TypeScript conversion from https://github.com/emn178/js-sha256.
     */
    class HmacSha256 {
        /**
         * Create a new instance of HmacSha256.
         * @param key The key for the hmac.
         * @param bits The number of bits.
         */
        constructor(key, bits = 256) {
            this._bits = bits;
            this._sha256 = new Sha256(bits);
            if (key.length > 64) {
                key = new Sha256(bits)
                    .update(key)
                    .digest();
            }
            this._oKeyPad = new Uint8Array(64);
            const iKeyPad = new Uint8Array(64);
            for (let i = 0; i < 64; ++i) {
                const b = key[i] || 0;
                this._oKeyPad[i] = 0x5C ^ b;
                iKeyPad[i] = 0x36 ^ b;
            }
            this._sha256.update(iKeyPad);
        }
        /**
         * Perform Sum 256 on the data.
         * @param key The key for the hmac.
         * @param data The data to operate on.
         * @returns The sum 256 of the data.
         */
        static sum256(key, data) {
            const b2b = new HmacSha256(key, 256);
            b2b.update(data);
            return b2b.digest();
        }
        /**
         * Update the hash with the data.
         * @param message The data to update the hash with.
         * @returns The instance for chaining.
         */
        update(message) {
            this._sha256.update(message);
            return this;
        }
        /**
         * Get the digest.
         * @returns The digest.
         */
        digest() {
            const innerHash = this._sha256.digest();
            const finalSha256 = new Sha256(this._bits);
            finalSha256.update(this._oKeyPad);
            finalSha256.update(innerHash);
            return finalSha256.digest();
        }
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Class to help with HmacSha512 scheme.
     * TypeScript conversion from https://github.com/emn178/js-sha512.
     */
    class HmacSha512 {
        /**
         * Create a new instance of HmacSha512.
         * @param key The key for the hmac.
         * @param bits The number of bits.
         */
        constructor(key, bits = 512) {
            this._bits = bits;
            this._sha512 = new Sha512(bits);
            if (key.length > 128) {
                key = new Sha512(bits)
                    .update(key)
                    .digest();
            }
            this._oKeyPad = new Uint8Array(128);
            const iKeyPad = new Uint8Array(128);
            for (let i = 0; i < 128; ++i) {
                const b = key[i] || 0;
                this._oKeyPad[i] = 0x5C ^ b;
                iKeyPad[i] = 0x36 ^ b;
            }
            this._sha512.update(iKeyPad);
        }
        /**
         * Perform Sum 512 on the data.
         * @param key The key for the hmac.
         * @param data The data to operate on.
         * @returns The sum 512 of the data.
         */
        static sum512(key, data) {
            const b2b = new HmacSha512(key, 512);
            b2b.update(data);
            return b2b.digest();
        }
        /**
         * Update the hash with the data.
         * @param message The data to update the hash with.
         * @returns The instance for chaining.
         */
        update(message) {
            this._sha512.update(message);
            return this;
        }
        /**
         * Get the digest.
         * @returns The digest.
         */
        digest() {
            const innerHash = this._sha512.digest();
            const finalSha512 = new Sha512(this._bits);
            finalSha512.update(this._oKeyPad);
            finalSha512.update(innerHash);
            return finalSha512.digest();
        }
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Implementation of the password based key derivation function 2.
     */
    class Pbkdf2 {
        /**
         * Derive a key from the parameters using Sha256.
         * @param password The password to derive the key from.
         * @param salt The salt for the derivation.
         * @param iterations Numer of iterations to perform.
         * @param keyLength The length of the key to derive.
         * @returns The derived key.
         */
        static sha256(password, salt, iterations, keyLength) {
            return Pbkdf2.deriveKey(password, salt, iterations, keyLength, 32, (pass, block) => HmacSha256.sum256(pass, block));
        }
        /**
         * Derive a key from the parameters using Sha512.
         * @param password The password to derive the key from.
         * @param salt The salt for the derivation.
         * @param iterations Numer of iterations to perform.
         * @param keyLength The length of the key to derive.
         * @returns The derived key.
         */
        static sha512(password, salt, iterations, keyLength) {
            return Pbkdf2.deriveKey(password, salt, iterations, keyLength, 64, (pass, block) => HmacSha512.sum512(pass, block));
        }
        /**
         * Derive a key from the parameters.
         * @param password The password to derive the key from.
         * @param salt The salt for the derivation.
         * @param iterations Numer of iterations to perform.
         * @param keyLength The length of the key to derive.
         * @param macLength The length of the mac key.
         * @param sumFunc The mac function.
         * @returns The derived key.
         * @internal
         */
        static deriveKey(password, salt, iterations, keyLength, macLength, sumFunc) {
            if (iterations < 1) {
                throw new Error("Iterations must be > 0");
            }
            if (keyLength > (Math.pow(2, 32) - 1) * macLength) {
                throw new Error("Requested key length is too long");
            }
            const DK = new Uint8Array(keyLength);
            let T = new Uint8Array(macLength);
            const block1 = new Uint8Array(salt.length + 4);
            const l = Math.ceil(keyLength / macLength);
            const r = (keyLength - (l - 1)) * macLength;
            block1.set(salt, 0);
            for (let i = 1; i <= l; i++) {
                block1[salt.length + 0] = (i >> 24) & 0xFF;
                block1[salt.length + 1] = (i >> 16) & 0xFF;
                block1[salt.length + 2] = (i >> 8) & 0xFF;
                block1[salt.length + 3] = (i >> 0) & 0xFF;
                let U = sumFunc(password, block1);
                T = U.slice(0, macLength);
                for (let j = 1; j < iterations; j++) {
                    U = sumFunc(password, U);
                    for (let k = 0; k < macLength; k++) {
                        T[k] ^= U[k];
                    }
                }
                const destPos = (i - 1) * macLength;
                const len = (i === l ? r : macLength);
                for (let j = 0; j < len; j++) {
                    DK[destPos + j] = T[j];
                }
            }
            return DK;
        }
    }

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    const english = [
        "abandon",
        "ability",
        "able",
        "about",
        "above",
        "absent",
        "absorb",
        "abstract",
        "absurd",
        "abuse",
        "access",
        "accident",
        "account",
        "accuse",
        "achieve",
        "acid",
        "acoustic",
        "acquire",
        "across",
        "act",
        "action",
        "actor",
        "actress",
        "actual",
        "adapt",
        "add",
        "addict",
        "address",
        "adjust",
        "admit",
        "adult",
        "advance",
        "advice",
        "aerobic",
        "affair",
        "afford",
        "afraid",
        "again",
        "age",
        "agent",
        "agree",
        "ahead",
        "aim",
        "air",
        "airport",
        "aisle",
        "alarm",
        "album",
        "alcohol",
        "alert",
        "alien",
        "all",
        "alley",
        "allow",
        "almost",
        "alone",
        "alpha",
        "already",
        "also",
        "alter",
        "always",
        "amateur",
        "amazing",
        "among",
        "amount",
        "amused",
        "analyst",
        "anchor",
        "ancient",
        "anger",
        "angle",
        "angry",
        "animal",
        "ankle",
        "announce",
        "annual",
        "another",
        "answer",
        "antenna",
        "antique",
        "anxiety",
        "any",
        "apart",
        "apology",
        "appear",
        "apple",
        "approve",
        "april",
        "arch",
        "arctic",
        "area",
        "arena",
        "argue",
        "arm",
        "armed",
        "armor",
        "army",
        "around",
        "arrange",
        "arrest",
        "arrive",
        "arrow",
        "art",
        "artefact",
        "artist",
        "artwork",
        "ask",
        "aspect",
        "assault",
        "asset",
        "assist",
        "assume",
        "asthma",
        "athlete",
        "atom",
        "attack",
        "attend",
        "attitude",
        "attract",
        "auction",
        "audit",
        "august",
        "aunt",
        "author",
        "auto",
        "autumn",
        "average",
        "avocado",
        "avoid",
        "awake",
        "aware",
        "away",
        "awesome",
        "awful",
        "awkward",
        "axis",
        "baby",
        "bachelor",
        "bacon",
        "badge",
        "bag",
        "balance",
        "balcony",
        "ball",
        "bamboo",
        "banana",
        "banner",
        "bar",
        "barely",
        "bargain",
        "barrel",
        "base",
        "basic",
        "basket",
        "battle",
        "beach",
        "bean",
        "beauty",
        "because",
        "become",
        "beef",
        "before",
        "begin",
        "behave",
        "behind",
        "believe",
        "below",
        "belt",
        "bench",
        "benefit",
        "best",
        "betray",
        "better",
        "between",
        "beyond",
        "bicycle",
        "bid",
        "bike",
        "bind",
        "biology",
        "bird",
        "birth",
        "bitter",
        "black",
        "blade",
        "blame",
        "blanket",
        "blast",
        "bleak",
        "bless",
        "blind",
        "blood",
        "blossom",
        "blouse",
        "blue",
        "blur",
        "blush",
        "board",
        "boat",
        "body",
        "boil",
        "bomb",
        "bone",
        "bonus",
        "book",
        "boost",
        "border",
        "boring",
        "borrow",
        "boss",
        "bottom",
        "bounce",
        "box",
        "boy",
        "bracket",
        "brain",
        "brand",
        "brass",
        "brave",
        "bread",
        "breeze",
        "brick",
        "bridge",
        "brief",
        "bright",
        "bring",
        "brisk",
        "broccoli",
        "broken",
        "bronze",
        "broom",
        "brother",
        "brown",
        "brush",
        "bubble",
        "buddy",
        "budget",
        "buffalo",
        "build",
        "bulb",
        "bulk",
        "bullet",
        "bundle",
        "bunker",
        "burden",
        "burger",
        "burst",
        "bus",
        "business",
        "busy",
        "butter",
        "buyer",
        "buzz",
        "cabbage",
        "cabin",
        "cable",
        "cactus",
        "cage",
        "cake",
        "call",
        "calm",
        "camera",
        "camp",
        "can",
        "canal",
        "cancel",
        "candy",
        "cannon",
        "canoe",
        "canvas",
        "canyon",
        "capable",
        "capital",
        "captain",
        "car",
        "carbon",
        "card",
        "cargo",
        "carpet",
        "carry",
        "cart",
        "case",
        "cash",
        "casino",
        "castle",
        "casual",
        "cat",
        "catalog",
        "catch",
        "category",
        "cattle",
        "caught",
        "cause",
        "caution",
        "cave",
        "ceiling",
        "celery",
        "cement",
        "census",
        "century",
        "cereal",
        "certain",
        "chair",
        "chalk",
        "champion",
        "change",
        "chaos",
        "chapter",
        "charge",
        "chase",
        "chat",
        "cheap",
        "check",
        "cheese",
        "chef",
        "cherry",
        "chest",
        "chicken",
        "chief",
        "child",
        "chimney",
        "choice",
        "choose",
        "chronic",
        "chuckle",
        "chunk",
        "churn",
        "cigar",
        "cinnamon",
        "circle",
        "citizen",
        "city",
        "civil",
        "claim",
        "clap",
        "clarify",
        "claw",
        "clay",
        "clean",
        "clerk",
        "clever",
        "click",
        "client",
        "cliff",
        "climb",
        "clinic",
        "clip",
        "clock",
        "clog",
        "close",
        "cloth",
        "cloud",
        "clown",
        "club",
        "clump",
        "cluster",
        "clutch",
        "coach",
        "coast",
        "coconut",
        "code",
        "coffee",
        "coil",
        "coin",
        "collect",
        "color",
        "column",
        "combine",
        "come",
        "comfort",
        "comic",
        "common",
        "company",
        "concert",
        "conduct",
        "confirm",
        "congress",
        "connect",
        "consider",
        "control",
        "convince",
        "cook",
        "cool",
        "copper",
        "copy",
        "coral",
        "core",
        "corn",
        "correct",
        "cost",
        "cotton",
        "couch",
        "country",
        "couple",
        "course",
        "cousin",
        "cover",
        "coyote",
        "crack",
        "cradle",
        "craft",
        "cram",
        "crane",
        "crash",
        "crater",
        "crawl",
        "crazy",
        "cream",
        "credit",
        "creek",
        "crew",
        "cricket",
        "crime",
        "crisp",
        "critic",
        "crop",
        "cross",
        "crouch",
        "crowd",
        "crucial",
        "cruel",
        "cruise",
        "crumble",
        "crunch",
        "crush",
        "cry",
        "crystal",
        "cube",
        "culture",
        "cup",
        "cupboard",
        "curious",
        "current",
        "curtain",
        "curve",
        "cushion",
        "custom",
        "cute",
        "cycle",
        "dad",
        "damage",
        "damp",
        "dance",
        "danger",
        "daring",
        "dash",
        "daughter",
        "dawn",
        "day",
        "deal",
        "debate",
        "debris",
        "decade",
        "december",
        "decide",
        "decline",
        "decorate",
        "decrease",
        "deer",
        "defense",
        "define",
        "defy",
        "degree",
        "delay",
        "deliver",
        "demand",
        "demise",
        "denial",
        "dentist",
        "deny",
        "depart",
        "depend",
        "deposit",
        "depth",
        "deputy",
        "derive",
        "describe",
        "desert",
        "design",
        "desk",
        "despair",
        "destroy",
        "detail",
        "detect",
        "develop",
        "device",
        "devote",
        "diagram",
        "dial",
        "diamond",
        "diary",
        "dice",
        "diesel",
        "diet",
        "differ",
        "digital",
        "dignity",
        "dilemma",
        "dinner",
        "dinosaur",
        "direct",
        "dirt",
        "disagree",
        "discover",
        "disease",
        "dish",
        "dismiss",
        "disorder",
        "display",
        "distance",
        "divert",
        "divide",
        "divorce",
        "dizzy",
        "doctor",
        "document",
        "dog",
        "doll",
        "dolphin",
        "domain",
        "donate",
        "donkey",
        "donor",
        "door",
        "dose",
        "double",
        "dove",
        "draft",
        "dragon",
        "drama",
        "drastic",
        "draw",
        "dream",
        "dress",
        "drift",
        "drill",
        "drink",
        "drip",
        "drive",
        "drop",
        "drum",
        "dry",
        "duck",
        "dumb",
        "dune",
        "during",
        "dust",
        "dutch",
        "duty",
        "dwarf",
        "dynamic",
        "eager",
        "eagle",
        "early",
        "earn",
        "earth",
        "easily",
        "east",
        "easy",
        "echo",
        "ecology",
        "economy",
        "edge",
        "edit",
        "educate",
        "effort",
        "egg",
        "eight",
        "either",
        "elbow",
        "elder",
        "electric",
        "elegant",
        "element",
        "elephant",
        "elevator",
        "elite",
        "else",
        "embark",
        "embody",
        "embrace",
        "emerge",
        "emotion",
        "employ",
        "empower",
        "empty",
        "enable",
        "enact",
        "end",
        "endless",
        "endorse",
        "enemy",
        "energy",
        "enforce",
        "engage",
        "engine",
        "enhance",
        "enjoy",
        "enlist",
        "enough",
        "enrich",
        "enroll",
        "ensure",
        "enter",
        "entire",
        "entry",
        "envelope",
        "episode",
        "equal",
        "equip",
        "era",
        "erase",
        "erode",
        "erosion",
        "error",
        "erupt",
        "escape",
        "essay",
        "essence",
        "estate",
        "eternal",
        "ethics",
        "evidence",
        "evil",
        "evoke",
        "evolve",
        "exact",
        "example",
        "excess",
        "exchange",
        "excite",
        "exclude",
        "excuse",
        "execute",
        "exercise",
        "exhaust",
        "exhibit",
        "exile",
        "exist",
        "exit",
        "exotic",
        "expand",
        "expect",
        "expire",
        "explain",
        "expose",
        "express",
        "extend",
        "extra",
        "eye",
        "eyebrow",
        "fabric",
        "face",
        "faculty",
        "fade",
        "faint",
        "faith",
        "fall",
        "false",
        "fame",
        "family",
        "famous",
        "fan",
        "fancy",
        "fantasy",
        "farm",
        "fashion",
        "fat",
        "fatal",
        "father",
        "fatigue",
        "fault",
        "favorite",
        "feature",
        "february",
        "federal",
        "fee",
        "feed",
        "feel",
        "female",
        "fence",
        "festival",
        "fetch",
        "fever",
        "few",
        "fiber",
        "fiction",
        "field",
        "figure",
        "file",
        "film",
        "filter",
        "final",
        "find",
        "fine",
        "finger",
        "finish",
        "fire",
        "firm",
        "first",
        "fiscal",
        "fish",
        "fit",
        "fitness",
        "fix",
        "flag",
        "flame",
        "flash",
        "flat",
        "flavor",
        "flee",
        "flight",
        "flip",
        "float",
        "flock",
        "floor",
        "flower",
        "fluid",
        "flush",
        "fly",
        "foam",
        "focus",
        "fog",
        "foil",
        "fold",
        "follow",
        "food",
        "foot",
        "force",
        "forest",
        "forget",
        "fork",
        "fortune",
        "forum",
        "forward",
        "fossil",
        "foster",
        "found",
        "fox",
        "fragile",
        "frame",
        "frequent",
        "fresh",
        "friend",
        "fringe",
        "frog",
        "front",
        "frost",
        "frown",
        "frozen",
        "fruit",
        "fuel",
        "fun",
        "funny",
        "furnace",
        "fury",
        "future",
        "gadget",
        "gain",
        "galaxy",
        "gallery",
        "game",
        "gap",
        "garage",
        "garbage",
        "garden",
        "garlic",
        "garment",
        "gas",
        "gasp",
        "gate",
        "gather",
        "gauge",
        "gaze",
        "general",
        "genius",
        "genre",
        "gentle",
        "genuine",
        "gesture",
        "ghost",
        "giant",
        "gift",
        "giggle",
        "ginger",
        "giraffe",
        "girl",
        "give",
        "glad",
        "glance",
        "glare",
        "glass",
        "glide",
        "glimpse",
        "globe",
        "gloom",
        "glory",
        "glove",
        "glow",
        "glue",
        "goat",
        "goddess",
        "gold",
        "good",
        "goose",
        "gorilla",
        "gospel",
        "gossip",
        "govern",
        "gown",
        "grab",
        "grace",
        "grain",
        "grant",
        "grape",
        "grass",
        "gravity",
        "great",
        "green",
        "grid",
        "grief",
        "grit",
        "grocery",
        "group",
        "grow",
        "grunt",
        "guard",
        "guess",
        "guide",
        "guilt",
        "guitar",
        "gun",
        "gym",
        "habit",
        "hair",
        "half",
        "hammer",
        "hamster",
        "hand",
        "happy",
        "harbor",
        "hard",
        "harsh",
        "harvest",
        "hat",
        "have",
        "hawk",
        "hazard",
        "head",
        "health",
        "heart",
        "heavy",
        "hedgehog",
        "height",
        "hello",
        "helmet",
        "help",
        "hen",
        "hero",
        "hidden",
        "high",
        "hill",
        "hint",
        "hip",
        "hire",
        "history",
        "hobby",
        "hockey",
        "hold",
        "hole",
        "holiday",
        "hollow",
        "home",
        "honey",
        "hood",
        "hope",
        "horn",
        "horror",
        "horse",
        "hospital",
        "host",
        "hotel",
        "hour",
        "hover",
        "hub",
        "huge",
        "human",
        "humble",
        "humor",
        "hundred",
        "hungry",
        "hunt",
        "hurdle",
        "hurry",
        "hurt",
        "husband",
        "hybrid",
        "ice",
        "icon",
        "idea",
        "identify",
        "idle",
        "ignore",
        "ill",
        "illegal",
        "illness",
        "image",
        "imitate",
        "immense",
        "immune",
        "impact",
        "impose",
        "improve",
        "impulse",
        "inch",
        "include",
        "income",
        "increase",
        "index",
        "indicate",
        "indoor",
        "industry",
        "infant",
        "inflict",
        "inform",
        "inhale",
        "inherit",
        "initial",
        "inject",
        "injury",
        "inmate",
        "inner",
        "innocent",
        "input",
        "inquiry",
        "insane",
        "insect",
        "inside",
        "inspire",
        "install",
        "intact",
        "interest",
        "into",
        "invest",
        "invite",
        "involve",
        "iron",
        "island",
        "isolate",
        "issue",
        "item",
        "ivory",
        "jacket",
        "jaguar",
        "jar",
        "jazz",
        "jealous",
        "jeans",
        "jelly",
        "jewel",
        "job",
        "join",
        "joke",
        "journey",
        "joy",
        "judge",
        "juice",
        "jump",
        "jungle",
        "junior",
        "junk",
        "just",
        "kangaroo",
        "keen",
        "keep",
        "ketchup",
        "key",
        "kick",
        "kid",
        "kidney",
        "kind",
        "kingdom",
        "kiss",
        "kit",
        "kitchen",
        "kite",
        "kitten",
        "kiwi",
        "knee",
        "knife",
        "knock",
        "know",
        "lab",
        "label",
        "labor",
        "ladder",
        "lady",
        "lake",
        "lamp",
        "language",
        "laptop",
        "large",
        "later",
        "latin",
        "laugh",
        "laundry",
        "lava",
        "law",
        "lawn",
        "lawsuit",
        "layer",
        "lazy",
        "leader",
        "leaf",
        "learn",
        "leave",
        "lecture",
        "left",
        "leg",
        "legal",
        "legend",
        "leisure",
        "lemon",
        "lend",
        "length",
        "lens",
        "leopard",
        "lesson",
        "letter",
        "level",
        "liar",
        "liberty",
        "library",
        "license",
        "life",
        "lift",
        "light",
        "like",
        "limb",
        "limit",
        "link",
        "lion",
        "liquid",
        "list",
        "little",
        "live",
        "lizard",
        "load",
        "loan",
        "lobster",
        "local",
        "lock",
        "logic",
        "lonely",
        "long",
        "loop",
        "lottery",
        "loud",
        "lounge",
        "love",
        "loyal",
        "lucky",
        "luggage",
        "lumber",
        "lunar",
        "lunch",
        "luxury",
        "lyrics",
        "machine",
        "mad",
        "magic",
        "magnet",
        "maid",
        "mail",
        "main",
        "major",
        "make",
        "mammal",
        "man",
        "manage",
        "mandate",
        "mango",
        "mansion",
        "manual",
        "maple",
        "marble",
        "march",
        "margin",
        "marine",
        "market",
        "marriage",
        "mask",
        "mass",
        "master",
        "match",
        "material",
        "math",
        "matrix",
        "matter",
        "maximum",
        "maze",
        "meadow",
        "mean",
        "measure",
        "meat",
        "mechanic",
        "medal",
        "media",
        "melody",
        "melt",
        "member",
        "memory",
        "mention",
        "menu",
        "mercy",
        "merge",
        "merit",
        "merry",
        "mesh",
        "message",
        "metal",
        "method",
        "middle",
        "midnight",
        "milk",
        "million",
        "mimic",
        "mind",
        "minimum",
        "minor",
        "minute",
        "miracle",
        "mirror",
        "misery",
        "miss",
        "mistake",
        "mix",
        "mixed",
        "mixture",
        "mobile",
        "model",
        "modify",
        "mom",
        "moment",
        "monitor",
        "monkey",
        "monster",
        "month",
        "moon",
        "moral",
        "more",
        "morning",
        "mosquito",
        "mother",
        "motion",
        "motor",
        "mountain",
        "mouse",
        "move",
        "movie",
        "much",
        "muffin",
        "mule",
        "multiply",
        "muscle",
        "museum",
        "mushroom",
        "music",
        "must",
        "mutual",
        "myself",
        "mystery",
        "myth",
        "naive",
        "name",
        "napkin",
        "narrow",
        "nasty",
        "nation",
        "nature",
        "near",
        "neck",
        "need",
        "negative",
        "neglect",
        "neither",
        "nephew",
        "nerve",
        "nest",
        "net",
        "network",
        "neutral",
        "never",
        "news",
        "next",
        "nice",
        "night",
        "noble",
        "noise",
        "nominee",
        "noodle",
        "normal",
        "north",
        "nose",
        "notable",
        "note",
        "nothing",
        "notice",
        "novel",
        "now",
        "nuclear",
        "number",
        "nurse",
        "nut",
        "oak",
        "obey",
        "object",
        "oblige",
        "obscure",
        "observe",
        "obtain",
        "obvious",
        "occur",
        "ocean",
        "october",
        "odor",
        "off",
        "offer",
        "office",
        "often",
        "oil",
        "okay",
        "old",
        "olive",
        "olympic",
        "omit",
        "once",
        "one",
        "onion",
        "online",
        "only",
        "open",
        "opera",
        "opinion",
        "oppose",
        "option",
        "orange",
        "orbit",
        "orchard",
        "order",
        "ordinary",
        "organ",
        "orient",
        "original",
        "orphan",
        "ostrich",
        "other",
        "outdoor",
        "outer",
        "output",
        "outside",
        "oval",
        "oven",
        "over",
        "own",
        "owner",
        "oxygen",
        "oyster",
        "ozone",
        "pact",
        "paddle",
        "page",
        "pair",
        "palace",
        "palm",
        "panda",
        "panel",
        "panic",
        "panther",
        "paper",
        "parade",
        "parent",
        "park",
        "parrot",
        "party",
        "pass",
        "patch",
        "path",
        "patient",
        "patrol",
        "pattern",
        "pause",
        "pave",
        "payment",
        "peace",
        "peanut",
        "pear",
        "peasant",
        "pelican",
        "pen",
        "penalty",
        "pencil",
        "people",
        "pepper",
        "perfect",
        "permit",
        "person",
        "pet",
        "phone",
        "photo",
        "phrase",
        "physical",
        "piano",
        "picnic",
        "picture",
        "piece",
        "pig",
        "pigeon",
        "pill",
        "pilot",
        "pink",
        "pioneer",
        "pipe",
        "pistol",
        "pitch",
        "pizza",
        "place",
        "planet",
        "plastic",
        "plate",
        "play",
        "please",
        "pledge",
        "pluck",
        "plug",
        "plunge",
        "poem",
        "poet",
        "point",
        "polar",
        "pole",
        "police",
        "pond",
        "pony",
        "pool",
        "popular",
        "portion",
        "position",
        "possible",
        "post",
        "potato",
        "pottery",
        "poverty",
        "powder",
        "power",
        "practice",
        "praise",
        "predict",
        "prefer",
        "prepare",
        "present",
        "pretty",
        "prevent",
        "price",
        "pride",
        "primary",
        "print",
        "priority",
        "prison",
        "private",
        "prize",
        "problem",
        "process",
        "produce",
        "profit",
        "program",
        "project",
        "promote",
        "proof",
        "property",
        "prosper",
        "protect",
        "proud",
        "provide",
        "public",
        "pudding",
        "pull",
        "pulp",
        "pulse",
        "pumpkin",
        "punch",
        "pupil",
        "puppy",
        "purchase",
        "purity",
        "purpose",
        "purse",
        "push",
        "put",
        "puzzle",
        "pyramid",
        "quality",
        "quantum",
        "quarter",
        "question",
        "quick",
        "quit",
        "quiz",
        "quote",
        "rabbit",
        "raccoon",
        "race",
        "rack",
        "radar",
        "radio",
        "rail",
        "rain",
        "raise",
        "rally",
        "ramp",
        "ranch",
        "random",
        "range",
        "rapid",
        "rare",
        "rate",
        "rather",
        "raven",
        "raw",
        "razor",
        "ready",
        "real",
        "reason",
        "rebel",
        "rebuild",
        "recall",
        "receive",
        "recipe",
        "record",
        "recycle",
        "reduce",
        "reflect",
        "reform",
        "refuse",
        "region",
        "regret",
        "regular",
        "reject",
        "relax",
        "release",
        "relief",
        "rely",
        "remain",
        "remember",
        "remind",
        "remove",
        "render",
        "renew",
        "rent",
        "reopen",
        "repair",
        "repeat",
        "replace",
        "report",
        "require",
        "rescue",
        "resemble",
        "resist",
        "resource",
        "response",
        "result",
        "retire",
        "retreat",
        "return",
        "reunion",
        "reveal",
        "review",
        "reward",
        "rhythm",
        "rib",
        "ribbon",
        "rice",
        "rich",
        "ride",
        "ridge",
        "rifle",
        "right",
        "rigid",
        "ring",
        "riot",
        "ripple",
        "risk",
        "ritual",
        "rival",
        "river",
        "road",
        "roast",
        "robot",
        "robust",
        "rocket",
        "romance",
        "roof",
        "rookie",
        "room",
        "rose",
        "rotate",
        "rough",
        "round",
        "route",
        "royal",
        "rubber",
        "rude",
        "rug",
        "rule",
        "run",
        "runway",
        "rural",
        "sad",
        "saddle",
        "sadness",
        "safe",
        "sail",
        "salad",
        "salmon",
        "salon",
        "salt",
        "salute",
        "same",
        "sample",
        "sand",
        "satisfy",
        "satoshi",
        "sauce",
        "sausage",
        "save",
        "say",
        "scale",
        "scan",
        "scare",
        "scatter",
        "scene",
        "scheme",
        "school",
        "science",
        "scissors",
        "scorpion",
        "scout",
        "scrap",
        "screen",
        "script",
        "scrub",
        "sea",
        "search",
        "season",
        "seat",
        "second",
        "secret",
        "section",
        "security",
        "seed",
        "seek",
        "segment",
        "select",
        "sell",
        "seminar",
        "senior",
        "sense",
        "sentence",
        "series",
        "service",
        "session",
        "settle",
        "setup",
        "seven",
        "shadow",
        "shaft",
        "shallow",
        "share",
        "shed",
        "shell",
        "sheriff",
        "shield",
        "shift",
        "shine",
        "ship",
        "shiver",
        "shock",
        "shoe",
        "shoot",
        "shop",
        "short",
        "shoulder",
        "shove",
        "shrimp",
        "shrug",
        "shuffle",
        "shy",
        "sibling",
        "sick",
        "side",
        "siege",
        "sight",
        "sign",
        "silent",
        "silk",
        "silly",
        "silver",
        "similar",
        "simple",
        "since",
        "sing",
        "siren",
        "sister",
        "situate",
        "six",
        "size",
        "skate",
        "sketch",
        "ski",
        "skill",
        "skin",
        "skirt",
        "skull",
        "slab",
        "slam",
        "sleep",
        "slender",
        "slice",
        "slide",
        "slight",
        "slim",
        "slogan",
        "slot",
        "slow",
        "slush",
        "small",
        "smart",
        "smile",
        "smoke",
        "smooth",
        "snack",
        "snake",
        "snap",
        "sniff",
        "snow",
        "soap",
        "soccer",
        "social",
        "sock",
        "soda",
        "soft",
        "solar",
        "soldier",
        "solid",
        "solution",
        "solve",
        "someone",
        "song",
        "soon",
        "sorry",
        "sort",
        "soul",
        "sound",
        "soup",
        "source",
        "south",
        "space",
        "spare",
        "spatial",
        "spawn",
        "speak",
        "special",
        "speed",
        "spell",
        "spend",
        "sphere",
        "spice",
        "spider",
        "spike",
        "spin",
        "spirit",
        "split",
        "spoil",
        "sponsor",
        "spoon",
        "sport",
        "spot",
        "spray",
        "spread",
        "spring",
        "spy",
        "square",
        "squeeze",
        "squirrel",
        "stable",
        "stadium",
        "staff",
        "stage",
        "stairs",
        "stamp",
        "stand",
        "start",
        "state",
        "stay",
        "steak",
        "steel",
        "stem",
        "step",
        "stereo",
        "stick",
        "still",
        "sting",
        "stock",
        "stomach",
        "stone",
        "stool",
        "story",
        "stove",
        "strategy",
        "street",
        "strike",
        "strong",
        "struggle",
        "student",
        "stuff",
        "stumble",
        "style",
        "subject",
        "submit",
        "subway",
        "success",
        "such",
        "sudden",
        "suffer",
        "sugar",
        "suggest",
        "suit",
        "summer",
        "sun",
        "sunny",
        "sunset",
        "super",
        "supply",
        "supreme",
        "sure",
        "surface",
        "surge",
        "surprise",
        "surround",
        "survey",
        "suspect",
        "sustain",
        "swallow",
        "swamp",
        "swap",
        "swarm",
        "swear",
        "sweet",
        "swift",
        "swim",
        "swing",
        "switch",
        "sword",
        "symbol",
        "symptom",
        "syrup",
        "system",
        "table",
        "tackle",
        "tag",
        "tail",
        "talent",
        "talk",
        "tank",
        "tape",
        "target",
        "task",
        "taste",
        "tattoo",
        "taxi",
        "teach",
        "team",
        "tell",
        "ten",
        "tenant",
        "tennis",
        "tent",
        "term",
        "test",
        "text",
        "thank",
        "that",
        "theme",
        "then",
        "theory",
        "there",
        "they",
        "thing",
        "this",
        "thought",
        "three",
        "thrive",
        "throw",
        "thumb",
        "thunder",
        "ticket",
        "tide",
        "tiger",
        "tilt",
        "timber",
        "time",
        "tiny",
        "tip",
        "tired",
        "tissue",
        "title",
        "toast",
        "tobacco",
        "today",
        "toddler",
        "toe",
        "together",
        "toilet",
        "token",
        "tomato",
        "tomorrow",
        "tone",
        "tongue",
        "tonight",
        "tool",
        "tooth",
        "top",
        "topic",
        "topple",
        "torch",
        "tornado",
        "tortoise",
        "toss",
        "total",
        "tourist",
        "toward",
        "tower",
        "town",
        "toy",
        "track",
        "trade",
        "traffic",
        "tragic",
        "train",
        "transfer",
        "trap",
        "trash",
        "travel",
        "tray",
        "treat",
        "tree",
        "trend",
        "trial",
        "tribe",
        "trick",
        "trigger",
        "trim",
        "trip",
        "trophy",
        "trouble",
        "truck",
        "true",
        "truly",
        "trumpet",
        "trust",
        "truth",
        "try",
        "tube",
        "tuition",
        "tumble",
        "tuna",
        "tunnel",
        "turkey",
        "turn",
        "turtle",
        "twelve",
        "twenty",
        "twice",
        "twin",
        "twist",
        "two",
        "type",
        "typical",
        "ugly",
        "umbrella",
        "unable",
        "unaware",
        "uncle",
        "uncover",
        "under",
        "undo",
        "unfair",
        "unfold",
        "unhappy",
        "uniform",
        "unique",
        "unit",
        "universe",
        "unknown",
        "unlock",
        "until",
        "unusual",
        "unveil",
        "update",
        "upgrade",
        "uphold",
        "upon",
        "upper",
        "upset",
        "urban",
        "urge",
        "usage",
        "use",
        "used",
        "useful",
        "useless",
        "usual",
        "utility",
        "vacant",
        "vacuum",
        "vague",
        "valid",
        "valley",
        "valve",
        "van",
        "vanish",
        "vapor",
        "various",
        "vast",
        "vault",
        "vehicle",
        "velvet",
        "vendor",
        "venture",
        "venue",
        "verb",
        "verify",
        "version",
        "very",
        "vessel",
        "veteran",
        "viable",
        "vibrant",
        "vicious",
        "victory",
        "video",
        "view",
        "village",
        "vintage",
        "violin",
        "virtual",
        "virus",
        "visa",
        "visit",
        "visual",
        "vital",
        "vivid",
        "vocal",
        "voice",
        "void",
        "volcano",
        "volume",
        "vote",
        "voyage",
        "wage",
        "wagon",
        "wait",
        "walk",
        "wall",
        "walnut",
        "want",
        "warfare",
        "warm",
        "warrior",
        "wash",
        "wasp",
        "waste",
        "water",
        "wave",
        "way",
        "wealth",
        "weapon",
        "wear",
        "weasel",
        "weather",
        "web",
        "wedding",
        "weekend",
        "weird",
        "welcome",
        "west",
        "wet",
        "whale",
        "what",
        "wheat",
        "wheel",
        "when",
        "where",
        "whip",
        "whisper",
        "wide",
        "width",
        "wife",
        "wild",
        "will",
        "win",
        "window",
        "wine",
        "wing",
        "wink",
        "winner",
        "winter",
        "wire",
        "wisdom",
        "wise",
        "wish",
        "witness",
        "wolf",
        "woman",
        "wonder",
        "wood",
        "wool",
        "word",
        "work",
        "world",
        "worry",
        "worth",
        "wrap",
        "wreck",
        "wrestle",
        "wrist",
        "write",
        "wrong",
        "yard",
        "year",
        "yellow",
        "you",
        "young",
        "youth",
        "zebra",
        "zero",
        "zone",
        "zoo"
    ];

    // Copyright 2020 IOTA Stiftung
    /**
     * Implementation of Bip39 for mnemonic generation.
     */
    class Bip39 {
        /**
         * Set the wordlist and joining character.
         * @param wordlistData Array of words.
         * @param joiningChar The character to join the words with.
         */
        static setWordList(wordlistData, joiningChar = " ") {
            Bip39._wordlist = wordlistData;
            Bip39._joiningChar = joiningChar;
        }
        /**
         * Generate a random mnemonic.
         * @param length The length of the mnemonic to generate, defaults to 256.
         * @returns The random mnemonic.
         */
        static randomMnemonic(length = 256) {
            if (length % 32 !== 0) {
                throw new Error("The length must be a multiple of 32");
            }
            const randomBytes = RandomHelper.generate(length / 8);
            return Bip39.entropyToMnemonic(randomBytes);
        }
        /**
         * Generate a mnemonic from the entropy.
         * @param entropy The entropy to generate.
         * @returns The mnemonic.
         */
        static entropyToMnemonic(entropy) {
            if (!Bip39._wordlist) {
                Bip39.setWordList(english, " ");
            }
            if (entropy.length % 4 !== 0 || entropy.length < 16 || entropy.length > 32) {
                throw new Error(`The length of the entropy is invalid, it should be a multiple of 4, >= 16 and <= 32, it is ${entropy.length}`);
            }
            const bin = `${Converter.bytesToBinary(entropy)}${Bip39.entropyChecksumBits(entropy)}`;
            const mnemonic = [];
            for (let i = 0; i < bin.length / 11; i++) {
                const wordIndexBits = bin.slice(i * 11, (i + 1) * 11);
                const wordIndex = Number.parseInt(wordIndexBits, 2);
                mnemonic.push(Bip39._wordlist[wordIndex]);
            }
            return mnemonic.join(Bip39._joiningChar);
        }
        /**
         * Convert a mnemonic to a seed.
         * @param mnemonic The mnemonic to convert.
         * @param password The password to apply to the seed generation.
         * @param iterations The number of iterations to perform on the password function, defaults to 2048.
         * @param keyLength The size of the key length to generate, defaults to 64.
         * @returns The seed.
         */
        static mnemonicToSeed(mnemonic, password, iterations = 2048, keyLength = 64) {
            const mnemonicBytes = Converter.utf8ToBytes(mnemonic.normalize("NFKD"));
            const salt = Converter.utf8ToBytes(`mnemonic${(password !== null && password !== void 0 ? password : "").normalize("NFKD")}`);
            return Pbkdf2.sha512(mnemonicBytes, salt, iterations, keyLength);
        }
        /**
         * Convert the mnemonic back to entropy.
         * @param mnemonic The mnemonic to convert.
         * @returns The entropy.
         */
        static mnemonicToEntropy(mnemonic) {
            if (!Bip39._wordlist) {
                Bip39.setWordList(english, " ");
            }
            const words = mnemonic.normalize("NFKD").split(Bip39._joiningChar);
            if (words.length % 3 !== 0) {
                throw new Error(`Invalid mnemonic the number of words should be a multiple of 3, it is ${words.length}`);
            }
            const bits = words
                .map(word => {
                const index = Bip39._wordlist.indexOf(word);
                if (index === -1) {
                    throw new Error(`The mnemonic contains a word not in the wordlist ${word}`);
                }
                return index.toString(2).padStart(11, "0");
            })
                .join("");
            const dividerIndex = Math.floor(bits.length / 33) * 32;
            const entropyBits = bits.slice(0, dividerIndex);
            const checksumBits = bits.slice(dividerIndex);
            const entropy = Converter.binaryToBytes(entropyBits);
            if (entropy.length % 4 !== 0 || entropy.length < 16 || entropy.length > 32) {
                throw new Error("The length of the entropy is invalid");
            }
            const newChecksum = Bip39.entropyChecksumBits(entropy);
            if (newChecksum !== checksumBits) {
                throw new Error(`The checksum does not match ${newChecksum} != ${checksumBits}.`);
            }
            return entropy;
        }
        /**
         * Calculate the entropy checksum.
         * @param entropy The entropy to calculate the checksum for.
         * @returns The checksum.
         */
        static entropyChecksumBits(entropy) {
            const hash = Sha256.sum256(entropy);
            const bits = entropy.length * 8;
            const hashbits = Converter.bytesToBinary(hash);
            return hashbits.slice(0, bits / 32);
        }
    }
    /**
     * The character to join the mnemonics with.
     * @internal
     */
    Bip39._joiningChar = " "; // \u3000 for japanese

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /* eslint-disable no-bitwise */
    /**
     * Bit manipulation methods.
     * @internal
     */
    class BitHelper {
        /**
         * Combine unsigned bytes to unsigned 32-bit.
         * @param bytes The byte array.
         * @param startIndex The start index to convert.
         * @returns The 32 bit number.
         * @internal
         */
        static u8To32LittleEndian(bytes, startIndex) {
            return bytes[startIndex] |
                (bytes[startIndex + 1] << 8) |
                (bytes[startIndex + 2] << 16) |
                (bytes[startIndex + 3] << 24);
        }
        /**
         * Write a 32 bit unsigned into a byte array.
         * @param bytes The array to write in to.
         * @param startIndex The index to start writing at.
         * @param value The 32 bit value.
         * @internal
         */
        static u32To8LittleEndian(bytes, startIndex, value) {
            bytes[startIndex] = value;
            value >>>= 8;
            bytes[startIndex + 1] = value;
            value >>>= 8;
            bytes[startIndex + 2] = value;
            value >>>= 8;
            bytes[startIndex + 3] = value;
        }
        /**
         * Rotate the 32 bit number.
         * @param value The value to rotate,
         * @param bits The number of bits to rotate by.
         * @returns The rotated number.
         * @internal
         */
        static rotate(value, bits) {
            return (value << bits) | (value >>> (32 - bits));
        }
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Implementation of the ChaCha29 cipher.
     */
    class ChaCha20 {
        /**
         * Create a new instance of ChaCha20.
         * @param key The key.
         * @param nonce The nonce.
         * @param counter Counter.
         */
        constructor(key, nonce, counter = 0) {
            this._input = new Uint32Array(16);
            // https://www.ietf.org/rfc/rfc8439.html#section-2.3
            this._input[0] = 1634760805;
            this._input[1] = 857760878;
            this._input[2] = 2036477234;
            this._input[3] = 1797285236;
            this._input[4] = BitHelper.u8To32LittleEndian(key, 0);
            this._input[5] = BitHelper.u8To32LittleEndian(key, 4);
            this._input[6] = BitHelper.u8To32LittleEndian(key, 8);
            this._input[7] = BitHelper.u8To32LittleEndian(key, 12);
            this._input[8] = BitHelper.u8To32LittleEndian(key, 16);
            this._input[9] = BitHelper.u8To32LittleEndian(key, 20);
            this._input[10] = BitHelper.u8To32LittleEndian(key, 24);
            this._input[11] = BitHelper.u8To32LittleEndian(key, 28);
            this._input[12] = counter;
            this._input[13] = BitHelper.u8To32LittleEndian(nonce, 0);
            this._input[14] = BitHelper.u8To32LittleEndian(nonce, 4);
            this._input[15] = BitHelper.u8To32LittleEndian(nonce, 8);
        }
        /**
         * Quarter round.
         * @param x The 32 bit array.
         * @param a The a index.
         * @param b The b index.
         * @param c The c index.
         * @param d The d index.
         * @internal
         */
        static quarterRound(x, a, b, c, d) {
            x[a] += x[b];
            x[d] = BitHelper.rotate(x[d] ^ x[a], 16);
            x[c] += x[d];
            x[b] = BitHelper.rotate(x[b] ^ x[c], 12);
            x[a] += x[b];
            x[d] = BitHelper.rotate(x[d] ^ x[a], 8);
            x[c] += x[d];
            x[b] = BitHelper.rotate(x[b] ^ x[c], 7);
        }
        /**
         * Encrypt the data.
         * @param data The source data to encrypt.
         * @returns The encrypted data.
         */
        encrypt(data) {
            const x = new Uint32Array(16);
            const output = new Uint8Array(64);
            let dpos = 0;
            let i;
            let spos = 0;
            let len = data.length;
            const dst = new Uint8Array(data.length);
            while (len > 0) {
                for (i = 16; i--;) {
                    x[i] = this._input[i];
                }
                for (i = 20; i > 0; i -= 2) {
                    ChaCha20.quarterRound(x, 0, 4, 8, 12);
                    ChaCha20.quarterRound(x, 1, 5, 9, 13);
                    ChaCha20.quarterRound(x, 2, 6, 10, 14);
                    ChaCha20.quarterRound(x, 3, 7, 11, 15);
                    ChaCha20.quarterRound(x, 0, 5, 10, 15);
                    ChaCha20.quarterRound(x, 1, 6, 11, 12);
                    ChaCha20.quarterRound(x, 2, 7, 8, 13);
                    ChaCha20.quarterRound(x, 3, 4, 9, 14);
                }
                for (i = 16; i--;) {
                    x[i] += this._input[i];
                }
                for (i = 16; i--;) {
                    BitHelper.u32To8LittleEndian(output, 4 * i, x[i]);
                }
                this._input[12] += 1;
                if (!this._input[12]) {
                    this._input[13] += 1;
                }
                if (len <= 64) {
                    for (i = len; i--;) {
                        dst[i + dpos] = data[i + spos] ^ output[i];
                    }
                    return dst;
                }
                for (i = 64; i--;) {
                    dst[i + dpos] = data[i + spos] ^ output[i];
                }
                len -= 64;
                spos += 64;
                dpos += 64;
            }
            return dst;
        }
        /**
         * Decrypt the data.
         * @param data The source data to decrypt.
         * @returns The decrypted data.
         */
        decrypt(data) {
            return this.encrypt(data);
        }
        /**
         * Create a keystream of the given length.
         * @param length The length to create the keystream.
         * @returns The keystream.
         */
        keyStream(length) {
            const dst = new Uint8Array(length);
            for (let i = 0; i < dst.length; i++) {
                dst[i] = 0;
            }
            return this.encrypt(dst);
        }
    }

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /* eslint-disable no-bitwise */
    // https://www.ietf.org/rfc/rfc8439.html
    /**
     * Implementation of Poly1305.
     */
    class Poly1305 {
        /**
         * Create a new instance of Poly1305.
         * @param key The key.
         */
        constructor(key) {
            this._buffer = new Uint8Array(16);
            this._r = new Uint16Array(10);
            this._h = new Uint16Array(10);
            this._pad = new Uint16Array(8);
            this._leftover = 0;
            this._fin = 0;
            this._finishedMac = new Uint8Array(1);
            const t0 = key[0] | (key[1] << 8);
            this._r[0] = (t0) & 0x1FFF;
            const t1 = key[2] | (key[3] << 8);
            this._r[1] = ((t0 >>> 13) | (t1 << 3)) & 0x1FFF;
            const t2 = key[4] | (key[5] << 8);
            this._r[2] = ((t1 >>> 10) | (t2 << 6)) & 0x1F03;
            const t3 = key[6] | (key[7] << 8);
            this._r[3] = ((t2 >>> 7) | (t3 << 9)) & 0x1FFF;
            const t4 = key[8] | (key[9] << 8);
            this._r[4] = ((t3 >>> 4) | (t4 << 12)) & 0x00FF;
            this._r[5] = ((t4 >>> 1)) & 0x1FFE;
            const t5 = key[10] | (key[11] << 8);
            this._r[6] = ((t4 >>> 14) | (t5 << 2)) & 0x1FFF;
            const t6 = key[12] | (key[13] << 8);
            this._r[7] = ((t5 >>> 11) | (t6 << 5)) & 0x1F81;
            const t7 = key[14] | (key[15] << 8);
            this._r[8] = ((t6 >>> 8) | (t7 << 8)) & 0x1FFF;
            this._r[9] = ((t7 >>> 5)) & 0x007F;
            this._pad[0] = key[16] | (key[17] << 8);
            this._pad[1] = key[18] | (key[19] << 8);
            this._pad[2] = key[20] | (key[21] << 8);
            this._pad[3] = key[22] | (key[23] << 8);
            this._pad[4] = key[24] | (key[25] << 8);
            this._pad[5] = key[26] | (key[27] << 8);
            this._pad[6] = key[28] | (key[29] << 8);
            this._pad[7] = key[30] | (key[31] << 8);
        }
        /**
         * Finished the mac.
         */
        finish() {
            const g = new Uint16Array(10);
            let c;
            let mask;
            let f;
            let i;
            if (this._leftover) {
                i = this._leftover;
                this._buffer[i++] = 1;
                for (; i < 16; i++) {
                    this._buffer[i] = 0;
                }
                this._fin = 1;
                this.blocks(this._buffer, 0, 16);
            }
            c = this._h[1] >>> 13;
            this._h[1] &= 0x1FFF;
            for (i = 2; i < 10; i++) {
                this._h[i] += c;
                c = this._h[i] >>> 13;
                this._h[i] &= 0x1FFF;
            }
            this._h[0] += (c * 5);
            c = this._h[0] >>> 13;
            this._h[0] &= 0x1FFF;
            this._h[1] += c;
            c = this._h[1] >>> 13;
            this._h[1] &= 0x1FFF;
            this._h[2] += c;
            g[0] = this._h[0] + 5;
            c = g[0] >>> 13;
            g[0] &= 0x1FFF;
            for (i = 1; i < 10; i++) {
                g[i] = this._h[i] + c;
                c = g[i] >>> 13;
                g[i] &= 0x1FFF;
            }
            g[9] -= (1 << 13);
            mask = (c ^ 1) - 1;
            for (i = 0; i < 10; i++) {
                g[i] &= mask;
            }
            mask = ~mask;
            for (i = 0; i < 10; i++) {
                this._h[i] = (this._h[i] & mask) | g[i];
            }
            this._h[0] = ((this._h[0]) | (this._h[1] << 13)) & 0xFFFF;
            this._h[1] = ((this._h[1] >>> 3) | (this._h[2] << 10)) & 0xFFFF;
            this._h[2] = ((this._h[2] >>> 6) | (this._h[3] << 7)) & 0xFFFF;
            this._h[3] = ((this._h[3] >>> 9) | (this._h[4] << 4)) & 0xFFFF;
            this._h[4] = ((this._h[4] >>> 12) | (this._h[5] << 1) | (this._h[6] << 14)) & 0xFFFF;
            this._h[5] = ((this._h[6] >>> 2) | (this._h[7] << 11)) & 0xFFFF;
            this._h[6] = ((this._h[7] >>> 5) | (this._h[8] << 8)) & 0xFFFF;
            this._h[7] = ((this._h[8] >>> 8) | (this._h[9] << 5)) & 0xFFFF;
            f = this._h[0] + this._pad[0];
            this._h[0] = f & 0xFFFF;
            for (i = 1; i < 8; i++) {
                f = Math.trunc((Math.trunc(this._h[i] + this._pad[i])) + (f >>> 16));
                this._h[i] = f & 0xFFFF;
            }
            this._finishedMac = new Uint8Array(16);
            this._finishedMac[0] = this._h[0] >>> 0;
            this._finishedMac[1] = this._h[0] >>> 8;
            this._finishedMac[2] = this._h[1] >>> 0;
            this._finishedMac[3] = this._h[1] >>> 8;
            this._finishedMac[4] = this._h[2] >>> 0;
            this._finishedMac[5] = this._h[2] >>> 8;
            this._finishedMac[6] = this._h[3] >>> 0;
            this._finishedMac[7] = this._h[3] >>> 8;
            this._finishedMac[8] = this._h[4] >>> 0;
            this._finishedMac[9] = this._h[4] >>> 8;
            this._finishedMac[10] = this._h[5] >>> 0;
            this._finishedMac[11] = this._h[5] >>> 8;
            this._finishedMac[12] = this._h[6] >>> 0;
            this._finishedMac[13] = this._h[6] >>> 8;
            this._finishedMac[14] = this._h[7] >>> 0;
            this._finishedMac[15] = this._h[7] >>> 8;
        }
        /**
         * Update the hash.
         * @param input The data to update with.
         * @returns Hasher instance.
         */
        update(input) {
            let mpos = 0;
            let bytes = input.length;
            let want;
            if (this._leftover) {
                want = (16 - this._leftover);
                if (want > bytes) {
                    want = bytes;
                }
                for (let i = 0; i < want; i++) {
                    this._buffer[this._leftover + i] = input[mpos + i];
                }
                bytes -= want;
                mpos += want;
                this._leftover += want;
                if (this._leftover < 16) {
                    return this;
                }
                this.blocks(this._buffer, 0, 16);
                this._leftover = 0;
            }
            if (bytes >= 16) {
                want = bytes - (bytes % 16);
                this.blocks(input, mpos, want);
                mpos += want;
                bytes -= want;
            }
            if (bytes) {
                for (let i = 0; i < bytes; i++) {
                    this._buffer[this._leftover + i] = input[mpos + i];
                }
                this._leftover += bytes;
            }
            return this;
        }
        /**
         * Get the digest for the hash.
         * @returns The mac.
         */
        digest() {
            if (!this._finishedMac) {
                this.finish();
            }
            return this._finishedMac;
        }
        /**
         * Perform the block operations.
         * @param m The data,
         * @param mpos The index in the data,
         * @param bytes The number of bytes.
         * @internal
         */
        blocks(m, mpos, bytes) {
            const hibit = this._fin ? 0 : 1 << 11;
            let h0 = this._h[0];
            let h1 = this._h[1];
            let h2 = this._h[2];
            let h3 = this._h[3];
            let h4 = this._h[4];
            let h5 = this._h[5];
            let h6 = this._h[6];
            let h7 = this._h[7];
            let h8 = this._h[8];
            let h9 = this._h[9];
            const r0 = this._r[0];
            const r1 = this._r[1];
            const r2 = this._r[2];
            const r3 = this._r[3];
            const r4 = this._r[4];
            const r5 = this._r[5];
            const r6 = this._r[6];
            const r7 = this._r[7];
            const r8 = this._r[8];
            const r9 = this._r[9];
            while (bytes >= 16) {
                const t0 = m[mpos + 0] | (m[mpos + 1] << 8);
                h0 += (t0) & 0x1FFF;
                const t1 = m[mpos + 2] | (m[mpos + 3] << 8);
                h1 += ((t0 >>> 13) | (t1 << 3)) & 0x1FFF;
                const t2 = m[mpos + 4] | (m[mpos + 5] << 8);
                h2 += ((t1 >>> 10) | (t2 << 6)) & 0x1FFF;
                const t3 = m[mpos + 6] | (m[mpos + 7] << 8);
                h3 += ((t2 >>> 7) | (t3 << 9)) & 0x1FFF;
                const t4 = m[mpos + 8] | (m[mpos + 9] << 8);
                h4 += ((t3 >>> 4) | (t4 << 12)) & 0x1FFF;
                h5 += ((t4 >>> 1)) & 0x1FFF;
                const t5 = m[mpos + 10] | (m[mpos + 11] << 8);
                h6 += ((t4 >>> 14) | (t5 << 2)) & 0x1FFF;
                const t6 = m[mpos + 12] | (m[mpos + 13] << 8);
                h7 += ((t5 >>> 11) | (t6 << 5)) & 0x1FFF;
                const t7 = m[mpos + 14] | (m[mpos + 15] << 8);
                h8 += ((t6 >>> 8) | (t7 << 8)) & 0x1FFF;
                h9 += ((t7 >>> 5)) | hibit;
                let c = 0;
                let d0 = c;
                d0 += h0 * r0;
                d0 += h1 * (5 * r9);
                d0 += h2 * (5 * r8);
                d0 += h3 * (5 * r7);
                d0 += h4 * (5 * r6);
                c = (d0 >>> 13);
                d0 &= 0x1FFF;
                d0 += h5 * (5 * r5);
                d0 += h6 * (5 * r4);
                d0 += h7 * (5 * r3);
                d0 += h8 * (5 * r2);
                d0 += h9 * (5 * r1);
                c += (d0 >>> 13);
                d0 &= 0x1FFF;
                let d1 = c;
                d1 += h0 * r1;
                d1 += h1 * r0;
                d1 += h2 * (5 * r9);
                d1 += h3 * (5 * r8);
                d1 += h4 * (5 * r7);
                c = (d1 >>> 13);
                d1 &= 0x1FFF;
                d1 += h5 * (5 * r6);
                d1 += h6 * (5 * r5);
                d1 += h7 * (5 * r4);
                d1 += h8 * (5 * r3);
                d1 += h9 * (5 * r2);
                c += (d1 >>> 13);
                d1 &= 0x1FFF;
                let d2 = c;
                d2 += h0 * r2;
                d2 += h1 * r1;
                d2 += h2 * r0;
                d2 += h3 * (5 * r9);
                d2 += h4 * (5 * r8);
                c = (d2 >>> 13);
                d2 &= 0x1FFF;
                d2 += h5 * (5 * r7);
                d2 += h6 * (5 * r6);
                d2 += h7 * (5 * r5);
                d2 += h8 * (5 * r4);
                d2 += h9 * (5 * r3);
                c += (d2 >>> 13);
                d2 &= 0x1FFF;
                let d3 = c;
                d3 += h0 * r3;
                d3 += h1 * r2;
                d3 += h2 * r1;
                d3 += h3 * r0;
                d3 += h4 * (5 * r9);
                c = (d3 >>> 13);
                d3 &= 0x1FFF;
                d3 += h5 * (5 * r8);
                d3 += h6 * (5 * r7);
                d3 += h7 * (5 * r6);
                d3 += h8 * (5 * r5);
                d3 += h9 * (5 * r4);
                c += (d3 >>> 13);
                d3 &= 0x1FFF;
                let d4 = c;
                d4 += h0 * r4;
                d4 += h1 * r3;
                d4 += h2 * r2;
                d4 += h3 * r1;
                d4 += h4 * r0;
                c = (d4 >>> 13);
                d4 &= 0x1FFF;
                d4 += h5 * (5 * r9);
                d4 += h6 * (5 * r8);
                d4 += h7 * (5 * r7);
                d4 += h8 * (5 * r6);
                d4 += h9 * (5 * r5);
                c += (d4 >>> 13);
                d4 &= 0x1FFF;
                let d5 = c;
                d5 += h0 * r5;
                d5 += h1 * r4;
                d5 += h2 * r3;
                d5 += h3 * r2;
                d5 += h4 * r1;
                c = (d5 >>> 13);
                d5 &= 0x1FFF;
                d5 += h5 * r0;
                d5 += h6 * (5 * r9);
                d5 += h7 * (5 * r8);
                d5 += h8 * (5 * r7);
                d5 += h9 * (5 * r6);
                c += (d5 >>> 13);
                d5 &= 0x1FFF;
                let d6 = c;
                d6 += h0 * r6;
                d6 += h1 * r5;
                d6 += h2 * r4;
                d6 += h3 * r3;
                d6 += h4 * r2;
                c = (d6 >>> 13);
                d6 &= 0x1FFF;
                d6 += h5 * r1;
                d6 += h6 * r0;
                d6 += h7 * (5 * r9);
                d6 += h8 * (5 * r8);
                d6 += h9 * (5 * r7);
                c += (d6 >>> 13);
                d6 &= 0x1FFF;
                let d7 = c;
                d7 += h0 * r7;
                d7 += h1 * r6;
                d7 += h2 * r5;
                d7 += h3 * r4;
                d7 += h4 * r3;
                c = (d7 >>> 13);
                d7 &= 0x1FFF;
                d7 += h5 * r2;
                d7 += h6 * r1;
                d7 += h7 * r0;
                d7 += h8 * (5 * r9);
                d7 += h9 * (5 * r8);
                c += (d7 >>> 13);
                d7 &= 0x1FFF;
                let d8 = c;
                d8 += h0 * r8;
                d8 += h1 * r7;
                d8 += h2 * r6;
                d8 += h3 * r5;
                d8 += h4 * r4;
                c = (d8 >>> 13);
                d8 &= 0x1FFF;
                d8 += h5 * r3;
                d8 += h6 * r2;
                d8 += h7 * r1;
                d8 += h8 * r0;
                d8 += h9 * (5 * r9);
                c += (d8 >>> 13);
                d8 &= 0x1FFF;
                let d9 = c;
                d9 += h0 * r9;
                d9 += h1 * r8;
                d9 += h2 * r7;
                d9 += h3 * r6;
                d9 += h4 * r5;
                c = (d9 >>> 13);
                d9 &= 0x1FFF;
                d9 += h5 * r4;
                d9 += h6 * r3;
                d9 += h7 * r2;
                d9 += h8 * r1;
                d9 += h9 * r0;
                c += (d9 >>> 13);
                d9 &= 0x1FFF;
                c = Math.trunc((c << 2) + c);
                c = Math.trunc(c + d0);
                d0 = c & 0x1FFF;
                c >>>= 13;
                d1 += c;
                h0 = d0;
                h1 = d1;
                h2 = d2;
                h3 = d3;
                h4 = d4;
                h5 = d5;
                h6 = d6;
                h7 = d7;
                h8 = d8;
                h9 = d9;
                mpos += 16;
                bytes -= 16;
            }
            this._h[0] = h0;
            this._h[1] = h1;
            this._h[2] = h2;
            this._h[3] = h3;
            this._h[4] = h4;
            this._h[5] = h5;
            this._h[6] = h6;
            this._h[7] = h7;
            this._h[8] = h8;
            this._h[9] = h9;
        }
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Implementation of the ChaCha20Poly1305 cipher.
     */
    class ChaCha20Poly1305 {
        /**
         * Create a new instance of ChaCha20Poly1305.
         * @param key The key.
         * @param nonce The nonce.
         * @param decrypt Are we decrypting.
         * @internal
         */
        constructor(key, nonce, decrypt) {
            this._chacha = new ChaCha20(key, nonce);
            this._poly = new Poly1305(this._chacha.keyStream(64));
            this._aadLength = 0;
            this._cipherLength = 0;
            this._decrypt = decrypt;
            this._hasData = false;
        }
        /**
         * Create a ChaCha20Poly1305 encryptor.
         * @param key The key.
         * @param nonce The nonce.
         * @returns Encryptor instance of ChaCha20Poly1305.
         */
        static encryptor(key, nonce) {
            return new ChaCha20Poly1305(key, nonce, false);
        }
        /**
         * Create a ChaCha20Poly1305 decryptor.
         * @param key The key.
         * @param nonce The nonce.
         * @returns Decryptor instance of ChaCha20Poly1305.
         */
        static decryptor(key, nonce) {
            return new ChaCha20Poly1305(key, nonce, true);
        }
        /**
         * Set the AAD.
         * @param aad The aad to set.
         */
        setAAD(aad) {
            if (this._hasData) {
                throw new Error("You can not set the aad when there is already data");
            }
            this._aadLength = aad.length;
            this._poly.update(aad);
            const padLength = this.padLength(this._aadLength);
            if (padLength) {
                this._poly.update(new Uint8Array(padLength).fill(0));
            }
        }
        /**
         * Update the cipher with more data.
         * @param input The input data to include.
         * @returns The updated data.
         */
        update(input) {
            this._hasData = true;
            const len = input.length;
            this._cipherLength += len;
            const pad = this._chacha.keyStream(len);
            for (let i = 0; i < len; i++) {
                pad[i] ^= input[i];
            }
            if (this._decrypt) {
                this._poly.update(input);
            }
            else {
                this._poly.update(pad);
            }
            return pad;
        }
        /**
         * Finalise the data.
         */
        final() {
            if (this._decrypt && !this._authTag) {
                throw new Error("Can not finalise when the auth tag is not set");
            }
            const padLength = this.padLength(this._cipherLength);
            if (padLength) {
                this._poly.update(new Uint8Array(padLength).fill(0));
            }
            const lens = new Uint8Array(16);
            lens.fill(0);
            BitHelper.u32To8LittleEndian(lens, 0, this._aadLength);
            BitHelper.u32To8LittleEndian(lens, 8, this._cipherLength);
            this._poly.update(lens).finish();
            const tag = this._poly.digest();
            if (this._decrypt) {
                if (this._authTag && this.xorTest(tag, this._authTag)) {
                    throw new Error("The data could not be authenticated");
                }
            }
            else {
                this._authTag = tag;
            }
        }
        /**
         * Get the auth tag.
         * @returns The auth tag.
         */
        getAuthTag() {
            if (this._decrypt) {
                throw new Error("Can not get the auth tag when decrypting");
            }
            if (!this._authTag) {
                throw new Error("The auth tag has not been set");
            }
            return this._authTag;
        }
        /**
         * Set the auth tag.
         * @param authTag Set the auth tag.
         */
        setAuthTag(authTag) {
            if (this._decrypt) {
                this._authTag = authTag;
            }
            else {
                throw new Error("Can not set the auth tag when encrypting");
            }
        }
        /**
         * Calculate the padding amount.
         * @param len The length to calculate the padding for.
         * @returns The padding amount.
         * @internal
         */
        padLength(len) {
            const rem = len % 16;
            if (!rem) {
                return 0;
            }
            return 16 - rem;
        }
        /**
         * Perform a xor test on the two arrays.
         * @param a The first array.
         * @param b The second array.
         * @returns The xor count.
         * @internal
         */
        xorTest(a, b) {
            if (a.length !== b.length) {
                return 1;
            }
            let out = 0;
            for (let i = 0; i < a.length; i++) {
                out += a[i] ^ b[i];
            }
            return out;
        }
    }

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /* eslint-disable no-bitwise */
    /**
     * Class to implement Curl sponge.
     */
    class Curl {
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

    // Copyright 2020 IOTA Stiftung
    /**
     * Class to help with slip0010 key derivation
     * https://github.com/satoshilabs/slips/blob/master/slip-0010.md.
     */
    class Slip0010 {
        /**
         * Get the master key from the seed.
         * @param seed The seed to generate the master key from.
         * @returns The key and chain code.
         */
        static getMasterKeyFromSeed(seed) {
            const hmac = new HmacSha512(Converter.utf8ToBytes("ed25519 seed"));
            const fullKey = hmac.update(seed).digest();
            return {
                privateKey: Uint8Array.from(fullKey.slice(0, 32)),
                chainCode: Uint8Array.from(fullKey.slice(32))
            };
        }
        /**
         * Derive a key from the path.
         * @param seed The seed.
         * @param path The path.
         * @returns The key and chain code.
         */
        static derivePath(seed, path) {
            let { privateKey, chainCode } = Slip0010.getMasterKeyFromSeed(seed);
            const segments = path.numberSegments();
            for (let i = 0; i < segments.length; i++) {
                const indexValue = 0x80000000 + segments[i];
                const data = new Uint8Array(1 + privateKey.length + 4);
                data[0] = 0;
                data.set(privateKey, 1);
                data[privateKey.length + 1] = indexValue >>> 24;
                data[privateKey.length + 2] = indexValue >>> 16;
                data[privateKey.length + 3] = indexValue >>> 8;
                data[privateKey.length + 4] = indexValue & 0xFF;
                const fullKey = new HmacSha512(chainCode)
                    .update(data)
                    .digest();
                privateKey = Uint8Array.from(fullKey.slice(0, 32));
                chainCode = Uint8Array.from(fullKey.slice(32));
            }
            return {
                privateKey,
                chainCode
            };
        }
        /**
         * Get the public key from the private key.
         * @param privateKey The private key.
         * @param withZeroByte Include a zero bute prefix.
         * @returns The public key.
         */
        static getPublicKey(privateKey, withZeroByte = true) {
            const keyPair = Ed25519.keyPairFromSeed(privateKey);
            const signPk = keyPair.privateKey.slice(32);
            if (withZeroByte) {
                const arr = new Uint8Array(1 + signPk.length);
                arr[0] = 0;
                arr.set(signPk, 1);
                return arr;
            }
            return signPk;
        }
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Implementation of X25519.
     */
    class X25519 {
        /**
         * Convert Ed25519 private key to X25519 private key.
         * @param ed25519PrivateKey The ed25519 private key to convert.
         * @returns The x25519 private key.
         */
        static convertPrivateKeyToX25519(ed25519PrivateKey) {
            const digest = Sha512.sum512(ed25519PrivateKey.slice(0, 32));
            digest[0] &= 248;
            digest[31] &= 127;
            digest[31] |= 64;
            return digest.slice(0, 32);
        }
        /**
         * Convert Ed25519 public key to X25519 public key.
         * @param ed25519PublicKey The ed25519 public key to convert.
         * @returns The x25519 public key.
         */
        static convertPublicKeyToX25519(ed25519PublicKey) {
            const A = new ExtendedGroupElement();
            if (!A.fromBytes(ed25519PublicKey)) {
                throw new Error("Invalid Ed25519 Public Key");
            }
            // A.Z = 1 as a postcondition of FromBytes.
            const x = X25519.edwardsToMontgomeryX(A.Y);
            const x25519PublicKey = new Uint8Array(32);
            x.toBytes(x25519PublicKey);
            return x25519PublicKey;
        }
        /**
         * Convert the edwards curve to montgomery curve.
         * @param y The point on the edwards curve.
         * @returns The x-coordinate of the mapping.
         * @internal
         */
        static edwardsToMontgomeryX(y) {
            // We only need the x-coordinate of the curve25519 point, which I'll
            // call u. The isomorphism is u=(y+1)/(1-y), since y=Y/Z, this gives
            // u=(Y+Z)/(Z-Y). We know that Z=1, thus u=(Y+1)/(1-Y).
            const oneMinusY = new FieldElement();
            oneMinusY.one();
            oneMinusY.sub(oneMinusY, y);
            oneMinusY.invert(oneMinusY);
            const outX = new FieldElement();
            outX.one();
            outX.add(outX, y);
            outX.mul(outX, oneMinusY);
            return outX;
        }
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Implementation of Zip215.
     */
    class Zip215 {
        /**
         * Verify reports whether sig is a valid signature of message by
         * publicKey, using precisely-specified validation criteria (ZIP 215) suitable
         * for use in consensus-critical contexts.
         * @param publicKey The public key for the message.
         * @param message The message content to validate.
         * @param sig The signature to verify.
         * @returns True if the signature is valid.
         */
        static verify(publicKey, message, sig) {
            if (!publicKey || publicKey.length !== Ed25519.PUBLIC_KEY_SIZE) {
                return false;
            }
            if (!sig || sig.length !== Ed25519.SIGNATURE_SIZE || ((sig[63] & 224) !== 0)) {
                return false;
            }
            const A = new ExtendedGroupElement();
            // ZIP215: this works because FromBytes does not check that encodings are canonical.
            if (!A.fromBytes(publicKey)) {
                return false;
            }
            A.X.neg();
            A.T.neg();
            const h = new Sha512();
            h.update(sig.subarray(0, 32));
            h.update(publicKey);
            h.update(message);
            const digest = h.digest();
            const hReduced = new Uint8Array(32);
            scalarReduce(hReduced, digest);
            const r = new Uint8Array(sig.subarray(0, 32));
            const checkR = new ExtendedGroupElement();
            // ZIP215: this works because FromBytes does not check that encodings are canonical.
            if (!checkR.fromBytes(r)) {
                return false;
            }
            const s = new Uint8Array(sig.subarray(32));
            // https://tools.ietf.org/html/rfc8032#section-5.1.7 requires that s be in
            // the range [0, order) in order to prevent signature malleability.
            // ZIP215: This is also required by ZIP215.
            if (!scalarMinimal(s)) {
                return false;
            }
            const rProj = new ProjectiveGroupElement();
            const R = new ExtendedGroupElement();
            rProj.doubleScalarMultVartime(hReduced, A, s);
            rProj.toExtended(R);
            // ZIP215: We want to check [8](R - R') == 0
            return R.cofactorEqual(checkR);
        }
    }

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /* eslint-disable no-bitwise */
    /**
     * Class implements the b1t6 encoding encoding which uses a group of 6 trits to encode each byte.
     */
    class B1T6 {
        /**
         * The encoded length of the data.
         * @param data The data.
         * @returns The encoded length.
         */
        static encodedLen(data) {
            return data.length * B1T6.TRITS_PER_TRYTE;
        }
        /**
         * Encode a byte array into trits.
         * @param dst The destination array.
         * @param startIndex The start index to write in the array.
         * @param src The source data.
         * @returns The length of the encode.
         */
        static encode(dst, startIndex, src) {
            let j = 0;
            for (let i = 0; i < src.length; i++) {
                // Convert to signed 8 bit value
                const v = (src[i] << 24 >> 24) + 364;
                const rem = Math.trunc(v % 27);
                const quo = Math.trunc(v / 27);
                dst[startIndex + j] = B1T6.TRYTE_VALUE_TO_TRITS[rem][0];
                dst[startIndex + j + 1] = B1T6.TRYTE_VALUE_TO_TRITS[rem][1];
                dst[startIndex + j + 2] = B1T6.TRYTE_VALUE_TO_TRITS[rem][2];
                dst[startIndex + j + 3] = B1T6.TRYTE_VALUE_TO_TRITS[quo][0];
                dst[startIndex + j + 4] = B1T6.TRYTE_VALUE_TO_TRITS[quo][1];
                dst[startIndex + j + 5] = B1T6.TRYTE_VALUE_TO_TRITS[quo][2];
                j += 6;
            }
            return j;
        }
    }
    /**
     * Trytes to trits lookup table.
     * @internal
     */
    B1T6.TRYTE_VALUE_TO_TRITS = [
        [-1, -1, -1], [0, -1, -1], [1, -1, -1], [-1, 0, -1], [0, 0, -1], [1, 0, -1],
        [-1, 1, -1], [0, 1, -1], [1, 1, -1], [-1, -1, 0], [0, -1, 0], [1, -1, 0],
        [-1, 0, 0], [0, 0, 0], [1, 0, 0], [-1, 1, 0], [0, 1, 0], [1, 1, 0],
        [-1, -1, 1], [0, -1, 1], [1, -1, 1], [-1, 0, 1], [0, 0, 1], [1, 0, 1],
        [-1, 1, 1], [0, 1, 1], [1, 1, 1]
    ];
    /**
     * Trites per tryte.
     * @internal
     */
    B1T6.TRITS_PER_TRYTE = 3;

    // Copyright 2020 IOTA Stiftung
    const IOTA_BIP44_BASE_PATH = "m/44'/4218'";
    /**
     * Generate a bip44 path based on all its parts.
     * @param accountIndex The account index.
     * @param addressIndex The address index.
     * @param isInternal Is this an internal address.
     * @returns The generated address.
     */
    function generateBip44Path(accountIndex, addressIndex, isInternal) {
        const bip32Path = new Bip32Path(IOTA_BIP44_BASE_PATH);
        bip32Path.pushHardened(accountIndex);
        bip32Path.pushHardened(isInternal ? 1 : 0);
        bip32Path.pushHardened(addressIndex);
        return bip32Path;
    }
    /**
     * Generate addresses based on the account indexing style.
     * @param generatorState The address state.
     * @param generatorState.accountIndex The index of the account to calculate.
     * @param generatorState.addressIndex The index of the address to calculate.
     * @param generatorState.isInternal Are we generating an internal address.
     * @param isFirst Is this the first address we are generating.
     * @returns The key pair for the address.
     */
    function generateBip44Address(generatorState, isFirst) {
        // Not the first address so increment the counters.
        if (!isFirst) {
            // Flip-flop between internal and external
            // and then increment the address Index
            if (!generatorState.isInternal) {
                generatorState.isInternal = true;
            }
            else {
                generatorState.isInternal = false;
                generatorState.addressIndex++;
            }
        }
        const path = new Bip32Path(IOTA_BIP44_BASE_PATH);
        path.pushHardened(generatorState.accountIndex);
        path.pushHardened(generatorState.isInternal ? 1 : 0);
        path.pushHardened(generatorState.addressIndex);
        return path.toString();
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Convert address to bech32.
     */
    class Bech32Helper {
        /**
         * Encode an address to bech32.
         * @param addressType The address type to encode.
         * @param addressBytes The address bytes to encode.
         * @param humanReadablePart The human readable part to use.
         * @returns The array formated as hex.
         */
        static toBech32(addressType, addressBytes, humanReadablePart) {
            const addressData = new Uint8Array(1 + addressBytes.length);
            addressData[0] = addressType;
            addressData.set(addressBytes, 1);
            return Bech32.encode(humanReadablePart, addressData);
        }
        /**
         * Decode an address from bech32.
         * @param bech32Text The bech32 text to decode.
         * @param humanReadablePart The human readable part to use.
         * @returns The address type and address bytes or undefined if it cannot be decoded.
         */
        static fromBech32(bech32Text, humanReadablePart) {
            const decoded = Bech32.decode(bech32Text);
            if (decoded) {
                if (decoded.humanReadablePart !== humanReadablePart) {
                    throw new Error(`The hrp part of the address should be ${humanReadablePart}, it is ${decoded.humanReadablePart}`);
                }
                if (decoded.data.length === 0) {
                    throw new Error("The data part of the address should be at least length 1, it is 0");
                }
                const addressType = decoded.data[0];
                const addressBytes = decoded.data.slice(1);
                return {
                    addressType,
                    addressBytes
                };
            }
        }
        /**
         * Does the provided string look like it might be an bech32 address with matching hrp.
         * @param bech32Text The bech32 text to text.
         * @param humanReadablePart The human readable part to match.
         * @returns True if the passed address matches the pattern for a bech32 address.
         */
        static matches(bech32Text, humanReadablePart) {
            return Bech32.matches(humanReadablePart, bech32Text);
        }
    }
    /**
     * The default human readable part of the bech32 addresses for mainnet, currently 'iota'.
     */
    Bech32Helper.BECH32_DEFAULT_HRP_MAIN = "iota";
    /**
     * The default human readable part of the bech32 addresses for testnet, currently 'atoi'.
     */
    Bech32Helper.BECH32_DEFAULT_HRP_TEST = "atoi";

    // Copyright 2020 IOTA Stiftung
    /**
     * Get all the unspent addresses.
     * @param client The client or node endpoint to send the transfer with.
     * @param seed The seed to use for address generation.
     * @param accountIndex The account index in the wallet.
     * @param addressOptions Optional address configuration for balance address lookups.
     * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
     * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
     * @param addressOptions.requiredCount The max number of addresses to find.
     * @returns All the unspent addresses.
     */
    async function getUnspentAddresses(client, seed, accountIndex, addressOptions) {
        var _a;
        return getUnspentAddressesWithAddressGenerator(client, seed, {
            accountIndex,
            addressIndex: (_a = addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.startIndex) !== null && _a !== void 0 ? _a : 0,
            isInternal: false
        }, generateBip44Address, addressOptions);
    }
    /**
     * Get all the unspent addresses using an address generator.
     * @param client The client or node endpoint to get the addresses from.
     * @param seed The seed to use for address generation.
     * @param initialAddressState The initial address state for calculating the addresses.
     * @param nextAddressPath Calculate the next address for inputs.
     * @param addressOptions Optional address configuration for balance address lookups.
     * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
     * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
     * @param addressOptions.requiredCount The max number of addresses to find.
     * @returns All the unspent addresses.
     */
    async function getUnspentAddressesWithAddressGenerator(client, seed, initialAddressState, nextAddressPath, addressOptions) {
        var _a, _b;
        const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
        const nodeInfo = await localClient.info();
        const localRequiredLimit = (_a = addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.requiredCount) !== null && _a !== void 0 ? _a : Number.MAX_SAFE_INTEGER;
        const localZeroCount = (_b = addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.zeroCount) !== null && _b !== void 0 ? _b : 20;
        let finished = false;
        const allUnspent = [];
        let isFirst = true;
        let zeroBalance = 0;
        do {
            const path = nextAddressPath(initialAddressState, isFirst);
            isFirst = false;
            const addressSeed = seed.generateSeedFromPath(new Bip32Path(path));
            const ed25519Address = new Ed25519Address(addressSeed.keyPair().publicKey);
            const addressBytes = ed25519Address.toAddress();
            const addressHex = Converter.bytesToHex(addressBytes);
            const addressResponse = await localClient.addressEd25519(addressHex);
            // If there is no balance we increment the counter and end
            // the text when we have reached the count
            if (addressResponse.balance === 0) {
                zeroBalance++;
                if (zeroBalance >= localZeroCount) {
                    finished = true;
                }
            }
            else {
                allUnspent.push({
                    address: Bech32Helper.toBech32(ED25519_ADDRESS_TYPE, addressBytes, nodeInfo.bech32HRP),
                    path,
                    balance: addressResponse.balance
                });
                if (allUnspent.length === localRequiredLimit) {
                    finished = true;
                }
            }
        } while (!finished);
        return allUnspent;
    }

    /**
     * Get the balance for a list of addresses.
     * @param client The client or node endpoint to send the transfer with.
     * @param seed The seed.
     * @param accountIndex The account index in the wallet.
     * @param addressOptions Optional address configuration for balance address lookups.
     * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
     * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
     * @returns The balance.
     */
    async function getBalance(client, seed, accountIndex, addressOptions) {
        const allUnspent = await getUnspentAddresses(client, seed, accountIndex, addressOptions);
        let total = 0;
        for (const output of allUnspent) {
            total += output.balance;
        }
        return total;
    }

    /**
     * Get the first unspent address.
     * @param client The client or node endpoint to send the transfer with.
     * @param seed The seed to use for address generation.
     * @param accountIndex The account index in the wallet.
     * @param addressOptions Optional address configuration for balance address lookups.
     * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
     * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
     * @returns The first unspent address.
     */
    async function getUnspentAddress(client, seed, accountIndex, addressOptions) {
        const allUnspent = await getUnspentAddresses(client, seed, accountIndex, {
            startIndex: addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.startIndex,
            zeroCount: addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.zeroCount,
            requiredCount: 1
        });
        return allUnspent.length > 0 ? allUnspent[0] : undefined;
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Promote an existing message.
     * @param client The clientor node endpoint to perform the promote with.
     * @param messageId The message to promote.
     * @returns The id and message that were promoted.
     */
    async function promote(client, messageId) {
        const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
        const message = await localClient.message(messageId);
        if (!message) {
            throw new Error("The message does not exist.");
        }
        const tipsResponse = await localClient.tips();
        // Parents must be unique and lexicographically sorted
        // so don't add the messageId if it is already one of the tips
        if (!tipsResponse.tipMessageIds.includes(messageId)) {
            tipsResponse.tipMessageIds.unshift(messageId);
        }
        // If we now exceed the max parents remove as many as we need
        if (tipsResponse.tipMessageIds.length > MAX_NUMBER_PARENTS) {
            tipsResponse.tipMessageIds = tipsResponse.tipMessageIds.slice(0, MAX_NUMBER_PARENTS);
        }
        // Finally sort the list
        tipsResponse.tipMessageIds.sort();
        const promoteMessage = {
            parentMessageIds: tipsResponse.tipMessageIds
        };
        const promoteMessageId = await localClient.messageSubmit(promoteMessage);
        return {
            message,
            messageId: promoteMessageId
        };
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Reattach an existing message.
     * @param client The client or node endpoint to perform the reattach with.
     * @param messageId The message to reattach.
     * @returns The id and message that were reattached.
     */
    async function reattach(client, messageId) {
        const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
        const message = await localClient.message(messageId);
        if (!message) {
            throw new Error("The message does not exist.");
        }
        const reattachMessage = {
            payload: message.payload
        };
        const reattachedMessageId = await localClient.messageSubmit(reattachMessage);
        return {
            message,
            messageId: reattachedMessageId
        };
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Retrieve a data message.
     * @param client The client or node endpoint to retrieve the data with.
     * @param messageId The message id of the data to get.
     * @returns The message index and data.
     */
    async function retrieveData(client, messageId) {
        const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
        const message = await localClient.message(messageId);
        if (message === null || message === void 0 ? void 0 : message.payload) {
            let indexationPayload;
            if (message.payload.type === TRANSACTION_PAYLOAD_TYPE) {
                indexationPayload = message.payload.essence.payload;
            }
            else if (message.payload.type === INDEXATION_PAYLOAD_TYPE) {
                indexationPayload = message.payload;
            }
            if (indexationPayload) {
                return {
                    index: Converter.hexToBytes(indexationPayload.index),
                    data: indexationPayload.data ? Converter.hexToBytes(indexationPayload.data) : undefined
                };
            }
        }
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Retry an existing message either by promoting or reattaching.
     * @param client The client or node endpoint to perform the retry with.
     * @param messageId The message to retry.
     * @returns The id and message that were retried.
     */
    async function retry(client, messageId) {
        const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
        const metadata = await localClient.messageMetadata(messageId);
        if (!metadata) {
            throw new Error("The message does not exist.");
        }
        if (metadata.shouldPromote) {
            return promote(client, messageId);
        }
        else if (metadata.shouldReattach) {
            return reattach(client, messageId);
        }
        throw new Error("The message should not be promoted or reattached.");
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Send a transfer from the balance on the seed.
     * @param client The client or node endpoint to send the transfer with.
     * @param inputsAndSignatureKeyPairs The inputs with the signature key pairs needed to sign transfers.
     * @param outputs The outputs to send.
     * @param indexation Optional indexation data to associate with the transaction.
     * @param indexation.key Indexation key.
     * @param indexation.data Optional index data.
     * @returns The id of the message created and the remainder address if one was needed.
     */
    async function sendAdvanced(client, inputsAndSignatureKeyPairs, outputs, indexation) {
        const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
        const transactionPayload = buildTransactionPayload(inputsAndSignatureKeyPairs, outputs, indexation);
        const message = {
            payload: transactionPayload
        };
        const messageId = await localClient.messageSubmit(message);
        return {
            messageId,
            message
        };
    }
    /**
     * Build a transaction payload.
     * @param inputsAndSignatureKeyPairs The inputs with the signature key pairs needed to sign transfers.
     * @param outputs The outputs to send.
     * @param indexation Optional indexation data to associate with the transaction.
     * @param indexation.key Indexation key.
     * @param indexation.data Optional index data.
     * @returns The transaction payload.
     */
    function buildTransactionPayload(inputsAndSignatureKeyPairs, outputs, indexation) {
        if (!inputsAndSignatureKeyPairs || inputsAndSignatureKeyPairs.length === 0) {
            throw new Error("You must specify some inputs");
        }
        if (!outputs || outputs.length === 0) {
            throw new Error("You must specify some outputs");
        }
        let localIndexationKeyHex;
        if (indexation === null || indexation === void 0 ? void 0 : indexation.key) {
            localIndexationKeyHex = typeof (indexation.key) === "string"
                ? Converter.utf8ToHex(indexation.key) : Converter.bytesToHex(indexation.key);
            if (localIndexationKeyHex.length / 2 < MIN_INDEXATION_KEY_LENGTH) {
                throw new Error(`The indexation key length is ${localIndexationKeyHex.length / 2}, which is below the minimum size of ${MIN_INDEXATION_KEY_LENGTH}`);
            }
            if (localIndexationKeyHex.length / 2 > MAX_INDEXATION_KEY_LENGTH) {
                throw new Error(`The indexation key length is ${localIndexationKeyHex.length / 2}, which exceeds the maximum size of ${MAX_INDEXATION_KEY_LENGTH}`);
            }
        }
        const outputsWithSerialization = [];
        for (const output of outputs) {
            if (output.addressType === ED25519_ADDRESS_TYPE) {
                const o = {
                    type: output.isDustAllowance ? SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE : SIG_LOCKED_SINGLE_OUTPUT_TYPE,
                    address: {
                        type: output.addressType,
                        address: output.address
                    },
                    amount: output.amount
                };
                const writeStream = new WriteStream();
                serializeOutput(writeStream, o);
                outputsWithSerialization.push({
                    output: o,
                    serialized: writeStream.finalHex()
                });
            }
            else {
                throw new Error(`Unrecognized output address type ${output.addressType}`);
            }
        }
        const inputsAndSignatureKeyPairsSerialized = inputsAndSignatureKeyPairs.map(i => {
            const writeStream = new WriteStream();
            serializeInput(writeStream, i.input);
            return {
                ...i,
                serialized: writeStream.finalHex()
            };
        });
        // Lexigraphically sort the inputs and outputs
        const sortedInputs = inputsAndSignatureKeyPairsSerialized.sort((a, b) => a.serialized.localeCompare(b.serialized));
        const sortedOutputs = outputsWithSerialization.sort((a, b) => a.serialized.localeCompare(b.serialized));
        const transactionEssence = {
            type: TRANSACTION_ESSENCE_TYPE,
            inputs: sortedInputs.map(i => i.input),
            outputs: sortedOutputs.map(o => o.output),
            payload: localIndexationKeyHex
                ? {
                    type: INDEXATION_PAYLOAD_TYPE,
                    index: localIndexationKeyHex,
                    data: (indexation === null || indexation === void 0 ? void 0 : indexation.data) ? (typeof indexation.data === "string"
                        ? Converter.utf8ToHex(indexation.data) : Converter.bytesToHex(indexation.data)) : undefined
                }
                : undefined
        };
        const binaryEssence = new WriteStream();
        serializeTransactionEssence(binaryEssence, transactionEssence);
        const essenceFinal = binaryEssence.finalBytes();
        const essenceHash = Blake2b.sum256(essenceFinal);
        // Create the unlock blocks
        const unlockBlocks = [];
        const addressToUnlockBlock = {};
        for (const input of sortedInputs) {
            const hexInputAddressPublic = Converter.bytesToHex(input.addressKeyPair.publicKey);
            if (addressToUnlockBlock[hexInputAddressPublic]) {
                unlockBlocks.push({
                    type: REFERENCE_UNLOCK_BLOCK_TYPE,
                    reference: addressToUnlockBlock[hexInputAddressPublic].unlockIndex
                });
            }
            else {
                unlockBlocks.push({
                    type: SIGNATURE_UNLOCK_BLOCK_TYPE,
                    signature: {
                        type: ED25519_SIGNATURE_TYPE,
                        publicKey: hexInputAddressPublic,
                        signature: Converter.bytesToHex(Ed25519.sign(input.addressKeyPair.privateKey, essenceHash))
                    }
                });
                addressToUnlockBlock[hexInputAddressPublic] = {
                    keyPair: input.addressKeyPair,
                    unlockIndex: unlockBlocks.length - 1
                };
            }
        }
        const transactionPayload = {
            type: TRANSACTION_PAYLOAD_TYPE,
            essence: transactionEssence,
            unlockBlocks
        };
        return transactionPayload;
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Send a transfer from the balance on the seed to a single output.
     * @param client The client or node endpoint to send the transfer with.
     * @param seed The seed to use for address generation.
     * @param accountIndex The account index in the wallet.
     * @param addressBech32 The address to send the funds to in bech32 format.
     * @param amount The amount to send.
     * @param indexation Optional indexation data to associate with the transaction.
     * @param indexation.key Indexation key.
     * @param indexation.data Optional index data.
     * @param addressOptions Optional address configuration for balance address lookups.
     * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
     * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
     * @returns The id of the message created and the contructed message.
     */
    async function send(client, seed, accountIndex, addressBech32, amount, indexation, addressOptions) {
        return sendMultiple(client, seed, accountIndex, [{ addressBech32, amount }], indexation, addressOptions);
    }
    /**
     * Send a transfer from the balance on the seed to a single output.
     * @param client The client or node endpoint to send the transfer with.
     * @param seed The seed to use for address generation.
     * @param accountIndex The account index in the wallet.
     * @param addressEd25519 The address to send the funds to in ed25519 format.
     * @param amount The amount to send.
     * @param indexation Optional indexation data to associate with the transaction.
     * @param indexation.key Indexation key.
     * @param indexation.data Optional index data.
     * @param addressOptions Optional address configuration for balance address lookups.
     * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
     * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
     * @returns The id of the message created and the contructed message.
     */
    async function sendEd25519(client, seed, accountIndex, addressEd25519, amount, indexation, addressOptions) {
        return sendMultipleEd25519(client, seed, accountIndex, [{ addressEd25519, amount }], indexation, addressOptions);
    }
    /**
     * Send a transfer from the balance on the seed to multiple outputs.
     * @param client The client or node endpoint to send the transfer with.
     * @param seed The seed to use for address generation.
     * @param accountIndex The account index in the wallet.
     * @param outputs The address to send the funds to in bech32 format and amounts.
     * @param indexation Optional indexation data to associate with the transaction.
     * @param indexation.key Indexation key.
     * @param indexation.data Optional index data.
     * @param addressOptions Optional address configuration for balance address lookups.
     * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
     * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
     * @returns The id of the message created and the contructed message.
     */
    async function sendMultiple(client, seed, accountIndex, outputs, indexation, addressOptions) {
        var _a;
        const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
        const nodeInfo = await localClient.info();
        const hexOutputs = outputs.map(output => {
            const bech32Details = Bech32Helper.fromBech32(output.addressBech32, nodeInfo.bech32HRP);
            if (!bech32Details) {
                throw new Error("Unable to decode bech32 address");
            }
            return {
                address: Converter.bytesToHex(bech32Details.addressBytes),
                addressType: bech32Details.addressType,
                amount: output.amount,
                isDustAllowance: output.isDustAllowance
            };
        });
        return sendWithAddressGenerator(client, seed, {
            accountIndex,
            addressIndex: (_a = addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.startIndex) !== null && _a !== void 0 ? _a : 0,
            isInternal: false
        }, generateBip44Address, hexOutputs, indexation, addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.zeroCount);
    }
    /**
     * Send a transfer from the balance on the seed.
     * @param client The client or node endpoint to send the transfer with.
     * @param seed The seed to use for address generation.
     * @param accountIndex The account index in the wallet.
     * @param outputs The outputs including address to send the funds to in ed25519 format and amount.
     * @param indexation Optional indexation data to associate with the transaction.
     * @param indexation.key Indexation key.
     * @param indexation.data Optional index data.
     * @param addressOptions Optional address configuration for balance address lookups.
     * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
     * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
     * @returns The id of the message created and the contructed message.
     */
    async function sendMultipleEd25519(client, seed, accountIndex, outputs, indexation, addressOptions) {
        var _a;
        const hexOutputs = outputs.map(output => ({
            address: output.addressEd25519,
            addressType: ED25519_ADDRESS_TYPE,
            amount: output.amount,
            isDustAllowance: output.isDustAllowance
        }));
        return sendWithAddressGenerator(client, seed, {
            accountIndex,
            addressIndex: (_a = addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.startIndex) !== null && _a !== void 0 ? _a : 0,
            isInternal: false
        }, generateBip44Address, hexOutputs, indexation, addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.zeroCount);
    }
    /**
     * Send a transfer using account based indexing for the inputs.
     * @param client The client or node endpoint to send the transfer with.
     * @param seed The seed to use for address generation.
     * @param initialAddressState The initial address state for calculating the addresses.
     * @param nextAddressPath Calculate the next address for inputs.
     * @param outputs The address to send the funds to in bech32 format and amounts.
     * @param indexation Optional indexation data to associate with the transaction.
     * @param indexation.key Indexation key.
     * @param indexation.data Optional index data.
     * @param zeroCount The number of addresses with 0 balance during lookup before aborting.
     * @returns The id of the message created and the contructed message.
     */
    async function sendWithAddressGenerator(client, seed, initialAddressState, nextAddressPath, outputs, indexation, zeroCount) {
        const inputsAndKeys = await calculateInputs(client, seed, initialAddressState, nextAddressPath, outputs, zeroCount);
        const response = await sendAdvanced(client, inputsAndKeys, outputs, indexation);
        return {
            messageId: response.messageId,
            message: response.message
        };
    }
    /**
     * Calculate the inputs from the seed and basePath.
     * @param client The client or node endpoint to calculate the inputs with.
     * @param seed The seed to use for address generation.
     * @param initialAddressState The initial address state for calculating the addresses.
     * @param nextAddressPath Calculate the next address for inputs.
     * @param outputs The outputs to send.
     * @param zeroCount Abort when the number of zero balances is exceeded.
     * @returns The id of the message created and the contructed message.
     */
    async function calculateInputs(client, seed, initialAddressState, nextAddressPath, outputs, zeroCount = 5) {
        const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
        let requiredBalance = 0;
        for (const output of outputs) {
            requiredBalance += output.amount;
        }
        let consumedBalance = 0;
        const inputsAndSignatureKeyPairs = [];
        let finished = false;
        let isFirst = true;
        let zeroBalance = 0;
        do {
            const path = nextAddressPath(initialAddressState, isFirst);
            isFirst = false;
            const addressSeed = seed.generateSeedFromPath(new Bip32Path(path));
            const addressKeyPair = addressSeed.keyPair();
            const ed25519Address = new Ed25519Address(addressKeyPair.publicKey);
            const address = Converter.bytesToHex(ed25519Address.toAddress());
            const addressOutputIds = await localClient.addressEd25519Outputs(address);
            if (addressOutputIds.count === 0) {
                zeroBalance++;
                if (zeroBalance >= zeroCount) {
                    finished = true;
                }
            }
            else {
                for (const addressOutputId of addressOutputIds.outputIds) {
                    const addressOutput = await localClient.output(addressOutputId);
                    if (!addressOutput.isSpent &&
                        consumedBalance < requiredBalance) {
                        if (addressOutput.output.amount === 0) {
                            zeroBalance++;
                            if (zeroBalance >= zeroCount) {
                                finished = true;
                            }
                        }
                        else {
                            consumedBalance += addressOutput.output.amount;
                            const input = {
                                type: UTXO_INPUT_TYPE,
                                transactionId: addressOutput.transactionId,
                                transactionOutputIndex: addressOutput.outputIndex
                            };
                            inputsAndSignatureKeyPairs.push({
                                input,
                                addressKeyPair
                            });
                            if (consumedBalance >= requiredBalance) {
                                // We didn't use all the balance from the last input
                                // so return the rest to the same address.
                                if (consumedBalance - requiredBalance > 0) {
                                    outputs.push({
                                        amount: consumedBalance - requiredBalance,
                                        address: addressOutput.output.address.address,
                                        addressType: addressOutput.output.address.type
                                    });
                                }
                                finished = true;
                            }
                        }
                    }
                }
            }
        } while (!finished);
        if (consumedBalance < requiredBalance) {
            throw new Error("There are not enough funds in the inputs for the required balance");
        }
        return inputsAndSignatureKeyPairs;
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Send a data message.
     * @param client The client or node endpoint to send the data with.
     * @param indexationKey The index name.
     * @param indexationData The index data as either UTF8 text or Uint8Array bytes.
     * @returns The id of the message created and the message.
     */
    async function sendData(client, indexationKey, indexationData) {
        const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
        if (!indexationKey) {
            throw new Error("indexationKey must not be empty");
        }
        const localIndexationKeyHex = typeof (indexationKey) === "string"
            ? Converter.utf8ToHex(indexationKey) : Converter.bytesToHex(indexationKey);
        if (localIndexationKeyHex.length / 2 < MIN_INDEXATION_KEY_LENGTH) {
            throw new Error(`The indexation key length is ${localIndexationKeyHex.length / 2}, which is below the minimum size of ${MIN_INDEXATION_KEY_LENGTH}`);
        }
        if (localIndexationKeyHex.length / 2 > MAX_INDEXATION_KEY_LENGTH) {
            throw new Error(`The indexation key length is ${localIndexationKeyHex.length / 2}, which exceeds the maximum size of ${MAX_INDEXATION_KEY_LENGTH}`);
        }
        const indexationPayload = {
            type: INDEXATION_PAYLOAD_TYPE,
            index: localIndexationKeyHex,
            data: indexationData ? (typeof indexationData === "string"
                ? Converter.utf8ToHex(indexationData) : Converter.bytesToHex(indexationData)) : undefined
        };
        const message = {
            payload: indexationPayload
        };
        const messageId = await localClient.messageSubmit(message);
        return {
            message,
            messageId
        };
    }

    // Copyright 2020 IOTA Stiftung
    // SPDX-License-Identifier: Apache-2.0
    /**
     * Reason for message conflicts.
     */
    // eslint-disable-next-line no-shadow
    exports.ConflictReason = void 0;
    (function (ConflictReason) {
        /**
         * The message has no conflict.
         */
        ConflictReason[ConflictReason["none"] = 0] = "none";
        /**
         * The referenced UTXO was already spent.
         */
        ConflictReason[ConflictReason["inputUTXOAlreadySpent"] = 1] = "inputUTXOAlreadySpent";
        /**
         * The referenced UTXO was already spent while confirming this milestone.
         */
        ConflictReason[ConflictReason["inputUTXOAlreadySpentInThisMilestone"] = 2] = "inputUTXOAlreadySpentInThisMilestone";
        /**
         * The referenced UTXO cannot be found.
         */
        ConflictReason[ConflictReason["inputUTXONotFound"] = 3] = "inputUTXONotFound";
        /**
         * The sum of the inputs and output values does not match.
         */
        ConflictReason[ConflictReason["inputOutputSumMismatch"] = 4] = "inputOutputSumMismatch";
        /**
         * The unlock block signature is invalid.
         */
        ConflictReason[ConflictReason["invalidSignature"] = 5] = "invalidSignature";
        /**
         * The dust allowance for the address is invalid.
         */
        ConflictReason[ConflictReason["invalidDustAllowance"] = 6] = "invalidDustAllowance";
        /**
         * The semantic validation failed.
         */
        ConflictReason[ConflictReason["semanticValidationFailed"] = 255] = "semanticValidationFailed";
    })(exports.ConflictReason || (exports.ConflictReason = {}));

    // Copyright 2020 IOTA Stiftung
    /**
     * Helper methods for POW.
     */
    class PowHelper {
        /**
         * Perform the score calculation.
         * @param message The data to perform the score on.
         * @returns The score for the data.
         */
        static score(message) {
            // the PoW digest is the hash of msg without the nonce
            const powRelevantData = message.slice(0, -8);
            const powDigest = Blake2b.sum256(powRelevantData);
            const nonce = BigIntHelper.read8(message, message.length - 8);
            const zeros = PowHelper.trailingZeros(powDigest, nonce);
            return Math.pow(3, zeros) / message.length;
        }
        /**
         * Calculate the number of zeros required to get target score.
         * @param message The message to process.
         * @param targetScore The target score.
         * @returns The number of zeros to find.
         */
        static calculateTargetZeros(message, targetScore) {
            return Math.ceil(Math.log(message.length * targetScore) / this.LN3);
        }
        /**
         * Calculate the trailing zeros.
         * @param powDigest The pow digest.
         * @param nonce The nonce.
         * @returns The trailing zeros.
         */
        static trailingZeros(powDigest, nonce) {
            const buf = new Int8Array(Curl.HASH_LENGTH);
            const digestTritsLen = B1T6.encode(buf, 0, powDigest);
            const biArr = new Uint8Array(8);
            BigIntHelper.write8(nonce, biArr, 0);
            B1T6.encode(buf, digestTritsLen, biArr);
            const curl = new Curl();
            curl.absorb(buf, 0, Curl.HASH_LENGTH);
            const hash = new Int8Array(Curl.HASH_LENGTH);
            curl.squeeze(hash, 0, Curl.HASH_LENGTH);
            return PowHelper.trinaryTrailingZeros(hash);
        }
        /**
         * Find the number of trailing zeros.
         * @param trits The trits to look for zeros.
         * @param endPos The end position to start looking for zeros.
         * @returns The number of trailing zeros.
         */
        static trinaryTrailingZeros(trits, endPos = trits.length) {
            let z = 0;
            for (let i = endPos - 1; i >= 0 && trits[i] === 0; i--) {
                z++;
            }
            return z;
        }
        /**
         * Perform the hash on the data until we reach target number of zeros.
         * @param powDigest The pow digest.
         * @param targetZeros The target number of zeros.
         * @param startIndex The index to start looking from.
         * @returns The nonce.
         */
        static performPow(powDigest, targetZeros, startIndex) {
            let nonce = BigInt(startIndex);
            let returnNonce;
            const buf = new Int8Array(Curl.HASH_LENGTH);
            const digestTritsLen = B1T6.encode(buf, 0, powDigest);
            const biArr = new Uint8Array(8);
            do {
                BigIntHelper.write8(nonce, biArr, 0);
                B1T6.encode(buf, digestTritsLen, biArr);
                const curlState = new Int8Array(Curl.STATE_LENGTH);
                curlState.set(buf, 0);
                Curl.transform(curlState, 81);
                if (PowHelper.trinaryTrailingZeros(curlState, Curl.HASH_LENGTH) >= targetZeros) {
                    returnNonce = nonce;
                }
                else {
                    nonce++;
                }
            } while (returnNonce === undefined);
            return returnNonce !== null && returnNonce !== void 0 ? returnNonce : BigInt(0);
        }
    }
    /**
     * LN3 Const see https://oeis.org/A002391.
     */
    PowHelper.LN3 = 1.098612288668109691395245236922525704647490557822749451734694333;

    // Copyright 2020 IOTA Stiftung
    /**
     * Local POW Provider.
     * WARNING - This is really slow.
     */
    class LocalPowProvider {
        /**
         * Perform pow on the message and return the nonce of at least targetScore.
         * @param message The message to process.
         * @param targetScore The target score.
         * @returns The nonce.
         */
        async pow(message, targetScore) {
            const powRelevantData = message.slice(0, -8);
            const powDigest = Blake2b.sum256(powRelevantData);
            const targetZeros = PowHelper.calculateTargetZeros(message, targetScore);
            return PowHelper.performPow(powDigest, targetZeros, BigInt(0));
        }
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Conflict reason strings.
     */
    const CONFLICT_REASON_STRINGS = {
        [exports.ConflictReason.none]: "Not conflicting",
        [exports.ConflictReason.inputUTXOAlreadySpent]: "The referenced UTXO was already spent",
        [exports.ConflictReason.inputUTXOAlreadySpentInThisMilestone]: "The referenced UTXO was already spent while confirming this milestone",
        [exports.ConflictReason.inputUTXONotFound]: "The referenced UTXO cannot be found",
        [exports.ConflictReason.inputOutputSumMismatch]: "The sum of the inputs and output values does not match",
        [exports.ConflictReason.invalidSignature]: "The unlock block signature is invalid",
        [exports.ConflictReason.invalidDustAllowance]: "The dust allowance for the address is invalid",
        [exports.ConflictReason.semanticValidationFailed]: "The semantic validation failed"
    };

    /**
     * The global type for the seed.
     */
    const ED25519_SEED_TYPE = 1;
    /**
     * Class to help with seeds.
     */
    class Ed25519Seed {
        /**
         * Create a new instance of Ed25519Seed.
         * @param secretKeyBytes The bytes.
         */
        constructor(secretKeyBytes) {
            this._secretKey = secretKeyBytes !== null && secretKeyBytes !== void 0 ? secretKeyBytes : new Uint8Array();
        }
        /**
         * Create the seed from a Bip39 mnemonic.
         * @param mnemonic The mnemonic to create the seed from.
         * @returns A new instance of Ed25519Seed.
         */
        static fromMnemonic(mnemonic) {
            return new Ed25519Seed(Bip39.mnemonicToSeed(mnemonic));
        }
        /**
         * Get the key pair from the seed.
         * @returns The key pair.
         */
        keyPair() {
            const signKeyPair = Ed25519.keyPairFromSeed(this._secretKey);
            return {
                publicKey: signKeyPair.publicKey,
                privateKey: signKeyPair.privateKey
            };
        }
        /**
         * Generate a new seed from the path.
         * @param path The path to generate the seed for.
         * @returns The generated seed.
         */
        generateSeedFromPath(path) {
            const keys = Slip0010.derivePath(this._secretKey, path);
            return new Ed25519Seed(keys.privateKey);
        }
        /**
         * Return the key as bytes.
         * @returns The key as bytes.
         */
        toBytes() {
            return this._secretKey;
        }
    }

    /**
     * The logger used by the log methods.
     * @param message The message to output.
     * @param data The data to output.
     * @returns Nothing.
     */
    let logger = (message, data) => (data !== undefined ? console.log(message, data) : console.log(message));
    /**
     * Set the logger for output.
     * @param log The logger.
     */
    function setLogger(log) {
        logger = log;
    }
    /**
     * Log the node information.
     * @param prefix The prefix for the output.
     * @param info The info to log.
     */
    function logInfo(prefix, info) {
        logger(`${prefix}\tName:`, info.name);
        logger(`${prefix}\tVersion:`, info.version);
        logger(`${prefix}\tNetwork Id:`, info.networkId);
        logger(`${prefix}\tIs Healthy:`, info.isHealthy);
        logger(`${prefix}\tMin PoW Score:`, info.minPoWScore);
        logger(`${prefix}\tBech32 HRP:`, info.bech32HRP);
        logger(`${prefix}\tLatest Milestone Index:`, info.latestMilestoneIndex);
        logger(`${prefix}\tLatest Milestone Timestamp:`, info.latestMilestoneTimestamp);
        logger(`${prefix}\tConfirmed Milestone Index:`, info.confirmedMilestoneIndex);
        logger(`${prefix}\tMessages Per Second:`, info.messagesPerSecond);
        logger(`${prefix}\tReferenced Messages Per Second:`, info.referencedMessagesPerSecond);
        logger(`${prefix}\tReferenced Rate:`, info.referencedRate);
        logger(`${prefix}\tPruning Index:`, info.pruningIndex);
        logger(`${prefix}\tFeatures:`, info.features);
    }
    /**
     * Log the tips information.
     * @param prefix The prefix for the output.
     * @param tipsResponse The tips to log.
     */
    function logTips(prefix, tipsResponse) {
        if (tipsResponse.tipMessageIds) {
            for (let i = 0; i < tipsResponse.tipMessageIds.length; i++) {
                logger(`${prefix}\tTip ${i + 1} Message Id:`, tipsResponse.tipMessageIds[i]);
            }
        }
    }
    /**
     * Log a message to the console.
     * @param prefix The prefix for the output.
     * @param message The message to log.
     */
    function logMessage(prefix, message) {
        logger(`${prefix}\tNetwork Id:`, message.networkId);
        if (message.parentMessageIds) {
            for (let i = 0; i < message.parentMessageIds.length; i++) {
                logger(`${prefix}\tParent ${i + 1} Message Id:`, message.parentMessageIds[i]);
            }
        }
        logPayload(`${prefix}\t`, message.payload);
        if (message.nonce !== undefined) {
            logger(`${prefix}\tNonce:`, message.nonce);
        }
    }
    /**
     * Log the message metadata to the console.
     * @param prefix The prefix for the output.
     * @param messageMetadata The messageMetadata to log.
     */
    function logMessageMetadata(prefix, messageMetadata) {
        logger(`${prefix}\tMessage Id:`, messageMetadata.messageId);
        if (messageMetadata.parentMessageIds) {
            for (let i = 0; i < messageMetadata.parentMessageIds.length; i++) {
                logger(`${prefix}\tParent ${i + 1} Message Id:`, messageMetadata.parentMessageIds[i]);
            }
        }
        if (messageMetadata.isSolid !== undefined) {
            logger(`${prefix}\tIs Solid:`, messageMetadata.isSolid);
        }
        if (messageMetadata.milestoneIndex !== undefined) {
            logger(`${prefix}\tMilestone Index:`, messageMetadata.milestoneIndex);
        }
        if (messageMetadata.referencedByMilestoneIndex !== undefined) {
            logger(`${prefix}\tReferenced By Milestone Index:`, messageMetadata.referencedByMilestoneIndex);
        }
        logger(`${prefix}\tLedger Inclusion State:`, messageMetadata.ledgerInclusionState);
        if (messageMetadata.conflictReason !== undefined) {
            logger(`${prefix}\tConflict Reason:`, messageMetadata.conflictReason);
        }
        if (messageMetadata.shouldPromote !== undefined) {
            logger(`${prefix}\tShould Promote:`, messageMetadata.shouldPromote);
        }
        if (messageMetadata.shouldReattach !== undefined) {
            logger(`${prefix}\tShould Reattach:`, messageMetadata.shouldReattach);
        }
    }
    /**
     * Log a message to the console.
     * @param prefix The prefix for the output.
     * @param unknownPayload The payload.
     */
    function logPayload(prefix, unknownPayload) {
        if (unknownPayload) {
            if (unknownPayload.type === TRANSACTION_PAYLOAD_TYPE) {
                logTransactionPayload(prefix, unknownPayload);
            }
            else if (unknownPayload.type === MILESTONE_PAYLOAD_TYPE) {
                logMilestonePayload(prefix, unknownPayload);
            }
            else if (unknownPayload.type === INDEXATION_PAYLOAD_TYPE) {
                logIndexationPayload(prefix, unknownPayload);
            }
            else if (unknownPayload.type === RECEIPT_PAYLOAD_TYPE) {
                logReceiptPayload(prefix, unknownPayload);
            }
            else if (unknownPayload.type === TREASURY_TRANSACTION_PAYLOAD_TYPE) {
                logTreasuryTransactionPayload(prefix, unknownPayload);
            }
        }
    }
    /**
     * Log a transaction payload to the console.
     * @param prefix The prefix for the output.
     * @param payload The payload.
     */
    function logTransactionPayload(prefix, payload) {
        if (payload) {
            logger(`${prefix}Transaction Payload`);
            if (payload.essence.type === TRANSACTION_ESSENCE_TYPE) {
                if (payload.essence.inputs) {
                    logger(`${prefix}\tInputs:`, payload.essence.inputs.length);
                    for (const input of payload.essence.inputs) {
                        logInput(`${prefix}\t\t`, input);
                    }
                }
                if (payload.essence.outputs) {
                    logger(`${prefix}\tOutputs:`, payload.essence.outputs.length);
                    for (const output of payload.essence.outputs) {
                        logOutput(`${prefix}\t\t`, output);
                    }
                }
            }
            if (payload.unlockBlocks) {
                logger(`${prefix}\tUnlock Blocks:`, payload.unlockBlocks.length);
                for (const unlockBlock of payload.unlockBlocks) {
                    logUnlockBlock(`${prefix}\t\t`, unlockBlock);
                }
            }
        }
    }
    /**
     * Log a indexation payload to the console.
     * @param prefix The prefix for the output.
     * @param payload The payload.
     */
    function logIndexationPayload(prefix, payload) {
        if (payload) {
            logger(`${prefix}Indexation Payload`);
            logger(`${prefix}\tIndex:`, Converter.hexToUtf8(payload.index));
            logger(`${prefix}\tData:`, payload.data ? Converter.hexToUtf8(payload.data) : "None");
        }
    }
    /**
     * Log a milestone payload to the console.
     * @param prefix The prefix for the output.
     * @param payload The payload.
     */
    function logMilestonePayload(prefix, payload) {
        if (payload) {
            logger(`${prefix}Milestone Payload`);
            logger(`${prefix}\tIndex:`, payload.index);
            logger(`${prefix}\tTimestamp:`, payload.timestamp);
            for (let i = 0; i < payload.parentMessageIds.length; i++) {
                logger(`${prefix}\tParent ${i + 1}:`, payload.parentMessageIds[i]);
            }
            logger(`${prefix}\tInclusion Merkle Proof:`, payload.inclusionMerkleProof);
            if (payload.nextPoWScore) {
                logger(`${prefix}\tNext PoW Score:`, payload.nextPoWScore);
            }
            if (payload.nextPoWScoreMilestoneIndex) {
                logger(`${prefix}\tNext PoW Score Milestone Index:`, payload.nextPoWScoreMilestoneIndex);
            }
            logger(`${prefix}\tPublic Keys:`, payload.publicKeys);
            logger(`${prefix}\tSignatures:`, payload.signatures);
            logReceiptPayload(`${prefix}\t`, payload.receipt);
        }
    }
    /**
     * Log a receipt payload to the console.
     * @param prefix The prefix for the output.
     * @param payload The payload.
     */
    function logReceiptPayload(prefix, payload) {
        if (payload) {
            logger(`${prefix}Receipt Payload`);
            logger(`${prefix}\tMigrated At:`, payload.migratedAt);
            logger(`${prefix}\tFinal:`, payload.final);
            logger(`${prefix}\tFunds:`, payload.funds.length);
            for (const funds of payload.funds) {
                logFunds(`${prefix}\t\t`, funds);
            }
            logTreasuryTransactionPayload(`${prefix}\t\t`, payload.transaction);
        }
    }
    /**
     * Log a treasury transaction payload to the console.
     * @param prefix The prefix for the output.
     * @param payload The payload.
     */
    function logTreasuryTransactionPayload(prefix, payload) {
        if (payload) {
            logger(`${prefix}Treasury Transaction Payload`);
            logInput(prefix, payload.input);
            logOutput(prefix, payload.output);
        }
    }
    /**
     * Log an address to the console.
     * @param prefix The prefix for the output.
     * @param unknownAddress The address to log.
     */
    function logAddress(prefix, unknownAddress) {
        if ((unknownAddress === null || unknownAddress === void 0 ? void 0 : unknownAddress.type) === ED25519_ADDRESS_TYPE) {
            const address = unknownAddress;
            logger(`${prefix}Ed25519 Address`);
            logger(`${prefix}\tAddress:`, address.address);
        }
    }
    /**
     * Log signature to the console.
     * @param prefix The prefix for the output.
     * @param unknownSignature The signature to log.
     */
    function logSignature(prefix, unknownSignature) {
        if ((unknownSignature === null || unknownSignature === void 0 ? void 0 : unknownSignature.type) === ED25519_SIGNATURE_TYPE) {
            const signature = unknownSignature;
            logger(`${prefix}Ed25519 Signature`);
            logger(`${prefix}\tPublic Key:`, signature.publicKey);
            logger(`${prefix}\tSignature:`, signature.signature);
        }
    }
    /**
     * Log input to the console.
     * @param prefix The prefix for the output.
     * @param unknownInput The input to log.
     */
    function logInput(prefix, unknownInput) {
        if (unknownInput) {
            if (unknownInput.type === UTXO_INPUT_TYPE) {
                const input = unknownInput;
                logger(`${prefix}UTXO Input`);
                logger(`${prefix}\tTransaction Id:`, input.transactionId);
                logger(`${prefix}\tTransaction Output Index:`, input.transactionOutputIndex);
            }
            else if (unknownInput.type === TREASURY_INPUT_TYPE) {
                const input = unknownInput;
                logger(`${prefix}Treasury Input`);
                logger(`${prefix}\tMilestone Hash:`, input.milestoneId);
            }
        }
    }
    /**
     * Log output to the console.
     * @param prefix The prefix for the output.
     * @param unknownOutput The output to log.
     */
    function logOutput(prefix, unknownOutput) {
        if (unknownOutput) {
            if (unknownOutput.type === SIG_LOCKED_SINGLE_OUTPUT_TYPE) {
                const output = unknownOutput;
                logger(`${prefix}Signature Locked Single Output`);
                logAddress(`${prefix}\t\t`, output.address);
                logger(`${prefix}\t\tAmount:`, output.amount);
            }
            else if (unknownOutput.type === SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
                const output = unknownOutput;
                logger(`${prefix}Signature Locked Dust Allowance Output`);
                logAddress(`${prefix}\t\t`, output.address);
                logger(`${prefix}\t\tAmount:`, output.amount);
            }
            else if (unknownOutput.type === TREASURY_OUTPUT_TYPE) {
                const output = unknownOutput;
                logger(`${prefix}Treasury Output`);
                logger(`${prefix}\t\tAmount:`, output.amount);
            }
        }
    }
    /**
     * Log unlock block to the console.
     * @param prefix The prefix for the output.
     * @param unknownUnlockBlock The unlock block to log.
     */
    function logUnlockBlock(prefix, unknownUnlockBlock) {
        if (unknownUnlockBlock) {
            if (unknownUnlockBlock.type === SIGNATURE_UNLOCK_BLOCK_TYPE) {
                const unlockBlock = unknownUnlockBlock;
                logger(`${prefix}\tSignature Unlock Block`);
                logSignature(`${prefix}\t\t`, unlockBlock.signature);
            }
            else if (unknownUnlockBlock.type === REFERENCE_UNLOCK_BLOCK_TYPE) {
                const unlockBlock = unknownUnlockBlock;
                logger(`${prefix}\tReference Unlock Block`);
                logger(`${prefix}\t\tReference:`, unlockBlock.reference);
            }
        }
    }
    /**
     * Log fund to the console.
     * @param prefix The prefix for the output.
     * @param fund The fund to log.
     */
    function logFunds(prefix, fund) {
        if (fund) {
            logger(`${prefix}\tFund`);
            logger(`${prefix}\t\tTail Transaction Hash:`, fund.tailTransactionHash);
            logAddress(`${prefix}\t\t`, fund.address);
            logger(`${prefix}\t\tDeposit:`, fund.deposit);
        }
    }

    // Copyright 2020 IOTA Stiftung
    /**
     * Keep track of the read index within a stream.
     */
    class ReadStream {
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

    /**
     * Class to help with units formatting.
     */
    class UnitsHelper {
        /**
         * Format the value in the best units.
         * @param value The value to format.
         * @param decimalPlaces The number of decimal places to display.
         * @returns The formated value.
         */
        static formatBest(value, decimalPlaces = 2) {
            return UnitsHelper.formatUnits(value, UnitsHelper.calculateBest(value), decimalPlaces);
        }
        /**
         * Format the value in the best units.
         * @param value The value to format.
         * @param unit The unit to format with.
         * @param decimalPlaces The number of decimal places to display.
         * @returns The formated value.
         */
        static formatUnits(value, unit, decimalPlaces = 2) {
            if (!UnitsHelper.UNIT_MAP[unit]) {
                throw new Error(`Unrecognized unit ${unit}`);
            }
            if (!value) {
                return `0 ${unit}`;
            }
            return unit === "i"
                ? `${value} i`
                : `${UnitsHelper.convertUnits(value, "i", unit).toFixed(decimalPlaces)} ${unit}`;
        }
        /**
         * Format the value in the best units.
         * @param value The value to format.
         * @returns The best units for the value.
         */
        static calculateBest(value) {
            let bestUnits = "i";
            if (!value) {
                return bestUnits;
            }
            const checkLength = Math.abs(value).toString().length;
            if (checkLength > UnitsHelper.UNIT_MAP.Pi.dp) {
                bestUnits = "Pi";
            }
            else if (checkLength > UnitsHelper.UNIT_MAP.Ti.dp) {
                bestUnits = "Ti";
            }
            else if (checkLength > UnitsHelper.UNIT_MAP.Gi.dp) {
                bestUnits = "Gi";
            }
            else if (checkLength > UnitsHelper.UNIT_MAP.Mi.dp) {
                bestUnits = "Mi";
            }
            else if (checkLength > UnitsHelper.UNIT_MAP.Ki.dp) {
                bestUnits = "Ki";
            }
            return bestUnits;
        }
        /**
         * Convert the value to different units.
         * @param value The value to convert.
         * @param fromUnit The form unit.
         * @param toUnit The to unit.
         * @returns The formatted unit.
         */
        static convertUnits(value, fromUnit, toUnit) {
            if (!value) {
                return 0;
            }
            if (!UnitsHelper.UNIT_MAP[fromUnit]) {
                throw new Error(`Unrecognized fromUnit ${fromUnit}`);
            }
            if (!UnitsHelper.UNIT_MAP[toUnit]) {
                throw new Error(`Unrecognized toUnit ${toUnit}`);
            }
            if (fromUnit === "i" && value % 1 !== 0) {
                throw new Error("If fromUnit is 'i' the value must be an integer value");
            }
            if (fromUnit === toUnit) {
                return Number(value);
            }
            const multiplier = value < 0 ? -1 : 1;
            const scaledValue = Math.abs(Number(value)) *
                UnitsHelper.UNIT_MAP[fromUnit].val /
                UnitsHelper.UNIT_MAP[toUnit].val;
            const numDecimals = UnitsHelper.UNIT_MAP[toUnit].dp;
            // We cant use toFixed to just convert the new value to a string with
            // fixed decimal places as it will round, which we don't want
            // instead we want to convert the value to a string and manually
            // truncate the number of digits after the decimal
            // Unfortunately large numbers end up in scientific notation with
            // the regular toString() so we use a custom conversion.
            let fixed = scaledValue.toString();
            if (fixed.includes("e")) {
                fixed = scaledValue.toFixed(Number.parseInt(fixed.split("-")[1], 10));
            }
            // Now we have the number as a full string we can split it into
            // whole and decimals parts
            const parts = fixed.split(".");
            if (parts.length === 1) {
                parts.push("0");
            }
            // Now truncate the decimals by the number allowed on the toUnit
            parts[1] = parts[1].slice(0, numDecimals);
            // Finally join the parts and convert back to a real number
            return Number.parseFloat(`${parts[0]}.${parts[1]}`) * multiplier;
        }
    }
    /**
     * Map units.
     */
    UnitsHelper.UNIT_MAP = {
        i: { val: 1, dp: 0 },
        Ki: { val: 1000, dp: 3 },
        Mi: { val: 1000000, dp: 6 },
        Gi: { val: 1000000000, dp: 9 },
        Ti: { val: 1000000000000, dp: 12 },
        Pi: { val: 1000000000000000, dp: 15 }
    };

    exports.ARRAY_LENGTH = ARRAY_LENGTH;
    exports.ArrayHelper = ArrayHelper;
    exports.B1T6 = B1T6;
    exports.BYTE_SIZE = BYTE_SIZE;
    exports.Base64 = Base64;
    exports.Bech32 = Bech32;
    exports.Bech32Helper = Bech32Helper;
    exports.BigIntHelper = BigIntHelper;
    exports.Bip32Path = Bip32Path;
    exports.Bip39 = Bip39;
    exports.Blake2b = Blake2b;
    exports.CONFLICT_REASON_STRINGS = CONFLICT_REASON_STRINGS;
    exports.ChaCha20 = ChaCha20;
    exports.ChaCha20Poly1305 = ChaCha20Poly1305;
    exports.ClientError = ClientError;
    exports.Converter = Converter;
    exports.Curl = Curl;
    exports.ED25519_ADDRESS_TYPE = ED25519_ADDRESS_TYPE;
    exports.ED25519_SEED_TYPE = ED25519_SEED_TYPE;
    exports.ED25519_SIGNATURE_TYPE = ED25519_SIGNATURE_TYPE;
    exports.Ed25519 = Ed25519;
    exports.Ed25519Address = Ed25519Address;
    exports.Ed25519Seed = Ed25519Seed;
    exports.HmacSha256 = HmacSha256;
    exports.HmacSha512 = HmacSha512;
    exports.INDEXATION_PAYLOAD_TYPE = INDEXATION_PAYLOAD_TYPE;
    exports.IOTA_BIP44_BASE_PATH = IOTA_BIP44_BASE_PATH;
    exports.LocalPowProvider = LocalPowProvider;
    exports.MAX_FUNDS_COUNT = MAX_FUNDS_COUNT;
    exports.MAX_INDEXATION_KEY_LENGTH = MAX_INDEXATION_KEY_LENGTH;
    exports.MAX_INPUT_COUNT = MAX_INPUT_COUNT;
    exports.MAX_MESSAGE_LENGTH = MAX_MESSAGE_LENGTH;
    exports.MAX_NUMBER_PARENTS = MAX_NUMBER_PARENTS;
    exports.MAX_OUTPUT_COUNT = MAX_OUTPUT_COUNT;
    exports.MERKLE_PROOF_LENGTH = MERKLE_PROOF_LENGTH;
    exports.MESSAGE_ID_LENGTH = MESSAGE_ID_LENGTH;
    exports.MILESTONE_PAYLOAD_TYPE = MILESTONE_PAYLOAD_TYPE;
    exports.MIN_ADDRESS_LENGTH = MIN_ADDRESS_LENGTH;
    exports.MIN_ED25519_ADDRESS_LENGTH = MIN_ED25519_ADDRESS_LENGTH;
    exports.MIN_ED25519_SIGNATURE_LENGTH = MIN_ED25519_SIGNATURE_LENGTH;
    exports.MIN_INDEXATION_KEY_LENGTH = MIN_INDEXATION_KEY_LENGTH;
    exports.MIN_INDEXATION_PAYLOAD_LENGTH = MIN_INDEXATION_PAYLOAD_LENGTH;
    exports.MIN_INPUT_COUNT = MIN_INPUT_COUNT;
    exports.MIN_INPUT_LENGTH = MIN_INPUT_LENGTH;
    exports.MIN_MIGRATED_FUNDS_LENGTH = MIN_MIGRATED_FUNDS_LENGTH;
    exports.MIN_MILESTONE_PAYLOAD_LENGTH = MIN_MILESTONE_PAYLOAD_LENGTH;
    exports.MIN_NUMBER_PARENTS = MIN_NUMBER_PARENTS;
    exports.MIN_OUTPUT_COUNT = MIN_OUTPUT_COUNT;
    exports.MIN_OUTPUT_LENGTH = MIN_OUTPUT_LENGTH;
    exports.MIN_PAYLOAD_LENGTH = MIN_PAYLOAD_LENGTH;
    exports.MIN_RECEIPT_PAYLOAD_LENGTH = MIN_RECEIPT_PAYLOAD_LENGTH;
    exports.MIN_REFERENCE_UNLOCK_BLOCK_LENGTH = MIN_REFERENCE_UNLOCK_BLOCK_LENGTH;
    exports.MIN_SIGNATURE_LENGTH = MIN_SIGNATURE_LENGTH;
    exports.MIN_SIGNATURE_UNLOCK_BLOCK_LENGTH = MIN_SIGNATURE_UNLOCK_BLOCK_LENGTH;
    exports.MIN_SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_LENGTH = MIN_SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_LENGTH;
    exports.MIN_SIG_LOCKED_SINGLE_OUTPUT_LENGTH = MIN_SIG_LOCKED_SINGLE_OUTPUT_LENGTH;
    exports.MIN_TRANSACTION_ESSENCE_LENGTH = MIN_TRANSACTION_ESSENCE_LENGTH;
    exports.MIN_TRANSACTION_PAYLOAD_LENGTH = MIN_TRANSACTION_PAYLOAD_LENGTH;
    exports.MIN_TREASURY_INPUT_LENGTH = MIN_TREASURY_INPUT_LENGTH;
    exports.MIN_TREASURY_OUTPUT_LENGTH = MIN_TREASURY_OUTPUT_LENGTH;
    exports.MIN_TREASURY_TRANSACTION_PAYLOAD_LENGTH = MIN_TREASURY_TRANSACTION_PAYLOAD_LENGTH;
    exports.MIN_UNLOCK_BLOCK_LENGTH = MIN_UNLOCK_BLOCK_LENGTH;
    exports.MIN_UTXO_INPUT_LENGTH = MIN_UTXO_INPUT_LENGTH;
    exports.Pbkdf2 = Pbkdf2;
    exports.Poly1305 = Poly1305;
    exports.PowHelper = PowHelper;
    exports.RECEIPT_PAYLOAD_TYPE = RECEIPT_PAYLOAD_TYPE;
    exports.REFERENCE_UNLOCK_BLOCK_TYPE = REFERENCE_UNLOCK_BLOCK_TYPE;
    exports.RandomHelper = RandomHelper;
    exports.ReadStream = ReadStream;
    exports.SIGNATURE_UNLOCK_BLOCK_TYPE = SIGNATURE_UNLOCK_BLOCK_TYPE;
    exports.SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE = SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE;
    exports.SIG_LOCKED_SINGLE_OUTPUT_TYPE = SIG_LOCKED_SINGLE_OUTPUT_TYPE;
    exports.SMALL_TYPE_LENGTH = SMALL_TYPE_LENGTH;
    exports.STRING_LENGTH = STRING_LENGTH;
    exports.Sha256 = Sha256;
    exports.Sha512 = Sha512;
    exports.SingleNodeClient = SingleNodeClient;
    exports.Slip0010 = Slip0010;
    exports.TAIL_HASH_LENGTH = TAIL_HASH_LENGTH;
    exports.TRANSACTION_ESSENCE_TYPE = TRANSACTION_ESSENCE_TYPE;
    exports.TRANSACTION_ID_LENGTH = TRANSACTION_ID_LENGTH;
    exports.TRANSACTION_PAYLOAD_TYPE = TRANSACTION_PAYLOAD_TYPE;
    exports.TREASURY_INPUT_TYPE = TREASURY_INPUT_TYPE;
    exports.TREASURY_OUTPUT_TYPE = TREASURY_OUTPUT_TYPE;
    exports.TREASURY_TRANSACTION_PAYLOAD_TYPE = TREASURY_TRANSACTION_PAYLOAD_TYPE;
    exports.TYPE_LENGTH = TYPE_LENGTH;
    exports.UINT16_SIZE = UINT16_SIZE;
    exports.UINT32_SIZE = UINT32_SIZE;
    exports.UINT64_SIZE = UINT64_SIZE;
    exports.UTXO_INPUT_TYPE = UTXO_INPUT_TYPE;
    exports.UnitsHelper = UnitsHelper;
    exports.WriteStream = WriteStream;
    exports.X25519 = X25519;
    exports.Zip215 = Zip215;
    exports.buildTransactionPayload = buildTransactionPayload;
    exports.calculateInputs = calculateInputs;
    exports.deserializeAddress = deserializeAddress;
    exports.deserializeEd25519Address = deserializeEd25519Address;
    exports.deserializeEd25519Signature = deserializeEd25519Signature;
    exports.deserializeFunds = deserializeFunds;
    exports.deserializeIndexationPayload = deserializeIndexationPayload;
    exports.deserializeInput = deserializeInput;
    exports.deserializeInputs = deserializeInputs;
    exports.deserializeMessage = deserializeMessage;
    exports.deserializeMigratedFunds = deserializeMigratedFunds;
    exports.deserializeMilestonePayload = deserializeMilestonePayload;
    exports.deserializeOutput = deserializeOutput;
    exports.deserializeOutputs = deserializeOutputs;
    exports.deserializePayload = deserializePayload;
    exports.deserializeReceiptPayload = deserializeReceiptPayload;
    exports.deserializeReferenceUnlockBlock = deserializeReferenceUnlockBlock;
    exports.deserializeSigLockedDustAllowanceOutput = deserializeSigLockedDustAllowanceOutput;
    exports.deserializeSigLockedSingleOutput = deserializeSigLockedSingleOutput;
    exports.deserializeSignature = deserializeSignature;
    exports.deserializeSignatureUnlockBlock = deserializeSignatureUnlockBlock;
    exports.deserializeTransactionEssence = deserializeTransactionEssence;
    exports.deserializeTransactionPayload = deserializeTransactionPayload;
    exports.deserializeTreasuryInput = deserializeTreasuryInput;
    exports.deserializeTreasuryOutput = deserializeTreasuryOutput;
    exports.deserializeTreasuryTransactionPayload = deserializeTreasuryTransactionPayload;
    exports.deserializeUTXOInput = deserializeUTXOInput;
    exports.deserializeUnlockBlock = deserializeUnlockBlock;
    exports.deserializeUnlockBlocks = deserializeUnlockBlocks;
    exports.generateBip44Address = generateBip44Address;
    exports.generateBip44Path = generateBip44Path;
    exports.getBalance = getBalance;
    exports.getUnspentAddress = getUnspentAddress;
    exports.getUnspentAddresses = getUnspentAddresses;
    exports.getUnspentAddressesWithAddressGenerator = getUnspentAddressesWithAddressGenerator;
    exports.logAddress = logAddress;
    exports.logFunds = logFunds;
    exports.logIndexationPayload = logIndexationPayload;
    exports.logInfo = logInfo;
    exports.logInput = logInput;
    exports.logMessage = logMessage;
    exports.logMessageMetadata = logMessageMetadata;
    exports.logMilestonePayload = logMilestonePayload;
    exports.logOutput = logOutput;
    exports.logPayload = logPayload;
    exports.logReceiptPayload = logReceiptPayload;
    exports.logSignature = logSignature;
    exports.logTips = logTips;
    exports.logTransactionPayload = logTransactionPayload;
    exports.logTreasuryTransactionPayload = logTreasuryTransactionPayload;
    exports.logUnlockBlock = logUnlockBlock;
    exports.promote = promote;
    exports.reattach = reattach;
    exports.retrieveData = retrieveData;
    exports.retry = retry;
    exports.send = send;
    exports.sendAdvanced = sendAdvanced;
    exports.sendData = sendData;
    exports.sendEd25519 = sendEd25519;
    exports.sendMultiple = sendMultiple;
    exports.sendMultipleEd25519 = sendMultipleEd25519;
    exports.sendWithAddressGenerator = sendWithAddressGenerator;
    exports.serializeAddress = serializeAddress;
    exports.serializeEd25519Address = serializeEd25519Address;
    exports.serializeEd25519Signature = serializeEd25519Signature;
    exports.serializeFunds = serializeFunds;
    exports.serializeIndexationPayload = serializeIndexationPayload;
    exports.serializeInput = serializeInput;
    exports.serializeInputs = serializeInputs;
    exports.serializeMessage = serializeMessage;
    exports.serializeMigratedFunds = serializeMigratedFunds;
    exports.serializeMilestonePayload = serializeMilestonePayload;
    exports.serializeOutput = serializeOutput;
    exports.serializeOutputs = serializeOutputs;
    exports.serializePayload = serializePayload;
    exports.serializeReceiptPayload = serializeReceiptPayload;
    exports.serializeReferenceUnlockBlock = serializeReferenceUnlockBlock;
    exports.serializeSigLockedDustAllowanceOutput = serializeSigLockedDustAllowanceOutput;
    exports.serializeSigLockedSingleOutput = serializeSigLockedSingleOutput;
    exports.serializeSignature = serializeSignature;
    exports.serializeSignatureUnlockBlock = serializeSignatureUnlockBlock;
    exports.serializeTransactionEssence = serializeTransactionEssence;
    exports.serializeTransactionPayload = serializeTransactionPayload;
    exports.serializeTreasuryInput = serializeTreasuryInput;
    exports.serializeTreasuryOutput = serializeTreasuryOutput;
    exports.serializeTreasuryTransactionPayload = serializeTreasuryTransactionPayload;
    exports.serializeUTXOInput = serializeUTXOInput;
    exports.serializeUnlockBlock = serializeUnlockBlock;
    exports.serializeUnlockBlocks = serializeUnlockBlocks;
    exports.setLogger = setLogger;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
