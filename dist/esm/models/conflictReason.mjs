// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/**
 * Reason for message conflicts.
 */
// eslint-disable-next-line no-shadow
export var ConflictReason;
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
})(ConflictReason || (ConflictReason = {}));
