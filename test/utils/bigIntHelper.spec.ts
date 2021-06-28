// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import "../../src/utils/randomHelper-node";
import { BigIntHelper } from "../../src/utils/bigIntHelper";

describe("BigIntHelper", () => {
    test("Can store and retrieve from a buffer", () => {
        for (let i = 0; i < 1000; i++) {
            const rand = BigIntHelper.random();

            const buf = new Uint8Array(8);
            BigIntHelper.write8(rand, buf, 0);

            const val = BigIntHelper.read8(buf, 0);
            expect(val).toEqual(rand);
        }
    });
});
