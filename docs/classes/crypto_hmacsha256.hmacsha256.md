[@iota/iota.js](../README.md) / [Exports](../modules.md) / [crypto/hmacSha256](../modules/crypto_hmacsha256.md) / HmacSha256

# Class: HmacSha256

[crypto/hmacSha256](../modules/crypto_hmacsha256.md).HmacSha256

Class to help with HmacSha256 scheme.
TypeScript conversion from https://github.com/emn178/js-sha256.

## Table of contents

### Constructors

- [constructor](crypto_hmacsha256.hmacsha256.md#constructor)

### Methods

- [digest](crypto_hmacsha256.hmacsha256.md#digest)
- [update](crypto_hmacsha256.hmacsha256.md#update)
- [sum256](crypto_hmacsha256.hmacsha256.md#sum256)

## Constructors

### constructor

• **new HmacSha256**(`key`, `bits?`)

Create a new instance of HmacSha256.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `Uint8Array` | `undefined` | The key for the hmac. |
| `bits` | `number` | 256 | The number of bits. |

## Methods

### digest

▸ **digest**(): `Uint8Array`

Get the digest.

#### Returns

`Uint8Array`

The digest.

___

### update

▸ **update**(`message`): [HmacSha256](crypto_hmacsha256.hmacsha256.md)

Update the hash with the data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Uint8Array` | The data to update the hash with. |

#### Returns

[HmacSha256](crypto_hmacsha256.hmacsha256.md)

The instance for chaining.

___

### sum256

▸ `Static` **sum256**(`key`, `data`): `Uint8Array`

Perform Sum 256 on the data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | The key for the hmac. |
| `data` | `Uint8Array` | The data to operate on. |

#### Returns

`Uint8Array`

The sum 256 of the data.
