[@iota/iota.js](../README.md) / [clients/singleNodeClientOptions](../modules/clients_singlenodeclientoptions.md) / SingleNodeClientOptions

# Interface: SingleNodeClientOptions

[clients/singleNodeClientOptions](../modules/clients_singlenodeclientoptions.md).SingleNodeClientOptions

Options used when constructing SingleNodeClient.

## Table of contents

### Properties

- [basePath](clients_singlenodeclientoptions.singlenodeclientoptions.md#basepath)
- [headers](clients_singlenodeclientoptions.singlenodeclientoptions.md#headers)
- [password](clients_singlenodeclientoptions.singlenodeclientoptions.md#password)
- [powProvider](clients_singlenodeclientoptions.singlenodeclientoptions.md#powprovider)
- [timeout](clients_singlenodeclientoptions.singlenodeclientoptions.md#timeout)
- [userName](clients_singlenodeclientoptions.singlenodeclientoptions.md#username)

## Properties

### basePath

• `Optional` **basePath**: `string`

Base path for API location, defaults to /api/v1/.

___

### headers

• `Optional` **headers**: `Object`

Additional headers to include in the requests.

#### Index signature

▪ [id: `string`]: `string`

___

### password

• `Optional` **password**: `string`

Password for the endpoint.

___

### powProvider

• `Optional` **powProvider**: [`IPowProvider`](models_ipowprovider.ipowprovider.md)

Use a custom pow provider instead of the one on the node.

___

### timeout

• `Optional` **timeout**: `number`

Timeout for API requests.

___

### userName

• `Optional` **userName**: `string`

Username for the endpoint.
