[@iota/iota.js](../README.md) / [utils/converter](../modules/utils_converter.md) / Converter

# Class: Converter

[utils/converter](../modules/utils_converter.md).Converter

Convert arrays to and from different formats.

## Table of contents

### Constructors

- [constructor](utils_converter.converter.md#constructor)

### Methods

- [base64ToBytes](utils_converter.converter.md#base64tobytes)
- [binaryToBytes](utils_converter.converter.md#binarytobytes)
- [bytesToBase64](utils_converter.converter.md#bytestobase64)
- [bytesToBinary](utils_converter.converter.md#bytestobinary)
- [bytesToHex](utils_converter.converter.md#bytestohex)
- [bytesToUtf8](utils_converter.converter.md#bytestoutf8)
- [hexToBytes](utils_converter.converter.md#hextobytes)
- [hexToUtf8](utils_converter.converter.md#hextoutf8)
- [isHex](utils_converter.converter.md#ishex)
- [utf8ToBytes](utils_converter.converter.md#utf8tobytes)
- [utf8ToHex](utils_converter.converter.md#utf8tohex)

## Constructors

### constructor

• **new Converter**()

## Methods

### base64ToBytes

▸ `Static` **base64ToBytes**(`base64`): `Uint8Array`

Convert a base64 string to bytes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `base64` | `string` | The base64 string. |

#### Returns

`Uint8Array`

The bytes.

___

### binaryToBytes

▸ `Static` **binaryToBytes**(`binary`): `Uint8Array`

Convert a binary string to bytes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `binary` | `string` | The binary string. |

#### Returns

`Uint8Array`

The bytes.

___

### bytesToBase64

▸ `Static` **bytesToBase64**(`bytes`): `string`

Convert bytes to base64 string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | The bytes to convert. |

#### Returns

`string`

A base64 string of the bytes.

___

### bytesToBinary

▸ `Static` **bytesToBinary**(`bytes`): `string`

Convert bytes to binary string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | The bytes to convert. |

#### Returns

`string`

A binary string of the bytes.

___

### bytesToHex

▸ `Static` **bytesToHex**(`array`, `startIndex?`, `length?`, `reverse?`): `string`

Encode a raw array to hex string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `array` | `ArrayLike`<`number`\> | The bytes to encode. |
| `startIndex?` | `number` | The index to start in the bytes. |
| `length?` | `number` | The length of bytes to read. |
| `reverse?` | `boolean` | Reverse the combine direction. |

#### Returns

`string`

The array formated as hex.

___

### bytesToUtf8

▸ `Static` **bytesToUtf8**(`array`, `startIndex?`, `length?`): `string`

Encode a raw array to UTF8 string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `array` | `ArrayLike`<`number`\> | The bytes to encode. |
| `startIndex?` | `number` | The index to start in the bytes. |
| `length?` | `number` | The length of bytes to read. |

#### Returns

`string`

The array formated as UTF8.

___

### hexToBytes

▸ `Static` **hexToBytes**(`hex`, `reverse?`): `Uint8Array`

Decode a hex string to raw array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex` | `string` | The hex to decode. |
| `reverse?` | `boolean` | Store the characters in reverse. |

#### Returns

`Uint8Array`

The array.

___

### hexToUtf8

▸ `Static` **hexToUtf8**(`hex`): `string`

Convert the hex text to text.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex` | `string` | The hex to convert. |

#### Returns

`string`

The UTF8 version of the bytes.

___

### isHex

▸ `Static` **isHex**(`value`): `boolean`

Is the data hex format.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to test. |

#### Returns

`boolean`

True if the string is hex.

___

### utf8ToBytes

▸ `Static` **utf8ToBytes**(`utf8`): `Uint8Array`

Convert a UTF8 string to raw array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `utf8` | `string` | The text to decode. |

#### Returns

`Uint8Array`

The array.

___

### utf8ToHex

▸ `Static` **utf8ToHex**(`utf8`): `string`

Convert the UTF8 to hex.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `utf8` | `string` | The text to convert. |

#### Returns

`string`

The hex version of the bytes.
