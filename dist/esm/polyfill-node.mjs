"use strict";
// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
// Fetch
if (globalThis && !globalThis.fetch) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    globalThis.fetch = require("node-fetch");
}
