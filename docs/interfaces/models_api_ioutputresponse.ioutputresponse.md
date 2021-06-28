[@iota/iota.js](../README.md) / [Exports](../modules.md) / [models/api/IOutputResponse](../modules/models_api_ioutputresponse.md) / IOutputResponse

# Interface: IOutputResponse

[models/api/IOutputResponse](../modules/models_api_ioutputresponse.md).IOutputResponse

Details of an output.

## Table of contents

### Properties

- [isSpent](models_api_ioutputresponse.ioutputresponse.md#isspent)
- [messageId](models_api_ioutputresponse.ioutputresponse.md#messageid)
- [output](models_api_ioutputresponse.ioutputresponse.md#output)
- [outputIndex](models_api_ioutputresponse.ioutputresponse.md#outputindex)
- [transactionId](models_api_ioutputresponse.ioutputresponse.md#transactionid)

## Properties

### isSpent

• **isSpent**: `boolean`

Is the output spent.

___

### messageId

• **messageId**: `string`

The message id the output was contained in.

___

### output

• **output**: [ISigLockedSingleOutput](models_isiglockedsingleoutput.isiglockedsingleoutput.md) \| [ISigLockedDustAllowanceOutput](models_isiglockeddustallowanceoutput.isiglockeddustallowanceoutput.md)

The output.

___

### outputIndex

• **outputIndex**: `number`

The index for the output.

___

### transactionId

• **transactionId**: `string`

The transaction id for the output.
