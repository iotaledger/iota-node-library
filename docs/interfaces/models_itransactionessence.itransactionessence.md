[@iota/iota.js](../README.md) / [Exports](../modules.md) / [models/ITransactionEssence](../modules/models_itransactionessence.md) / ITransactionEssence

# Interface: ITransactionEssence

[models/ITransactionEssence](../modules/models_itransactionessence.md).ITransactionEssence

Transaction payload.

## Hierarchy

- [ITypeBase](models_itypebase.itypebase.md)<``0``\>

  ↳ **ITransactionEssence**

## Table of contents

### Properties

- [inputs](models_itransactionessence.itransactionessence.md#inputs)
- [outputs](models_itransactionessence.itransactionessence.md#outputs)
- [payload](models_itransactionessence.itransactionessence.md#payload)
- [type](models_itransactionessence.itransactionessence.md#type)

## Properties

### inputs

• **inputs**: [IUTXOInput](models_iutxoinput.iutxoinput.md)[]

The inputs of the transaction.

___

### outputs

• **outputs**: ([ISigLockedSingleOutput](models_isiglockedsingleoutput.isiglockedsingleoutput.md) \| [ISigLockedDustAllowanceOutput](models_isiglockeddustallowanceoutput.isiglockeddustallowanceoutput.md))[]

The outputs of the transaction.

___

### payload

• `Optional` **payload**: [IIndexationPayload](models_iindexationpayload.iindexationpayload.md)

Indexation payload.

___

### type

• **type**: ``0``

The type of the object.

#### Inherited from

[ITypeBase](models_itypebase.itypebase.md).[type](models_itypebase.itypebase.md#type)
