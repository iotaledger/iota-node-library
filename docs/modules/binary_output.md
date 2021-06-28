[@iota/iota.js](../README.md) / binary/output

# Module: binary/output

## Table of contents

### Variables

- [MAX\_OUTPUT\_COUNT](binary_output.md#max_output_count)
- [MIN\_OUTPUT\_COUNT](binary_output.md#min_output_count)
- [MIN\_OUTPUT\_LENGTH](binary_output.md#min_output_length)
- [MIN\_SIG\_LOCKED\_DUST\_ALLOWANCE\_OUTPUT\_LENGTH](binary_output.md#min_sig_locked_dust_allowance_output_length)
- [MIN\_SIG\_LOCKED\_SINGLE\_OUTPUT\_LENGTH](binary_output.md#min_sig_locked_single_output_length)
- [MIN\_TREASURY\_OUTPUT\_LENGTH](binary_output.md#min_treasury_output_length)

### Functions

- [deserializeOutput](binary_output.md#deserializeoutput)
- [deserializeOutputs](binary_output.md#deserializeoutputs)
- [deserializeSigLockedDustAllowanceOutput](binary_output.md#deserializesiglockeddustallowanceoutput)
- [deserializeSigLockedSingleOutput](binary_output.md#deserializesiglockedsingleoutput)
- [deserializeTreasuryOutput](binary_output.md#deserializetreasuryoutput)
- [serializeOutput](binary_output.md#serializeoutput)
- [serializeOutputs](binary_output.md#serializeoutputs)
- [serializeSigLockedDustAllowanceOutput](binary_output.md#serializesiglockeddustallowanceoutput)
- [serializeSigLockedSingleOutput](binary_output.md#serializesiglockedsingleoutput)
- [serializeTreasuryOutput](binary_output.md#serializetreasuryoutput)

## Variables

### MAX\_OUTPUT\_COUNT

• `Const` **MAX\_OUTPUT\_COUNT**: `number` = `127`

The maximum number of outputs.

___

### MIN\_OUTPUT\_COUNT

• `Const` **MIN\_OUTPUT\_COUNT**: `number` = `1`

The minimum number of outputs.

___

### MIN\_OUTPUT\_LENGTH

• `Const` **MIN\_OUTPUT\_LENGTH**: `number`

The minimum length of an output binary representation.

___

### MIN\_SIG\_LOCKED\_DUST\_ALLOWANCE\_OUTPUT\_LENGTH

• `Const` **MIN\_SIG\_LOCKED\_DUST\_ALLOWANCE\_OUTPUT\_LENGTH**: `number`

The minimum length of a sig locked dust allowance output binary representation.

___

### MIN\_SIG\_LOCKED\_SINGLE\_OUTPUT\_LENGTH

• `Const` **MIN\_SIG\_LOCKED\_SINGLE\_OUTPUT\_LENGTH**: `number`

The minimum length of a sig locked single output binary representation.

___

### MIN\_TREASURY\_OUTPUT\_LENGTH

• `Const` **MIN\_TREASURY\_OUTPUT\_LENGTH**: `number`

The minimum length of a treasury output binary representation.

## Functions

### deserializeOutput

▸ **deserializeOutput**(`readStream`): [`ISigLockedSingleOutput`](../interfaces/models_isiglockedsingleoutput.isiglockedsingleoutput.md) \| [`ISigLockedDustAllowanceOutput`](../interfaces/models_isiglockeddustallowanceoutput.isiglockeddustallowanceoutput.md) \| [`ITreasuryOutput`](../interfaces/models_itreasuryoutput.itreasuryoutput.md)

Deserialize the output from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [`ReadStream`](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[`ISigLockedSingleOutput`](../interfaces/models_isiglockedsingleoutput.isiglockedsingleoutput.md) \| [`ISigLockedDustAllowanceOutput`](../interfaces/models_isiglockeddustallowanceoutput.isiglockeddustallowanceoutput.md) \| [`ITreasuryOutput`](../interfaces/models_itreasuryoutput.itreasuryoutput.md)

The deserialized object.

___

### deserializeOutputs

▸ **deserializeOutputs**(`readStream`): ([`ISigLockedSingleOutput`](../interfaces/models_isiglockedsingleoutput.isiglockedsingleoutput.md) \| [`ISigLockedDustAllowanceOutput`](../interfaces/models_isiglockeddustallowanceoutput.isiglockeddustallowanceoutput.md) \| [`ITreasuryOutput`](../interfaces/models_itreasuryoutput.itreasuryoutput.md))[]

Deserialize the outputs from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [`ReadStream`](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

([`ISigLockedSingleOutput`](../interfaces/models_isiglockedsingleoutput.isiglockedsingleoutput.md) \| [`ISigLockedDustAllowanceOutput`](../interfaces/models_isiglockeddustallowanceoutput.isiglockeddustallowanceoutput.md) \| [`ITreasuryOutput`](../interfaces/models_itreasuryoutput.itreasuryoutput.md))[]

The deserialized object.

___

### deserializeSigLockedDustAllowanceOutput

▸ **deserializeSigLockedDustAllowanceOutput**(`readStream`): [`ISigLockedDustAllowanceOutput`](../interfaces/models_isiglockeddustallowanceoutput.isiglockeddustallowanceoutput.md)

Deserialize the signature locked dust allowance output from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [`ReadStream`](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[`ISigLockedDustAllowanceOutput`](../interfaces/models_isiglockeddustallowanceoutput.isiglockeddustallowanceoutput.md)

The deserialized object.

___

### deserializeSigLockedSingleOutput

▸ **deserializeSigLockedSingleOutput**(`readStream`): [`ISigLockedSingleOutput`](../interfaces/models_isiglockedsingleoutput.isiglockedsingleoutput.md)

Deserialize the signature locked single output from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [`ReadStream`](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[`ISigLockedSingleOutput`](../interfaces/models_isiglockedsingleoutput.isiglockedsingleoutput.md)

The deserialized object.

___

### deserializeTreasuryOutput

▸ **deserializeTreasuryOutput**(`readStream`): [`ITreasuryOutput`](../interfaces/models_itreasuryoutput.itreasuryoutput.md)

Deserialize the treasury output from binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readStream` | [`ReadStream`](../classes/utils_readstream.readstream.md) | The stream to read the data from. |

#### Returns

[`ITreasuryOutput`](../interfaces/models_itreasuryoutput.itreasuryoutput.md)

The deserialized object.

___

### serializeOutput

▸ **serializeOutput**(`writeStream`, `object`): `void`

Serialize the output to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [`WriteStream`](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [`ITypeBase`](../interfaces/models_itypebase.itypebase.md)<`number`\> | The object to serialize. |

#### Returns

`void`

___

### serializeOutputs

▸ **serializeOutputs**(`writeStream`, `objects`): `void`

Serialize the outputs to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [`WriteStream`](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `objects` | ([`ISigLockedSingleOutput`](../interfaces/models_isiglockedsingleoutput.isiglockedsingleoutput.md) \| [`ISigLockedDustAllowanceOutput`](../interfaces/models_isiglockeddustallowanceoutput.isiglockeddustallowanceoutput.md) \| [`ITreasuryOutput`](../interfaces/models_itreasuryoutput.itreasuryoutput.md))[] | The objects to serialize. |

#### Returns

`void`

___

### serializeSigLockedDustAllowanceOutput

▸ **serializeSigLockedDustAllowanceOutput**(`writeStream`, `object`): `void`

Serialize the signature locked dust allowance output to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [`WriteStream`](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [`ISigLockedDustAllowanceOutput`](../interfaces/models_isiglockeddustallowanceoutput.isiglockeddustallowanceoutput.md) | The object to serialize. |

#### Returns

`void`

___

### serializeSigLockedSingleOutput

▸ **serializeSigLockedSingleOutput**(`writeStream`, `object`): `void`

Serialize the signature locked single output to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [`WriteStream`](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [`ISigLockedSingleOutput`](../interfaces/models_isiglockedsingleoutput.isiglockedsingleoutput.md) | The object to serialize. |

#### Returns

`void`

___

### serializeTreasuryOutput

▸ **serializeTreasuryOutput**(`writeStream`, `object`): `void`

Serialize the treasury output to binary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeStream` | [`WriteStream`](../classes/utils_writestream.writestream.md) | The stream to write the data to. |
| `object` | [`ITreasuryOutput`](../interfaces/models_itreasuryoutput.itreasuryoutput.md) | The object to serialize. |

#### Returns

`void`
