[@iota/iota.js](../README.md) / [crypto/bip39](../modules/crypto_bip39.md) / Bip39

# Class: Bip39

[crypto/bip39](../modules/crypto_bip39.md).Bip39

Implementation of Bip39 for mnemonic generation.

## Table of contents

### Constructors

- [constructor](crypto_bip39.bip39.md#constructor)

### Methods

- [entropyChecksumBits](crypto_bip39.bip39.md#entropychecksumbits)
- [entropyToMnemonic](crypto_bip39.bip39.md#entropytomnemonic)
- [mnemonicToEntropy](crypto_bip39.bip39.md#mnemonictoentropy)
- [mnemonicToSeed](crypto_bip39.bip39.md#mnemonictoseed)
- [randomMnemonic](crypto_bip39.bip39.md#randommnemonic)
- [setWordList](crypto_bip39.bip39.md#setwordlist)

## Constructors

### constructor

• **new Bip39**()

## Methods

### entropyChecksumBits

▸ `Static` **entropyChecksumBits**(`entropy`): `string`

Calculate the entropy checksum.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `entropy` | `Uint8Array` | The entropy to calculate the checksum for. |

#### Returns

`string`

The checksum.

___

### entropyToMnemonic

▸ `Static` **entropyToMnemonic**(`entropy`): `string`

Generate a mnemonic from the entropy.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `entropy` | `Uint8Array` | The entropy to generate. |

#### Returns

`string`

The mnemonic.

___

### mnemonicToEntropy

▸ `Static` **mnemonicToEntropy**(`mnemonic`): `Uint8Array`

Convert the mnemonic back to entropy.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mnemonic` | `string` | The mnemonic to convert. |

#### Returns

`Uint8Array`

The entropy.

___

### mnemonicToSeed

▸ `Static` **mnemonicToSeed**(`mnemonic`, `password?`, `iterations?`, `keyLength?`): `Uint8Array`

Convert a mnemonic to a seed.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `mnemonic` | `string` | `undefined` | The mnemonic to convert. |
| `password?` | `string` | `undefined` | The password to apply to the seed generation. |
| `iterations` | `number` | `2048` | The number of iterations to perform on the password function, defaults to 2048. |
| `keyLength` | `number` | `64` | The size of the key length to generate, defaults to 64. |

#### Returns

`Uint8Array`

The seed.

___

### randomMnemonic

▸ `Static` **randomMnemonic**(`length?`): `string`

Generate a random mnemonic.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `length` | `number` | `256` | The length of the mnemonic to generate, defaults to 256. |

#### Returns

`string`

The random mnemonic.

___

### setWordList

▸ `Static` **setWordList**(`wordlistData`, `joiningChar?`): `void`

Set the wordlist and joining character.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `wordlistData` | `string`[] | `undefined` | Array of words. |
| `joiningChar` | `string` | `" "` | The character to join the words with. |

#### Returns

`void`
