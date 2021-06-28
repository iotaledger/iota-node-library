// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

// BigInt
if (globalThis && !globalThis.BigInt) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    globalThis.BigInt = require("big-integer");
}
