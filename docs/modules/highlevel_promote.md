[@iota/iota.js](../README.md) / [Exports](../modules.md) / highLevel/promote

# Module: highLevel/promote

## Table of contents

### Functions

- [promote](highlevel_promote.md#promote)

## Functions

### promote

▸ **promote**(`client`, `messageId`): `Promise`<`Object`\>

Promote an existing message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `client` | [IClient](../interfaces/models_iclient.iclient.md) \| `string` | The clientor node endpoint to perform the promote with. |
| `messageId` | `string` | The message to promote. |

#### Returns

`Promise`<`Object`\>

The id and message that were promoted.
