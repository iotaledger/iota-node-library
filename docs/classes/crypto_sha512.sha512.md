[@iota/iota.js](../README.md) / [Exports](../modules.md) / [crypto/sha512](../modules/crypto_sha512.md) / Sha512

# Class: Sha512

[crypto/sha512](../modules/crypto_sha512.md).Sha512

Class to help with Sha512 scheme
TypeScript conversion from https://github.com/emn178/js-sha512.

## Table of contents

### Constructors

- [constructor](crypto_sha512.sha512.md#constructor)

### Properties

- [SIZE\_224](crypto_sha512.sha512.md#size_224)
- [SIZE\_256](crypto_sha512.sha512.md#size_256)
- [SIZE\_384](crypto_sha512.sha512.md#size_384)
- [SIZE\_512](crypto_sha512.sha512.md#size_512)

### Methods

- [digest](crypto_sha512.sha512.md#digest)
- [update](crypto_sha512.sha512.md#update)
- [sum512](crypto_sha512.sha512.md#sum512)

## Constructors

### constructor

• **new Sha512**(`bits?`)

Create a new instance of Sha512.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bits` | `number` | The number of bits. |

## Properties

### SIZE\_224

▪ `Static` **SIZE\_224**: `number` = 224

Sha512 224.

___

### SIZE\_256

▪ `Static` **SIZE\_256**: `number` = 256

Sha512 256.

___

### SIZE\_384

▪ `Static` **SIZE\_384**: `number` = 384

Sha512 384.

___

### SIZE\_512

▪ `Static` **SIZE\_512**: `number` = 512

Sha512 512.

## Methods

### digest

▸ **digest**(): `Uint8Array`

Get the digest.

#### Returns

`Uint8Array`

The digest.

___

### update

▸ **update**(`message`): [Sha512](crypto_sha512.sha512.md)

Update the hash with the data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Uint8Array` | The data to update the hash with. |

#### Returns

[Sha512](crypto_sha512.sha512.md)

The instance for chaining.

___

### sum512

▸ `Static` **sum512**(`data`): `Uint8Array`

Perform Sum 512 on the data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to operate on. |

#### Returns

`Uint8Array`

The sum 512 of the data.
