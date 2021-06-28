[@iota/iota.js](../README.md) / [Exports](../modules.md) / [models/IMilestonePayload](../modules/models_imilestonepayload.md) / IMilestonePayload

# Interface: IMilestonePayload

[models/IMilestonePayload](../modules/models_imilestonepayload.md).IMilestonePayload

Milestone payload.

## Hierarchy

- [ITypeBase](models_itypebase.itypebase.md)<``1``\>

  ↳ **IMilestonePayload**

## Table of contents

### Properties

- [inclusionMerkleProof](models_imilestonepayload.imilestonepayload.md#inclusionmerkleproof)
- [index](models_imilestonepayload.imilestonepayload.md#index)
- [nextPoWScore](models_imilestonepayload.imilestonepayload.md#nextpowscore)
- [nextPoWScoreMilestoneIndex](models_imilestonepayload.imilestonepayload.md#nextpowscoremilestoneindex)
- [parentMessageIds](models_imilestonepayload.imilestonepayload.md#parentmessageids)
- [publicKeys](models_imilestonepayload.imilestonepayload.md#publickeys)
- [receipt](models_imilestonepayload.imilestonepayload.md#receipt)
- [signatures](models_imilestonepayload.imilestonepayload.md#signatures)
- [timestamp](models_imilestonepayload.imilestonepayload.md#timestamp)
- [type](models_imilestonepayload.imilestonepayload.md#type)

## Properties

### inclusionMerkleProof

• **inclusionMerkleProof**: `string`

The merkle proof inclusions.

___

### index

• **index**: `number`

The index name.

___

### nextPoWScore

• **nextPoWScore**: `number`

The next PoW score.

___

### nextPoWScoreMilestoneIndex

• **nextPoWScoreMilestoneIndex**: `number`

The milestone at which the next PoW score becomes active.

___

### parentMessageIds

• **parentMessageIds**: `string`[]

The parents where this milestone attaches to.

___

### publicKeys

• **publicKeys**: `string`[]

The public keys.

___

### receipt

• `Optional` **receipt**: [IReceiptPayload](models_ireceiptpayload.ireceiptpayload.md)

Receipt payload.

___

### signatures

• **signatures**: `string`[]

The signatures.

___

### timestamp

• **timestamp**: `number`

The timestamp of the milestone.

___

### type

• **type**: ``1``

The type of the object.

#### Inherited from

[ITypeBase](models_itypebase.itypebase.md).[type](models_itypebase.itypebase.md#type)
