// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { MAX_MESSAGE_LENGTH, serializeMessage } from "../binary/message.mjs";
import { Blake2b } from "../crypto/blake2b.mjs";
import { ArrayHelper } from "../utils/arrayHelper.mjs";
import { BigIntHelper } from "../utils/bigIntHelper.mjs";
import { Converter } from "../utils/converter.mjs";
import { WriteStream } from "../utils/writeStream.mjs";
import { ClientError } from "./clientError.mjs";
/**
 * Client for API communication.
 */
export class SingleNodeClient {
    /**
     * Create a new instance of client.
     * @param endpoint The endpoint.
     * @param options Options for the client.
     */
    constructor(endpoint, options) {
        var _a, _b, _c;
        if (!endpoint) {
            throw new Error("The endpoint can not be empty");
        }
        this._endpoint = endpoint.replace(/\/+$/, "");
        this._basePath = (_a = options === null || options === void 0 ? void 0 : options.basePath) !== null && _a !== void 0 ? _a : "/api/v1/";
        this._powProvider = options === null || options === void 0 ? void 0 : options.powProvider;
        this._timeout = options === null || options === void 0 ? void 0 : options.timeout;
        this._userName = options === null || options === void 0 ? void 0 : options.userName;
        this._password = options === null || options === void 0 ? void 0 : options.password;
        this._headers = options === null || options === void 0 ? void 0 : options.headers;
        if (this._userName && this._password && !this._endpoint.startsWith("https")) {
            throw new Error("Basic authentication requires the endpoint to be https");
        }
        if (this._userName && this._password && (((_b = this._headers) === null || _b === void 0 ? void 0 : _b.authorization) || ((_c = this._headers) === null || _c === void 0 ? void 0 : _c.Authorization))) {
            throw new Error("You can not supply both user/pass and authorization header");
        }
    }
    /**
     * Get the health of the node.
     * @returns True if the node is healthy.
     */
    async health() {
        const status = await this.fetchStatus("/health");
        if (status === 200) {
            return true;
        }
        else if (status === 503) {
            return false;
        }
        throw new ClientError("Unexpected response code", "/health", status);
    }
    /**
     * Get the info about the node.
     * @returns The node information.
     */
    async info() {
        return this.fetchJson("get", "info");
    }
    /**
     * Get the tips from the node.
     * @returns The tips.
     */
    async tips() {
        return this.fetchJson("get", "tips");
    }
    /**
     * Get the message data by id.
     * @param messageId The message to get the data for.
     * @returns The message data.
     */
    async message(messageId) {
        return this.fetchJson("get", `messages/${messageId}`);
    }
    /**
     * Get the message metadata by id.
     * @param messageId The message to get the metadata for.
     * @returns The message metadata.
     */
    async messageMetadata(messageId) {
        return this.fetchJson("get", `messages/${messageId}/metadata`);
    }
    /**
     * Get the message raw data by id.
     * @param messageId The message to get the data for.
     * @returns The message raw data.
     */
    async messageRaw(messageId) {
        return this.fetchBinary("get", `messages/${messageId}/raw`);
    }
    /**
     * Submit message.
     * @param message The message to submit.
     * @returns The messageId.
     */
    async messageSubmit(message) {
        let minPoWScore = 0;
        if (this._powProvider) {
            // If there is a local pow provider and no networkId or parent message ids
            // we must populate them, so that the they are not filled in by the
            // node causing invalid pow calculation
            const powInfo = await this.getPoWInfo();
            minPoWScore = powInfo.minPoWScore;
            if (!message.parentMessageIds || message.parentMessageIds.length === 0) {
                const tips = await this.tips();
                message.parentMessageIds = tips.tipMessageIds;
            }
            if (!message.networkId || message.networkId.length === 0) {
                message.networkId = powInfo.networkId.toString();
            }
        }
        const writeStream = new WriteStream();
        serializeMessage(writeStream, message);
        const messageBytes = writeStream.finalBytes();
        if (messageBytes.length > MAX_MESSAGE_LENGTH) {
            throw new Error(`The message length is ${messageBytes.length}, which exceeds the maximum size of ${MAX_MESSAGE_LENGTH}`);
        }
        if (this._powProvider) {
            const nonce = await this._powProvider.pow(messageBytes, minPoWScore);
            message.nonce = nonce.toString(10);
        }
        const response = await this.fetchJson("post", "messages", message);
        return response.messageId;
    }
    /**
     * Submit message in raw format.
     * @param message The message to submit.
     * @returns The messageId.
     */
    async messageSubmitRaw(message) {
        if (message.length > MAX_MESSAGE_LENGTH) {
            throw new Error(`The message length is ${message.length}, which exceeds the maximum size of ${MAX_MESSAGE_LENGTH}`);
        }
        if (this._powProvider && ArrayHelper.equal(message.slice(-8), SingleNodeClient.NONCE_ZERO)) {
            const { networkId, minPoWScore } = await this.getPoWInfo();
            BigIntHelper.write8(networkId, message, 0);
            const nonce = await this._powProvider.pow(message, minPoWScore);
            BigIntHelper.write8(nonce, message, message.length - 8);
        }
        const response = await this.fetchBinary("post", "messages", message);
        return response.messageId;
    }
    /**
     * Find messages by index.
     * @param indexationKey The index value as a byte array or UTF8 string.
     * @returns The messageId.
     */
    async messagesFind(indexationKey) {
        return this.fetchJson("get", `messages?index=${typeof indexationKey === "string"
            ? Converter.utf8ToHex(indexationKey)
            : Converter.bytesToHex(indexationKey)}`);
    }
    /**
     * Get the children of a message.
     * @param messageId The id of the message to get the children for.
     * @returns The messages children.
     */
    async messageChildren(messageId) {
        return this.fetchJson("get", `messages/${messageId}/children`);
    }
    /**
     * Get the message that was included in the ledger for a transaction.
     * @param transactionId The id of the transaction to get the included message for.
     * @returns The message.
     */
    async transactionIncludedMessage(transactionId) {
        return this.fetchJson("get", `transactions/${transactionId}/included-message`);
    }
    /**
     * Find an output by its identifier.
     * @param outputId The id of the output to get.
     * @returns The output details.
     */
    async output(outputId) {
        return this.fetchJson("get", `outputs/${outputId}`);
    }
    /**
     * Get the address details.
     * @param addressBech32 The address to get the details for.
     * @returns The address details.
     */
    async address(addressBech32) {
        return this.fetchJson("get", `addresses/${addressBech32}`);
    }
    /**
     * Get the address outputs.
     * @param addressBech32 The address to get the outputs for.
     * @param type Filter the type of outputs you are looking up, defaults to all.
     * @param includeSpent Filter the type of outputs you are looking up, defaults to false.
     * @returns The address outputs.
     */
    async addressOutputs(addressBech32, type, includeSpent) {
        const queryParams = [];
        if (type !== undefined) {
            queryParams.push(`type=${type}`);
        }
        if (includeSpent !== undefined) {
            queryParams.push(`include-spent=${includeSpent}`);
        }
        return this.fetchJson("get", `addresses/${addressBech32}/outputs${this.combineQueryParams(queryParams)}`);
    }
    /**
     * Get the address detail using ed25519 address.
     * @param addressEd25519 The address to get the details for.
     * @returns The address details.
     */
    async addressEd25519(addressEd25519) {
        if (!Converter.isHex(addressEd25519)) {
            throw new Error("The supplied address does not appear to be hex format");
        }
        return this.fetchJson("get", `addresses/ed25519/${addressEd25519}`);
    }
    /**
     * Get the address outputs using ed25519 address.
     * @param addressEd25519 The address to get the outputs for.
     * @param type Filter the type of outputs you are looking up, defaults to all.
     * @param includeSpent Filter the type of outputs you are looking up, defaults to false.
     * @returns The address outputs.
     */
    async addressEd25519Outputs(addressEd25519, type, includeSpent) {
        if (!Converter.isHex(addressEd25519)) {
            throw new Error("The supplied address does not appear to be hex format");
        }
        const queryParams = [];
        if (type !== undefined) {
            queryParams.push(`type=${type}`);
        }
        if (includeSpent !== undefined) {
            queryParams.push(`include-spent=${includeSpent}`);
        }
        return this.fetchJson("get", `addresses/ed25519/${addressEd25519}/outputs${this.combineQueryParams(queryParams)}`);
    }
    /**
     * Get the requested milestone.
     * @param index The index of the milestone to get.
     * @returns The milestone details.
     */
    async milestone(index) {
        return this.fetchJson("get", `milestones/${index}`);
    }
    /**
     * Get the requested milestone utxo changes.
     * @param index The index of the milestone to request the changes for.
     * @returns The milestone utxo changes details.
     */
    async milestoneUtxoChanges(index) {
        return this.fetchJson("get", `milestones/${index}/utxo-changes`);
    }
    /**
     * Get the current treasury output.
     * @returns The details for the treasury.
     */
    async treasury() {
        return this.fetchJson("get", "treasury");
    }
    /**
     * Get all the stored receipts or those for a given migrated at index.
     * @param migratedAt The index the receipts were migrated at, if not supplied returns all stored receipts.
     * @returns The stored receipts.
     */
    async receipts(migratedAt) {
        return this.fetchJson("get", `receipts${migratedAt !== undefined ? `/${migratedAt}` : ""}`);
    }
    /**
     * Get the list of peers.
     * @returns The list of peers.
     */
    async peers() {
        return this.fetchJson("get", "peers");
    }
    /**
     * Add a new peer.
     * @param multiAddress The address of the peer to add.
     * @param alias An optional alias for the peer.
     * @returns The details for the created peer.
     */
    async peerAdd(multiAddress, alias) {
        return this.fetchJson("post", "peers", {
            multiAddress,
            alias
        });
    }
    /**
     * Delete a peer.
     * @param peerId The peer to delete.
     * @returns Nothing.
     */
    async peerDelete(peerId) {
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        return this.fetchJson("delete", `peers/${peerId}`);
    }
    /**
     * Get a peer.
     * @param peerId The peer to delete.
     * @returns The details for the created peer.
     */
    async peer(peerId) {
        return this.fetchJson("get", `peers/${peerId}`);
    }
    /**
     * Perform a request and just return the status.
     * @param route The route of the request.
     * @returns The response.
     */
    async fetchStatus(route) {
        const response = await this.fetchWithTimeout("get", route);
        return response.status;
    }
    /**
     * Perform a request in json format.
     * @param method The http method.
     * @param route The route of the request.
     * @param requestData Request to send to the endpoint.
     * @returns The response.
     */
    async fetchJson(method, route, requestData) {
        const response = await this.fetchWithTimeout(method, `${this._basePath}${route}`, { "Content-Type": "application/json" }, requestData ? JSON.stringify(requestData) : undefined);
        let errorMessage;
        let errorCode;
        if (response.ok) {
            if (response.status === 204) {
                // No content
                return {};
            }
            try {
                const responseData = await response.json();
                if (responseData.error) {
                    errorMessage = responseData.error.message;
                    errorCode = responseData.error.code;
                }
                else {
                    return responseData.data;
                }
            }
            catch {
            }
        }
        if (!errorMessage) {
            try {
                const json = await response.json();
                if (json.error) {
                    errorMessage = json.error.message;
                    errorCode = json.error.code;
                }
            }
            catch { }
        }
        if (!errorMessage) {
            try {
                const text = await response.text();
                if (text.length > 0) {
                    const match = /code=(\d+), message=(.*)/.exec(text);
                    if ((match === null || match === void 0 ? void 0 : match.length) === 3) {
                        errorCode = match[1];
                        errorMessage = match[2];
                    }
                    else {
                        errorMessage = text;
                    }
                }
            }
            catch { }
        }
        throw new ClientError(errorMessage !== null && errorMessage !== void 0 ? errorMessage : response.statusText, route, response.status, errorCode !== null && errorCode !== void 0 ? errorCode : response.status.toString());
    }
    /**
     * Perform a request for binary data.
     * @param method The http method.
     * @param route The route of the request.
     * @param requestData Request to send to the endpoint.
     * @returns The response.
     */
    async fetchBinary(method, route, requestData) {
        var _a, _b, _c;
        const response = await this.fetchWithTimeout(method, `${this._basePath}${route}`, { "Content-Type": "application/octet-stream" }, requestData);
        let responseData;
        if (response.ok) {
            if (method === "get") {
                return new Uint8Array(await response.arrayBuffer());
            }
            responseData = await response.json();
            if (!(responseData === null || responseData === void 0 ? void 0 : responseData.error)) {
                return responseData === null || responseData === void 0 ? void 0 : responseData.data;
            }
        }
        if (!responseData) {
            responseData = await response.json();
        }
        throw new ClientError((_b = (_a = responseData === null || responseData === void 0 ? void 0 : responseData.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : response.statusText, route, response.status, (_c = responseData === null || responseData === void 0 ? void 0 : responseData.error) === null || _c === void 0 ? void 0 : _c.code);
    }
    /**
     * Perform a fetch request.
     * @param method The http method.
     * @param route The route of the request.
     * @param headers The headers for the request.
     * @param requestData Request to send to the endpoint.
     * @returns The response.
     * @internal
     */
    async fetchWithTimeout(method, route, headers, body) {
        let controller;
        let timerId;
        if (this._timeout !== undefined) {
            controller = new AbortController();
            timerId = setTimeout(() => {
                if (controller) {
                    controller.abort();
                }
            }, this._timeout);
        }
        const finalHeaders = {};
        if (this._headers) {
            for (const header in this._headers) {
                finalHeaders[header] = this._headers[header];
            }
        }
        if (headers) {
            for (const header in headers) {
                finalHeaders[header] = headers[header];
            }
        }
        if (this._userName && this._password) {
            const userPass = Converter.bytesToBase64(Converter.utf8ToBytes(`${this._userName}:${this._password}`));
            finalHeaders.Authorization = `Basic ${userPass}`;
        }
        try {
            const response = await fetch(`${this._endpoint}${route}`, {
                method,
                headers: finalHeaders,
                body,
                signal: controller ? controller.signal : undefined
            });
            return response;
        }
        catch (err) {
            throw err.name === "AbortError" ? new Error("Timeout") : err;
        }
        finally {
            if (timerId) {
                clearTimeout(timerId);
            }
        }
    }
    /**
     * Combine the query params.
     * @param queryParams The quer params to combine.
     * @returns The combined query params.
     */
    combineQueryParams(queryParams) {
        return queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    }
    /**
     * Get the pow info from the node.
     * @returns The networkId and the minPoWScore.
     * @internal
     */
    async getPoWInfo() {
        const nodeInfo = await this.info();
        const networkIdBytes = Blake2b.sum256(Converter.utf8ToBytes(nodeInfo.networkId));
        return {
            networkId: BigIntHelper.read8(networkIdBytes, 0),
            minPoWScore: nodeInfo.minPoWScore
        };
    }
}
/**
 * A zero nonce.
 * @internal
 */
SingleNodeClient.NONCE_ZERO = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
