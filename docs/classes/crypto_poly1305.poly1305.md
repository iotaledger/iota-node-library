[@iota/iota.js](../README.md) / [crypto/poly1305](../modules/crypto_poly1305.md) / Poly1305

# Class: Poly1305

[crypto/poly1305](../modules/crypto_poly1305.md).Poly1305

Implementation of Poly1305.

## Table of contents

### Constructors

- [constructor](crypto_poly1305.poly1305.md#constructor)

### Methods

- [digest](crypto_poly1305.poly1305.md#digest)
- [finish](crypto_poly1305.poly1305.md#finish)
- [update](crypto_poly1305.poly1305.md#update)

## Constructors

### constructor

• **new Poly1305**(`key`)

Create a new instance of Poly1305.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | The key. |

## Methods

### digest

▸ **digest**(): `Uint8Array`

Get the digest for the hash.

#### Returns

`Uint8Array`

The mac.

___

### finish

▸ **finish**(): `void`

Finished the mac.

#### Returns

`void`

___

### update

▸ **update**(`input`): [`Poly1305`](crypto_poly1305.poly1305.md)

Update the hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `Uint8Array` | The data to update with. |

#### Returns

[`Poly1305`](crypto_poly1305.poly1305.md)

Hasher instance.
