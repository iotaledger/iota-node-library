[@iota/iota.js](../README.md) / [encoding/base64](../modules/encoding_base64.md) / Base64

# Class: Base64

[encoding/base64](../modules/encoding_base64.md).Base64

Class to help with base64 Encoding/Decoding.
Sourced from https://github.com/beatgammit/base64-js.

## Table of contents

### Constructors

- [constructor](encoding_base64.base64.md#constructor)

### Methods

- [byteLength](encoding_base64.base64.md#bytelength)
- [decode](encoding_base64.base64.md#decode)
- [encode](encoding_base64.base64.md#encode)

## Constructors

### constructor

• **new Base64**()

## Methods

### byteLength

▸ `Static` **byteLength**(`base64`): `number`

Get the byte length of the data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `base64` | `string` | The base64 string. |

#### Returns

`number`

The bytle length of the data.

___

### decode

▸ `Static` **decode**(`base64`): `Uint8Array`

Convert the base 64 string to a byte array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `base64` | `string` | The base64 string to convert. |

#### Returns

`Uint8Array`

The byte array.

___

### encode

▸ `Static` **encode**(`bytes`): `string`

Convert a byte array to base 64.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | The byte array to convert. |

#### Returns

`string`

The data as bas64 string.
