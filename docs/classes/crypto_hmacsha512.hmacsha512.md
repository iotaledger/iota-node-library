[@iota/iota.js](../README.md) / [crypto/hmacSha512](../modules/crypto_hmacsha512.md) / HmacSha512

# Class: HmacSha512

[crypto/hmacSha512](../modules/crypto_hmacsha512.md).HmacSha512

Class to help with HmacSha512 scheme.
TypeScript conversion from https://github.com/emn178/js-sha512.

## Table of contents

### Constructors

- [constructor](crypto_hmacsha512.hmacsha512.md#constructor)

### Methods

- [digest](crypto_hmacsha512.hmacsha512.md#digest)
- [update](crypto_hmacsha512.hmacsha512.md#update)
- [sum512](crypto_hmacsha512.hmacsha512.md#sum512)

## Constructors

### constructor

• **new HmacSha512**(`key`, `bits?`)

Create a new instance of HmacSha512.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `Uint8Array` | `undefined` | The key for the hmac. |
| `bits` | `number` | `512` | The number of bits. |

## Methods

### digest

▸ **digest**(): `Uint8Array`

Get the digest.

#### Returns

`Uint8Array`

The digest.

___

### update

▸ **update**(`message`): [`HmacSha512`](crypto_hmacsha512.hmacsha512.md)

Update the hash with the data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Uint8Array` | The data to update the hash with. |

#### Returns

[`HmacSha512`](crypto_hmacsha512.hmacsha512.md)

The instance for chaining.

___

### sum512

▸ `Static` **sum512**(`key`, `data`): `Uint8Array`

Perform Sum 512 on the data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | The key for the hmac. |
| `data` | `Uint8Array` | The data to operate on. |

#### Returns

`Uint8Array`

The sum 512 of the data.
