[@iota/iota.js](../README.md) / [Exports](../modules.md) / crypto/edwards25519/scalar

# Module: crypto/edwards25519/scalar

## Table of contents

### Functions

- [scalarMinimal](crypto_edwards25519_scalar.md#scalarminimal)
- [scalarMulAdd](crypto_edwards25519_scalar.md#scalarmuladd)
- [scalarReduce](crypto_edwards25519_scalar.md#scalarreduce)

## Functions

### scalarMinimal

▸ **scalarMinimal**(`scalar`): `boolean`

Scalar Minimal returns true if the given scalar is less than the order of the Curve.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scalar` | `Uint8Array` | The scalar. |

#### Returns

`boolean`

True if the given scalar is less than the order of the Curve.

___

### scalarMulAdd

▸ **scalarMulAdd**(`s`, `a`, `b`, `c`): `void`

The scalars are GF(2^252 + 27742317777372353535851937790883648493).

Input
a[0]+256*a[1]+...+256^31*a[31] = a
b[0]+256*b[1]+...+256^31*b[31] = b
c[0]+256*c[1]+...+256^31*c[31] = c.

Output
s[0]+256*s[1]+...+256^31*s[31] = (ab+c) mod l
where l = 2^252 + 27742317777372353535851937790883648493.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `s` | `Uint8Array` | The scalar. |
| `a` | `Uint8Array` | The a. |
| `b` | `Uint8Array` | The b. |
| `c` | `Uint8Array` | The c. |

#### Returns

`void`

___

### scalarReduce

▸ **scalarReduce**(`out`, `s`): `void`

Scalar reduce
where l = 2^252 + 27742317777372353535851937790883648493.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `out` | `Uint8Array` | Where s[0]+256*s[1]+...+256^31*s[31] = s mod l. |
| `s` | `Uint8Array` | Where s[0]+256*s[1]+...+256^63*s[63] = s. |

#### Returns

`void`
