[@iota/iota.js](../README.md) / [crypto/sha256](../modules/crypto_sha256.md) / Sha256

# Class: Sha256

[crypto/sha256](../modules/crypto_sha256.md).Sha256

Class to help with Sha256 scheme.
TypeScript conversion from https://github.com/emn178/js-sha256.

## Table of contents

### Constructors

- [constructor](crypto_sha256.sha256.md#constructor)

### Properties

- [SIZE\_224](crypto_sha256.sha256.md#size_224)
- [SIZE\_256](crypto_sha256.sha256.md#size_256)

### Methods

- [digest](crypto_sha256.sha256.md#digest)
- [update](crypto_sha256.sha256.md#update)
- [sum224](crypto_sha256.sha256.md#sum224)
- [sum256](crypto_sha256.sha256.md#sum256)

## Constructors

### constructor

• **new Sha256**(`bits?`)

Create a new instance of Sha256.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bits` | `number` | The number of bits. |

## Properties

### SIZE\_224

▪ `Static` `Readonly` **SIZE\_224**: `number` = `224`

Sha256 224.

___

### SIZE\_256

▪ `Static` `Readonly` **SIZE\_256**: `number` = `256`

Sha256 256.

## Methods

### digest

▸ **digest**(): `Uint8Array`

Get the digest.

#### Returns

`Uint8Array`

The digest.

___

### update

▸ **update**(`message`): [`Sha256`](crypto_sha256.sha256.md)

Update the hash with the data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Uint8Array` | The data to update the hash with. |

#### Returns

[`Sha256`](crypto_sha256.sha256.md)

The instance for chaining.

___

### sum224

▸ `Static` **sum224**(`data`): `Uint8Array`

Perform Sum 224 on the data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to operate on. |

#### Returns

`Uint8Array`

The sum 224 of the data.

___

### sum256

▸ `Static` **sum256**(`data`): `Uint8Array`

Perform Sum 256 on the data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to operate on. |

#### Returns

`Uint8Array`

The sum 256 of the data.
