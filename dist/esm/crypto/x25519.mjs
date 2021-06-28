// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
/**
 * This is a TypeScript port of https://github.com/katzenpost/core/blob/master/crypto/extra25519/extra25519.go.
 */
import { Sha512 } from "../crypto/sha512.mjs";
import { ExtendedGroupElement } from "./edwards25519/extendedGroupElement.mjs";
import { FieldElement } from "./edwards25519/fieldElement.mjs";
/**
 * Implementation of X25519.
 */
export class X25519 {
    /**
     * Convert Ed25519 private key to X25519 private key.
     * @param ed25519PrivateKey The ed25519 private key to convert.
     * @returns The x25519 private key.
     */
    static convertPrivateKeyToX25519(ed25519PrivateKey) {
        const digest = Sha512.sum512(ed25519PrivateKey.slice(0, 32));
        digest[0] &= 248;
        digest[31] &= 127;
        digest[31] |= 64;
        return digest.slice(0, 32);
    }
    /**
     * Convert Ed25519 public key to X25519 public key.
     * @param ed25519PublicKey The ed25519 public key to convert.
     * @returns The x25519 public key.
     */
    static convertPublicKeyToX25519(ed25519PublicKey) {
        const A = new ExtendedGroupElement();
        if (!A.fromBytes(ed25519PublicKey)) {
            throw new Error("Invalid Ed25519 Public Key");
        }
        // A.Z = 1 as a postcondition of FromBytes.
        const x = X25519.edwardsToMontgomeryX(A.Y);
        const x25519PublicKey = new Uint8Array(32);
        x.toBytes(x25519PublicKey);
        return x25519PublicKey;
    }
    /**
     * Convert the edwards curve to montgomery curve.
     * @param y The point on the edwards curve.
     * @returns The x-coordinate of the mapping.
     * @internal
     */
    static edwardsToMontgomeryX(y) {
        // We only need the x-coordinate of the curve25519 point, which I'll
        // call u. The isomorphism is u=(y+1)/(1-y), since y=Y/Z, this gives
        // u=(Y+Z)/(Z-Y). We know that Z=1, thus u=(Y+1)/(1-Y).
        const oneMinusY = new FieldElement();
        oneMinusY.one();
        oneMinusY.sub(oneMinusY, y);
        oneMinusY.invert(oneMinusY);
        const outX = new FieldElement();
        outX.one();
        outX.add(outX, y);
        outX.mul(outX, oneMinusY);
        return outX;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieDI1NTE5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NyeXB0by94MjU1MTkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLHNDQUFzQztBQUN0QywrQkFBK0I7QUFFL0I7O0dBRUc7QUFDSCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDMUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDM0UsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRTNEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLE1BQU07SUFDZjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLHlCQUF5QixDQUFDLGlCQUE2QjtRQUNqRSxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU3RCxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUM7UUFDbEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVqQixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLHdCQUF3QixDQUFDLGdCQUE0QjtRQUMvRCxNQUFNLENBQUMsR0FBeUIsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO1FBRTNELElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7WUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1NBQ2pEO1FBRUQsMkNBQTJDO1FBQzNDLE1BQU0sQ0FBQyxHQUFpQixNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sZUFBZSxHQUFHLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0IsT0FBTyxlQUFlLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQWU7UUFDL0Msb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSx1REFBdUQ7UUFDdkQsTUFBTSxTQUFTLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVyQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDaEIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU1QixNQUFNLElBQUksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRTFCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSiJ9