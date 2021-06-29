// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
/**
 * This is a port of the Go code from https://github.com/hdevalence/ed25519consensus.
 * Which is an extension of https://github.com/golang/crypto/tree/master/ed25519.
 * Which in a port of the “ref10” implementation of ed25519 from SUPERCOP.
 */
import { Sha512 } from "../crypto/sha512.mjs";
import { ArrayHelper } from "../utils/arrayHelper.mjs";
import { ExtendedGroupElement } from "./edwards25519/extendedGroupElement.mjs";
import { ProjectiveGroupElement } from "./edwards25519/projectiveGroupElement.mjs";
import { scalarMinimal, scalarMulAdd, scalarReduce } from "./edwards25519/scalar.mjs";
/**
 * Implementation of Ed25519.
 */
export class Ed25519 {
    /**
     * Public returns the PublicKey corresponding to priv.
     * @param privateKey The private key to get the corresponding public key.
     * @returns The public key.
     */
    static publicKeyFromPrivateKey(privateKey) {
        return privateKey.subarray(32).slice();
    }
    /**
     * Generate the key pair from the seed.
     * @param seed The seed to generate the key pair for.
     * @returns The key pair.
     */
    static keyPairFromSeed(seed) {
        const privateKey = Ed25519.privateKeyFromSeed(seed.slice(0, Ed25519.SEED_SIZE));
        return {
            privateKey,
            publicKey: Ed25519.publicKeyFromPrivateKey(privateKey)
        };
    }
    /**
     * Calculates a private key from a seed.
     * @param seed The seed to generate the private key from.
     * @returns The private key.
     */
    static privateKeyFromSeed(seed) {
        if (!seed || seed.length !== Ed25519.SEED_SIZE) {
            throw new Error(`The seed length is incorrect, it should be ${Ed25519.SEED_SIZE} but is ${seed ? seed.length : 0}`);
        }
        const sha512 = new Sha512();
        sha512.update(seed);
        const digest = sha512.digest();
        digest[0] &= 248;
        digest[31] &= 127;
        digest[31] |= 64;
        const A = new ExtendedGroupElement();
        A.scalarMultBase(digest);
        const publicKeyBytes = new Uint8Array(32);
        A.toBytes(publicKeyBytes);
        const privateKey = new Uint8Array(Ed25519.PRIVATE_KEY_SIZE);
        privateKey.set(seed);
        privateKey.set(publicKeyBytes, 32);
        return privateKey;
    }
    /**
     * Sign the message with privateKey and returns a signature.
     * @param privateKey The private key.
     * @param message The message to sign.
     * @returns The signature.
     */
    static sign(privateKey, message) {
        if (!privateKey || privateKey.length !== Ed25519.PRIVATE_KEY_SIZE) {
            throw new Error("Bad private key length");
        }
        let sha512 = new Sha512();
        sha512.update(privateKey.subarray(0, 32));
        const digest1 = sha512.digest();
        const expandedSecretKey = digest1.slice();
        expandedSecretKey[0] &= 248;
        expandedSecretKey[31] &= 63;
        expandedSecretKey[31] |= 64;
        sha512 = new Sha512();
        sha512.update(digest1.subarray(32));
        sha512.update(message);
        const messageDigest = sha512.digest();
        const messageDigestReduced = new Uint8Array(32);
        scalarReduce(messageDigestReduced, messageDigest);
        const R = new ExtendedGroupElement();
        R.scalarMultBase(messageDigestReduced);
        const encodedR = new Uint8Array(32);
        R.toBytes(encodedR);
        sha512 = new Sha512();
        sha512.update(encodedR);
        sha512.update(privateKey.subarray(32));
        sha512.update(message);
        const hramDigest = sha512.digest();
        const hramDigestReduced = new Uint8Array(32);
        scalarReduce(hramDigestReduced, hramDigest);
        const s = new Uint8Array(32);
        scalarMulAdd(s, hramDigestReduced, expandedSecretKey, messageDigestReduced);
        const signature = new Uint8Array(Ed25519.SIGNATURE_SIZE);
        signature.set(encodedR);
        signature.set(s, 32);
        return signature;
    }
    /**
     * Verify reports whether sig is a valid signature of message by publicKey.
     * @param publicKey The public key to verify the signature.
     * @param message The message for the signature.
     * @param sig The signature.
     * @returns True if the signature matches.
     */
    static verify(publicKey, message, sig) {
        if (!publicKey || publicKey.length !== Ed25519.PUBLIC_KEY_SIZE) {
            return false;
        }
        if (!sig || sig.length !== Ed25519.SIGNATURE_SIZE || ((sig[63] & 224) !== 0)) {
            return false;
        }
        const A = new ExtendedGroupElement();
        if (!A.fromBytes(publicKey)) {
            return false;
        }
        A.X.neg();
        A.T.neg();
        const h = new Sha512();
        h.update(sig.subarray(0, 32));
        h.update(publicKey);
        h.update(message);
        const digest = h.digest();
        const hReduced = new Uint8Array(32);
        scalarReduce(hReduced, digest);
        const R = new ProjectiveGroupElement();
        const s = sig.subarray(32).slice();
        // https://tools.ietf.org/html/rfc8032#section-5.1.7 requires that s be in
        // the range [0, order) in order to prevent signature malleability.
        if (!scalarMinimal(s)) {
            return false;
        }
        R.doubleScalarMultVartime(hReduced, A, s);
        const checkR = new Uint8Array(32);
        R.toBytes(checkR);
        return ArrayHelper.equal(sig.subarray(0, 32), checkR);
    }
}
/**
 * PublicKeySize is the size, in bytes, of public keys as used in this package.
 */
Ed25519.PUBLIC_KEY_SIZE = 32;
/**
 * PrivateKeySize is the size, in bytes, of private keys as used in this package.
 */
Ed25519.PRIVATE_KEY_SIZE = 64;
/**
 * SignatureSize is the size, in bytes, of signatures generated and verified by this package.
 */
Ed25519.SIGNATURE_SIZE = 64;
/**
 * SeedSize is the size, in bytes, of private key seeds. These are the private key representations used by RFC 8032.
 */
Ed25519.SEED_SIZE = 32;
