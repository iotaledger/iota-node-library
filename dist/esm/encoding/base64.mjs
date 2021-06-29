// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
/**
 * Class to help with base64 Encoding/Decoding.
 * Sourced from https://github.com/beatgammit/base64-js.
 */
export class Base64 {
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
