[@iota/iota.js](../README.md) / [clients/clientError](../modules/clients_clienterror.md) / ClientError

# Class: ClientError

[clients/clientError](../modules/clients_clienterror.md).ClientError

Class to represent errors from Client.

## Hierarchy

- `Error`

  ↳ **`ClientError`**

## Table of contents

### Constructors

- [constructor](clients_clienterror.clienterror.md#constructor)

### Properties

- [code](clients_clienterror.clienterror.md#code)
- [httpStatus](clients_clienterror.clienterror.md#httpstatus)
- [route](clients_clienterror.clienterror.md#route)
- [prepareStackTrace](clients_clienterror.clienterror.md#preparestacktrace)

### Methods

- [captureStackTrace](clients_clienterror.clienterror.md#capturestacktrace)

## Constructors

### constructor

• **new ClientError**(`message`, `route`, `httpStatus`, `code?`)

Create a new instance of ClientError.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The message for the error. |
| `route` | `string` | The route the request was made to. |
| `httpStatus` | `number` | The http status code. |
| `code?` | `string` | The code in the payload. |

#### Overrides

Error.constructor

## Properties

### code

• `Optional` **code**: `string`

The code return in the payload.

___

### httpStatus

• **httpStatus**: `number`

The HTTP status code returned.

___

### route

• **route**: `string`

The route the request was made to.

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace
