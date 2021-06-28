[@iota/iota.js](../README.md) / [crypto/zip215](../modules/crypto_zip215.md) / Zip215

# Class: Zip215

[crypto/zip215](../modules/crypto_zip215.md).Zip215

Implementation of Zip215.

## Table of contents

### Constructors

- [constructor](crypto_zip215.zip215.md#constructor)

### Methods

- [verify](crypto_zip215.zip215.md#verify)

## Constructors

### constructor

• **new Zip215**()

## Methods

### verify

▸ `Static` **verify**(`publicKey`, `message`, `sig`): `boolean`

Verify reports whether sig is a valid signature of message by
publicKey, using precisely-specified validation criteria (ZIP 215) suitable
for use in consensus-critical contexts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `publicKey` | `Uint8Array` | The public key for the message. |
| `message` | `Uint8Array` | The message content to validate. |
| `sig` | `Uint8Array` | The signature to verify. |

#### Returns

`boolean`

True if the signature is valid.
