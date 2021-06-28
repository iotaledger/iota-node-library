[@iota/iota.js](../README.md) / [utils/unitsHelper](../modules/utils_unitshelper.md) / UnitsHelper

# Class: UnitsHelper

[utils/unitsHelper](../modules/utils_unitshelper.md).UnitsHelper

Class to help with units formatting.

## Table of contents

### Constructors

- [constructor](utils_unitshelper.unitshelper.md#constructor)

### Properties

- [UNIT\_MAP](utils_unitshelper.unitshelper.md#unit_map)

### Methods

- [calculateBest](utils_unitshelper.unitshelper.md#calculatebest)
- [convertUnits](utils_unitshelper.unitshelper.md#convertunits)
- [formatBest](utils_unitshelper.unitshelper.md#formatbest)
- [formatUnits](utils_unitshelper.unitshelper.md#formatunits)

## Constructors

### constructor

• **new UnitsHelper**()

## Properties

### UNIT\_MAP

▪ `Static` `Readonly` **UNIT\_MAP**: `Object`

Map units.

## Methods

### calculateBest

▸ `Static` **calculateBest**(`value`): [`Units`](../modules/models_units.md#units)

Format the value in the best units.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The value to format. |

#### Returns

[`Units`](../modules/models_units.md#units)

The best units for the value.

___

### convertUnits

▸ `Static` **convertUnits**(`value`, `fromUnit`, `toUnit`): `number`

Convert the value to different units.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The value to convert. |
| `fromUnit` | [`Units`](../modules/models_units.md#units) | The form unit. |
| `toUnit` | [`Units`](../modules/models_units.md#units) | The to unit. |

#### Returns

`number`

The formatted unit.

___

### formatBest

▸ `Static` **formatBest**(`value`, `decimalPlaces?`): `string`

Format the value in the best units.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `value` | `number` | `undefined` | The value to format. |
| `decimalPlaces` | `number` | `2` | The number of decimal places to display. |

#### Returns

`string`

The formated value.

___

### formatUnits

▸ `Static` **formatUnits**(`value`, `unit`, `decimalPlaces?`): `string`

Format the value in the best units.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `value` | `number` | `undefined` | The value to format. |
| `unit` | [`Units`](../modules/models_units.md#units) | `undefined` | The unit to format with. |
| `decimalPlaces` | `number` | `2` | The number of decimal places to display. |

#### Returns

`string`

The formated value.
