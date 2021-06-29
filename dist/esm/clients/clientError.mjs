// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/**
 * Class to represent errors from Client.
 */
export class ClientError extends Error {
    /**
     * Create a new instance of ClientError.
     * @param message The message for the error.
     * @param route The route the request was made to.
     * @param httpStatus The http status code.
     * @param code The code in the payload.
     */
    constructor(message, route, httpStatus, code) {
        super(message);
        this.route = route;
        this.httpStatus = httpStatus;
        this.code = code;
    }
}
