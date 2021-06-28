[@iota/iota.js](../README.md) / binary/transaction

# Module: binary/transaction

## Table of contents

### Variables

- [MIN\_TRANSACTION\_ESSENCE\_LENGTH](binary_transaction.md#min_transaction_essence_length)

### Functions

- [deserializeTransactionEssence](binary_transaction.md#deserializetransactionessence)
- [serializeTransactionEssence](binary_transaction.md#serializetransactionessence)

## Variables

### MIN\_TRANSACTION\_ESSENCE\_LENGTH

• `Const` **MIN\_TRANSACTION\_ESSENCE\_LENGTH**: `number`

The minimum length of a transaction essence binary representation.

## Functions

### deserializeTransactionEssence

▸ **deserializeTransactionEssence**(`readStream`): [`ITransactionEssence`](../interfaces/models_itransactionessence.itransactionessence.md)

Deserialize the transaction essence from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [`ReadStream`](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[`ITransactionEssence`](../interfaces/models_itransactionessence.itransactionessence.md)

The deserialized object.

___

### serializeTransactionEssence

▸ **serializeTransactionEssence**(`writeStream`, `object`): `void`

Serialize the transaction essence to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [`WriteStream`](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [`ITransactionEssence`](../interfaces/models_itransactionessence.itransactionessence.md) | The object to serialize. |

#### Returns

`void`
