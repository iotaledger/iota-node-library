[@iota/iota.js](../README.md) / [Exports](../modules.md) / highLevel/sendAdvanced

# Module: highLevel/sendAdvanced

## Table of contents

### Functions

- [buildTransactionPayload](highlevel_sendadvanced.md#buildtransactionpayload)
- [sendAdvanced](highlevel_sendadvanced.md#sendadvanced)

## Functions

### buildTransactionPayload

▸ **buildTransactionPayload**(`inputsAndSignatureKeyPairs`, `outputs`, `indexation?`): [ITransactionPayload](../interfaces/models_itransactionpayload.itransactionpayload.md)

Build a transaction payload.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inputsAndSignatureKeyPairs` | {}[] | The inputs with the signature key pairs needed to sign transfers. |
| `outputs` | {}[] | The outputs to send. |
| `indexation?` | `Object` | Optional indexation data to associate with the transaction. |

#### Returns

[ITransactionPayload](../interfaces/models_itransactionpayload.itransactionpayload.md)

The transaction payload.

___

### sendAdvanced

▸ **sendAdvanced**(`client`, `inputsAndSignatureKeyPairs`, `outputs`, `indexation?`): `Promise`<`Object`\>

Send a transfer from the balance on the seed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `client` | [IClient](../interfaces/models_iclient.iclient.md) \| `string` | The client or node endpoint to send the transfer with. |
| `inputsAndSignatureKeyPairs` | {}[] | The inputs with the signature key pairs needed to sign transfers. |
| `outputs` | {}[] | The outputs to send. |
| `indexation?` | `Object` | Optional indexation data to associate with the transaction. |

#### Returns

`Promise`<`Object`\>

The id of the message created and the remainder address if one was needed.
