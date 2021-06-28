[@iota/iota.js](../README.md) / [crypto/ed25519](../modules/crypto_ed25519.md) / Ed25519

# Class: Ed25519

[crypto/ed25519](../modules/crypto_ed25519.md).Ed25519

Implementation of Ed25519.

## Table of contents

### Constructors

- [constructor](crypto_ed25519.ed25519.md#constructor)

### Properties

- [PRIVATE\_KEY\_SIZE](crypto_ed25519.ed25519.md#private_key_size)
- [PUBLIC\_KEY\_SIZE](crypto_ed25519.ed25519.md#public_key_size)
- [SEED\_SIZE](crypto_ed25519.ed25519.md#seed_size)
- [SIGNATURE\_SIZE](crypto_ed25519.ed25519.md#signature_size)

### Methods

- [keyPairFromSeed](crypto_ed25519.ed25519.md#keypairfromseed)
- [privateKeyFromSeed](crypto_ed25519.ed25519.md#privatekeyfromseed)
- [publicKeyFromPrivateKey](crypto_ed25519.ed25519.md#publickeyfromprivatekey)
- [sign](crypto_ed25519.ed25519.md#sign)
- [verify](crypto_ed25519.ed25519.md#verify)

## Constructors

### constructor

• **new Ed25519**()

## Properties

### PRIVATE\_KEY\_SIZE

▪ `Static` **PRIVATE\_KEY\_SIZE**: `number` = `64`

PrivateKeySize is the size, in bytes, of private keys as used in this package.

___

### PUBLIC\_KEY\_SIZE

▪ `Static` **PUBLIC\_KEY\_SIZE**: `number` = `32`

PublicKeySize is the size, in bytes, of public keys as used in this package.

___

### SEED\_SIZE

▪ `Static` **SEED\_SIZE**: `number` = `32`

SeedSize is the size, in bytes, of private key seeds. These are the private key representations used by RFC 8032.

___

### SIGNATURE\_SIZE

▪ `Static` **SIGNATURE\_SIZE**: `number` = `64`

SignatureSize is the size, in bytes, of signatures generated and verified by this package.

## Methods

### keyPairFromSeed

▸ `Static` **keyPairFromSeed**(`seed`): `Object`

Generate the key pair from the seed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `seed` | `Uint8Array` | The seed to generate the key pair for. |

#### Returns

`Object`

The key pair.

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Uint8Array` | The public key generated from the seed. |
| `publicKey` | `Uint8Array` | The private key generated from the seed. |

___

### privateKeyFromSeed

▸ `Static` **privateKeyFromSeed**(`seed`): `Uint8Array`

Calculates a private key from a seed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `seed` | `Uint8Array` | The seed to generate the private key from. |

#### Returns

`Uint8Array`

The private key.

___

### publicKeyFromPrivateKey

▸ `Static` **publicKeyFromPrivateKey**(`privateKey`): `Uint8Array`

Public returns the PublicKey corresponding to priv.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Uint8Array` | The private key to get the corresponding public key. |

#### Returns

`Uint8Array`

The public key.

___

### sign

▸ `Static` **sign**(`privateKey`, `message`): `Uint8Array`

Sign the message with privateKey and returns a signature.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Uint8Array` | The private key. |
| `message` | `Uint8Array` | The message to sign. |

#### Returns

`Uint8Array`

The signature.

___

### verify

▸ `Static` **verify**(`publicKey`, `message`, `sig`): `boolean`

Verify reports whether sig is a valid signature of message by publicKey.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `publicKey` | `Uint8Array` | The public key to verify the signature. |
| `message` | `Uint8Array` | The message for the signature. |
| `sig` | `Uint8Array` | The signature. |

#### Returns

`boolean`

True if the signature matches.
