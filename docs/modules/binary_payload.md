[@iota/iota.js](../README.md) / [Exports](../modules.md) / binary/payload

# Module: binary/payload

## Table of contents

### Variables

- [MAX\_INDEXATION\_KEY\_LENGTH](binary_payload.md#max_indexation_key_length)
- [MIN\_INDEXATION\_KEY\_LENGTH](binary_payload.md#min_indexation_key_length)
- [MIN\_INDEXATION\_PAYLOAD\_LENGTH](binary_payload.md#min_indexation_payload_length)
- [MIN\_MILESTONE\_PAYLOAD\_LENGTH](binary_payload.md#min_milestone_payload_length)
- [MIN\_PAYLOAD\_LENGTH](binary_payload.md#min_payload_length)
- [MIN\_RECEIPT\_PAYLOAD\_LENGTH](binary_payload.md#min_receipt_payload_length)
- [MIN\_TRANSACTION\_PAYLOAD\_LENGTH](binary_payload.md#min_transaction_payload_length)
- [MIN\_TREASURY\_TRANSACTION\_PAYLOAD\_LENGTH](binary_payload.md#min_treasury_transaction_payload_length)

### Functions

- [deserializeIndexationPayload](binary_payload.md#deserializeindexationpayload)
- [deserializeMilestonePayload](binary_payload.md#deserializemilestonepayload)
- [deserializePayload](binary_payload.md#deserializepayload)
- [deserializeReceiptPayload](binary_payload.md#deserializereceiptpayload)
- [deserializeTransactionPayload](binary_payload.md#deserializetransactionpayload)
- [deserializeTreasuryTransactionPayload](binary_payload.md#deserializetreasurytransactionpayload)
- [serializeIndexationPayload](binary_payload.md#serializeindexationpayload)
- [serializeMilestonePayload](binary_payload.md#serializemilestonepayload)
- [serializePayload](binary_payload.md#serializepayload)
- [serializeReceiptPayload](binary_payload.md#serializereceiptpayload)
- [serializeTransactionPayload](binary_payload.md#serializetransactionpayload)
- [serializeTreasuryTransactionPayload](binary_payload.md#serializetreasurytransactionpayload)

## Variables

### MAX\_INDEXATION\_KEY\_LENGTH

• `Const` **MAX\_INDEXATION\_KEY\_LENGTH**: `number` = 64

The maximum length of a indexation key.

___

### MIN\_INDEXATION\_KEY\_LENGTH

• `Const` **MIN\_INDEXATION\_KEY\_LENGTH**: `number` = 1

The minimum length of a indexation key.

___

### MIN\_INDEXATION\_PAYLOAD\_LENGTH

• `Const` **MIN\_INDEXATION\_PAYLOAD\_LENGTH**: `number`

The minimum length of an indexation payload binary representation.

___

### MIN\_MILESTONE\_PAYLOAD\_LENGTH

• `Const` **MIN\_MILESTONE\_PAYLOAD\_LENGTH**: `number`

The minimum length of a milestone payload binary representation.

___

### MIN\_PAYLOAD\_LENGTH

• `Const` **MIN\_PAYLOAD\_LENGTH**: `number`

The minimum length of a payload binary representation.

___

### MIN\_RECEIPT\_PAYLOAD\_LENGTH

• `Const` **MIN\_RECEIPT\_PAYLOAD\_LENGTH**: `number`

The minimum length of a receipt payload binary representation.

___

### MIN\_TRANSACTION\_PAYLOAD\_LENGTH

• `Const` **MIN\_TRANSACTION\_PAYLOAD\_LENGTH**: `number`

The minimum length of a transaction payload binary representation.

___

### MIN\_TREASURY\_TRANSACTION\_PAYLOAD\_LENGTH

• `Const` **MIN\_TREASURY\_TRANSACTION\_PAYLOAD\_LENGTH**: `number`

The minimum length of a treasure transaction payload binary representation.

## Functions

### deserializeIndexationPayload

▸ **deserializeIndexationPayload**(`readStream`): [IIndexationPayload](../interfaces/models_iindexationpayload.iindexationpayload.md)

Deserialize the indexation payload from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [ReadStream](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[IIndexationPayload](../interfaces/models_iindexationpayload.iindexationpayload.md)

The deserialized object.

___

### deserializeMilestonePayload

▸ **deserializeMilestonePayload**(`readStream`): [IMilestonePayload](../interfaces/models_imilestonepayload.imilestonepayload.md)

Deserialize the milestone payload from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [ReadStream](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[IMilestonePayload](../interfaces/models_imilestonepayload.imilestonepayload.md)

The deserialized object.

___

### deserializePayload

▸ **deserializePayload**(`readStream`): [ITransactionPayload](../interfaces/models_itransactionpayload.itransactionpayload.md) \| [IMilestonePayload](../interfaces/models_imilestonepayload.imilestonepayload.md) \| [IIndexationPayload](../interfaces/models_iindexationpayload.iindexationpayload.md) \| [ITreasuryTransactionPayload](../interfaces/models_itreasurytransactionpayload.itreasurytransactionpayload.md) \| [IReceiptPayload](../interfaces/models_ireceiptpayload.ireceiptpayload.md) \| `undefined`

Deserialize the payload from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [ReadStream](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[ITransactionPayload](../interfaces/models_itransactionpayload.itransactionpayload.md) \| [IMilestonePayload](../interfaces/models_imilestonepayload.imilestonepayload.md) \| [IIndexationPayload](../interfaces/models_iindexationpayload.iindexationpayload.md) \| [ITreasuryTransactionPayload](../interfaces/models_itreasurytransactionpayload.itreasurytransactionpayload.md) \| [IReceiptPayload](../interfaces/models_ireceiptpayload.ireceiptpayload.md) \| `undefined`

The deserialized object.

___

### deserializeReceiptPayload

▸ **deserializeReceiptPayload**(`readStream`): [IReceiptPayload](../interfaces/models_ireceiptpayload.ireceiptpayload.md)

Deserialize the receipt payload from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [ReadStream](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[IReceiptPayload](../interfaces/models_ireceiptpayload.ireceiptpayload.md)

The deserialized object.

___

### deserializeTransactionPayload

▸ **deserializeTransactionPayload**(`readStream`): [ITransactionPayload](../interfaces/models_itransactionpayload.itransactionpayload.md)

Deserialize the transaction payload from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [ReadStream](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[ITransactionPayload](../interfaces/models_itransactionpayload.itransactionpayload.md)

The deserialized object.

___

### deserializeTreasuryTransactionPayload

▸ **deserializeTreasuryTransactionPayload**(`readStream`): [ITreasuryTransactionPayload](../interfaces/models_itreasurytransactionpayload.itreasurytransactionpayload.md)

Deserialize the treasury transaction payload from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [ReadStream](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[ITreasuryTransactionPayload](../interfaces/models_itreasurytransactionpayload.itreasurytransactionpayload.md)

The deserialized object.

___

### serializeIndexationPayload

▸ **serializeIndexationPayload**(`writeStream`, `object`): `void`

Serialize the indexation payload to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [WriteStream](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [IIndexationPayload](../interfaces/models_iindexationpayload.iindexationpayload.md) | The object to serialize. |

#### Returns

`void`

___

### serializeMilestonePayload

▸ **serializeMilestonePayload**(`writeStream`, `object`): `void`

Serialize the milestone payload to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [WriteStream](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [IMilestonePayload](../interfaces/models_imilestonepayload.imilestonepayload.md) | The object to serialize. |

#### Returns

`void`

___

### serializePayload

▸ **serializePayload**(`writeStream`, `object`): `void`

Serialize the payload essence to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [WriteStream](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [ITransactionPayload](../interfaces/models_itransactionpayload.itransactionpayload.md) \| [IMilestonePayload](../interfaces/models_imilestonepayload.imilestonepayload.md) \| [IIndexationPayload](../interfaces/models_iindexationpayload.iindexationpayload.md) \| [ITreasuryTransactionPayload](../interfaces/models_itreasurytransactionpayload.itreasurytransactionpayload.md) \| [IReceiptPayload](../interfaces/models_ireceiptpayload.ireceiptpayload.md) \| `undefined` | The object to serialize. |

#### Returns

`void`

___

### serializeReceiptPayload

▸ **serializeReceiptPayload**(`writeStream`, `object`): `void`

Serialize the receipt payload to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [WriteStream](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [IReceiptPayload](../interfaces/models_ireceiptpayload.ireceiptpayload.md) | The object to serialize. |

#### Returns

`void`

___

### serializeTransactionPayload

▸ **serializeTransactionPayload**(`writeStream`, `object`): `void`

Serialize the transaction payload to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [WriteStream](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [ITransactionPayload](../interfaces/models_itransactionpayload.itransactionpayload.md) | The object to serialize. |

#### Returns

`void`

___

### serializeTreasuryTransactionPayload

▸ **serializeTreasuryTransactionPayload**(`writeStream`, `object`): `void`

Serialize the treasury transaction payload to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [WriteStream](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [ITreasuryTransactionPayload](../interfaces/models_itreasurytransactionpayload.itreasurytransactionpayload.md) | The object to serialize. |

#### Returns

`void`
