[@iota/iota.js](../README.md) / [Exports](../modules.md) / [crypto/edwards25519/cachedGroupElement](../modules/crypto_edwards25519_cachedgroupelement.md) / CachedGroupElement

# Class: CachedGroupElement

[crypto/edwards25519/cachedGroupElement](../modules/crypto_edwards25519_cachedgroupelement.md).CachedGroupElement

Cached group element.

## Table of contents

### Constructors

- [constructor](crypto_edwards25519_cachedgroupelement.cachedgroupelement.md#constructor)

### Properties

- [T2d](crypto_edwards25519_cachedgroupelement.cachedgroupelement.md#t2d)
- [Z](crypto_edwards25519_cachedgroupelement.cachedgroupelement.md#z)
- [yMinusX](crypto_edwards25519_cachedgroupelement.cachedgroupelement.md#yminusx)
- [yPlusX](crypto_edwards25519_cachedgroupelement.cachedgroupelement.md#yplusx)

## Constructors

### constructor

• **new CachedGroupElement**(`yPlusX?`, `yMinusX?`, `Z?`, `T2d?`)

Create a new instance of CachedGroupElement.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `yPlusX?` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | Y + X Element. |
| `yMinusX?` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | Y - X Element. |
| `Z?` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | Z Element. |
| `T2d?` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | T2d Element. |

## Properties

### T2d

• **T2d**: [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md)

T2d Element.

___

### Z

• **Z**: [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md)

Z Element.

___

### yMinusX

• **yMinusX**: [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md)

Y - X Element.

___

### yPlusX

• **yPlusX**: [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md)

Y + X Element.
