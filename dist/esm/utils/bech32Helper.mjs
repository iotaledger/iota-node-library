// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
import { Bech32 } from "../crypto/bech32";
/**
 * Convert address to bech32.
 */
export class Bech32Helper {
    /**
     * Encode an address to bech32.
     * @param addressType The address type to encode.
     * @param addressBytes The address bytes to encode.
     * @param humanReadablePart The human readable part to use.
     * @returns The array formated as hex.
     */
    static toBech32(addressType, addressBytes, humanReadablePart) {
        const addressData = new Uint8Array(1 + addressBytes.length);
        addressData[0] = addressType;
        addressData.set(addressBytes, 1);
        return Bech32.encode(humanReadablePart, addressData);
    }
    /**
     * Decode an address from bech32.
     * @param bech32Text The bech32 text to decode.
     * @param humanReadablePart The human readable part to use.
     * @returns The address type and address bytes or undefined if it cannot be decoded.
     */
    static fromBech32(bech32Text, humanReadablePart) {
        const decoded = Bech32.decode(bech32Text);
        if (decoded) {
            if (decoded.humanReadablePart !== humanReadablePart) {
                throw new Error(`The hrp part of the address should be ${humanReadablePart}, it is ${decoded.humanReadablePart}`);
            }
            if (decoded.data.length === 0) {
                throw new Error("The data part of the address should be at least length 1, it is 0");
            }
            const addressType = decoded.data[0];
            const addressBytes = decoded.data.slice(1);
            return {
                addressType,
                addressBytes
            };
        }
    }
    /**
     * Does the provided string look like it might be an bech32 address with matching hrp.
     * @param bech32Text The bech32 text to text.
     * @param humanReadablePart The human readable part to match.
     * @returns True if the passed address matches the pattern for a bech32 address.
     */
    static matches(bech32Text, humanReadablePart) {
        return Bech32.matches(humanReadablePart, bech32Text);
    }
}
/**
 * The default human readable part of the bech32 addresses for mainnet, currently 'iota'.
 */
Bech32Helper.BECH32_DEFAULT_HRP_MAIN = "iota";
/**
 * The default human readable part of the bech32 addresses for testnet, currently 'atoi'.
 */
Bech32Helper.BECH32_DEFAULT_HRP_TEST = "atoi";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVjaDMySGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2JlY2gzMkhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFDL0Isc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUMvQixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFMUM7O0dBRUc7QUFDSCxNQUFNLE9BQU8sWUFBWTtJQVdyQjs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUNsQixXQUFtQixFQUNuQixZQUF3QixFQUN4QixpQkFBeUI7UUFDekIsTUFBTSxXQUFXLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RCxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDO1FBQzdCLFdBQVcsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQWtCLEVBQUUsaUJBQXlCO1FBSWxFLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUMsSUFBSSxPQUFPLEVBQUU7WUFDVCxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsS0FBSyxpQkFBaUIsRUFBRTtnQkFDakQsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsaUJBQ3JELFdBQVcsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQzthQUMvQztZQUVELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLG1FQUFtRSxDQUFDLENBQUM7YUFDeEY7WUFFRCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTNDLE9BQU87Z0JBQ0gsV0FBVztnQkFDWCxZQUFZO2FBQ2YsQ0FBQztTQUNMO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FDakIsVUFBa0IsRUFDbEIsaUJBQXlCO1FBQ3pCLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN6RCxDQUFDOztBQXBFRDs7R0FFRztBQUNXLG9DQUF1QixHQUFXLE1BQU0sQ0FBQztBQUV2RDs7R0FFRztBQUNXLG9DQUF1QixHQUFXLE1BQU0sQ0FBQyJ9