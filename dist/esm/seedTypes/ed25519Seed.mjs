import { Bip39 } from "../crypto/bip39.mjs";
import { Ed25519 } from "../crypto/ed25519.mjs";
import { Slip0010 } from "../crypto/slip0010.mjs";
/**
 * The global type for the seed.
 */
export const ED25519_SEED_TYPE = 1;
/**
 * Class to help with seeds.
 */
export class Ed25519Seed {
    /**
     * Create a new instance of Ed25519Seed.
     * @param secretKeyBytes The bytes.
     */
    constructor(secretKeyBytes) {
        this._secretKey = secretKeyBytes !== null && secretKeyBytes !== void 0 ? secretKeyBytes : new Uint8Array();
    }
    /**
     * Create the seed from a Bip39 mnemonic.
     * @param mnemonic The mnemonic to create the seed from.
     * @returns A new instance of Ed25519Seed.
     */
    static fromMnemonic(mnemonic) {
        return new Ed25519Seed(Bip39.mnemonicToSeed(mnemonic));
    }
    /**
     * Get the key pair from the seed.
     * @returns The key pair.
     */
    keyPair() {
        const signKeyPair = Ed25519.keyPairFromSeed(this._secretKey);
        return {
            publicKey: signKeyPair.publicKey,
            privateKey: signKeyPair.privateKey
        };
    }
    /**
     * Generate a new seed from the path.
     * @param path The path to generate the seed for.
     * @returns The generated seed.
     */
    generateSeedFromPath(path) {
        const keys = Slip0010.derivePath(this._secretKey, path);
        return new Ed25519Seed(keys.privateKey);
    }
    /**
     * Return the key as bytes.
     * @returns The key as bytes.
     */
    toBytes() {
        return this._secretKey;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWQyNTUxOVNlZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VlZFR5cGVzL2VkMjU1MTlTZWVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN4QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDNUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBSTlDOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQVcsQ0FBQyxDQUFDO0FBRTNDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFdBQVc7SUFPcEI7OztPQUdHO0lBQ0gsWUFBWSxjQUEyQjtRQUNuQyxJQUFJLENBQUMsVUFBVSxHQUFHLGNBQWMsYUFBZCxjQUFjLGNBQWQsY0FBYyxHQUFJLElBQUksVUFBVSxFQUFFLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQWdCO1FBQ3ZDLE9BQU8sSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7O09BR0c7SUFDSSxPQUFPO1FBQ1YsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFN0QsT0FBTztZQUNILFNBQVMsRUFBRSxXQUFXLENBQUMsU0FBUztZQUNoQyxVQUFVLEVBQUUsV0FBVyxDQUFDLFVBQVU7U0FDckMsQ0FBQztJQUNOLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksb0JBQW9CLENBQUMsSUFBZTtRQUN2QyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7T0FHRztJQUNJLE9BQU87UUFDVixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztDQUNKIn0=