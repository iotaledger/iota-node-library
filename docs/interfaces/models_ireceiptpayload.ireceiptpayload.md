[@iota/iota.js](../README.md) / [models/IReceiptPayload](../modules/models_ireceiptpayload.md) / IReceiptPayload

# Interface: IReceiptPayload

[models/IReceiptPayload](../modules/models_ireceiptpayload.md).IReceiptPayload

Receipt payload.

## Hierarchy

- [`ITypeBase`](models_itypebase.itypebase.md)<``3``\>

  ↳ **`IReceiptPayload`**

## Table of contents

### Properties

- [final](models_ireceiptpayload.ireceiptpayload.md#final)
- [funds](models_ireceiptpayload.ireceiptpayload.md#funds)
- [migratedAt](models_ireceiptpayload.ireceiptpayload.md#migratedat)
- [transaction](models_ireceiptpayload.ireceiptpayload.md#transaction)
- [type](models_ireceiptpayload.ireceiptpayload.md#type)

## Properties

### final

• **final**: `boolean`

Whether this Receipt is the final one for a given migrated at index.

___

### funds

• **funds**: [`IMigratedFunds`](models_imigratedfunds.imigratedfunds.md)[]

The index data.

___

### migratedAt

• **migratedAt**: `number`

The milestone index at which the funds were migrated in the legacy network.

___

### transaction

• **transaction**: [`ITreasuryTransactionPayload`](models_itreasurytransactionpayload.itreasurytransactionpayload.md)

The TreasuryTransaction used to fund the funds.

___

### type

• **type**: ``3``

The type of the object.

#### Inherited from

[ITypeBase](models_itypebase.itypebase.md).[type](models_itypebase.itypebase.md#type)
