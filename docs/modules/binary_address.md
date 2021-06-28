[@iota/iota.js](../README.md) / [Exports](../modules.md) / binary/address

# Module: binary/address

## Table of contents

### Variables

- [MIN\_ADDRESS\_LENGTH](binary_address.md#min_address_length)
- [MIN\_ED25519\_ADDRESS\_LENGTH](binary_address.md#min_ed25519_address_length)

### Functions

- [deserializeAddress](binary_address.md#deserializeaddress)
- [deserializeEd25519Address](binary_address.md#deserializeed25519address)
- [serializeAddress](binary_address.md#serializeaddress)
- [serializeEd25519Address](binary_address.md#serializeed25519address)

## Variables

### MIN\_ADDRESS\_LENGTH

• `Const` **MIN\_ADDRESS\_LENGTH**: `number`

The minimum length of an address binary representation.

___

### MIN\_ED25519\_ADDRESS\_LENGTH

• `Const` **MIN\_ED25519\_ADDRESS\_LENGTH**: `number`

The minimum length of an ed25519 address binary representation.

## Functions

### deserializeAddress

▸ **deserializeAddress**(`readStream`): [IEd25519Address](../interfaces/models_ied25519address.ied25519address.md)

Deserialize the address from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [ReadStream](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[IEd25519Address](../interfaces/models_ied25519address.ied25519address.md)

The deserialized object.

___

### deserializeEd25519Address

▸ **deserializeEd25519Address**(`readStream`): [IEd25519Address](../interfaces/models_ied25519address.ied25519address.md)

Deserialize the Ed25519 address from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [ReadStream](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[IEd25519Address](../interfaces/models_ied25519address.ied25519address.md)

The deserialized object.

___

### serializeAddress

▸ **serializeAddress**(`writeStream`, `object`): `void`

Serialize the address to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [WriteStream](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [IEd25519Address](../interfaces/models_ied25519address.ied25519address.md) | The object to serialize. |

#### Returns

`void`

___

### serializeEd25519Address

▸ **serializeEd25519Address**(`writeStream`, `object`): `void`

Serialize the ed25519 address to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [WriteStream](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [IEd25519Address](../interfaces/models_ied25519address.ied25519address.md) | The object to serialize. |

#### Returns

`void`
