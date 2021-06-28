[@iota/iota.js](../README.md) / [Exports](../modules.md) / [models/ITransactionPayload](../modules/models_itransactionpayload.md) / ITransactionPayload

# Interface: ITransactionPayload

[models/ITransactionPayload](../modules/models_itransactionpayload.md).ITransactionPayload

Transaction payload.

## Hierarchy

- [ITypeBase](models_itypebase.itypebase.md)<``0``\>

  ↳ **ITransactionPayload**

## Table of contents

### Properties

- [essence](models_itransactionpayload.itransactionpayload.md#essence)
- [type](models_itransactionpayload.itransactionpayload.md#type)
- [unlockBlocks](models_itransactionpayload.itransactionpayload.md#unlockblocks)

## Properties

### essence

• **essence**: [ITransactionEssence](models_itransactionessence.itransactionessence.md)

The index name.

___

### type

• **type**: ``0``

The type of the object.

#### Inherited from

[ITypeBase](models_itypebase.itypebase.md).[type](models_itypebase.itypebase.md#type)

___

### unlockBlocks

• **unlockBlocks**: ([ISignatureUnlockBlock](models_isignatureunlockblock.isignatureunlockblock.md) \| [IReferenceUnlockBlock](models_ireferenceunlockblock.ireferenceunlockblock.md))[]

The unlock blocks.
