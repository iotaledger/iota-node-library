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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmlwMzkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY3J5cHRvL2JpcDM5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixzQ0FBc0M7QUFFdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTlDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLEtBQUs7SUFhZDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFzQixFQUFFLGNBQXNCLEdBQUc7UUFDdkUsS0FBSyxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUM7UUFDL0IsS0FBSyxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7SUFDckMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQWlCLEdBQUc7UUFDN0MsSUFBSSxNQUFNLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7U0FDMUQ7UUFDRCxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0RCxPQUFPLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFtQjtRQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUNsQixLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNuQztRQUVELElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsRUFBRSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO1lBQ3hFLE1BQU0sSUFBSSxLQUFLLENBQ1gsOEZBQ0ksT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDN0I7UUFFRCxNQUFNLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFFdkYsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdEQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEQsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7U0FDN0M7UUFFRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FDeEIsUUFBZ0IsRUFBRSxRQUFpQixFQUFFLGFBQXFCLElBQUksRUFBRSxZQUFvQixFQUFFO1FBQ3RGLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFFBQVEsYUFBUixRQUFRLGNBQVIsUUFBUSxHQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFcEYsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLGlCQUFpQixDQUFDLFFBQWdCO1FBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO1lBQ2xCLEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ25DO1FBRUQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5FLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMseUVBQXlFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQzVHO1FBRUQsTUFBTSxJQUFJLEdBQUcsS0FBSzthQUNiLEdBQUcsQ0FDQSxJQUFJLENBQUMsRUFBRTtZQUNILE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELElBQUksRUFBRSxDQUFDLENBQUM7YUFDL0U7WUFFRCxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQ0o7YUFDQSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFZCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3ZELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFOUMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVyRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUUsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtZQUN4RSxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7U0FDM0Q7UUFFRCxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkQsSUFBSSxXQUFXLEtBQUssWUFBWSxFQUFFO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLFdBQVcsT0FBTyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1NBQ3JGO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsT0FBbUI7UUFDakQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUVoQyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRS9DLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7O0FBcElEOzs7R0FHRztBQUNZLGtCQUFZLEdBQUcsR0FBRyxDQUFDLENBQUMsc0JBQXNCIn0=