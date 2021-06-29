// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Converter } from "../utils/converter.mjs";
import { RandomHelper } from "../utils/randomHelper.mjs";
import { Pbkdf2 } from "./pbkdf2.mjs";
import { Sha256 } from "./sha256.mjs";
import { english } from "./wordlists/english.mjs";
/**
 * Implementation of Bip39 for mnemonic generation.
 */
export class Bip39 {
    /**
     * Set the wordlist and joining character.
     * @param wordlistData Array of words.
     * @param joiningChar The character to join the words with.
     */
    static setWordList(wordlistData, joiningChar = " ") {
        Bip39._wordlist = wordlistData;
        Bip39._joiningChar = joiningChar;
    }
    /**
     * Generate a random mnemonic.
     * @param length The length of the mnemonic to generate, defaults to 256.
     * @returns The random mnemonic.
     */
    static randomMnemonic(length = 256) {
        if (length % 32 !== 0) {
            throw new Error("The length must be a multiple of 32");
        }
        const randomBytes = RandomHelper.generate(length / 8);
        return Bip39.entropyToMnemonic(randomBytes);
    }
    /**
     * Generate a mnemonic from the entropy.
     * @param entropy The entropy to generate.
     * @returns The mnemonic.
     */
    static entropyToMnemonic(entropy) {
        if (!Bip39._wordlist) {
            Bip39.setWordList(english, " ");
        }
        if (entropy.length % 4 !== 0 || entropy.length < 16 || entropy.length > 32) {
            throw new Error(`The length of the entropy is invalid, it should be a multiple of 4, >= 16 and <= 32, it is ${entropy.length}`);
        }
        const bin = `${Converter.bytesToBinary(entropy)}${Bip39.entropyChecksumBits(entropy)}`;
        const mnemonic = [];
        for (let i = 0; i < bin.length / 11; i++) {
            const wordIndexBits = bin.slice(i * 11, (i + 1) * 11);
            const wordIndex = Number.parseInt(wordIndexBits, 2);
            mnemonic.push(Bip39._wordlist[wordIndex]);
        }
        return mnemonic.join(Bip39._joiningChar);
    }
    /**
     * Convert a mnemonic to a seed.
     * @param mnemonic The mnemonic to convert.
     * @param password The password to apply to the seed generation.
     * @param iterations The number of iterations to perform on the password function, defaults to 2048.
     * @param keyLength The size of the key length to generate, defaults to 64.
     * @returns The seed.
     */
    static mnemonicToSeed(mnemonic, password, iterations = 2048, keyLength = 64) {
        const mnemonicBytes = Converter.utf8ToBytes(mnemonic.normalize("NFKD"));
        const salt = Converter.utf8ToBytes(`mnemonic${(password !== null && password !== void 0 ? password : "").normalize("NFKD")}`);
        return Pbkdf2.sha512(mnemonicBytes, salt, iterations, keyLength);
    }
    /**
     * Convert the mnemonic back to entropy.
     * @param mnemonic The mnemonic to convert.
     * @returns The entropy.
     */
    static mnemonicToEntropy(mnemonic) {
        if (!Bip39._wordlist) {
            Bip39.setWordList(english, " ");
        }
        const words = mnemonic.normalize("NFKD").split(Bip39._joiningChar);
        if (words.length % 3 !== 0) {
            throw new Error(`Invalid mnemonic the number of words should be a multiple of 3, it is ${words.length}`);
        }
        const bits = words
            .map(word => {
            const index = Bip39._wordlist.indexOf(word);
            if (index === -1) {
                throw new Error(`The mnemonic contains a word not in the wordlist ${word}`);
            }
            return index.toString(2).padStart(11, "0");
        })
            .join("");
        const dividerIndex = Math.floor(bits.length / 33) * 32;
        const entropyBits = bits.slice(0, dividerIndex);
        const checksumBits = bits.slice(dividerIndex);
        const entropy = Converter.binaryToBytes(entropyBits);
        if (entropy.length % 4 !== 0 || entropy.length < 16 || entropy.length > 32) {
            throw new Error("The length of the entropy is invalid");
        }
        const newChecksum = Bip39.entropyChecksumBits(entropy);
        if (newChecksum !== checksumBits) {
            throw new Error(`The checksum does not match ${newChecksum} != ${checksumBits}.`);
        }
        return entropy;
    }
    /**
     * Calculate the entropy checksum.
     * @param entropy The entropy to calculate the checksum for.
     * @returns The checksum.
     */
    static entropyChecksumBits(entropy) {
        const hash = Sha256.sum256(entropy);
        const bits = entropy.length * 8;
        const hashbits = Converter.bytesToBinary(hash);
        return hashbits.slice(0, bits / 32);
    }
}
/**
 * The character to join the mnemonics with.
 * @internal
 */
Bip39._joiningChar = " "; // \u3000 for japanese
