[@iota/iota.js](../README.md) / [Exports](../modules.md) / utils/logging

# Module: utils/logging

## Table of contents

### Functions

- [logAddress](utils_logging.md#logaddress)
- [logFunds](utils_logging.md#logfunds)
- [logIndexationPayload](utils_logging.md#logindexationpayload)
- [logInfo](utils_logging.md#loginfo)
- [logInput](utils_logging.md#loginput)
- [logMessage](utils_logging.md#logmessage)
- [logMessageMetadata](utils_logging.md#logmessagemetadata)
- [logMilestonePayload](utils_logging.md#logmilestonepayload)
- [logOutput](utils_logging.md#logoutput)
- [logPayload](utils_logging.md#logpayload)
- [logReceiptPayload](utils_logging.md#logreceiptpayload)
- [logSignature](utils_logging.md#logsignature)
- [logTips](utils_logging.md#logtips)
- [logTransactionPayload](utils_logging.md#logtransactionpayload)
- [logTreasuryTransactionPayload](utils_logging.md#logtreasurytransactionpayload)
- [logUnlockBlock](utils_logging.md#logunlockblock)
- [setLogger](utils_logging.md#setlogger)

## Functions

### logAddress

▸ **logAddress**(`prefix`, `unknownAddress?`): `void`

Log an address to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `unknownAddress?` | [IEd25519Address](../interfaces/models_ied25519address.ied25519address.md) | The address to log. |

#### Returns

`void`

___

### logFunds

▸ **logFunds**(`prefix`, `fund?`): `void`

Log fund to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `fund?` | [IMigratedFunds](../interfaces/models_imigratedfunds.imigratedfunds.md) | The fund to log. |

#### Returns

`void`

___

### logIndexationPayload

▸ **logIndexationPayload**(`prefix`, `payload?`): `void`

Log a indexation payload to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `payload?` | [IIndexationPayload](../interfaces/models_iindexationpayload.iindexationpayload.md) | The payload. |

#### Returns

`void`

___

### logInfo

▸ **logInfo**(`prefix`, `info`): `void`

Log the node information.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `info` | [INodeInfo](../interfaces/models_inodeinfo.inodeinfo.md) | The info to log. |

#### Returns

`void`

___

### logInput

▸ **logInput**(`prefix`, `unknownInput?`): `void`

Log input to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `unknownInput?` | [IUTXOInput](../interfaces/models_iutxoinput.iutxoinput.md) \| [ITreasuryInput](../interfaces/models_itreasuryinput.itreasuryinput.md) | The input to log. |

#### Returns

`void`

___

### logMessage

▸ **logMessage**(`prefix`, `message`): `void`

Log a message to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `message` | [IMessage](../interfaces/models_imessage.imessage.md) | The message to log. |

#### Returns

`void`

___

### logMessageMetadata

▸ **logMessageMetadata**(`prefix`, `messageMetadata`): `void`

Log the message metadata to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `messageMetadata` | [IMessageMetadata](../interfaces/models_imessagemetadata.imessagemetadata.md) | The messageMetadata to log. |

#### Returns

`void`

___

### logMilestonePayload

▸ **logMilestonePayload**(`prefix`, `payload?`): `void`

Log a milestone payload to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `payload?` | [IMilestonePayload](../interfaces/models_imilestonepayload.imilestonepayload.md) | The payload. |

#### Returns

`void`

___

### logOutput

▸ **logOutput**(`prefix`, `unknownOutput?`): `void`

Log output to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `unknownOutput?` | [ISigLockedSingleOutput](../interfaces/models_isiglockedsingleoutput.isiglockedsingleoutput.md) \| [ISigLockedDustAllowanceOutput](../interfaces/models_isiglockeddustallowanceoutput.isiglockeddustallowanceoutput.md) \| [ITreasuryOutput](../interfaces/models_itreasuryoutput.itreasuryoutput.md) | The output to log. |

#### Returns

`void`

___

### logPayload

▸ **logPayload**(`prefix`, `unknownPayload?`): `void`

Log a message to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `unknownPayload?` | [ITransactionPayload](../interfaces/models_itransactionpayload.itransactionpayload.md) \| [IMilestonePayload](../interfaces/models_imilestonepayload.imilestonepayload.md) \| [IIndexationPayload](../interfaces/models_iindexationpayload.iindexationpayload.md) \| [ITreasuryTransactionPayload](../interfaces/models_itreasurytransactionpayload.itreasurytransactionpayload.md) \| [IReceiptPayload](../interfaces/models_ireceiptpayload.ireceiptpayload.md) | The payload. |

#### Returns

`void`

___

### logReceiptPayload

▸ **logReceiptPayload**(`prefix`, `payload?`): `void`

Log a receipt payload to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `payload?` | [IReceiptPayload](../interfaces/models_ireceiptpayload.ireceiptpayload.md) | The payload. |

#### Returns

`void`

___

### logSignature

▸ **logSignature**(`prefix`, `unknownSignature?`): `void`

Log signature to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `unknownSignature?` | [IEd25519Signature](../interfaces/models_ied25519signature.ied25519signature.md) | The signature to log. |

#### Returns

`void`

___

### logTips

▸ **logTips**(`prefix`, `tipsResponse`): `void`

Log the tips information.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `tipsResponse` | [ITipsResponse](../interfaces/models_api_itipsresponse.itipsresponse.md) | The tips to log. |

#### Returns

`void`

___

### logTransactionPayload

▸ **logTransactionPayload**(`prefix`, `payload?`): `void`

Log a transaction payload to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `payload?` | [ITransactionPayload](../interfaces/models_itransactionpayload.itransactionpayload.md) | The payload. |

#### Returns

`void`

___

### logTreasuryTransactionPayload

▸ **logTreasuryTransactionPayload**(`prefix`, `payload?`): `void`

Log a treasury transaction payload to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `payload?` | [ITreasuryTransactionPayload](../interfaces/models_itreasurytransactionpayload.itreasurytransactionpayload.md) | The payload. |

#### Returns

`void`

___

### logUnlockBlock

▸ **logUnlockBlock**(`prefix`, `unknownUnlockBlock?`): `void`

Log unlock block to the console.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix` | `string` | The prefix for the output. |
| `unknownUnlockBlock?` | [ISignatureUnlockBlock](../interfaces/models_isignatureunlockblock.isignatureunlockblock.md) \| [IReferenceUnlockBlock](../interfaces/models_ireferenceunlockblock.ireferenceunlockblock.md) | The unlock block to log. |

#### Returns

`void`

___

### setLogger

▸ **setLogger**(`log`): `void`

Set the logger for output.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `log` | (`message`: `string`, `data?`: `unknown`) => `void` | The logger. |

#### Returns

`void`
