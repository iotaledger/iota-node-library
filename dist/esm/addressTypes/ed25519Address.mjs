// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Blake2b } from "../crypto/blake2b";
import { ArrayHelper } from "../utils/arrayHelper";
/**
 * Class to help with Ed25519 Signature scheme.
 */
export class Ed25519Address {
    /**
     * Create a new instance of Ed25519Address.
     * @param publicKey The public key for the address.
     */
    constructor(publicKey) {
        this._publicKey = publicKey;
    }
    /**
     * Convert the public key to an address.
     * @returns The address.
     */
    toAddress() {
        return Blake2b.sum256(this._publicKey);
    }
    /**
     * Use the public key to validate the address.
     * @param address The address to verify.
     * @returns True if the data and address is verified.
     */
    verify(address) {
        return ArrayHelper.equal(this.toAddress(), address);
    }
}
/**
 * Address size.
 * @internal
 */
Ed25519Address.ADDRESS_LENGTH = Blake2b.SIZE_256;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWQyNTUxOUFkZHJlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWRkcmVzc1R5cGVzL2VkMjU1MTlBZGRyZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixzQ0FBc0M7QUFDdEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTVDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVuRDs7R0FFRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBWXZCOzs7T0FHRztJQUNILFlBQVksU0FBcUI7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFNBQVM7UUFDWixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE9BQW1CO1FBQzdCLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEQsQ0FBQzs7QUFsQ0Q7OztHQUdHO0FBQ1csNkJBQWMsR0FBVyxPQUFPLENBQUMsUUFBUSxDQUFDIn0=