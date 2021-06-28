[@iota/iota.js](../README.md) / [crypto/x25519](../modules/crypto_x25519.md) / X25519

# Class: X25519

[crypto/x25519](../modules/crypto_x25519.md).X25519

Implementation of X25519.

## Table of contents

### Constructors

- [constructor](crypto_x25519.x25519.md#constructor)

### Methods

- [convertPrivateKeyToX25519](crypto_x25519.x25519.md#convertprivatekeytox25519)
- [convertPublicKeyToX25519](crypto_x25519.x25519.md#convertpublickeytox25519)

## Constructors

### constructor

• **new X25519**()

## Methods

### convertPrivateKeyToX25519

▸ `Static` **convertPrivateKeyToX25519**(`ed25519PrivateKey`): `Uint8Array`

Convert Ed25519 private key to X25519 private key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ed25519PrivateKey` | `Uint8Array` | The ed25519 private key to convert. |

#### Returns

`Uint8Array`

The x25519 private key.

___

### convertPublicKeyToX25519

▸ `Static` **convertPublicKeyToX25519**(`ed25519PublicKey`): `Uint8Array`

Convert Ed25519 public key to X25519 public key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ed25519PublicKey` | `Uint8Array` | The ed25519 public key to convert. |

#### Returns

`Uint8Array`

The x25519 public key.
