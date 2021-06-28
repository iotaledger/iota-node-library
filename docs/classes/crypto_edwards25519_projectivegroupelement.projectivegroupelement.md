[@iota/iota.js](../README.md) / [Exports](../modules.md) / [crypto/edwards25519/projectiveGroupElement](../modules/crypto_edwards25519_projectivegroupelement.md) / ProjectiveGroupElement

# Class: ProjectiveGroupElement

[crypto/edwards25519/projectiveGroupElement](../modules/crypto_edwards25519_projectivegroupelement.md).ProjectiveGroupElement

Group elements are members of the elliptic curve -x^2 + y^2 = 1 + d * x^2 *
y^2 where d = -121665/121666
ProjectiveGroupElement: (X:Y:Z) satisfying x=X/Z, y=Y/Z.

## Table of contents

### Constructors

- [constructor](crypto_edwards25519_projectivegroupelement.projectivegroupelement.md#constructor)

### Properties

- [X](crypto_edwards25519_projectivegroupelement.projectivegroupelement.md#x)
- [Y](crypto_edwards25519_projectivegroupelement.projectivegroupelement.md#y)
- [Z](crypto_edwards25519_projectivegroupelement.projectivegroupelement.md#z)

### Methods

- [double](crypto_edwards25519_projectivegroupelement.projectivegroupelement.md#double)
- [doubleScalarMultVartime](crypto_edwards25519_projectivegroupelement.projectivegroupelement.md#doublescalarmultvartime)
- [toBytes](crypto_edwards25519_projectivegroupelement.projectivegroupelement.md#tobytes)
- [toExtended](crypto_edwards25519_projectivegroupelement.projectivegroupelement.md#toextended)
- [zero](crypto_edwards25519_projectivegroupelement.projectivegroupelement.md#zero)

## Constructors

### constructor

• **new ProjectiveGroupElement**(`X?`, `Y?`, `Z?`)

Create a new instance of CompletedGroupElement.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `X?` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The X element. |
| `Y?` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The Y Element. |
| `Z?` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The Z Element. |

## Properties

### X

• **X**: [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md)

The X element.

___

### Y

• **Y**: [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md)

The Y Element.

___

### Z

• **Z**: [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md)

The Z Element.

## Methods

### double

▸ **double**(`r`): `void`

Double the elements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `r` | [CompletedGroupElement](crypto_edwards25519_completedgroupelement.completedgroupelement.md) | The elements. |

#### Returns

`void`

___

### doubleScalarMultVartime

▸ **doubleScalarMultVartime**(`a`, `A`, `b`): `void`

GeDoubleScalarMultVartime sets r = a*A + b*B
where a = a[0]+256*a[1]+...+256^31 a[31]
and b = b[0]+256*b[1]+...+256^31 b[31]
B is the Ed25519 base point (x,4/5) with x positive.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `Uint8Array` | The a. |
| `A` | [ExtendedGroupElement](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md) | The A. |
| `b` | `Uint8Array` | The b. |

#### Returns

`void`

___

### toBytes

▸ **toBytes**(`s`): `void`

Convert the element to bytes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `s` | `Uint8Array` | The bytes. |

#### Returns

`void`

___

### toExtended

▸ **toExtended**(`r`): `void`

Convert to extended form.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `r` | [ExtendedGroupElement](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md) | The extended element. |

#### Returns

`void`

___

### zero

▸ **zero**(): `void`

Zero the elements.

#### Returns

`void`
