[@iota/iota.js](../README.md) / [Exports](../modules.md) / [models/IPowProvider](../modules/models_ipowprovider.md) / IPowProvider

# Interface: IPowProvider

[models/IPowProvider](../modules/models_ipowprovider.md).IPowProvider

Perform the POW on a message.

## Implemented by

- [LocalPowProvider](../classes/pow_localpowprovider.localpowprovider.md)

## Table of contents

### Methods

- [pow](models_ipowprovider.ipowprovider.md#pow)

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
