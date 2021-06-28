[@iota/iota.js](../README.md) / [Exports](../modules.md) / highLevel/getBalance

# Module: highLevel/getBalance

## Table of contents

### Functions

- [getBalance](highlevel_getbalance.md#getbalance)

## Functions

### getBalance

▸ **getBalance**(`client`, `seed`, `accountIndex`, `addressOptions?`): `Promise`<number\>

Get the balance for a list of addresses.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `client` | [IClient](../interfaces/models_iclient.iclient.md) \| `string` | The client or node endpoint to send the transfer with. |
| `seed` | [ISeed](../interfaces/models_iseed.iseed.md) | The seed. |
| `accountIndex` | `number` | The account index in the wallet. |
| `addressOptions?` | `Object` | Optional address configuration for balance address lookups. |

#### Returns

`Promise`<number\>

The balance.
