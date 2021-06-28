[@iota/iota.js](../README.md) / [Exports](../modules.md) / [crypto/edwards25519/extendedGroupElement](../modules/crypto_edwards25519_extendedgroupelement.md) / ExtendedGroupElement

# Class: ExtendedGroupElement

[crypto/edwards25519/extendedGroupElement](../modules/crypto_edwards25519_extendedgroupelement.md).ExtendedGroupElement

Group elements are members of the elliptic curve -x^2 + y^2 = 1 + d * x^2 * y^2 where d = -121665/121666.
ExtendedGroupElement: (X:Y:Z:T) satisfying x=X/Z, y=Y/Z, XY=ZT.

## Table of contents

### Constructors

- [constructor](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md#constructor)

### Properties

- [T](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md#t)
- [X](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md#x)
- [Y](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md#y)
- [Z](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md#z)

### Methods

- [cofactorEqual](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md#cofactorequal)
- [double](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md#double)
- [fromBytes](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md#frombytes)
- [scalarMultBase](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md#scalarmultbase)
- [toBytes](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md#tobytes)
- [toCached](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md#tocached)
- [toProjective](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md#toprojective)
- [zero](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md#zero)

## Constructors

### constructor

• **new ExtendedGroupElement**(`X?`, `Y?`, `Z?`, `T?`)

Create a new instance of ExtendedGroupElement.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `X?` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The X element. |
| `Y?` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The Y Element. |
| `Z?` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The Z Element. |
| `T?` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The T Element. |

## Properties

### T

• **T**: [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md)

The T Element.

___

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

### cofactorEqual

▸ **cofactorEqual**(`q`): `boolean`

CofactorEqual checks whether p, q are equal up to cofactor multiplication
ie if their difference is of small order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `q` | [ExtendedGroupElement](crypto_edwards25519_extendedgroupelement.extendedgroupelement.md) | The extended group element. |

#### Returns

`boolean`

True if they are equal.

___

### double

▸ **double**(`cachedGroupElement`): `void`

Double the element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cachedGroupElement` | [CompletedGroupElement](crypto_edwards25519_completedgroupelement.completedgroupelement.md) | The element to populate. |

#### Returns

`void`

___

### fromBytes

▸ **fromBytes**(`bytes`): `boolean`

Populate the element from bytes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | The butes to populate from. |

#### Returns

`boolean`

False is non-zero check.

___

### scalarMultBase

▸ **scalarMultBase**(`a`): `void`

GeScalarMultBase computes h = a*B, where
a = a[0]+256*a[1]+...+256^31 a[31]
b is the Ed25519 base point (x,4/5) with x positive.

Preconditions:
A[31] <= 127.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `Uint8Array` | The a. |

#### Returns

`void`

___

### toBytes

▸ **toBytes**(`bytes`): `void`

Convert the element to bytes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | The array to store the bytes in. |

#### Returns

`void`

___

### toCached

▸ **toCached**(`cacheGroupElement`): `void`

Convert to a cached group element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheGroupElement` | [CachedGroupElement](crypto_edwards25519_cachedgroupelement.cachedgroupelement.md) | The element to populate. |

#### Returns

`void`

___

### toProjective

▸ **toProjective**(`projectiveGroupElement`): `void`

Convert to a projective group element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `projectiveGroupElement` | [ProjectiveGroupElement](crypto_edwards25519_projectivegroupelement.projectivegroupelement.md) | The element to populate. |

#### Returns

`void`

___

### zero

▸ **zero**(): `void`

Zero the elements.

#### Returns

`void`
