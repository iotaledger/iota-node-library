[@iota/iota.js](../README.md) / [models/conflictReason](../modules/models_conflictreason.md) / ConflictReason

# Enumeration: ConflictReason

[models/conflictReason](../modules/models_conflictreason.md).ConflictReason

Reason for message conflicts.

## Table of contents

### Enumeration members

- [inputOutputSumMismatch](models_conflictreason.conflictreason.md#inputoutputsummismatch)
- [inputUTXOAlreadySpent](models_conflictreason.conflictreason.md#inpututxoalreadyspent)
- [inputUTXOAlreadySpentInThisMilestone](models_conflictreason.conflictreason.md#inpututxoalreadyspentinthismilestone)
- [inputUTXONotFound](models_conflictreason.conflictreason.md#inpututxonotfound)
- [invalidDustAllowance](models_conflictreason.conflictreason.md#invaliddustallowance)
- [invalidSignature](models_conflictreason.conflictreason.md#invalidsignature)
- [none](models_conflictreason.conflictreason.md#none)
- [semanticValidationFailed](models_conflictreason.conflictreason.md#semanticvalidationfailed)

## Enumeration members

### inputOutputSumMismatch

• **inputOutputSumMismatch** = `4`

The sum of the inputs and output values does not match.

___

### inputUTXOAlreadySpent

• **inputUTXOAlreadySpent** = `1`

The referenced UTXO was already spent.

___

### inputUTXOAlreadySpentInThisMilestone

• **inputUTXOAlreadySpentInThisMilestone** = `2`

The referenced UTXO was already spent while confirming this milestone.

___

### inputUTXONotFound

• **inputUTXONotFound** = `3`

The referenced UTXO cannot be found.

___

### invalidDustAllowance

• **invalidDustAllowance** = `6`

The dust allowance for the address is invalid.

___

### invalidSignature

• **invalidSignature** = `5`

The unlock block signature is invalid.

___

### none

• **none** = `0`

The message has no conflict.

___

### semanticValidationFailed

• **semanticValidationFailed** = `255`

The semantic validation failed.
