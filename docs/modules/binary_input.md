[@iota/iota.js](../README.md) / [Exports](../modules.md) / binary/input

# Module: binary/input

## Table of contents

### Variables

- [MAX\_INPUT\_COUNT](binary_input.md#max_input_count)
- [MIN\_INPUT\_COUNT](binary_input.md#min_input_count)
- [MIN\_INPUT\_LENGTH](binary_input.md#min_input_length)
- [MIN\_TREASURY\_INPUT\_LENGTH](binary_input.md#min_treasury_input_length)
- [MIN\_UTXO\_INPUT\_LENGTH](binary_input.md#min_utxo_input_length)

### Functions

- [deserializeInput](binary_input.md#deserializeinput)
- [deserializeInputs](binary_input.md#deserializeinputs)
- [deserializeTreasuryInput](binary_input.md#deserializetreasuryinput)
- [deserializeUTXOInput](binary_input.md#deserializeutxoinput)
- [serializeInput](binary_input.md#serializeinput)
- [serializeInputs](binary_input.md#serializeinputs)
- [serializeTreasuryInput](binary_input.md#serializetreasuryinput)
- [serializeUTXOInput](binary_input.md#serializeutxoinput)

## Variables

### MAX\_INPUT\_COUNT

• `Const` **MAX\_INPUT\_COUNT**: `number` = 127

The maximum number of inputs.

___

### MIN\_INPUT\_COUNT

• `Const` **MIN\_INPUT\_COUNT**: `number` = 1

The minimum number of inputs.

___

### MIN\_INPUT\_LENGTH

• `Const` **MIN\_INPUT\_LENGTH**: `number`

The minimum length of an input binary representation.

___

### MIN\_TREASURY\_INPUT\_LENGTH

• `Const` **MIN\_TREASURY\_INPUT\_LENGTH**: `number`

The minimum length of a treasury input binary representation.

___

### MIN\_UTXO\_INPUT\_LENGTH

• `Const` **MIN\_UTXO\_INPUT\_LENGTH**: `number`

The minimum length of a utxo input binary representation.

## Functions

### deserializeInput

▸ **deserializeInput**(`readStream`): [IUTXOInput](../interfaces/models_iutxoinput.iutxoinput.md) \| [ITreasuryInput](../interfaces/models_itreasuryinput.itreasuryinput.md)

Deserialize the input from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [ReadStream](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[IUTXOInput](../interfaces/models_iutxoinput.iutxoinput.md) \| [ITreasuryInput](../interfaces/models_itreasuryinput.itreasuryinput.md)

The deserialized object.

___

### deserializeInputs

▸ **deserializeInputs**(`readStream`): ([IUTXOInput](../interfaces/models_iutxoinput.iutxoinput.md) \| [ITreasuryInput](../interfaces/models_itreasuryinput.itreasuryinput.md))[]

Deserialize the inputs from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [ReadStream](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

([IUTXOInput](../interfaces/models_iutxoinput.iutxoinput.md) \| [ITreasuryInput](../interfaces/models_itreasuryinput.itreasuryinput.md))[]

The deserialized object.

___

### deserializeTreasuryInput

▸ **deserializeTreasuryInput**(`readStream`): [ITreasuryInput](../interfaces/models_itreasuryinput.itreasuryinput.md)

Deserialize the treasury input from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [ReadStream](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[ITreasuryInput](../interfaces/models_itreasuryinput.itreasuryinput.md)

The deserialized object.

___

### deserializeUTXOInput

▸ **deserializeUTXOInput**(`readStream`): [IUTXOInput](../interfaces/models_iutxoinput.iutxoinput.md)

Deserialize the utxo input from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [ReadStream](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[IUTXOInput](../interfaces/models_iutxoinput.iutxoinput.md)

The deserialized object.

___

### serializeInput

▸ **serializeInput**(`writeStream`, `object`): `void`

Serialize the input to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [WriteStream](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [IUTXOInput](../interfaces/models_iutxoinput.iutxoinput.md) \| [ITreasuryInput](../interfaces/models_itreasuryinput.itreasuryinput.md) | The object to serialize. |

#### Returns

`void`

___

### serializeInputs

▸ **serializeInputs**(`writeStream`, `objects`): `void`

Serialize the inputs to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [WriteStream](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `objects` | ([IUTXOInput](../interfaces/models_iutxoinput.iutxoinput.md) \| [ITreasuryInput](../interfaces/models_itreasuryinput.itreasuryinput.md))[] | The objects to serialize. |

#### Returns

`void`

___

### serializeTreasuryInput

▸ **serializeTreasuryInput**(`writeStream`, `object`): `void`

Serialize the treasury input to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [WriteStream](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [ITreasuryInput](../interfaces/models_itreasuryinput.itreasuryinput.md) | The object to serialize. |

#### Returns

`void`

___

### serializeUTXOInput

▸ **serializeUTXOInput**(`writeStream`, `object`): `void`

Serialize the utxo input to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [WriteStream](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [IUTXOInput](../interfaces/models_iutxoinput.iutxoinput.md) | The object to serialize. |

#### Returns

`void`
