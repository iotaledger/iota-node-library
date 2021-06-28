[@iota/iota.js](../README.md) / [Exports](../modules.md) / [pow/localPowProvider](../modules/pow_localpowprovider.md) / LocalPowProvider

# Class: LocalPowProvider

[pow/localPowProvider](../modules/pow_localpowprovider.md).LocalPowProvider

Local POW Provider.
WARNING - This is really slow.

## Implements

- [IPowProvider](../interfaces/models_ipowprovider.ipowprovider.md)

## Table of contents

### Constructors

- [constructor](pow_localpowprovider.localpowprovider.md#constructor)

### Methods

- [pow](pow_localpowprovider.localpowprovider.md#pow)

## Constructors

### constructor

• **new LocalPowProvider**()

## Methods

### pow

▸ **pow**(`message`, `targetScore`): `Promise`<bigint\>

Perform pow on the message and return the nonce of at least targetScore.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Uint8Array` | The message to process. |
| `targetScore` | `number` | The target score. |

#### Returns

`Promise`<bigint\>

The nonce.

#### Implementation of

[IPowProvider](../interfaces/models_ipowprovider.ipowprovider.md).[pow](../interfaces/models_ipowprovider.ipowprovider.md#pow)
