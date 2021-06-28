[@iota/iota.js](../README.md) / [Exports](../modules.md) / [encoding/b1t6](../modules/encoding_b1t6.md) / B1T6

# Class: B1T6

[encoding/b1t6](../modules/encoding_b1t6.md).B1T6

Class implements the b1t6 encoding encoding which uses a group of 6 trits to encode each byte.

## Table of contents

### Constructors

- [constructor](encoding_b1t6.b1t6.md#constructor)

### Methods

- [encode](encoding_b1t6.b1t6.md#encode)
- [encodedLen](encoding_b1t6.b1t6.md#encodedlen)

## Constructors

### constructor

• **new B1T6**()

## Methods

### encode

▸ `Static` **encode**(`dst`, `startIndex`, `src`): `number`

Encode a byte array into trits.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dst` | `Int8Array` | The destination array. |
| `startIndex` | `number` | The start index to write in the array. |
| `src` | `Uint8Array` | The source data. |

#### Returns

`number`

The length of the encode.

___

### encodedLen

▸ `Static` **encodedLen**(`data`): `number`

The encoded length of the data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data. |

#### Returns

`number`

The encoded length.
