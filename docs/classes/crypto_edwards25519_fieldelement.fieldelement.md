[@iota/iota.js](../README.md) / [Exports](../modules.md) / [crypto/edwards25519/fieldElement](../modules/crypto_edwards25519_fieldelement.md) / FieldElement

# Class: FieldElement

[crypto/edwards25519/fieldElement](../modules/crypto_edwards25519_fieldelement.md).FieldElement

Class for field element operations.
FieldElement represents an element of the field GF(2^255 - 19).  An element
t, entries t[0]...t[9], represents the integer t[0]+2^26 t[1]+2^51 t[2]+2^77
t[3]+2^102 t[4]+...+2^230 t[9].  Bounds on each t[i] vary depending on
context.

## Table of contents

### Constructors

- [constructor](crypto_edwards25519_fieldelement.fieldelement.md#constructor)

### Properties

- [data](crypto_edwards25519_fieldelement.fieldelement.md#data)

### Methods

- [add](crypto_edwards25519_fieldelement.fieldelement.md#add)
- [cMove](crypto_edwards25519_fieldelement.fieldelement.md#cmove)
- [clone](crypto_edwards25519_fieldelement.fieldelement.md#clone)
- [combine](crypto_edwards25519_fieldelement.fieldelement.md#combine)
- [fromBytes](crypto_edwards25519_fieldelement.fieldelement.md#frombytes)
- [internalSquare](crypto_edwards25519_fieldelement.fieldelement.md#internalsquare)
- [invert](crypto_edwards25519_fieldelement.fieldelement.md#invert)
- [isNegative](crypto_edwards25519_fieldelement.fieldelement.md#isnegative)
- [isNonZero](crypto_edwards25519_fieldelement.fieldelement.md#isnonzero)
- [mul](crypto_edwards25519_fieldelement.fieldelement.md#mul)
- [neg](crypto_edwards25519_fieldelement.fieldelement.md#neg)
- [one](crypto_edwards25519_fieldelement.fieldelement.md#one)
- [pow22523](crypto_edwards25519_fieldelement.fieldelement.md#pow22523)
- [square](crypto_edwards25519_fieldelement.fieldelement.md#square)
- [square2](crypto_edwards25519_fieldelement.fieldelement.md#square2)
- [sub](crypto_edwards25519_fieldelement.fieldelement.md#sub)
- [toBytes](crypto_edwards25519_fieldelement.fieldelement.md#tobytes)
- [zero](crypto_edwards25519_fieldelement.fieldelement.md#zero)

## Constructors

### constructor

• **new FieldElement**(`values?`)

Create a new instance of FieldElement.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values?` | `number`[] \| `Int32Array` | A set of values to initialize the array. |

## Properties

### data

• **data**: `Int32Array`

The data for the element.

## Methods

### add

▸ **add**(`a`, `b`): `void`

Add the elements and store in this.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The a element. |
| `b` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The b element. |

#### Returns

`void`

___

### cMove

▸ **cMove**(`g`, `b`): `void`

Replace (f,g) with (g,g) if b == 1;
replace (f,g) with (f,g) if b == 0.

Preconditions: b in {0,1}.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `g` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The g element. |
| `b` | `number` | The b value. |

#### Returns

`void`

___

### clone

▸ **clone**(): [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md)

Clone the field element.

#### Returns

[FieldElement](crypto_edwards25519_fieldelement.fieldelement.md)

The clones element.

___

### combine

▸ **combine**(`h0`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `h7`, `h8`, `h9`): `void`

Combine the element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `h0` | `bigint` | The h0 component. |
| `h1` | `bigint` | The h1 component. |
| `h2` | `bigint` | The h2 component. |
| `h3` | `bigint` | The h3 component. |
| `h4` | `bigint` | The h4 component. |
| `h5` | `bigint` | The h5 component. |
| `h6` | `bigint` | The h6 component. |
| `h7` | `bigint` | The h7 component. |
| `h8` | `bigint` | The h8 component. |
| `h9` | `bigint` | The h9 component. |

#### Returns

`void`

___

### fromBytes

▸ **fromBytes**(`bytes`): `void`

Populate from bytes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | The bytes to populate from. |

#### Returns

`void`

___

### internalSquare

▸ **internalSquare**(`f`): `Object`

FieldElement.square calculates h = f*f. Can overlap h with f.

Preconditions:
|f| bounded by 1.1*2^26,1.1*2^25,1.1*2^26,1.1*2^25,etc.

Postconditions:
|h| bounded by 1.1*2^25,1.1*2^24,1.1*2^25,1.1*2^24,etc.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `f` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The f element. |

#### Returns

`Object`

The components.

___

### invert

▸ **invert**(`z`): `void`

Invert.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `z` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The elemnt to invert. |

#### Returns

`void`

___

### isNegative

▸ **isNegative**(): `number`

Is the element negative.

#### Returns

`number`

1 if its negative.

___

### isNonZero

▸ **isNonZero**(): `number`

Is the value non zero.

#### Returns

`number`

1 if non zero.

___

### mul

▸ **mul**(`f`, `g`): `void`

Calculates h = f * g
Can overlap h with f or g.

Preconditions:
|f| bounded by 1.1*2^26,1.1*2^25,1.1*2^26,1.1*2^25,etc.
|g| bounded by 1.1*2^26,1.1*2^25,1.1*2^26,1.1*2^25,etc.

Postconditions:
|h| bounded by 1.1*2^25,1.1*2^24,1.1*2^25,1.1*2^24,etc.

Notes on implementation strategy:

Using schoolbook multiplication.
Karatsuba would save a little in some cost models.

Most multiplications by 2 and 19 are 32-bit precomputations;
cheaper than 64-bit postcomputations.

There is one remaining multiplication by 19 in the carry chain;
one *19 precomputation can be merged into this,
but the resulting data flow is considerably less clean.

There are 12 carries below.
10 of them are 2-way parallelizable and vectorizable.
Can get away with 11 carries, but then data flow is much deeper.

With tighter constraints on inputs, can squeeze carries into: number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `f` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The f element. |
| `g` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The g element. |

#### Returns

`void`

___

### neg

▸ **neg**(): `void`

Neg sets h = -f.

Preconditions:
|f| bounded by 1.1*2^25,1.1*2^24,1.1*2^25,1.1*2^24,etc.

Postconditions:
|h| bounded by 1.1*2^25,1.1*2^24,1.1*2^25,1.1*2^24,etc.

#### Returns

`void`

___

### one

▸ **one**(): `void`

Zero all the values and set the first byte to 1.

#### Returns

`void`

___

### pow22523

▸ **pow22523**(`z`): `void`

Perform the pow 22523 calculate.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `z` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The element to operate on. |

#### Returns

`void`

___

### square

▸ **square**(`f`): `void`

FieldElement.square calculates h = f*f. Can overlap h with f.

Preconditions:
|f| bounded by 1.1*2^26,1.1*2^25,1.1*2^26,1.1*2^25,etc.

Postconditions:
|h| bounded by 1.1*2^25,1.1*2^24,1.1*2^25,1.1*2^24,etc.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `f` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The f element. |

#### Returns

`void`

___

### square2

▸ **square2**(`f`): `void`

Square2 sets h = 2 * f * f.

Can overlap h with f.

Preconditions:
|f| bounded by 1.65*2^26,1.65*2^25,1.65*2^26,1.65*2^25,etc.

Postconditions:
|h| bounded by 1.01*2^25,1.01*2^24,1.01*2^25,1.01*2^24,etc.
See fe_mul.c for discussion of implementation strategy.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `f` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The f element. |

#### Returns

`void`

___

### sub

▸ **sub**(`a`, `b`): `void`

Subtract the elements and store in this.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The a element. |
| `b` | [FieldElement](crypto_edwards25519_fieldelement.fieldelement.md) | The b element. |

#### Returns

`void`

___

### toBytes

▸ **toBytes**(`bytes`): `void`

FieldElement.toBytes marshals h to s.
Preconditions:
|h| bounded by 1.1*2^25,1.1*2^24,1.1*2^25,1.1*2^24,etc.

Write p=2^255-19; q=floor(h/p).
Basic claim: q = floor(2^(-255)(h + 19 2^(-25)h9 + 2^(-1))).

Proof:
Have |h|<=p so |q|<=1 so |19^2 2^(-255) q|<1/4.
Also have |h-2^230 h9|<2^230 so |19 2^(-255)(h-2^230 h9)|<1/4.

Write y=2^(-1)-19^2 2^(-255)q-19 2^(-255)(h-2^230 h9).
Then 0<y<1.

Write r=h-pq.
Have 0<=r<=p-1=2^255-20.
Thus 0<=r+19(2^-255)r<r+19(2^-255)2^255<=2^255-1.

Write x=r+19(2^-255)r+y.
Then 0<x<2^255 so floor(2^(-255)x) = 0 so floor(q+2^(-255)x) = q.

Have q+2^(-255)x = 2^(-255)(h + 19 2^(-25) h9 + 2^(-1))
so floor(2^(-255)(h + 19 2^(-25) h9 + 2^(-1))) = q.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | The bytes to populate. |

#### Returns

`void`

___

### zero

▸ **zero**(): `void`

Zero the values.

#### Returns

`void`
