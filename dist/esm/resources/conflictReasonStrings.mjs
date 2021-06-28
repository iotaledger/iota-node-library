// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { ConflictReason } from "../models/conflictReason";
/**
 * Conflict reason strings.
 */
export const CONFLICT_REASON_STRINGS = {
    [ConflictReason.none]: "Not conflicting",
    [ConflictReason.inputUTXOAlreadySpent]: "The referenced UTXO was already spent",
    [ConflictReason.inputUTXOAlreadySpentInThisMilestone]: "The referenced UTXO was already spent while confirming this milestone",
    [ConflictReason.inputUTXONotFound]: "The referenced UTXO cannot be found",
    [ConflictReason.inputOutputSumMismatch]: "The sum of the inputs and output values does not match",
    [ConflictReason.invalidSignature]: "The unlock block signature is invalid",
    [ConflictReason.invalidDustAllowance]: "The dust allowance for the address is invalid",
    [ConflictReason.semanticValidationFailed]: "The semantic validation failed"
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmxpY3RSZWFzb25TdHJpbmdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc291cmNlcy9jb25mbGljdFJlYXNvblN0cmluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLHNDQUFzQztBQUN0QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFMUQ7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBd0M7SUFDeEUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsaUJBQWlCO0lBQ3hDLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLEVBQUUsdUNBQXVDO0lBQy9FLENBQUMsY0FBYyxDQUFDLG9DQUFvQyxDQUFDLEVBQ2pELHVFQUF1RTtJQUMzRSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLHFDQUFxQztJQUN6RSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLHdEQUF3RDtJQUNqRyxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLHVDQUF1QztJQUMxRSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLCtDQUErQztJQUN0RixDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLGdDQUFnQztDQUM5RSxDQUFDIn0=