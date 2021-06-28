[@iota/iota.js](../README.md) / [Exports](../modules.md) / [models/IAddress](../modules/models_iaddress.md) / IAddress

# Interface: IAddress

[models/IAddress](../modules/models_iaddress.md).IAddress

Interface defining address.

## Implemented by

- [Ed25519Address](../classes/addresstypes_ed25519address.ed25519address.md)

## Table of contents

### Methods

- [toAddress](models_iaddress.iaddress.md#toaddress)
- [verify](models_iaddress.iaddress.md#verify)

## Methods

### toAddress

▸ **toAddress**(): `Uint8Array`

Convert the public key to an address.

#### Returns

`Uint8Array`

The address.

___

### verify

▸ **verify**(`publicKey`, `address`): `boolean`

Use the public key to validate the address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `publicKey` | `Uint8Array` | - |
| `address` | `Uint8Array` | The address to verify. |

#### Returns

`boolean`

True if the data and address is verified.
