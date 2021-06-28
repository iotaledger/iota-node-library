// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { RandomHelper } from "./randomHelper";

/**
 * Generate a new random array.
 * @param length The length of buffer to create.
 * @returns The random array.
 */
 RandomHelper.generate = (length: number) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
    const crypto = require("crypto");
    return crypto.randomBytes(length) as Uint8Array;
};
