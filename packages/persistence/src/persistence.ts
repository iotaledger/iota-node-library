import { asyncBuffer, AsyncBuffer } from '@iota/async-buffer'
import { bytesToTrits, tritsToBytes, tritsToTrytes, tritsToValue, trytesToTrits, valueToTrits } from '@iota/converter'
import Kerl from '@iota/kerl'
import { address as signingAddress, digests, key, subseed } from '@iota/signing'
import { ADDRESS_LENGTH, bundle, isMultipleOfTransactionLength } from '@iota/transaction'
import * as Promise from 'bluebird'
import { EventEmitter } from 'events'
import * as errors from '../../errors'
import { isTrits } from '../../guards'
import {
    Persistence,
    PersistenceAdapter,
    PersistenceAdapterBatch,
    PersistenceAdapterBatchTypes,
    PersistenceBatch,
    PersistenceBatchTypes,
    PersistenceError,
    PersistenceEvents,
    PersistenceIteratorOptions,
    PersistenceParams,
} from '../../types'

export {
    Persistence,
    PersistenceAdapter,
    PersistenceBatch,
    PersistenceBatchTypes,
    PersistenceEvents,
    PersistenceError,
    PersistenceIteratorOptions,
    PersistenceParams,
}

const CDA_ADDRESS_OFFSET = 0
const CDA_ADDRESS_LENGTH = ADDRESS_LENGTH
const CDA_LENGTH = 243 + 27 + 27 + 1 + 81 + 35 + 1 // address + checksum + timeout_at + multi_use + expected_amount + key_index + security
const CDAddress = (cda: Int8Array) => cda.slice(CDA_ADDRESS_OFFSET, CDA_ADDRESS_OFFSET + CDA_ADDRESS_LENGTH)

const KEY_INDEX_START = 0

const verifyIndex = (index: Int8Array) => {
    if (tritsToValue(index) < KEY_INDEX_START || !Number.isSafeInteger(tritsToValue(index))) {
        throw new Error(errors.ILLEGAL_KEY_INDEX)
    }
    return index
}

const increment = (index: Int8Array) => valueToTrits(tritsToValue(index) + 1)

const prefixes = {
    KEY_INDEX_PREFIX: tritsToBytes(trytesToTrits('KEY9INDEX')),
}

export function createPersistence({
    persistenceID,
    persistencePath,
    stateAdapter,
    historyAdapter,
}: PersistenceParams): Persistence<Int8Array> {
    const state = stateAdapter({ persistenceID: 'STATE-OF-' + persistenceID, persistencePath })
    const history = historyAdapter({ persistenceID: 'HISTORY-OF-' + persistenceID, persistencePath })

    const indexBuffer = asyncBuffer<Int8Array>()
    let initialized = false

    const ready = () => {
        if (initialized) {
            return Promise.resolve()
        }

        initialized = true

        return state
            .read(prefixes.KEY_INDEX_PREFIX)
            .then(bytesToTrits)
            .then(indexBuffer.write)
            .catch(error => {
                if (error.notFound) {
                    // Intialize index field in store.
                    const index = valueToTrits(KEY_INDEX_START)

                    return state.write(prefixes.KEY_INDEX_PREFIX, tritsToBytes(index)).then(() => {
                        indexBuffer.write(index)
                        return index
                    })
                }

                throw error
            })
    }

    function persistenceMixin(this: any) {
        return Object.assign(
            this,
            {
                nextIndex: () =>
                    ready()
                        .then(indexBuffer.read)
                        .then(verifyIndex)
                        .then(increment)
                        .then(index =>
                            state
                                .write(prefixes.KEY_INDEX_PREFIX, tritsToBytes(index))
                                .then(() => indexBuffer.write(index))
                                .then(() => index)
                                .catch(error => {
                                    // On error, restore the buffer value and rethrow.
                                    indexBuffer.write(index)
                                    throw error
                                })
                        ),

                writeBundle: (buffer: Int8Array) => {
                    if (!isMultipleOfTransactionLength(buffer.length)) {
                        throw new RangeError(errors.ILLEGAL_BUNDLE_LENGTH)
                    }

                    return ready()
                        .then(() => state.write(tritsToBytes(bundle(buffer)), tritsToBytes(buffer)))
                        .tap(() => this.emit(PersistenceEvents.writeBundle, buffer))
                },

                deleteBundle: (buffer: Int8Array) => {
                    if (!isMultipleOfTransactionLength(buffer.length)) {
                        throw new RangeError(errors.ILLEGAL_BUNDLE_LENGTH)
                    }

                    return ready()
                        .then(() => history.write(tritsToBytes(bundle(buffer)), tritsToBytes(buffer)))
                        .then(() => state.delete(tritsToBytes(bundle(buffer))))
                        .tap(() => this.emit(PersistenceEvents.deleteBundle, buffer))
                },

                readCDA: (address: Int8Array) => {
                    if (address.length !== ADDRESS_LENGTH) {
                        throw new RangeError(errors.ILLEGAL_ADDRESS_LENGTH)
                    }

                    return ready()
                        .then(() => state.read(tritsToBytes(address)))
                        .then(bytesToTrits)
                },

                writeCDA: (cda: Int8Array) => {
                    if (cda.length !== CDA_LENGTH) {
                        throw new RangeError(errors.ILLEGAL_CDA_LENGTH)
                    }

                    return ready()
                        .then(() => state.write(tritsToBytes(CDAddress(cda)), tritsToBytes(cda)))
                        .tap(() => this.emit(PersistenceEvents.writeCDA, cda))
                },

                deleteCDA: (cda: Int8Array) => {
                    if (cda.length !== CDA_LENGTH) {
                        throw new RangeError(errors.ILLEGAL_CDA_LENGTH)
                    }

                    return ready()
                        .then(() => history.write(tritsToBytes(CDAddress(cda)), tritsToBytes(cda)))
                        .then(() => state.delete(tritsToBytes(CDAddress(cda))))
                        .tap(() => this.emit(PersistenceEvents.deleteCDA, cda))
                },

                batch: (ops: ReadonlyArray<PersistenceBatch<Int8Array>>) => {
                    for (const { type, value } of ops) {
                        if (type === PersistenceBatchTypes.writeBundle || type === PersistenceBatchTypes.deleteBundle) {
                            if (!isMultipleOfTransactionLength(value.length)) {
                                throw new RangeError(errors.ILLEGAL_BUNDLE_LENGTH)
                            }
                        } else if (
                            type === PersistenceBatchTypes.writeCDA ||
                            type === PersistenceBatchTypes.deleteCDA
                        ) {
                            if (value.length !== CDA_LENGTH) {
                                throw new RangeError(errors.ILLEGAL_CDA_LENGTH)
                            }
                        } else {
                            throw new Error(errors.ILLEGAL_BATCH)
                        }
                    }

                    return ready()
                        .then(() =>
                            history.batch(
                                ops
                                    .filter(
                                        ({ type }) =>
                                            type === PersistenceBatchTypes.deleteBundle ||
                                            type === PersistenceBatchTypes.deleteCDA
                                    )
                                    .map(
                                        ({ type, value }): PersistenceAdapterBatch => {
                                            switch (type) {
                                                case PersistenceBatchTypes.deleteBundle:
                                                    return {
                                                        type: PersistenceAdapterBatchTypes.write,
                                                        key: tritsToBytes(bundle(value)),
                                                        value: tritsToBytes(value),
                                                    }
                                                case PersistenceBatchTypes.deleteCDA:
                                                    return {
                                                        type: PersistenceAdapterBatchTypes.write,
                                                        key: tritsToBytes(CDAddress(value)),
                                                        value: tritsToBytes(value),
                                                    }
                                            }
                                            /* istanbul ignore next */
                                            return undefined as any
                                        }
                                    )
                            )
                        )
                        .then(() =>
                            state.batch(
                                ops.map(
                                    ({ type, value }): PersistenceAdapterBatch => {
                                        switch (type) {
                                            case PersistenceBatchTypes.writeBundle:
                                                return {
                                                    type: PersistenceAdapterBatchTypes.write,
                                                    key: tritsToBytes(bundle(value)),
                                                    value: tritsToBytes(value),
                                                }
                                            case PersistenceBatchTypes.deleteBundle:
                                                return {
                                                    type: PersistenceAdapterBatchTypes.delete,
                                                    key: tritsToBytes(bundle(value)),
                                                }

                                            case PersistenceBatchTypes.writeCDA:
                                                return {
                                                    type: PersistenceAdapterBatchTypes.write,
                                                    key: tritsToBytes(CDAddress(value)),
                                                    value: tritsToBytes(value),
                                                }
                                            case PersistenceBatchTypes.deleteCDA:
                                                return {
                                                    type: PersistenceAdapterBatchTypes.delete,
                                                    key: tritsToBytes(CDAddress(value)),
                                                }
                                        }
                                    }
                                )
                            )
                        )
                        .tap(() => ops.forEach(({ type, value }) => this.emit(type, value)))
                },

                stateRead: state.read,
                stateWrite: state.write,
                stateDelete: state.delete,
                stateBatch: state.batch,
                createStateReadStream: (options: PersistenceIteratorOptions) => state.createReadStream(options),

                historyRead: history.read,
                historyWrite: history.write,
                historyDelete: history.delete,
                historyBatch: history.batch,
                createHistoryReadStream: (options: PersistenceIteratorOptions) => history.createReadStream(options),
            },
            EventEmitter.prototype
        )
    }

    return persistenceMixin.call({})
}

export const generatePersistenceID = (seed: Int8Array): string => {
    if (!isTrits(seed) || seed.length !== Kerl.HASH_LENGTH) {
        throw new Error(errors.ILLEGAL_SEED_LENGTH)
    }
    const sponge = new Kerl()
    const id = new Int8Array(Kerl.HASH_LENGTH)
    sponge.absorb(signingAddress(digests(key(subseed(seed, KEY_INDEX_START), 2))), 0, Kerl.HASH_LENGTH)
    sponge.squeeze(id, 0, Kerl.HASH_LENGTH)
    return tritsToTrytes(id)
}

export const streamToBuffers = ({
    bundles,
    deposits,
}: {
    bundles: AsyncBuffer<Int8Array>
    deposits: AsyncBuffer<Int8Array>
}) => ({ value }: { value: Buffer }) => {
    const trits = bytesToTrits(value)
    if (trits.length !== 0 && isMultipleOfTransactionLength(trits.length)) {
        bundles.write(trits)
    }

    if (trits.length === CDA_LENGTH) {
        deposits.write(trits)
    }
}
