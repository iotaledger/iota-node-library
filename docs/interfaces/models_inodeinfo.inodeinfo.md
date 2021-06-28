[@iota/iota.js](../README.md) / [models/INodeInfo](../modules/models_inodeinfo.md) / INodeInfo

# Interface: INodeInfo

[models/INodeInfo](../modules/models_inodeinfo.md).INodeInfo

Response from the /info endpoint.

## Table of contents

### Properties

- [bech32HRP](models_inodeinfo.inodeinfo.md#bech32hrp)
- [confirmedMilestoneIndex](models_inodeinfo.inodeinfo.md#confirmedmilestoneindex)
- [features](models_inodeinfo.inodeinfo.md#features)
- [isHealthy](models_inodeinfo.inodeinfo.md#ishealthy)
- [latestMilestoneIndex](models_inodeinfo.inodeinfo.md#latestmilestoneindex)
- [latestMilestoneTimestamp](models_inodeinfo.inodeinfo.md#latestmilestonetimestamp)
- [messagesPerSecond](models_inodeinfo.inodeinfo.md#messagespersecond)
- [minPoWScore](models_inodeinfo.inodeinfo.md#minpowscore)
- [name](models_inodeinfo.inodeinfo.md#name)
- [networkId](models_inodeinfo.inodeinfo.md#networkid)
- [pruningIndex](models_inodeinfo.inodeinfo.md#pruningindex)
- [referencedMessagesPerSecond](models_inodeinfo.inodeinfo.md#referencedmessagespersecond)
- [referencedRate](models_inodeinfo.inodeinfo.md#referencedrate)
- [version](models_inodeinfo.inodeinfo.md#version)

## Properties

### bech32HRP

• **bech32HRP**: `string`

The human readable part of bech32 addresses.

___

### confirmedMilestoneIndex

• **confirmedMilestoneIndex**: `number`

The confirmed milestone index.

___

### features

• **features**: `string`[]

Features supported by the node.

___

### isHealthy

• **isHealthy**: `boolean`

Is the node healthy.

___

### latestMilestoneIndex

• **latestMilestoneIndex**: `number`

The latest milestone index.

___

### latestMilestoneTimestamp

• **latestMilestoneTimestamp**: `number`

The latest milestone timestamp.

___

### messagesPerSecond

• **messagesPerSecond**: `number`

Messages per second.

___

### minPoWScore

• **minPoWScore**: `number`

The minimum score required for PoW.

___

### name

• **name**: `string`

The name of the node software.

___

### networkId

• **networkId**: `string`

The network id.

___

### pruningIndex

• **pruningIndex**: `number`

The pruning index.

___

### referencedMessagesPerSecond

• **referencedMessagesPerSecond**: `number`

Referenced messages per second.

___

### referencedRate

• **referencedRate**: `number`

The rate at which rates are being referenced.

___

### version

• **version**: `string`

The version of the software running on the node.
