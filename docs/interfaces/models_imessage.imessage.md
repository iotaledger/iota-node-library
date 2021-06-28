[@iota/iota.js](../README.md) / [models/IMessage](../modules/models_imessage.md) / IMessage

# Interface: IMessage

[models/IMessage](../modules/models_imessage.md).IMessage

Message layout.

## Table of contents

### Properties

- [networkId](models_imessage.imessage.md#networkid)
- [nonce](models_imessage.imessage.md#nonce)
- [parentMessageIds](models_imessage.imessage.md#parentmessageids)
- [payload](models_imessage.imessage.md#payload)

## Properties

### networkId

• `Optional` **networkId**: `string`

The network id of the message.

___

### nonce

• `Optional` **nonce**: `string`

The nonce for the message.

___

### parentMessageIds

• `Optional` **parentMessageIds**: `string`[]

The parent message ids.

___

### payload

• `Optional` **payload**: [`ITransactionPayload`](models_itransactionpayload.itransactionpayload.md) \| [`IMilestonePayload`](models_imilestonepayload.imilestonepayload.md) \| [`IIndexationPayload`](models_iindexationpayload.iindexationpayload.md)

The payload contents.
