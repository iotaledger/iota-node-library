[@iota/iota.js](../README.md) / binary/unlockBlock

# Module: binary/unlockBlock

## Table of contents

### Variables

- [MIN\_REFERENCE\_UNLOCK\_BLOCK\_LENGTH](binary_unlockblock.md#min_reference_unlock_block_length)
- [MIN\_SIGNATURE\_UNLOCK\_BLOCK\_LENGTH](binary_unlockblock.md#min_signature_unlock_block_length)
- [MIN\_UNLOCK\_BLOCK\_LENGTH](binary_unlockblock.md#min_unlock_block_length)

### Functions

- [deserializeReferenceUnlockBlock](binary_unlockblock.md#deserializereferenceunlockblock)
- [deserializeSignatureUnlockBlock](binary_unlockblock.md#deserializesignatureunlockblock)
- [deserializeUnlockBlock](binary_unlockblock.md#deserializeunlockblock)
- [deserializeUnlockBlocks](binary_unlockblock.md#deserializeunlockblocks)
- [serializeReferenceUnlockBlock](binary_unlockblock.md#serializereferenceunlockblock)
- [serializeSignatureUnlockBlock](binary_unlockblock.md#serializesignatureunlockblock)
- [serializeUnlockBlock](binary_unlockblock.md#serializeunlockblock)
- [serializeUnlockBlocks](binary_unlockblock.md#serializeunlockblocks)

## Variables

### MIN\_REFERENCE\_UNLOCK\_BLOCK\_LENGTH

• `Const` **MIN\_REFERENCE\_UNLOCK\_BLOCK\_LENGTH**: `number`

The minimum length of a reference unlock block binary representation.

___

### MIN\_SIGNATURE\_UNLOCK\_BLOCK\_LENGTH

• `Const` **MIN\_SIGNATURE\_UNLOCK\_BLOCK\_LENGTH**: `number`

The minimum length of a signature unlock block binary representation.

___

### MIN\_UNLOCK\_BLOCK\_LENGTH

• `Const` **MIN\_UNLOCK\_BLOCK\_LENGTH**: `number`

The minimum length of an unlock block binary representation.

## Functions

### deserializeReferenceUnlockBlock

▸ **deserializeReferenceUnlockBlock**(`readStream`): [`IReferenceUnlockBlock`](../interfaces/models_ireferenceunlockblock.ireferenceunlockblock.md)

Deserialize the reference unlock block from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [`ReadStream`](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[`IReferenceUnlockBlock`](../interfaces/models_ireferenceunlockblock.ireferenceunlockblock.md)

The deserialized object.

___

### deserializeSignatureUnlockBlock

▸ **deserializeSignatureUnlockBlock**(`readStream`): [`ISignatureUnlockBlock`](../interfaces/models_isignatureunlockblock.isignatureunlockblock.md)

Deserialize the signature unlock block from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [`ReadStream`](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[`ISignatureUnlockBlock`](../interfaces/models_isignatureunlockblock.isignatureunlockblock.md)

The deserialized object.

___

### deserializeUnlockBlock

▸ **deserializeUnlockBlock**(`readStream`): [`ISignatureUnlockBlock`](../interfaces/models_isignatureunlockblock.isignatureunlockblock.md) \| [`IReferenceUnlockBlock`](../interfaces/models_ireferenceunlockblock.ireferenceunlockblock.md)

Deserialize the unlock block from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [`ReadStream`](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[`ISignatureUnlockBlock`](../interfaces/models_isignatureunlockblock.isignatureunlockblock.md) \| [`IReferenceUnlockBlock`](../interfaces/models_ireferenceunlockblock.ireferenceunlockblock.md)

The deserialized object.

___

### deserializeUnlockBlocks

▸ **deserializeUnlockBlocks**(`readStream`): ([`ISignatureUnlockBlock`](../interfaces/models_isignatureunlockblock.isignatureunlockblock.md) \| [`IReferenceUnlockBlock`](../interfaces/models_ireferenceunlockblock.ireferenceunlockblock.md))[]

Deserialize the unlock blocks from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [`ReadStream`](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

([`ISignatureUnlockBlock`](../interfaces/models_isignatureunlockblock.isignatureunlockblock.md) \| [`IReferenceUnlockBlock`](../interfaces/models_ireferenceunlockblock.ireferenceunlockblock.md))[]

The deserialized object.

___

### serializeReferenceUnlockBlock

▸ **serializeReferenceUnlockBlock**(`writeStream`, `object`): `void`

Serialize the reference unlock block to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [`WriteStream`](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [`IReferenceUnlockBlock`](../interfaces/models_ireferenceunlockblock.ireferenceunlockblock.md) | The object to serialize. |

#### Returns

`void`

___

### serializeSignatureUnlockBlock

▸ **serializeSignatureUnlockBlock**(`writeStream`, `object`): `void`

Serialize the signature unlock block to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [`WriteStream`](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [`ISignatureUnlockBlock`](../interfaces/models_isignatureunlockblock.isignatureunlockblock.md) | The object to serialize. |

#### Returns

`void`

___

### serializeUnlockBlock

▸ **serializeUnlockBlock**(`writeStream`, `object`): `void`

Serialize the unlock block to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [`WriteStream`](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [`ISignatureUnlockBlock`](../interfaces/models_isignatureunlockblock.isignatureunlockblock.md) \| [`IReferenceUnlockBlock`](../interfaces/models_ireferenceunlockblock.ireferenceunlockblock.md) | The object to serialize. |

#### Returns

`void`

___

### serializeUnlockBlocks

▸ **serializeUnlockBlocks**(`writeStream`, `objects`): `void`

Serialize the unlock blocks to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [`WriteStream`](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `objects` | ([`ISignatureUnlockBlock`](../interfaces/models_isignatureunlockblock.isignatureunlockblock.md) \| [`IReferenceUnlockBlock`](../interfaces/models_ireferenceunlockblock.ireferenceunlockblock.md))[] | The objects to serialize. |

#### Returns

`void`
