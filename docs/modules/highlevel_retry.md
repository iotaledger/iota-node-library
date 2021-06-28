[@iota/iota.js](../README.md) / highLevel/retry

# Module: highLevel/retry

## Table of contents

### Functions

- [retry](highlevel_retry.md#retry)

## Functions

### retry

▸ **retry**(`client`, `messageId`): `Promise`<`Object`\>

Retry an existing message either by promoting or reattaching.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `client` | [`IClient`](../interfaces/models_iclient.iclient.md) \| `string` | The client or node endpoint to perform the retry with. |
| `messageId` | `string` | The message to retry. |

#### Returns

`Promise`<`Object`\>

The id and message that were retried.
