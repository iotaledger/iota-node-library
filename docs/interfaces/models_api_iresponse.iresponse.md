[@iota/iota.js](../README.md) / [Exports](../modules.md) / [models/api/IResponse](../modules/models_api_iresponse.md) / IResponse

# Interface: IResponse<T\>

[models/api/IResponse](../modules/models_api_iresponse.md).IResponse

Base response data.

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [data](models_api_iresponse.iresponse.md#data)
- [error](models_api_iresponse.iresponse.md#error)

## Properties

### data

• **data**: `T`

The data in the response.

___

### error

• `Optional` **error**: `Object`

Optional error in the response.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | The code for the error response. |
| `message` | `string` | A more descriptive version of the error. |
