[@iota/iota.js](../README.md) / core

# Module: core

## Table of contents

### References

- [ARRAY\_LENGTH](core.md#array_length)
- [ArrayHelper](core.md#arrayhelper)
- [B1T6](core.md#b1t6)
- [BYTE\_SIZE](core.md#byte_size)
- [Base64](core.md#base64)
- [Bech32](core.md#bech32)
- [Bech32Helper](core.md#bech32helper)
- [BigIntHelper](core.md#biginthelper)
- [Bip32Path](core.md#bip32path)
- [Bip39](core.md#bip39)
- [Blake2b](core.md#blake2b)
- [CONFLICT\_REASON\_STRINGS](core.md#conflict_reason_strings)
- [ChaCha20](core.md#chacha20)
- [ChaCha20Poly1305](core.md#chacha20poly1305)
- [ClientError](core.md#clienterror)
- [ConflictReason](core.md#conflictreason)
- [Converter](core.md#converter)
- [Curl](core.md#curl)
- [ED25519\_ADDRESS\_TYPE](core.md#ed25519_address_type)
- [ED25519\_SEED\_TYPE](core.md#ed25519_seed_type)
- [ED25519\_SIGNATURE\_TYPE](core.md#ed25519_signature_type)
- [Ed25519](core.md#ed25519)
- [Ed25519Address](core.md#ed25519address)
- [Ed25519Seed](core.md#ed25519seed)
- [HmacSha256](core.md#hmacsha256)
- [HmacSha512](core.md#hmacsha512)
- [IAddress](core.md#iaddress)
- [IAddressOutputsResponse](core.md#iaddressoutputsresponse)
- [IAddressResponse](core.md#iaddressresponse)
- [IBip44GeneratorState](core.md#ibip44generatorstate)
- [IChildrenResponse](core.md#ichildrenresponse)
- [IClient](core.md#iclient)
- [IEd25519Address](core.md#ied25519address)
- [IEd25519Signature](core.md#ied25519signature)
- [IGossipHeartbeat](core.md#igossipheartbeat)
- [IGossipMetrics](core.md#igossipmetrics)
- [IIndexationPayload](core.md#iindexationpayload)
- [IKeyPair](core.md#ikeypair)
- [IMessage](core.md#imessage)
- [IMessageIdResponse](core.md#imessageidresponse)
- [IMessageMetadata](core.md#imessagemetadata)
- [IMessagesResponse](core.md#imessagesresponse)
- [IMigratedFunds](core.md#imigratedfunds)
- [IMilestonePayload](core.md#imilestonepayload)
- [IMilestoneResponse](core.md#imilestoneresponse)
- [IMilestoneUtxoChangesResponse](core.md#imilestoneutxochangesresponse)
- [INDEXATION\_PAYLOAD\_TYPE](core.md#indexation_payload_type)
- [INodeInfo](core.md#inodeinfo)
- [IOutputResponse](core.md#ioutputresponse)
- [IPeer](core.md#ipeer)
- [IPowProvider](core.md#ipowprovider)
- [IReceiptPayload](core.md#ireceiptpayload)
- [IReceiptsResponse](core.md#ireceiptsresponse)
- [IReferenceUnlockBlock](core.md#ireferenceunlockblock)
- [IResponse](core.md#iresponse)
- [ISeed](core.md#iseed)
- [ISigLockedDustAllowanceOutput](core.md#isiglockeddustallowanceoutput)
- [ISigLockedSingleOutput](core.md#isiglockedsingleoutput)
- [ISignatureUnlockBlock](core.md#isignatureunlockblock)
- [ITipsResponse](core.md#itipsresponse)
- [ITransactionEssence](core.md#itransactionessence)
- [ITransactionPayload](core.md#itransactionpayload)
- [ITreasury](core.md#itreasury)
- [ITreasuryInput](core.md#itreasuryinput)
- [ITreasuryOutput](core.md#itreasuryoutput)
- [ITreasuryTransactionPayload](core.md#itreasurytransactionpayload)
- [ITypeBase](core.md#itypebase)
- [IUTXOInput](core.md#iutxoinput)
- [LedgerInclusionState](core.md#ledgerinclusionstate)
- [LocalPowProvider](core.md#localpowprovider)
- [MAX\_FUNDS\_COUNT](core.md#max_funds_count)
- [MAX\_INDEXATION\_KEY\_LENGTH](core.md#max_indexation_key_length)
- [MAX\_INPUT\_COUNT](core.md#max_input_count)
- [MAX\_MESSAGE\_LENGTH](core.md#max_message_length)
- [MAX\_NUMBER\_PARENTS](core.md#max_number_parents)
- [MAX\_OUTPUT\_COUNT](core.md#max_output_count)
- [MERKLE\_PROOF\_LENGTH](core.md#merkle_proof_length)
- [MESSAGE\_ID\_LENGTH](core.md#message_id_length)
- [MILESTONE\_PAYLOAD\_TYPE](core.md#milestone_payload_type)
- [MIN\_ADDRESS\_LENGTH](core.md#min_address_length)
- [MIN\_ED25519\_ADDRESS\_LENGTH](core.md#min_ed25519_address_length)
- [MIN\_ED25519\_SIGNATURE\_LENGTH](core.md#min_ed25519_signature_length)
- [MIN\_INDEXATION\_KEY\_LENGTH](core.md#min_indexation_key_length)
- [MIN\_INDEXATION\_PAYLOAD\_LENGTH](core.md#min_indexation_payload_length)
- [MIN\_INPUT\_COUNT](core.md#min_input_count)
- [MIN\_INPUT\_LENGTH](core.md#min_input_length)
- [MIN\_MIGRATED\_FUNDS\_LENGTH](core.md#min_migrated_funds_length)
- [MIN\_MILESTONE\_PAYLOAD\_LENGTH](core.md#min_milestone_payload_length)
- [MIN\_NUMBER\_PARENTS](core.md#min_number_parents)
- [MIN\_OUTPUT\_COUNT](core.md#min_output_count)
- [MIN\_OUTPUT\_LENGTH](core.md#min_output_length)
- [MIN\_PAYLOAD\_LENGTH](core.md#min_payload_length)
- [MIN\_RECEIPT\_PAYLOAD\_LENGTH](core.md#min_receipt_payload_length)
- [MIN\_REFERENCE\_UNLOCK\_BLOCK\_LENGTH](core.md#min_reference_unlock_block_length)
- [MIN\_SIGNATURE\_LENGTH](core.md#min_signature_length)
- [MIN\_SIGNATURE\_UNLOCK\_BLOCK\_LENGTH](core.md#min_signature_unlock_block_length)
- [MIN\_SIG\_LOCKED\_DUST\_ALLOWANCE\_OUTPUT\_LENGTH](core.md#min_sig_locked_dust_allowance_output_length)
- [MIN\_SIG\_LOCKED\_SINGLE\_OUTPUT\_LENGTH](core.md#min_sig_locked_single_output_length)
- [MIN\_TRANSACTION\_ESSENCE\_LENGTH](core.md#min_transaction_essence_length)
- [MIN\_TRANSACTION\_PAYLOAD\_LENGTH](core.md#min_transaction_payload_length)
- [MIN\_TREASURY\_INPUT\_LENGTH](core.md#min_treasury_input_length)
- [MIN\_TREASURY\_OUTPUT\_LENGTH](core.md#min_treasury_output_length)
- [MIN\_TREASURY\_TRANSACTION\_PAYLOAD\_LENGTH](core.md#min_treasury_transaction_payload_length)
- [MIN\_UNLOCK\_BLOCK\_LENGTH](core.md#min_unlock_block_length)
- [MIN\_UTXO\_INPUT\_LENGTH](core.md#min_utxo_input_length)
- [Pbkdf2](core.md#pbkdf2)
- [Poly1305](core.md#poly1305)
- [PowHelper](core.md#powhelper)
- [RECEIPT\_PAYLOAD\_TYPE](core.md#receipt_payload_type)
- [REFERENCE\_UNLOCK\_BLOCK\_TYPE](core.md#reference_unlock_block_type)
- [RandomHelper](core.md#randomhelper)
- [ReadStream](core.md#readstream)
- [SIGNATURE\_UNLOCK\_BLOCK\_TYPE](core.md#signature_unlock_block_type)
- [SIG\_LOCKED\_DUST\_ALLOWANCE\_OUTPUT\_TYPE](core.md#sig_locked_dust_allowance_output_type)
- [SIG\_LOCKED\_SINGLE\_OUTPUT\_TYPE](core.md#sig_locked_single_output_type)
- [SMALL\_TYPE\_LENGTH](core.md#small_type_length)
- [STRING\_LENGTH](core.md#string_length)
- [Sha256](core.md#sha256)
- [Sha512](core.md#sha512)
- [SingleNodeClient](core.md#singlenodeclient)
- [SingleNodeClientOptions](core.md#singlenodeclientoptions)
- [Slip0010](core.md#slip0010)
- [TAIL\_HASH\_LENGTH](core.md#tail_hash_length)
- [TRANSACTION\_ESSENCE\_TYPE](core.md#transaction_essence_type)
- [TRANSACTION\_ID\_LENGTH](core.md#transaction_id_length)
- [TRANSACTION\_PAYLOAD\_TYPE](core.md#transaction_payload_type)
- [TREASURY\_INPUT\_TYPE](core.md#treasury_input_type)
- [TREASURY\_OUTPUT\_TYPE](core.md#treasury_output_type)
- [TREASURY\_TRANSACTION\_PAYLOAD\_TYPE](core.md#treasury_transaction_payload_type)
- [TYPE\_LENGTH](core.md#type_length)
- [UINT16\_SIZE](core.md#uint16_size)
- [UINT32\_SIZE](core.md#uint32_size)
- [UINT64\_SIZE](core.md#uint64_size)
- [UTXO\_INPUT\_TYPE](core.md#utxo_input_type)
- [Units](core.md#units)
- [UnitsHelper](core.md#unitshelper)
- [WriteStream](core.md#writestream)
- [X25519](core.md#x25519)
- [Zip215](core.md#zip215)
- [buildTransactionPayload](core.md#buildtransactionpayload)
- [calculateInputs](core.md#calculateinputs)
- [deserializeAddress](core.md#deserializeaddress)
- [deserializeEd25519Address](core.md#deserializeed25519address)
- [deserializeEd25519Signature](core.md#deserializeed25519signature)
- [deserializeFunds](core.md#deserializefunds)
- [deserializeIndexationPayload](core.md#deserializeindexationpayload)
- [deserializeInput](core.md#deserializeinput)
- [deserializeInputs](core.md#deserializeinputs)
- [deserializeMessage](core.md#deserializemessage)
- [deserializeMigratedFunds](core.md#deserializemigratedfunds)
- [deserializeMilestonePayload](core.md#deserializemilestonepayload)
- [deserializeOutput](core.md#deserializeoutput)
- [deserializeOutputs](core.md#deserializeoutputs)
- [deserializePayload](core.md#deserializepayload)
- [deserializeReceiptPayload](core.md#deserializereceiptpayload)
- [deserializeReferenceUnlockBlock](core.md#deserializereferenceunlockblock)
- [deserializeSigLockedDustAllowanceOutput](core.md#deserializesiglockeddustallowanceoutput)
- [deserializeSigLockedSingleOutput](core.md#deserializesiglockedsingleoutput)
- [deserializeSignature](core.md#deserializesignature)
- [deserializeSignatureUnlockBlock](core.md#deserializesignatureunlockblock)
- [deserializeTransactionEssence](core.md#deserializetransactionessence)
- [deserializeTransactionPayload](core.md#deserializetransactionpayload)
- [deserializeTreasuryInput](core.md#deserializetreasuryinput)
- [deserializeTreasuryOutput](core.md#deserializetreasuryoutput)
- [deserializeTreasuryTransactionPayload](core.md#deserializetreasurytransactionpayload)
- [deserializeUTXOInput](core.md#deserializeutxoinput)
- [deserializeUnlockBlock](core.md#deserializeunlockblock)
- [deserializeUnlockBlocks](core.md#deserializeunlockblocks)
- [generateBip44Address](core.md#generatebip44address)
- [generateBip44Path](core.md#generatebip44path)
- [getBalance](core.md#getbalance)
- [getUnspentAddress](core.md#getunspentaddress)
- [getUnspentAddresses](core.md#getunspentaddresses)
- [getUnspentAddressesWithAddressGenerator](core.md#getunspentaddresseswithaddressgenerator)
- [logAddress](core.md#logaddress)
- [logFunds](core.md#logfunds)
- [logIndexationPayload](core.md#logindexationpayload)
- [logInfo](core.md#loginfo)
- [logInput](core.md#loginput)
- [logMessage](core.md#logmessage)
- [logMessageMetadata](core.md#logmessagemetadata)
- [logMilestonePayload](core.md#logmilestonepayload)
- [logOutput](core.md#logoutput)
- [logPayload](core.md#logpayload)
- [logReceiptPayload](core.md#logreceiptpayload)
- [logSignature](core.md#logsignature)
- [logTips](core.md#logtips)
- [logTransactionPayload](core.md#logtransactionpayload)
- [logTreasuryTransactionPayload](core.md#logtreasurytransactionpayload)
- [logUnlockBlock](core.md#logunlockblock)
- [promote](core.md#promote)
- [reattach](core.md#reattach)
- [retrieveData](core.md#retrievedata)
- [retry](core.md#retry)
- [send](core.md#send)
- [sendAdvanced](core.md#sendadvanced)
- [sendData](core.md#senddata)
- [sendEd25519](core.md#sended25519)
- [sendMultiple](core.md#sendmultiple)
- [sendMultipleEd25519](core.md#sendmultipleed25519)
- [sendWithAddressGenerator](core.md#sendwithaddressgenerator)
- [serializeAddress](core.md#serializeaddress)
- [serializeEd25519Address](core.md#serializeed25519address)
- [serializeEd25519Signature](core.md#serializeed25519signature)
- [serializeFunds](core.md#serializefunds)
- [serializeIndexationPayload](core.md#serializeindexationpayload)
- [serializeInput](core.md#serializeinput)
- [serializeInputs](core.md#serializeinputs)
- [serializeMessage](core.md#serializemessage)
- [serializeMigratedFunds](core.md#serializemigratedfunds)
- [serializeMilestonePayload](core.md#serializemilestonepayload)
- [serializeOutput](core.md#serializeoutput)
- [serializeOutputs](core.md#serializeoutputs)
- [serializePayload](core.md#serializepayload)
- [serializeReceiptPayload](core.md#serializereceiptpayload)
- [serializeReferenceUnlockBlock](core.md#serializereferenceunlockblock)
- [serializeSigLockedDustAllowanceOutput](core.md#serializesiglockeddustallowanceoutput)
- [serializeSigLockedSingleOutput](core.md#serializesiglockedsingleoutput)
- [serializeSignature](core.md#serializesignature)
- [serializeSignatureUnlockBlock](core.md#serializesignatureunlockblock)
- [serializeTransactionEssence](core.md#serializetransactionessence)
- [serializeTransactionPayload](core.md#serializetransactionpayload)
- [serializeTreasuryInput](core.md#serializetreasuryinput)
- [serializeTreasuryOutput](core.md#serializetreasuryoutput)
- [serializeTreasuryTransactionPayload](core.md#serializetreasurytransactionpayload)
- [serializeUTXOInput](core.md#serializeutxoinput)
- [serializeUnlockBlock](core.md#serializeunlockblock)
- [serializeUnlockBlocks](core.md#serializeunlockblocks)
- [setLogger](core.md#setlogger)

## References

### ARRAY\_LENGTH

Re-exports: [ARRAY\_LENGTH](binary_common.md#array_length)

___

### ArrayHelper

Re-exports: [ArrayHelper](../classes/utils_arrayhelper.arrayhelper.md)

___

### B1T6

Re-exports: [B1T6](../classes/encoding_b1t6.b1t6.md)

___

### BYTE\_SIZE

Re-exports: [BYTE\_SIZE](binary_common.md#byte_size)

___

### Base64

Re-exports: [Base64](../classes/encoding_base64.base64.md)

___

### Bech32

Re-exports: [Bech32](../classes/crypto_bech32.bech32.md)

___

### Bech32Helper

Re-exports: [Bech32Helper](../classes/utils_bech32helper.bech32helper.md)

___

### BigIntHelper

Re-exports: [BigIntHelper](../classes/utils_biginthelper.biginthelper.md)

___

### Bip32Path

Re-exports: [Bip32Path](../classes/crypto_bip32path.bip32path.md)

___

### Bip39

Re-exports: [Bip39](../classes/crypto_bip39.bip39.md)

___

### Blake2b

Re-exports: [Blake2b](../classes/crypto_blake2b.blake2b.md)

___

### CONFLICT\_REASON\_STRINGS

Re-exports: [CONFLICT\_REASON\_STRINGS](resources_conflictreasonstrings.md#conflict_reason_strings)

___

### ChaCha20

Re-exports: [ChaCha20](../classes/crypto_chacha20.chacha20.md)

___

### ChaCha20Poly1305

Re-exports: [ChaCha20Poly1305](../classes/crypto_chacha20poly1305.chacha20poly1305.md)

___

### ClientError

Re-exports: [ClientError](../classes/clients_clienterror.clienterror.md)

___

### ConflictReason

Re-exports: [ConflictReason](../enums/models_conflictreason.conflictreason.md)

___

### Converter

Re-exports: [Converter](../classes/utils_converter.converter.md)

___

### Curl

Re-exports: [Curl](../classes/crypto_curl.curl.md)

___

### ED25519\_ADDRESS\_TYPE

Re-exports: [ED25519\_ADDRESS\_TYPE](models_ied25519address.md#ed25519_address_type)

___

### ED25519\_SEED\_TYPE

Re-exports: [ED25519\_SEED\_TYPE](seedtypes_ed25519seed.md#ed25519_seed_type)

___

### ED25519\_SIGNATURE\_TYPE

Re-exports: [ED25519\_SIGNATURE\_TYPE](models_ied25519signature.md#ed25519_signature_type)

___

### Ed25519

Re-exports: [Ed25519](../classes/crypto_ed25519.ed25519.md)

___

### Ed25519Address

Re-exports: [Ed25519Address](../classes/addresstypes_ed25519address.ed25519address.md)

___

### Ed25519Seed

Re-exports: [Ed25519Seed](../classes/seedtypes_ed25519seed.ed25519seed.md)

___

### HmacSha256

Re-exports: [HmacSha256](../classes/crypto_hmacsha256.hmacsha256.md)

___

### HmacSha512

Re-exports: [HmacSha512](../classes/crypto_hmacsha512.hmacsha512.md)

___

### IAddress

Re-exports: [IAddress](../interfaces/models_iaddress.iaddress.md)

___

### IAddressOutputsResponse

Re-exports: [IAddressOutputsResponse](../interfaces/models_api_iaddressoutputsresponse.iaddressoutputsresponse.md)

___

### IAddressResponse

Re-exports: [IAddressResponse](../interfaces/models_api_iaddressresponse.iaddressresponse.md)

___

### IBip44GeneratorState

Re-exports: [IBip44GeneratorState](../interfaces/models_ibip44generatorstate.ibip44generatorstate.md)

___

### IChildrenResponse

Re-exports: [IChildrenResponse](../interfaces/models_api_ichildrenresponse.ichildrenresponse.md)

___

### IClient

Re-exports: [IClient](../interfaces/models_iclient.iclient.md)

___

### IEd25519Address

Re-exports: [IEd25519Address](../interfaces/models_ied25519address.ied25519address.md)

___

### IEd25519Signature

Re-exports: [IEd25519Signature](../interfaces/models_ied25519signature.ied25519signature.md)

___

### IGossipHeartbeat

Re-exports: [IGossipHeartbeat](../interfaces/models_igossipheartbeat.igossipheartbeat.md)

___

### IGossipMetrics

Re-exports: [IGossipMetrics](../interfaces/models_igossipmetrics.igossipmetrics.md)

___

### IIndexationPayload

Re-exports: [IIndexationPayload](../interfaces/models_iindexationpayload.iindexationpayload.md)

___

### IKeyPair

Re-exports: [IKeyPair](../interfaces/models_ikeypair.ikeypair.md)

___

### IMessage

Re-exports: [IMessage](../interfaces/models_imessage.imessage.md)

___

### IMessageIdResponse

Re-exports: [IMessageIdResponse](../interfaces/models_api_imessageidresponse.imessageidresponse.md)

___

### IMessageMetadata

Re-exports: [IMessageMetadata](../interfaces/models_imessagemetadata.imessagemetadata.md)

___

### IMessagesResponse

Re-exports: [IMessagesResponse](../interfaces/models_api_imessagesresponse.imessagesresponse.md)

___

### IMigratedFunds

Re-exports: [IMigratedFunds](../interfaces/models_imigratedfunds.imigratedfunds.md)

___

### IMilestonePayload

Re-exports: [IMilestonePayload](../interfaces/models_imilestonepayload.imilestonepayload.md)

___

### IMilestoneResponse

Re-exports: [IMilestoneResponse](../interfaces/models_api_imilestoneresponse.imilestoneresponse.md)

___

### IMilestoneUtxoChangesResponse

Re-exports: [IMilestoneUtxoChangesResponse](../interfaces/models_api_imilestoneutxochangesresponse.imilestoneutxochangesresponse.md)

___

### INDEXATION\_PAYLOAD\_TYPE

Re-exports: [INDEXATION\_PAYLOAD\_TYPE](models_iindexationpayload.md#indexation_payload_type)

___

### INodeInfo

Re-exports: [INodeInfo](../interfaces/models_inodeinfo.inodeinfo.md)

___

### IOutputResponse

Re-exports: [IOutputResponse](../interfaces/models_api_ioutputresponse.ioutputresponse.md)

___

### IPeer

Re-exports: [IPeer](../interfaces/models_ipeer.ipeer.md)

___

### IPowProvider

Re-exports: [IPowProvider](../interfaces/models_ipowprovider.ipowprovider.md)

___

### IReceiptPayload

Re-exports: [IReceiptPayload](../interfaces/models_ireceiptpayload.ireceiptpayload.md)

___

### IReceiptsResponse

Re-exports: [IReceiptsResponse](../interfaces/models_api_ireceiptsresponse.ireceiptsresponse.md)

___

### IReferenceUnlockBlock

Re-exports: [IReferenceUnlockBlock](../interfaces/models_ireferenceunlockblock.ireferenceunlockblock.md)

___

### IResponse

Re-exports: [IResponse](../interfaces/models_api_iresponse.iresponse.md)

___

### ISeed

Re-exports: [ISeed](../interfaces/models_iseed.iseed.md)

___

### ISigLockedDustAllowanceOutput

Re-exports: [ISigLockedDustAllowanceOutput](../interfaces/models_isiglockeddustallowanceoutput.isiglockeddustallowanceoutput.md)

___

### ISigLockedSingleOutput

Re-exports: [ISigLockedSingleOutput](../interfaces/models_isiglockedsingleoutput.isiglockedsingleoutput.md)

___

### ISignatureUnlockBlock

Re-exports: [ISignatureUnlockBlock](../interfaces/models_isignatureunlockblock.isignatureunlockblock.md)

___

### ITipsResponse

Re-exports: [ITipsResponse](../interfaces/models_api_itipsresponse.itipsresponse.md)

___

### ITransactionEssence

Re-exports: [ITransactionEssence](../interfaces/models_itransactionessence.itransactionessence.md)

___

### ITransactionPayload

Re-exports: [ITransactionPayload](../interfaces/models_itransactionpayload.itransactionpayload.md)

___

### ITreasury

Re-exports: [ITreasury](../interfaces/models_itreasury.itreasury.md)

___

### ITreasuryInput

Re-exports: [ITreasuryInput](../interfaces/models_itreasuryinput.itreasuryinput.md)

___

### ITreasuryOutput

Re-exports: [ITreasuryOutput](../interfaces/models_itreasuryoutput.itreasuryoutput.md)

___

### ITreasuryTransactionPayload

Re-exports: [ITreasuryTransactionPayload](../interfaces/models_itreasurytransactionpayload.itreasurytransactionpayload.md)

___

### ITypeBase

Re-exports: [ITypeBase](../interfaces/models_itypebase.itypebase.md)

___

### IUTXOInput

Re-exports: [IUTXOInput](../interfaces/models_iutxoinput.iutxoinput.md)

___

### LedgerInclusionState

Re-exports: [LedgerInclusionState](models_ledgerinclusionstate.md#ledgerinclusionstate)

___

### LocalPowProvider

Re-exports: [LocalPowProvider](../classes/pow_localpowprovider.localpowprovider.md)

___

### MAX\_FUNDS\_COUNT

Re-exports: [MAX\_FUNDS\_COUNT](binary_funds.md#max_funds_count)

___

### MAX\_INDEXATION\_KEY\_LENGTH

Re-exports: [MAX\_INDEXATION\_KEY\_LENGTH](binary_payload.md#max_indexation_key_length)

___

### MAX\_INPUT\_COUNT

Re-exports: [MAX\_INPUT\_COUNT](binary_input.md#max_input_count)

___

### MAX\_MESSAGE\_LENGTH

Re-exports: [MAX\_MESSAGE\_LENGTH](binary_message.md#max_message_length)

___

### MAX\_NUMBER\_PARENTS

Re-exports: [MAX\_NUMBER\_PARENTS](binary_message.md#max_number_parents)

___

### MAX\_OUTPUT\_COUNT

Re-exports: [MAX\_OUTPUT\_COUNT](binary_output.md#max_output_count)

___

### MERKLE\_PROOF\_LENGTH

Re-exports: [MERKLE\_PROOF\_LENGTH](binary_common.md#merkle_proof_length)

___

### MESSAGE\_ID\_LENGTH

Re-exports: [MESSAGE\_ID\_LENGTH](binary_common.md#message_id_length)

___

### MILESTONE\_PAYLOAD\_TYPE

Re-exports: [MILESTONE\_PAYLOAD\_TYPE](models_imilestonepayload.md#milestone_payload_type)

___

### MIN\_ADDRESS\_LENGTH

Re-exports: [MIN\_ADDRESS\_LENGTH](binary_address.md#min_address_length)

___

### MIN\_ED25519\_ADDRESS\_LENGTH

Re-exports: [MIN\_ED25519\_ADDRESS\_LENGTH](binary_address.md#min_ed25519_address_length)

___

### MIN\_ED25519\_SIGNATURE\_LENGTH

Re-exports: [MIN\_ED25519\_SIGNATURE\_LENGTH](binary_signature.md#min_ed25519_signature_length)

___

### MIN\_INDEXATION\_KEY\_LENGTH

Re-exports: [MIN\_INDEXATION\_KEY\_LENGTH](binary_payload.md#min_indexation_key_length)

___

### MIN\_INDEXATION\_PAYLOAD\_LENGTH

Re-exports: [MIN\_INDEXATION\_PAYLOAD\_LENGTH](binary_payload.md#min_indexation_payload_length)

___

### MIN\_INPUT\_COUNT

Re-exports: [MIN\_INPUT\_COUNT](binary_input.md#min_input_count)

___

### MIN\_INPUT\_LENGTH

Re-exports: [MIN\_INPUT\_LENGTH](binary_input.md#min_input_length)

___

### MIN\_MIGRATED\_FUNDS\_LENGTH

Re-exports: [MIN\_MIGRATED\_FUNDS\_LENGTH](binary_funds.md#min_migrated_funds_length)

___

### MIN\_MILESTONE\_PAYLOAD\_LENGTH

Re-exports: [MIN\_MILESTONE\_PAYLOAD\_LENGTH](binary_payload.md#min_milestone_payload_length)

___

### MIN\_NUMBER\_PARENTS

Re-exports: [MIN\_NUMBER\_PARENTS](binary_message.md#min_number_parents)

___

### MIN\_OUTPUT\_COUNT

Re-exports: [MIN\_OUTPUT\_COUNT](binary_output.md#min_output_count)

___

### MIN\_OUTPUT\_LENGTH

Re-exports: [MIN\_OUTPUT\_LENGTH](binary_output.md#min_output_length)

___

### MIN\_PAYLOAD\_LENGTH

Re-exports: [MIN\_PAYLOAD\_LENGTH](binary_payload.md#min_payload_length)

___

### MIN\_RECEIPT\_PAYLOAD\_LENGTH

Re-exports: [MIN\_RECEIPT\_PAYLOAD\_LENGTH](binary_payload.md#min_receipt_payload_length)

___

### MIN\_REFERENCE\_UNLOCK\_BLOCK\_LENGTH

Re-exports: [MIN\_REFERENCE\_UNLOCK\_BLOCK\_LENGTH](binary_unlockblock.md#min_reference_unlock_block_length)

___

### MIN\_SIGNATURE\_LENGTH

Re-exports: [MIN\_SIGNATURE\_LENGTH](binary_signature.md#min_signature_length)

___

### MIN\_SIGNATURE\_UNLOCK\_BLOCK\_LENGTH

Re-exports: [MIN\_SIGNATURE\_UNLOCK\_BLOCK\_LENGTH](binary_unlockblock.md#min_signature_unlock_block_length)

___

### MIN\_SIG\_LOCKED\_DUST\_ALLOWANCE\_OUTPUT\_LENGTH

Re-exports: [MIN\_SIG\_LOCKED\_DUST\_ALLOWANCE\_OUTPUT\_LENGTH](binary_output.md#min_sig_locked_dust_allowance_output_length)

___

### MIN\_SIG\_LOCKED\_SINGLE\_OUTPUT\_LENGTH

Re-exports: [MIN\_SIG\_LOCKED\_SINGLE\_OUTPUT\_LENGTH](binary_output.md#min_sig_locked_single_output_length)

___

### MIN\_TRANSACTION\_ESSENCE\_LENGTH

Re-exports: [MIN\_TRANSACTION\_ESSENCE\_LENGTH](binary_transaction.md#min_transaction_essence_length)

___

### MIN\_TRANSACTION\_PAYLOAD\_LENGTH

Re-exports: [MIN\_TRANSACTION\_PAYLOAD\_LENGTH](binary_payload.md#min_transaction_payload_length)

___

### MIN\_TREASURY\_INPUT\_LENGTH

Re-exports: [MIN\_TREASURY\_INPUT\_LENGTH](binary_input.md#min_treasury_input_length)

___

### MIN\_TREASURY\_OUTPUT\_LENGTH

Re-exports: [MIN\_TREASURY\_OUTPUT\_LENGTH](binary_output.md#min_treasury_output_length)

___

### MIN\_TREASURY\_TRANSACTION\_PAYLOAD\_LENGTH

Re-exports: [MIN\_TREASURY\_TRANSACTION\_PAYLOAD\_LENGTH](binary_payload.md#min_treasury_transaction_payload_length)

___

### MIN\_UNLOCK\_BLOCK\_LENGTH

Re-exports: [MIN\_UNLOCK\_BLOCK\_LENGTH](binary_unlockblock.md#min_unlock_block_length)

___

### MIN\_UTXO\_INPUT\_LENGTH

Re-exports: [MIN\_UTXO\_INPUT\_LENGTH](binary_input.md#min_utxo_input_length)

___

### Pbkdf2

Re-exports: [Pbkdf2](../classes/crypto_pbkdf2.pbkdf2.md)

___

### Poly1305

Re-exports: [Poly1305](../classes/crypto_poly1305.poly1305.md)

___

### PowHelper

Re-exports: [PowHelper](../classes/utils_powhelper.powhelper.md)

___

### RECEIPT\_PAYLOAD\_TYPE

Re-exports: [RECEIPT\_PAYLOAD\_TYPE](models_ireceiptpayload.md#receipt_payload_type)

___

### REFERENCE\_UNLOCK\_BLOCK\_TYPE

Re-exports: [REFERENCE\_UNLOCK\_BLOCK\_TYPE](models_ireferenceunlockblock.md#reference_unlock_block_type)

___

### RandomHelper

Re-exports: [RandomHelper](../classes/utils_randomhelper.randomhelper.md)

___

### ReadStream

Re-exports: [ReadStream](../classes/utils_readstream.readstream.md)

___

### SIGNATURE\_UNLOCK\_BLOCK\_TYPE

Re-exports: [SIGNATURE\_UNLOCK\_BLOCK\_TYPE](models_isignatureunlockblock.md#signature_unlock_block_type)

___

### SIG\_LOCKED\_DUST\_ALLOWANCE\_OUTPUT\_TYPE

Re-exports: [SIG\_LOCKED\_DUST\_ALLOWANCE\_OUTPUT\_TYPE](models_isiglockeddustallowanceoutput.md#sig_locked_dust_allowance_output_type)

___

### SIG\_LOCKED\_SINGLE\_OUTPUT\_TYPE

Re-exports: [SIG\_LOCKED\_SINGLE\_OUTPUT\_TYPE](models_isiglockedsingleoutput.md#sig_locked_single_output_type)

___

### SMALL\_TYPE\_LENGTH

Re-exports: [SMALL\_TYPE\_LENGTH](binary_common.md#small_type_length)

___

### STRING\_LENGTH

Re-exports: [STRING\_LENGTH](binary_common.md#string_length)

___

### Sha256

Re-exports: [Sha256](../classes/crypto_sha256.sha256.md)

___

### Sha512

Re-exports: [Sha512](../classes/crypto_sha512.sha512.md)

___

### SingleNodeClient

Re-exports: [SingleNodeClient](../classes/clients_singlenodeclient.singlenodeclient.md)

___

### SingleNodeClientOptions

Re-exports: [SingleNodeClientOptions](../interfaces/clients_singlenodeclientoptions.singlenodeclientoptions.md)

___

### Slip0010

Re-exports: [Slip0010](../classes/crypto_slip0010.slip0010.md)

___

### TAIL\_HASH\_LENGTH

Re-exports: [TAIL\_HASH\_LENGTH](binary_funds.md#tail_hash_length)

___

### TRANSACTION\_ESSENCE\_TYPE

Re-exports: [TRANSACTION\_ESSENCE\_TYPE](models_itransactionessence.md#transaction_essence_type)

___

### TRANSACTION\_ID\_LENGTH

Re-exports: [TRANSACTION\_ID\_LENGTH](binary_common.md#transaction_id_length)

___

### TRANSACTION\_PAYLOAD\_TYPE

Re-exports: [TRANSACTION\_PAYLOAD\_TYPE](models_itransactionpayload.md#transaction_payload_type)

___

### TREASURY\_INPUT\_TYPE

Re-exports: [TREASURY\_INPUT\_TYPE](models_itreasuryinput.md#treasury_input_type)

___

### TREASURY\_OUTPUT\_TYPE

Re-exports: [TREASURY\_OUTPUT\_TYPE](models_itreasuryoutput.md#treasury_output_type)

___

### TREASURY\_TRANSACTION\_PAYLOAD\_TYPE

Re-exports: [TREASURY\_TRANSACTION\_PAYLOAD\_TYPE](models_itreasurytransactionpayload.md#treasury_transaction_payload_type)

___

### TYPE\_LENGTH

Re-exports: [TYPE\_LENGTH](binary_common.md#type_length)

___

### UINT16\_SIZE

Re-exports: [UINT16\_SIZE](binary_common.md#uint16_size)

___

### UINT32\_SIZE

Re-exports: [UINT32\_SIZE](binary_common.md#uint32_size)

___

### UINT64\_SIZE

Re-exports: [UINT64\_SIZE](binary_common.md#uint64_size)

___

### UTXO\_INPUT\_TYPE

Re-exports: [UTXO\_INPUT\_TYPE](models_iutxoinput.md#utxo_input_type)

___

### Units

Re-exports: [Units](models_units.md#units)

___

### UnitsHelper

Re-exports: [UnitsHelper](../classes/utils_unitshelper.unitshelper.md)

___

### WriteStream

Re-exports: [WriteStream](../classes/utils_writestream.writestream.md)

___

### X25519

Re-exports: [X25519](../classes/crypto_x25519.x25519.md)

___

### Zip215

Re-exports: [Zip215](../classes/crypto_zip215.zip215.md)

___

### buildTransactionPayload

Re-exports: [buildTransactionPayload](highlevel_sendadvanced.md#buildtransactionpayload)

___

### calculateInputs

Re-exports: [calculateInputs](highlevel_send.md#calculateinputs)

___

### deserializeAddress

Re-exports: [deserializeAddress](binary_address.md#deserializeaddress)

___

### deserializeEd25519Address

Re-exports: [deserializeEd25519Address](binary_address.md#deserializeed25519address)

___

### deserializeEd25519Signature

Re-exports: [deserializeEd25519Signature](binary_signature.md#deserializeed25519signature)

___

### deserializeFunds

Re-exports: [deserializeFunds](binary_funds.md#deserializefunds)

___

### deserializeIndexationPayload

Re-exports: [deserializeIndexationPayload](binary_payload.md#deserializeindexationpayload)

___

### deserializeInput

Re-exports: [deserializeInput](binary_input.md#deserializeinput)

___

### deserializeInputs

Re-exports: [deserializeInputs](binary_input.md#deserializeinputs)

___

### deserializeMessage

Re-exports: [deserializeMessage](binary_message.md#deserializemessage)

___

### deserializeMigratedFunds

Re-exports: [deserializeMigratedFunds](binary_funds.md#deserializemigratedfunds)

___

### deserializeMilestonePayload

Re-exports: [deserializeMilestonePayload](binary_payload.md#deserializemilestonepayload)

___

### deserializeOutput

Re-exports: [deserializeOutput](binary_output.md#deserializeoutput)

___

### deserializeOutputs

Re-exports: [deserializeOutputs](binary_output.md#deserializeoutputs)

___

### deserializePayload

Re-exports: [deserializePayload](binary_payload.md#deserializepayload)

___

### deserializeReceiptPayload

Re-exports: [deserializeReceiptPayload](binary_payload.md#deserializereceiptpayload)

___

### deserializeReferenceUnlockBlock

Re-exports: [deserializeReferenceUnlockBlock](binary_unlockblock.md#deserializereferenceunlockblock)

___

### deserializeSigLockedDustAllowanceOutput

Re-exports: [deserializeSigLockedDustAllowanceOutput](binary_output.md#deserializesiglockeddustallowanceoutput)

___

### deserializeSigLockedSingleOutput

Re-exports: [deserializeSigLockedSingleOutput](binary_output.md#deserializesiglockedsingleoutput)

___

### deserializeSignature

Re-exports: [deserializeSignature](binary_signature.md#deserializesignature)

___

### deserializeSignatureUnlockBlock

Re-exports: [deserializeSignatureUnlockBlock](binary_unlockblock.md#deserializesignatureunlockblock)

___

### deserializeTransactionEssence

Re-exports: [deserializeTransactionEssence](binary_transaction.md#deserializetransactionessence)

___

### deserializeTransactionPayload

Re-exports: [deserializeTransactionPayload](binary_payload.md#deserializetransactionpayload)

___

### deserializeTreasuryInput

Re-exports: [deserializeTreasuryInput](binary_input.md#deserializetreasuryinput)

___

### deserializeTreasuryOutput

Re-exports: [deserializeTreasuryOutput](binary_output.md#deserializetreasuryoutput)

___

### deserializeTreasuryTransactionPayload

Re-exports: [deserializeTreasuryTransactionPayload](binary_payload.md#deserializetreasurytransactionpayload)

___

### deserializeUTXOInput

Re-exports: [deserializeUTXOInput](binary_input.md#deserializeutxoinput)

___

### deserializeUnlockBlock

Re-exports: [deserializeUnlockBlock](binary_unlockblock.md#deserializeunlockblock)

___

### deserializeUnlockBlocks

Re-exports: [deserializeUnlockBlocks](binary_unlockblock.md#deserializeunlockblocks)

___

### generateBip44Address

Re-exports: [generateBip44Address](highlevel_addresses.md#generatebip44address)

___

### generateBip44Path

Re-exports: [generateBip44Path](highlevel_addresses.md#generatebip44path)

___

### getBalance

Re-exports: [getBalance](highlevel_getbalance.md#getbalance)

___

### getUnspentAddress

Re-exports: [getUnspentAddress](highlevel_getunspentaddress.md#getunspentaddress)

___

### getUnspentAddresses

Re-exports: [getUnspentAddresses](highlevel_getunspentaddresses.md#getunspentaddresses)

___

### getUnspentAddressesWithAddressGenerator

Re-exports: [getUnspentAddressesWithAddressGenerator](highlevel_getunspentaddresses.md#getunspentaddresseswithaddressgenerator)

___

### logAddress

Re-exports: [logAddress](utils_logging.md#logaddress)

___

### logFunds

Re-exports: [logFunds](utils_logging.md#logfunds)

___

### logIndexationPayload

Re-exports: [logIndexationPayload](utils_logging.md#logindexationpayload)

___

### logInfo

Re-exports: [logInfo](utils_logging.md#loginfo)

___

### logInput

Re-exports: [logInput](utils_logging.md#loginput)

___

### logMessage

Re-exports: [logMessage](utils_logging.md#logmessage)

___

### logMessageMetadata

Re-exports: [logMessageMetadata](utils_logging.md#logmessagemetadata)

___

### logMilestonePayload

Re-exports: [logMilestonePayload](utils_logging.md#logmilestonepayload)

___

### logOutput

Re-exports: [logOutput](utils_logging.md#logoutput)

___

### logPayload

Re-exports: [logPayload](utils_logging.md#logpayload)

___

### logReceiptPayload

Re-exports: [logReceiptPayload](utils_logging.md#logreceiptpayload)

___

### logSignature

Re-exports: [logSignature](utils_logging.md#logsignature)

___

### logTips

Re-exports: [logTips](utils_logging.md#logtips)

___

### logTransactionPayload

Re-exports: [logTransactionPayload](utils_logging.md#logtransactionpayload)

___

### logTreasuryTransactionPayload

Re-exports: [logTreasuryTransactionPayload](utils_logging.md#logtreasurytransactionpayload)

___

### logUnlockBlock

Re-exports: [logUnlockBlock](utils_logging.md#logunlockblock)

___

### promote

Re-exports: [promote](highlevel_promote.md#promote)

___

### reattach

Re-exports: [reattach](highlevel_reattach.md#reattach)

___

### retrieveData

Re-exports: [retrieveData](highlevel_retrievedata.md#retrievedata)

___

### retry

Re-exports: [retry](highlevel_retry.md#retry)

___

### send

Re-exports: [send](highlevel_send.md#send)

___

### sendAdvanced

Re-exports: [sendAdvanced](highlevel_sendadvanced.md#sendadvanced)

___

### sendData

Re-exports: [sendData](highlevel_senddata.md#senddata)

___

### sendEd25519

Re-exports: [sendEd25519](highlevel_send.md#sended25519)

___

### sendMultiple

Re-exports: [sendMultiple](highlevel_send.md#sendmultiple)

___

### sendMultipleEd25519

Re-exports: [sendMultipleEd25519](highlevel_send.md#sendmultipleed25519)

___

### sendWithAddressGenerator

Re-exports: [sendWithAddressGenerator](highlevel_send.md#sendwithaddressgenerator)

___

### serializeAddress

Re-exports: [serializeAddress](binary_address.md#serializeaddress)

___

### serializeEd25519Address

Re-exports: [serializeEd25519Address](binary_address.md#serializeed25519address)

___

### serializeEd25519Signature

Re-exports: [serializeEd25519Signature](binary_signature.md#serializeed25519signature)

___

### serializeFunds

Re-exports: [serializeFunds](binary_funds.md#serializefunds)

___

### serializeIndexationPayload

Re-exports: [serializeIndexationPayload](binary_payload.md#serializeindexationpayload)

___

### serializeInput

Re-exports: [serializeInput](binary_input.md#serializeinput)

___

### serializeInputs

Re-exports: [serializeInputs](binary_input.md#serializeinputs)

___

### serializeMessage

Re-exports: [serializeMessage](binary_message.md#serializemessage)

___

### serializeMigratedFunds

Re-exports: [serializeMigratedFunds](binary_funds.md#serializemigratedfunds)

___

### serializeMilestonePayload

Re-exports: [serializeMilestonePayload](binary_payload.md#serializemilestonepayload)

___

### serializeOutput

Re-exports: [serializeOutput](binary_output.md#serializeoutput)

___

### serializeOutputs

Re-exports: [serializeOutputs](binary_output.md#serializeoutputs)

___

### serializePayload

Re-exports: [serializePayload](binary_payload.md#serializepayload)

___

### serializeReceiptPayload

Re-exports: [serializeReceiptPayload](binary_payload.md#serializereceiptpayload)

___

### serializeReferenceUnlockBlock

Re-exports: [serializeReferenceUnlockBlock](binary_unlockblock.md#serializereferenceunlockblock)

___

### serializeSigLockedDustAllowanceOutput

Re-exports: [serializeSigLockedDustAllowanceOutput](binary_output.md#serializesiglockeddustallowanceoutput)

___

### serializeSigLockedSingleOutput

Re-exports: [serializeSigLockedSingleOutput](binary_output.md#serializesiglockedsingleoutput)

___

### serializeSignature

Re-exports: [serializeSignature](binary_signature.md#serializesignature)

___

### serializeSignatureUnlockBlock

Re-exports: [serializeSignatureUnlockBlock](binary_unlockblock.md#serializesignatureunlockblock)

___

### serializeTransactionEssence

Re-exports: [serializeTransactionEssence](binary_transaction.md#serializetransactionessence)

___

### serializeTransactionPayload

Re-exports: [serializeTransactionPayload](binary_payload.md#serializetransactionpayload)

___

### serializeTreasuryInput

Re-exports: [serializeTreasuryInput](binary_input.md#serializetreasuryinput)

___

### serializeTreasuryOutput

Re-exports: [serializeTreasuryOutput](binary_output.md#serializetreasuryoutput)

___

### serializeTreasuryTransactionPayload

Re-exports: [serializeTreasuryTransactionPayload](binary_payload.md#serializetreasurytransactionpayload)

___

### serializeUTXOInput

Re-exports: [serializeUTXOInput](binary_input.md#serializeutxoinput)

___

### serializeUnlockBlock

Re-exports: [serializeUnlockBlock](binary_unlockblock.md#serializeunlockblock)

___

### serializeUnlockBlocks

Re-exports: [serializeUnlockBlocks](binary_unlockblock.md#serializeunlockblocks)

___

### setLogger

Re-exports: [setLogger](utils_logging.md#setlogger)
