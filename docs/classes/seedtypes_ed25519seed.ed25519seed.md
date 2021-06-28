[@iota/iota.js](../README.md) / [seedTypes/ed25519Seed](../modules/seedtypes_ed25519seed.md) / Ed25519Seed

# Class: Ed25519Seed

[seedTypes/ed25519Seed](../modules/seedtypes_ed25519seed.md).Ed25519Seed

Class to help with seeds.

## Implements

- [`ISeed`](../interfaces/models_iseed.iseed.md)

## Table of contents

### Constructors

- [constructor](seedtypes_ed25519seed.ed25519seed.md#constructor)

### Methods

- [generateSeedFromPath](seedtypes_ed25519seed.ed25519seed.md#generateseedfrompath)
- [keyPair](seedtypes_ed25519seed.ed25519seed.md#keypair)
- [toBytes](seedtypes_ed25519seed.ed25519seed.md#tobytes)
- [fromMnemonic](seedtypes_ed25519seed.ed25519seed.md#frommnemonic)

## Constructors

### constructor

• **new Ed25519Seed**(`secretKeyBytes?`)

Create a new instance of Ed25519Seed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `secretKeyBytes?` | `Uint8Array` | The bytes. |

## Methods

### generateSeedFromPath

▸ **generateSeedFromPath**(`path`): [`ISeed`](../interfaces/models_iseed.iseed.md)

Generate a new seed from the path.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | [`Bip32Path`](crypto_bip32path.bip32path.md) | The path to generate the seed for. |

#### Returns

[`ISeed`](../interfaces/models_iseed.iseed.md)

The generated seed.

#### Implementation of

[ISeed](../interfaces/models_iseed.iseed.md).[generateSeedFromPath](../interfaces/models_iseed.iseed.md#generateseedfrompath)

___

### keyPair

▸ **keyPair**(): [`IKeyPair`](../interfaces/models_ikeypair.ikeypair.md)

Get the key pair from the seed.

#### Returns

[`IKeyPair`](../interfaces/models_ikeypair.ikeypair.md)

The key pair.

#### Implementation of

[ISeed](../interfaces/models_iseed.iseed.md).[keyPair](../interfaces/models_iseed.iseed.md#keypair)

___

### toBytes

▸ **toBytes**(): `Uint8Array`

Return the key as bytes.

#### Returns

`Uint8Array`

The key as bytes.

#### Implementation of

[ISeed](../interfaces/models_iseed.iseed.md).[toBytes](../interfaces/models_iseed.iseed.md#tobytes)

___

### fromMnemonic

▸ `Static` **fromMnemonic**(`mnemonic`): [`Ed25519Seed`](seedtypes_ed25519seed.ed25519seed.md)

Create the seed from a Bip39 mnemonic.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mnemonic` | `string` | The mnemonic to create the seed from. |

#### Returns

[`Ed25519Seed`](seedtypes_ed25519seed.ed25519seed.md)

A new instance of Ed25519Seed.
