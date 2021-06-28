[@iota/iota.js](../README.md) / [Exports](../modules.md) / [crypto/slip0010](../modules/crypto_slip0010.md) / Slip0010

# Class: Slip0010

[crypto/slip0010](../modules/crypto_slip0010.md).Slip0010

Class to help with slip0010 key derivation
https://github.com/satoshilabs/slips/blob/master/slip-0010.md.

## Table of contents

### Constructors

- [constructor](crypto_slip0010.slip0010.md#constructor)

### Methods

- [derivePath](crypto_slip0010.slip0010.md#derivepath)
- [getMasterKeyFromSeed](crypto_slip0010.slip0010.md#getmasterkeyfromseed)
- [getPublicKey](crypto_slip0010.slip0010.md#getpublickey)

## Constructors

### constructor

• **new Slip0010**()

## Methods

### derivePath

▸ `Static` **derivePath**(`seed`, `path`): `Object`

Derive a key from the path.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `seed` | `Uint8Array` | The seed. |
| `path` | [Bip32Path](crypto_bip32path.bip32path.md) | The path. |

#### Returns

`Object`

The key and chain code.

___

### getMasterKeyFromSeed

▸ `Static` **getMasterKeyFromSeed**(`seed`): `Object`

Get the master key from the seed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `seed` | `Uint8Array` | The seed to generate the master key from. |

#### Returns

`Object`

The key and chain code.

___

### getPublicKey

▸ `Static` **getPublicKey**(`privateKey`, `withZeroByte?`): `Uint8Array`

Get the public key from the private key.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `privateKey` | `Uint8Array` | `undefined` | The private key. |
| `withZeroByte` | `boolean` | true | Include a zero bute prefix. |

#### Returns

`Uint8Array`

The public key.
