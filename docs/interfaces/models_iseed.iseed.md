[@iota/iota.js](../README.md) / [Exports](../modules.md) / [models/ISeed](../modules/models_iseed.md) / ISeed

# Interface: ISeed

[models/ISeed](../modules/models_iseed.md).ISeed

Interface definitions for seed.

## Implemented by

- [Ed25519Seed](../classes/seedtypes_ed25519seed.ed25519seed.md)

## Table of contents

### Methods

- [generateSeedFromPath](models_iseed.iseed.md#generateseedfrompath)
- [keyPair](models_iseed.iseed.md#keypair)
- [toBytes](models_iseed.iseed.md#tobytes)
- [toString](models_iseed.iseed.md#tostring)

## Methods

### generateSeedFromPath

▸ **generateSeedFromPath**(`path`): [ISeed](models_iseed.iseed.md)

Generate a new seed from the path.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | [Bip32Path](../classes/crypto_bip32path.bip32path.md) | The path to generate the seed for. |

#### Returns

[ISeed](models_iseed.iseed.md)

The generated seed.

___

### keyPair

▸ **keyPair**(): [IKeyPair](models_ikeypair.ikeypair.md)

Get the key pair from the seed.

#### Returns

[IKeyPair](models_ikeypair.ikeypair.md)

The key pair.

___

### toBytes

▸ **toBytes**(): `Uint8Array`

Return the key as bytes.

#### Returns

`Uint8Array`

The key as bytes.

___

### toString

▸ **toString**(): `string`

Return the key as string.

#### Returns

`string`

The key as string.
