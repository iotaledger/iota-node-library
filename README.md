<h2 align="center">iota.js</h2>

<p align="center">
  <a href="https://discord.iota.org/" style="text-decoration:none;"><img src="https://img.shields.io/badge/Discord-9cf.svg?logo=discord" alt="Discord"></a>
    <a href="https://iota.stackexchange.com/" style="text-decoration:none;"><img src="https://img.shields.io/badge/StackExchange-9cf.svg?logo=stackexchange" alt="StackExchange"></a>
    <a href="https://github.com/iotaledger/iota.js/blob/main/LICENSE" style="text-decoration:none;"><img src="https://img.shields.io/github/license/iotaledger/iota.js.svg" alt="Apache-2.0 license"></a>
</p>
      
<p align="center">
  <a href="#about">About</a> ◈
  <a href="#prerequisites">Prerequisites</a> ◈
  <a href="#example">Example</a> ◈
  <a href="#api-endpoints">Api Endpoints</a> ◈
  <a href="#high-level-operations">High Level Operations</a> ◈
  <a href="#models">Models</a> ◈
  <a href="#proof-of-work">Proof Of Work</a> ◈
  <a href="#additional-examples">Additional Examples</a> ◈
  <a href="#supporting-the-project">Supporting the project</a> ◈
  <a href="#joining-the-discussion">Joining the discussion</a> 
</p>

# About

> This library is functionally complete, but it is recommended to use [iota.rs](https://github.com/iotaledger/iota.rs). The rust library will be more heavily maintained and is much more performant.

Client library for IOTA chrysalis network, implemeted in TypeScript to strongly type the objects sent and received from the API.

Also includes High Level operations.

Runs in both NodeJS and Browser environments.

## Prerequisites

```shell
npm install @iota/iota.js
```

## Example

```js
const { SingleNodeClient } = require("@iota/iota.js");

async function run() {
    const client = new SingleNodeClient("https://chrysalis-nodes.iota.org");

    const info = await client.info();
    console.log("Node Info");
    console.log("\tName:", info.name);
    console.log("\tVersion:", info.version);
    console.log("\tIs Healthy:", info.isHealthy);
    console.log("\tNetwork Id:", info.networkId);
    console.log("\tLatest Milestone Index:", info.latestMilestoneIndex);
    console.log("\tConfirmed Milestone Index:", info.confirmedMilestoneIndex);
    console.log("\tPruning Index:", info.pruningIndex);
    console.log("\tFeatures:", info.features);
    console.log("\tMin PoW Score:", info.minPoWScore);
}

run()
    .then(() => console.log("Done"))
    .catch((err) => console.error(err));
```

## API Endpoints

These methods are implemented on the API client.

* health() - Is the node healthy.
* info() - Get the information about a node.
* tips() - The tips for the tangle.
* message(messageId) - Get a message.
* messageMetadata(messageId) - Get the metadata for a message.
* messageRaw(messageId) - Get the raw message bytes.
* messageSubmit(message) - Submit a new message to the tangle.
* messageSubmitRaw(message) - Submit a new message to the tangle as bytes.
* messageChildren(messageId) - Find the children of a message.
* messagesFind(index) - Find messages by indexation key.
* output(outputId) - Get an output by id.
* address(address) - Get an address details using bech32 address.
* addressOutputs(address) - Get address outputs using bech32 address.
* addressEd25519(address) - Get address details using ed25519 address.
* addressEd25519Outputs(address) - Get address outputs using ed25519 address.
* milestone(index) - Get the milestone details.
* peers() - Get a list of peers.
* peerAdd() - Add a peer.
* peerDelete() - Delete a peer.
* peer() - Get the details of a peer.

## High level operations

There are also high level operations which make use of the API level methods:

* getBalance - Given a seed and account index calculate the total balance available on it's addresses.
* getUnspentAddress - Given a seed, account index, and start index find the next unspent address.
* getUnspentAddresses - Given a seed, account index, and start index find all the unspent addresses.
* promote - Promote a message by attaching an empty message to it.
* reattach - Reattach a message using the message id.
* retry - Looks at the metadata for a message and promotes or retries depending on it's state.
* retrieveData - Given a message id return the index and data from it.
* send - Given a seed, path, destination address in bech32 format and amount, make a single transfer.
* sendEd25519 - Given a seed, path, destination address in ed25519 format and amount, make a single transfer.
* sendMultiple - Given a seed, path, destination addresses in bech32 format and amounts, make multiple transfers.
* sendMultipleEd25519 - Given a seed, path, destination addresses in ed25519 format and amounts, make multiple transfers.
* sendAdvanced - Given a set of inputs with keypairs seed, path, list of destinations make multiple transfers, can also include index data.
* sendData - Given index and data create a new data message.

## Models

You can see the model definitions for all the objects in the [typings](./typings/models) folder.

## Proof of Work

See [./README-POW.md](./README-POW.md)
## Additional Examples

Please find other examples in the [./examples](./examples) folder.
* Simple - Performs basic API operations.
* Address - Demonstrates address generation from a Bip39 mnemonic seed using raw and Bip32 path methods.
* Transaction - Demonstrates how to send a transaction and call some of the other higher level functions.
* Data - Storing and retrieving data on the tangle.
* Browser - Demonstrates direct inclusion and use of the library in an html page.
* Peers - Demonstrates peer management.
* Pow - Demonstrates using one of the other PoW packages.

## Supporting the project

If the iota.js has been useful to you and you feel like contributing, consider submitting a [bug report](https://github.com/iotaledger/iota.js/issues/new), [feature request](https://github.com/iotaledger/iota.js/issues/new) or a [pull request](https://github.com/iotaledger/iota.js/pulls/).

See our [contributing guidelines](.github/CONTRIBUTING.md) for more information.

## Joining the discussion

If you want to get involved in the community, need help with getting set up, have any issues or just want to discuss IOTA, feel free to join our [Discord](https://discord.iota.org/).