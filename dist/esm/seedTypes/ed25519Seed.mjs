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
