// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import type { IEd25519Address } from "./IEd25519Address";
import type { ITypeBase } from "./ITypeBase";

/**
 * The global type for the sig locked single output.
 */
export const SIG_LOCKED_SINGLE_OUTPUT_TYPE = 0;

/**
 * Signature locked single output.
 */
export interface ISigLockedSingleOutput extends ITypeBase<0> {
    /**
     * The address.
     */
    address: IEd25519Address;

    /**
     * The amount of the output.
     */
    amount: number;
}
