[@iota/iota.js](../README.md) / [Exports](../modules.md) / [utils/writeStream](../modules/utils_writestream.md) / WriteStream

# Class: WriteStream

[utils/writeStream](../modules/utils_writestream.md).WriteStream

Keep track of the write index within a stream.

## Table of contents

### Constructors

- [constructor](utils_writestream.writestream.md#constructor)

### Methods

- [finalBytes](utils_writestream.writestream.md#finalbytes)
- [finalHex](utils_writestream.writestream.md#finalhex)
- [getWriteIndex](utils_writestream.writestream.md#getwriteindex)
- [length](utils_writestream.writestream.md#length)
- [setWriteIndex](utils_writestream.writestream.md#setwriteindex)
- [unused](utils_writestream.writestream.md#unused)
- [writeBoolean](utils_writestream.writestream.md#writeboolean)
- [writeByte](utils_writestream.writestream.md#writebyte)
- [writeBytes](utils_writestream.writestream.md#writebytes)
- [writeFixedHex](utils_writestream.writestream.md#writefixedhex)
- [writeUInt16](utils_writestream.writestream.md#writeuint16)
- [writeUInt32](utils_writestream.writestream.md#writeuint32)
- [writeUInt64](utils_writestream.writestream.md#writeuint64)

## Constructors

### constructor

• **new WriteStream**()

Create a new instance of ReadStream.

## Methods

### finalBytes

▸ **finalBytes**(): `Uint8Array`

Get the final stream as bytes.

#### Returns

`Uint8Array`

The final stream.

___

### finalHex

▸ **finalHex**(): `string`

Get the final stream as hex.

#### Returns

`string`

The final stream as hex.

___

### getWriteIndex

▸ **getWriteIndex**(): `number`

Get the current write index.

#### Returns

`number`

The current write index.

___

### length

▸ **length**(): `number`

Get the length of the stream.

#### Returns

`number`

The stream length.

___

### setWriteIndex

▸ **setWriteIndex**(`writeIndex`): `void`

Set the current write index.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writeIndex` | `number` | The current write index. |

#### Returns

`void`

___

### unused

▸ **unused**(): `number`

How much unused data is there.

#### Returns

`number`

The amount of unused data.

___

### writeBoolean

▸ **writeBoolean**(`name`, `val`): `void`

Write a boolean to the stream.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the data we are trying to write. |
| `val` | `boolean` | The data to write. |

#### Returns

`void`

___

### writeByte

▸ **writeByte**(`name`, `val`): `void`

Write a byte to the stream.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the data we are trying to write. |
| `val` | `number` | The data to write. |

#### Returns

`void`

___

### writeBytes

▸ **writeBytes**(`name`, `length`, `val`): `void`

Write fixed length stream.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the data we are trying to write. |
| `length` | `number` | The length of the data to write. |
| `val` | `Uint8Array` | The data to write. |

#### Returns

`void`

___

### writeFixedHex

▸ **writeFixedHex**(`name`, `length`, `val`): `void`

Write fixed length stream.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the data we are trying to write. |
| `length` | `number` | The length of the data to write. |
| `val` | `string` | The data to write. |

#### Returns

`void`

___

### writeUInt16

▸ **writeUInt16**(`name`, `val`): `void`

Write a UInt16 to the stream.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the data we are trying to write. |
| `val` | `number` | The data to write. |

#### Returns

`void`

___

### writeUInt32

▸ **writeUInt32**(`name`, `val`): `void`

Write a UInt32 to the stream.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the data we are trying to write. |
| `val` | `number` | The data to write. |

#### Returns

`void`

___

### writeUInt64

▸ **writeUInt64**(`name`, `val`): `void`

Write a UInt64 to the stream.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the data we are trying to write. |
| `val` | `bigint` | The data to write. |

#### Returns

`void`
