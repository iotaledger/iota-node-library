[@iota/iota.js](../README.md) / [Exports](../modules.md) / [utils/readStream](../modules/utils_readstream.md) / ReadStream

# Class: ReadStream

[utils/readStream](../modules/utils_readstream.md).ReadStream

Keep track of the read index within a stream.

## Table of contents

### Constructors

- [constructor](utils_readstream.readstream.md#constructor)

### Methods

- [getReadIndex](utils_readstream.readstream.md#getreadindex)
- [hasRemaining](utils_readstream.readstream.md#hasremaining)
- [length](utils_readstream.readstream.md#length)
- [readBoolean](utils_readstream.readstream.md#readboolean)
- [readByte](utils_readstream.readstream.md#readbyte)
- [readBytes](utils_readstream.readstream.md#readbytes)
- [readFixedHex](utils_readstream.readstream.md#readfixedhex)
- [readUInt16](utils_readstream.readstream.md#readuint16)
- [readUInt32](utils_readstream.readstream.md#readuint32)
- [readUInt64](utils_readstream.readstream.md#readuint64)
- [setReadIndex](utils_readstream.readstream.md#setreadindex)
- [unused](utils_readstream.readstream.md#unused)

## Constructors

### constructor

• **new ReadStream**(`storage`, `readStartIndex?`)

Create a new instance of ReadStream.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `storage` | `Uint8Array` | `undefined` | The data to access. |
| `readStartIndex` | `number` | 0 | The index to start the reading from. |

## Methods

### getReadIndex

▸ **getReadIndex**(): `number`

Get the current read index.

#### Returns

`number`

The current read index.

___

### hasRemaining

▸ **hasRemaining**(`remaining`): `boolean`

Does the storage have enough data remaining.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `remaining` | `number` | The amount of space needed. |

#### Returns

`boolean`

True if it has enough data.

___

### length

▸ **length**(): `number`

Get the length of the storage.

#### Returns

`number`

The storage length.

___

### readBoolean

▸ **readBoolean**(`name`, `moveIndex?`): `boolean`

Read a boolean from the stream.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | The name of the data we are trying to read. |
| `moveIndex` | `boolean` | true | Move the index pointer on. |

#### Returns

`boolean`

The value.

___

### readByte

▸ **readByte**(`name`, `moveIndex?`): `number`

Read a byte from the stream.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | The name of the data we are trying to read. |
| `moveIndex` | `boolean` | true | Move the index pointer on. |

#### Returns

`number`

The value.

___

### readBytes

▸ **readBytes**(`name`, `length`, `moveIndex?`): `Uint8Array`

Read an array of byte from the stream.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | The name of the data we are trying to read. |
| `length` | `number` | `undefined` | The length of the array to read. |
| `moveIndex` | `boolean` | true | Move the index pointer on. |

#### Returns

`Uint8Array`

The value.

___

### readFixedHex

▸ **readFixedHex**(`name`, `length`, `moveIndex?`): `string`

Read fixed length as hex.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | The name of the data we are trying to read. |
| `length` | `number` | `undefined` | The length of the data to read. |
| `moveIndex` | `boolean` | true | Move the index pointer on. |

#### Returns

`string`

The hex formatted data.

___

### readUInt16

▸ **readUInt16**(`name`, `moveIndex?`): `number`

Read a UInt16 from the stream.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | The name of the data we are trying to read. |
| `moveIndex` | `boolean` | true | Move the index pointer on. |

#### Returns

`number`

The value.

___

### readUInt32

▸ **readUInt32**(`name`, `moveIndex?`): `number`

Read a UInt32 from the stream.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | The name of the data we are trying to read. |
| `moveIndex` | `boolean` | true | Move the index pointer on. |

#### Returns

`number`

The value.

___

### readUInt64

▸ **readUInt64**(`name`, `moveIndex?`): `bigint`

Read a UInt64 from the stream.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | The name of the data we are trying to read. |
| `moveIndex` | `boolean` | true | Move the index pointer on. |

#### Returns

`bigint`

The value.

___

### setReadIndex

▸ **setReadIndex**(`readIndex`): `void`

Set the current read index.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readIndex` | `number` | The current read index. |

#### Returns

`void`

___

### unused

▸ **unused**(): `number`

How much unused data is there.

#### Returns

`number`

The amount of unused data.
