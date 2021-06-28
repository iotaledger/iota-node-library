// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { RandomHelper } from "./randomHelper";

/**
 * Generate a new random array.
 * @param length The length of buffer to create.
 * @returns The random array.
 */
RandomHelper.generate = (length: number) => {
    const randomBytes = new Uint8Array(length);
    window.crypto.getRandomValues(randomBytes);
    return randomBytes;
};
