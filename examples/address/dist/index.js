"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const iota_js_1 = require("@iota/iota.js");
const API_ENDPOINT = "https://chrysalis-nodes.iota.org/";
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new iota_js_1.SingleNodeClient(API_ENDPOINT);
        const info = yield client.info();
        console.log("Base");
        // Generate a random mnemonic.
        const randomMnemonic = iota_js_1.Bip39.randomMnemonic();
        console.log("\tMnemonic:", randomMnemonic);
        // Generate the seed from the Mnemonic
        const baseSeed = iota_js_1.Ed25519Seed.fromMnemonic(randomMnemonic);
        console.log("\tSeed", iota_js_1.Converter.bytesToHex(baseSeed.toBytes()));
        // Generate the next addresses for your account.
        console.log();
        console.log("Generated Addresses using Bip44 Format");
        const addressGeneratorAccountState = {
            accountIndex: 0,
            addressIndex: 0,
            isInternal: false
        };
        for (let i = 0; i < 6; i++) {
            const path = iota_js_1.generateBip44Address(addressGeneratorAccountState, i === 0);
            console.log(`Wallet Index ${path}`);
            const addressSeed = baseSeed.generateSeedFromPath(new iota_js_1.Bip32Path(path));
            const addressKeyPair = addressSeed.keyPair();
            console.log("\tPrivate Key", iota_js_1.Converter.bytesToHex(addressKeyPair.privateKey));
            console.log("\tPublic Key", iota_js_1.Converter.bytesToHex(addressKeyPair.publicKey));
            const indexEd25519Address = new iota_js_1.Ed25519Address(addressKeyPair.publicKey);
            const indexPublicKeyAddress = indexEd25519Address.toAddress();
            console.log("\tAddress Ed25519", iota_js_1.Converter.bytesToHex(indexPublicKeyAddress));
            console.log("\tAddress Bech32", iota_js_1.Bech32Helper.toBech32(iota_js_1.ED25519_ADDRESS_TYPE, indexPublicKeyAddress, info.bech32HRP));
            console.log();
        }
        console.log();
        console.log("Generated Addresses manually using Bip44 Format");
        console.log();
        // You can perform the same process as the generator manually as follows.
        const basePath = new iota_js_1.Bip32Path(iota_js_1.IOTA_BIP44_BASE_PATH);
        const accountIndex = 0;
        let isInternal = false;
        let addressIndex = 0;
        for (let i = 0; i < 6; i++) {
            basePath.pushHardened(accountIndex);
            basePath.pushHardened(isInternal ? 1 : 0);
            basePath.pushHardened(addressIndex);
            console.log(`Wallet Index ${basePath.toString()}`);
            // Create a new seed from the base seed using the path
            const indexSeed = baseSeed.generateSeedFromPath(basePath);
            console.log("\tSeed", iota_js_1.Converter.bytesToHex(indexSeed.toBytes()));
            // Get the public and private keys for the path seed
            const indexSeedKeyPair = indexSeed.keyPair();
            console.log("\tPrivate Key", iota_js_1.Converter.bytesToHex(indexSeedKeyPair.privateKey));
            console.log("\tPublic Key", iota_js_1.Converter.bytesToHex(indexSeedKeyPair.publicKey));
            // Get the address for the path seed which is actually the Blake2b.sum256 of the public key
            // display it in both Ed25519 and Bech 32 format
            const indexEd25519Address = new iota_js_1.Ed25519Address(indexSeedKeyPair.publicKey);
            const indexPublicKeyAddress = indexEd25519Address.toAddress();
            console.log("\tAddress Ed25519", iota_js_1.Converter.bytesToHex(indexPublicKeyAddress));
            console.log("\tAddress Bech32", iota_js_1.Bech32Helper.toBech32(iota_js_1.ED25519_ADDRESS_TYPE, indexPublicKeyAddress, info.bech32HRP));
            console.log();
            basePath.pop();
            basePath.pop();
            basePath.pop();
            if (isInternal) {
                addressIndex++;
            }
            isInternal = !isInternal;
        }
    });
}
run()
    .then(() => console.log("Done"))
    .catch((err) => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBMkw7QUFFM0wsTUFBTSxZQUFZLEdBQUcsbUNBQW1DLENBQUM7QUFFekQsU0FBZSxHQUFHOztRQUNkLE1BQU0sTUFBTSxHQUFHLElBQUksMEJBQWdCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVwQiw4QkFBOEI7UUFDOUIsTUFBTSxjQUFjLEdBQUcsZUFBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFBO1FBRTFDLHNDQUFzQztRQUN0QyxNQUFNLFFBQVEsR0FBRyxxQkFBVyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMxRCxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxtQkFBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWhFLGdEQUFnRDtRQUNoRCxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDdEQsTUFBTSw0QkFBNEIsR0FBRztZQUNqQyxZQUFZLEVBQUUsQ0FBQztZQUNmLFlBQVksRUFBRSxDQUFDO1lBQ2YsVUFBVSxFQUFFLEtBQUs7U0FDcEIsQ0FBQztRQUNGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEIsTUFBTSxJQUFJLEdBQUcsOEJBQW9CLENBQUMsNEJBQTRCLEVBQUUsQ0FBQyxLQUFLLENBQUMs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