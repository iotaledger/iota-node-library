[@iota/iota.js](../README.md) / [utils/powHelper](../modules/utils_powhelper.md) / PowHelper

# Class: PowHelper

[utils/powHelper](../modules/utils_powhelper.md).PowHelper

Helper methods for POW.

## Table of contents

### Constructors

- [constructor](utils_powhelper.powhelper.md#constructor)

### Properties

- [LN3](utils_powhelper.powhelper.md#ln3)

### Methods

- [calculateTargetZeros](utils_powhelper.powhelper.md#calculatetargetzeros)
- [performPow](utils_powhelper.powhelper.md#performpow)
- [score](utils_powhelper.powhelper.md#score)
- [trailingZeros](utils_powhelper.powhelper.md#trailingzeros)
- [trinaryTrailingZeros](utils_powhelper.powhelper.md#trinarytrailingzeros)

## Constructors

### constructor

• **new PowHelper**()

## Properties

### LN3

▪ `Static` `Readonly` **LN3**: `number` = `1.098612288668109691395245236922525704647490557822749451734694333`

LN3 Const see https://oeis.org/A002391.

## Methods

### calculateTargetZeros

▸ `Static` **calculateTargetZeros**(`message`, `targetScore`): `number`

Calculate the number of zeros required to get target score.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Uint8Array` | The message to process. |
| `targetScore` | `number` | The target score. |

#### Returns

`number`

The number of zeros to find.

___

### performPow

▸ `Static` **performPow**(`powDigest`, `targetZeros`, `startIndex`): `bigint`

Perform the hash on the data until we reach target number of zeros.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `powDigest` | `Uint8Array` | The pow digest. |
| `targetZeros` | `number` | The target number of zeros. |
| `startIndex` | `bigint` | The index to start looking from. |

#### Returns

`bigint`

The nonce.

___

### score

▸ `Static` **score**(`message`): `number`

Perform the score calculation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Uint8Array` | The data to perform the score on. |

#### Returns

`number`

The score for the data.

___

### trailingZeros

▸ `Static` **trailingZeros**(`powDigest`, `nonce`): `number`

Calculate the trailing zeros.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `powDigest` | `Uint8Array` | The pow digest. |
| `nonce` | `bigint` | The nonce. |

#### Returns

`number`

The trailing zeros.

___

### trinaryTrailingZeros

▸ `Static` **trinaryTrailingZeros**(`trits`, `endPos?`): `number`

Find the number of trailing zeros.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `trits` | `Int8Array` | The trits to look for zeros. |
| `endPos` | `number` | The end position to start looking for zeros. |

#### Returns

`number`

The number of trailing zeros.
