[@iota/iota.js](../README.md) / [Exports](../modules.md) / [clients/singleNodeClient](../modules/clients_singlenodeclient.md) / SingleNodeClient

# Class: SingleNodeClient

[clients/singleNodeClient](../modules/clients_singlenodeclient.md).SingleNodeClient

Client for API communication.

## Implements

- [IClient](../interfaces/models_iclient.iclient.md)

## Table of contents

### Constructors

- [constructor](clients_singlenodeclient.singlenodeclient.md#constructor)

### Methods

- [address](clients_singlenodeclient.singlenodeclient.md#address)
- [addressEd25519](clients_singlenodeclient.singlenodeclient.md#addressed25519)
- [addressEd25519Outputs](clients_singlenodeclient.singlenodeclient.md#addressed25519outputs)
- [addressOutputs](clients_singlenodeclient.singlenodeclient.md#addressoutputs)
- [combineQueryParams](clients_singlenodeclient.singlenodeclient.md#combinequeryparams)
- [fetchBinary](clients_singlenodeclient.singlenodeclient.md#fetchbinary)
- [fetchJson](clients_singlenodeclient.singlenodeclient.md#fetchjson)
- [fetchStatus](clients_singlenodeclient.singlenodeclient.md#fetchstatus)
- [health](clients_singlenodeclient.singlenodeclient.md#health)
- [info](clients_singlenodeclient.singlenodeclient.md#info)
- [message](clients_singlenodeclient.singlenodeclient.md#message)
- [messageChildren](clients_singlenodeclient.singlenodeclient.md#messagechildren)
- [messageMetadata](clients_singlenodeclient.singlenodeclient.md#messagemetadata)
- [messageRaw](clients_singlenodeclient.singlenodeclient.md#messageraw)
- [messageSubmit](clients_singlenodeclient.singlenodeclient.md#messagesubmit)
- [messageSubmitRaw](clients_singlenodeclient.singlenodeclient.md#messagesubmitraw)
- [messagesFind](clients_singlenodeclient.singlenodeclient.md#messagesfind)
- [milestone](clients_singlenodeclient.singlenodeclient.md#milestone)
- [milestoneUtxoChanges](clients_singlenodeclient.singlenodeclient.md#milestoneutxochanges)
- [output](clients_singlenodeclient.singlenodeclient.md#output)
- [peer](clients_singlenodeclient.singlenodeclient.md#peer)
- [peerAdd](clients_singlenodeclient.singlenodeclient.md#peeradd)
- [peerDelete](clients_singlenodeclient.singlenodeclient.md#peerdelete)
- [peers](clients_singlenodeclient.singlenodeclient.md#peers)
- [receipts](clients_singlenodeclient.singlenodeclient.md#receipts)
- [tips](clients_singlenodeclient.singlenodeclient.md#tips)
- [transactionIncludedMessage](clients_singlenodeclient.singlenodeclient.md#transactionincludedmessage)
- [treasury](clients_singlenodeclient.singlenodeclient.md#treasury)

## Constructors

### constructor

• **new SingleNodeClient**(`endpoint`, `options?`)

Create a new instance of client.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `endpoint` | `string` | The endpoint. |
| `options?` | [SingleNodeClientOptions](../interfaces/clients_singlenodeclientoptions.singlenodeclientoptions.md) | Options for the client. |

## Methods

### address

▸ **address**(`addressBech32`): `Promise`<[IAddressResponse](../interfaces/models_api_iaddressresponse.iaddressresponse.md)\>

Get the address details.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `addressBech32` | `string` | The address to get the details for. |

#### Returns

`Promise`<[IAddressResponse](../interfaces/models_api_iaddressresponse.iaddressresponse.md)\>

The address details.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[address](../interfaces/models_iclient.iclient.md#address)

___

### addressEd25519

▸ **addressEd25519**(`addressEd25519`): `Promise`<[IAddressResponse](../interfaces/models_api_iaddressresponse.iaddressresponse.md)\>

Get the address detail using ed25519 address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `addressEd25519` | `string` | The address to get the details for. |

#### Returns

`Promise`<[IAddressResponse](../interfaces/models_api_iaddressresponse.iaddressresponse.md)\>

The address details.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[addressEd25519](../interfaces/models_iclient.iclient.md#addressed25519)

___

### addressEd25519Outputs

▸ **addressEd25519Outputs**(`addressEd25519`, `type?`, `includeSpent?`): `Promise`<[IAddressOutputsResponse](../interfaces/models_api_iaddressoutputsresponse.iaddressoutputsresponse.md)\>

Get the address outputs using ed25519 address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `addressEd25519` | `string` | The address to get the outputs for. |
| `type?` | `number` | Filter the type of outputs you are looking up, defaults to all. |
| `includeSpent?` | `boolean` | Filter the type of outputs you are looking up, defaults to false. |

#### Returns

`Promise`<[IAddressOutputsResponse](../interfaces/models_api_iaddressoutputsresponse.iaddressoutputsresponse.md)\>

The address outputs.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[addressEd25519Outputs](../interfaces/models_iclient.iclient.md#addressed25519outputs)

___

### addressOutputs

▸ **addressOutputs**(`addressBech32`, `type?`, `includeSpent?`): `Promise`<[IAddressOutputsResponse](../interfaces/models_api_iaddressoutputsresponse.iaddressoutputsresponse.md)\>

Get the address outputs.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `addressBech32` | `string` | The address to get the outputs for. |
| `type?` | `number` | Filter the type of outputs you are looking up, defaults to all. |
| `includeSpent?` | `boolean` | Filter the type of outputs you are looking up, defaults to false. |

#### Returns

`Promise`<[IAddressOutputsResponse](../interfaces/models_api_iaddressoutputsresponse.iaddressoutputsresponse.md)\>

The address outputs.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[addressOutputs](../interfaces/models_iclient.iclient.md#addressoutputs)

___

### combineQueryParams

▸ **combineQueryParams**(`queryParams`): `string`

Combine the query params.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `queryParams` | `string`[] | The quer params to combine. |

#### Returns

`string`

The combined query params.

___

### fetchBinary

▸ **fetchBinary**<T\>(`method`, `route`, `requestData?`): `Promise`<Uint8Array \| T\>

Perform a request for binary data.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | ``"get"`` \| ``"post"`` | The http method. |
| `route` | `string` | The route of the request. |
| `requestData?` | `Uint8Array` | Request to send to the endpoint. |

#### Returns

`Promise`<Uint8Array \| T\>

The response.

___

### fetchJson

▸ **fetchJson**<T, U\>(`method`, `route`, `requestData?`): `Promise`<U\>

Perform a request in json format.

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | ``"get"`` \| ``"post"`` \| ``"delete"`` | The http method. |
| `route` | `string` | The route of the request. |
| `requestData?` | `T` | Request to send to the endpoint. |

#### Returns

`Promise`<U\>

The response.

___

### fetchStatus

▸ **fetchStatus**(`route`): `Promise`<number\>

Perform a request and just return the status.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `route` | `string` | The route of the request. |

#### Returns

`Promise`<number\>

The response.

___

### health

▸ **health**(): `Promise`<boolean\>

Get the health of the node.

#### Returns

`Promise`<boolean\>

True if the node is healthy.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[health](../interfaces/models_iclient.iclient.md#health)

___

### info

▸ **info**(): `Promise`<[INodeInfo](../interfaces/models_inodeinfo.inodeinfo.md)\>

Get the info about the node.

#### Returns

`Promise`<[INodeInfo](../interfaces/models_inodeinfo.inodeinfo.md)\>

The node information.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[info](../interfaces/models_iclient.iclient.md#info)

___

### message

▸ **message**(`messageId`): `Promise`<[IMessage](../interfaces/models_imessage.imessage.md)\>

Get the message data by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageId` | `string` | The message to get the data for. |

#### Returns

`Promise`<[IMessage](../interfaces/models_imessage.imessage.md)\>

The message data.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[message](../interfaces/models_iclient.iclient.md#message)

___

### messageChildren

▸ **messageChildren**(`messageId`): `Promise`<[IChildrenResponse](../interfaces/models_api_ichildrenresponse.ichildrenresponse.md)\>

Get the children of a message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageId` | `string` | The id of the message to get the children for. |

#### Returns

`Promise`<[IChildrenResponse](../interfaces/models_api_ichildrenresponse.ichildrenresponse.md)\>

The messages children.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[messageChildren](../interfaces/models_iclient.iclient.md#messagechildren)

___

### messageMetadata

▸ **messageMetadata**(`messageId`): `Promise`<[IMessageMetadata](../interfaces/models_imessagemetadata.imessagemetadata.md)\>

Get the message metadata by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageId` | `string` | The message to get the metadata for. |

#### Returns

`Promise`<[IMessageMetadata](../interfaces/models_imessagemetadata.imessagemetadata.md)\>

The message metadata.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[messageMetadata](../interfaces/models_iclient.iclient.md#messagemetadata)

___

### messageRaw

▸ **messageRaw**(`messageId`): `Promise`<Uint8Array\>

Get the message raw data by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageId` | `string` | The message to get the data for. |

#### Returns

`Promise`<Uint8Array\>

The message raw data.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[messageRaw](../interfaces/models_iclient.iclient.md#messageraw)

___

### messageSubmit

▸ **messageSubmit**(`message`): `Promise`<string\>

Submit message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [IMessage](../interfaces/models_imessage.imessage.md) | The message to submit. |

#### Returns

`Promise`<string\>

The messageId.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[messageSubmit](../interfaces/models_iclient.iclient.md#messagesubmit)

___

### messageSubmitRaw

▸ **messageSubmitRaw**(`message`): `Promise`<string\>

Submit message in raw format.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Uint8Array` | The message to submit. |

#### Returns

`Promise`<string\>

The messageId.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[messageSubmitRaw](../interfaces/models_iclient.iclient.md#messagesubmitraw)

___

### messagesFind

▸ **messagesFind**(`indexationKey`): `Promise`<[IMessagesResponse](../interfaces/models_api_imessagesresponse.imessagesresponse.md)\>

Find messages by index.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexationKey` | `string` \| `Uint8Array` | The index value as a byte array or UTF8 string. |

#### Returns

`Promise`<[IMessagesResponse](../interfaces/models_api_imessagesresponse.imessagesresponse.md)\>

The messageId.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[messagesFind](../interfaces/models_iclient.iclient.md#messagesfind)

___

### milestone

▸ **milestone**(`index`): `Promise`<[IMilestoneResponse](../interfaces/models_api_imilestoneresponse.imilestoneresponse.md)\>

Get the requested milestone.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The index of the milestone to get. |

#### Returns

`Promise`<[IMilestoneResponse](../interfaces/models_api_imilestoneresponse.imilestoneresponse.md)\>

The milestone details.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[milestone](../interfaces/models_iclient.iclient.md#milestone)

___

### milestoneUtxoChanges

▸ **milestoneUtxoChanges**(`index`): `Promise`<[IMilestoneUtxoChangesResponse](../interfaces/models_api_imilestoneutxochangesresponse.imilestoneutxochangesresponse.md)\>

Get the requested milestone utxo changes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The index of the milestone to request the changes for. |

#### Returns

`Promise`<[IMilestoneUtxoChangesResponse](../interfaces/models_api_imilestoneutxochangesresponse.imilestoneutxochangesresponse.md)\>

The milestone utxo changes details.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[milestoneUtxoChanges](../interfaces/models_iclient.iclient.md#milestoneutxochanges)

___

### output

▸ **output**(`outputId`): `Promise`<[IOutputResponse](../interfaces/models_api_ioutputresponse.ioutputresponse.md)\>

Find an output by its identifier.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `outputId` | `string` | The id of the output to get. |

#### Returns

`Promise`<[IOutputResponse](../interfaces/models_api_ioutputresponse.ioutputresponse.md)\>

The output details.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[output](../interfaces/models_iclient.iclient.md#output)

___

### peer

▸ **peer**(`peerId`): `Promise`<[IPeer](../interfaces/models_ipeer.ipeer.md)\>

Get a peer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `peerId` | `string` | The peer to delete. |

#### Returns

`Promise`<[IPeer](../interfaces/models_ipeer.ipeer.md)\>

The details for the created peer.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[peer](../interfaces/models_iclient.iclient.md#peer)

___

### peerAdd

▸ **peerAdd**(`multiAddress`, `alias?`): `Promise`<[IPeer](../interfaces/models_ipeer.ipeer.md)\>

Add a new peer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `multiAddress` | `string` | The address of the peer to add. |
| `alias?` | `string` | An optional alias for the peer. |

#### Returns

`Promise`<[IPeer](../interfaces/models_ipeer.ipeer.md)\>

The details for the created peer.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[peerAdd](../interfaces/models_iclient.iclient.md#peeradd)

___

### peerDelete

▸ **peerDelete**(`peerId`): `Promise`<void\>

Delete a peer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `peerId` | `string` | The peer to delete. |

#### Returns

`Promise`<void\>

Nothing.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[peerDelete](../interfaces/models_iclient.iclient.md#peerdelete)

___

### peers

▸ **peers**(): `Promise`<[IPeer](../interfaces/models_ipeer.ipeer.md)[]\>

Get the list of peers.

#### Returns

`Promise`<[IPeer](../interfaces/models_ipeer.ipeer.md)[]\>

The list of peers.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[peers](../interfaces/models_iclient.iclient.md#peers)

___

### receipts

▸ **receipts**(`migratedAt?`): `Promise`<[IReceiptsResponse](../interfaces/models_api_ireceiptsresponse.ireceiptsresponse.md)\>

Get all the stored receipts or those for a given migrated at index.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `migratedAt?` | `number` | The index the receipts were migrated at, if not supplied returns all stored receipts. |

#### Returns

`Promise`<[IReceiptsResponse](../interfaces/models_api_ireceiptsresponse.ireceiptsresponse.md)\>

The stored receipts.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[receipts](../interfaces/models_iclient.iclient.md#receipts)

___

### tips

▸ **tips**(): `Promise`<[ITipsResponse](../interfaces/models_api_itipsresponse.itipsresponse.md)\>

Get the tips from the node.

#### Returns

`Promise`<[ITipsResponse](../interfaces/models_api_itipsresponse.itipsresponse.md)\>

The tips.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[tips](../interfaces/models_iclient.iclient.md#tips)

___

### transactionIncludedMessage

▸ **transactionIncludedMessage**(`transactionId`): `Promise`<[IMessage](../interfaces/models_imessage.imessage.md)\>

Get the message that was included in the ledger for a transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionId` | `string` | The id of the transaction to get the included message for. |

#### Returns

`Promise`<[IMessage](../interfaces/models_imessage.imessage.md)\>

The message.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[transactionIncludedMessage](../interfaces/models_iclient.iclient.md#transactionincludedmessage)

___

### treasury

▸ **treasury**(): `Promise`<[ITreasury](../interfaces/models_itreasury.itreasury.md)\>

Get the current treasury output.

#### Returns

`Promise`<[ITreasury](../interfaces/models_itreasury.itreasury.md)\>

The details for the treasury.

#### Implementation of

[IClient](../interfaces/models_iclient.iclient.md).[treasury](../interfaces/models_iclient.iclient.md#treasury)
