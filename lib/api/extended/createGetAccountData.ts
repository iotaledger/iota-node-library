import * as Promise from 'bluebird'
import * as errors from '../../errors'
import {
    asArray,
    getOptionsWithDefaults,
    securityLevelValidator,
    seedValidator,
    startEndOptionsValidator,
    startOptionValidator,
    validate,
} from '../../utils'
import { createGetBalances, createWereAddressesSpentFrom, GetBalancesResponse } from '../core'
import { Address, Bundle, Callback, Maybe, Provider, Settings, Transaction, Trytes } from '../types'
import { createGetBundlesFromAddresses, createGetNewAddress } from './index'

/**
 * Account data object
 */
export interface AccountData {
    addresses: string[]
    inputs: Address[]
    transfers: Bundle[]
    latestAddress: string
    balance: number
}

export interface GetAccountDataOptions {
    start: number
    end?: number
    security: number
}

const defaults: GetAccountDataOptions = {
    start: 0,
    security: 2,
}

export const blankAccountData = (): AccountData => ({
    latestAddress: '',
    addresses: [],
    transfers: [],
    inputs: [],
    balance: 0,
})

export const verifyGetAccountData = (seed: Trytes, opts: GetAccountDataOptions) => {
    const validators = [seedValidator(seed), securityLevelValidator(opts.security!)]

    const { start, end } = opts

    if (start) {
        validators.push(startOptionValidator(start)) 
    }

    if (typeof end === 'number') {
        validators.push(startEndOptionsValidator({ start, end }))
    }

    validate(...validators)
}

export const getAccountDataOptions = getOptionsWithDefaults(defaults)

/**
 *   Similar to getTransfers, just that it returns additional account data
 *
 *   @method getAccountData
 *   @param {string} seed
 *   @param {object} options
 *   @param {int} [options.start=0] - Starting key index
 *   @param {int} [options.security=0] - Security level to be used for getting inputs and addresses
 *   @param {int} [options.end] - Ending key index
 *   @param {function} callback
 *   @returns {object} success
 */
export const createGetAccountData = (provider: Provider) => {
    const getNewAddress = createGetNewAddress(provider)
    const getBundlesFromAddresses = createGetBundlesFromAddresses(provider)
    const getBalances = createGetBalances(provider)
    const wereAddressesSpentFrom = createWereAddressesSpentFrom(provider)

    return ( 
        seed: string,
        options: Partial<GetAccountDataOptions> = {},
        callback?: Callback<Maybe<AccountData>>
    ): Promise<Maybe<AccountData>> => {
        const { start, end, security } = getAccountDataOptions(options)
        const accountData = blankAccountData()

        return Promise.resolve(verifyGetAccountData(seed, { start, end, security }))
            .then(() =>
                getNewAddress(seed, {
                    index: start,
                    total: end ? end - start : 0,
                    returnAll: true,
                    security,
                })
            )
            .then(address => {
                const addresses = asArray(address)

                // 2. Assign the last address as the latest address
                accountData.latestAddress = addresses[addresses.length - 1]

                // 3. Add all returned addresses to the list of addresses
                // remove the last element as that is the most recent address
                accountData.addresses = addresses 

                return getBundlesFromAddresses(addresses, true)
            })
            .then((bundles: Bundle[]) => {
                // Add bundles to account data
                accountData.transfers = bundles
                // 5. Get balances for all addresses
                return getBalances(accountData.addresses, 100)
            })
            .then((res: GetBalancesResponse) => {
                res.balances
                    .map((balance: string) => parseInt(balance, 10))
                    .forEach((balance: number, index: number) => {
                        accountData.balance += balance

                        // 6. Mark all addresses with balance as inputs
                        if (balance > 0) {
                            accountData.inputs.push({
                                address: accountData.addresses[index],
                                keyIndex: start + index,
                                security,
                                balance: balance.toString(),
                            })
                        }
                    })
            })
            .then(() => wereAddressesSpentFrom(accountData.inputs.map(input => input.address)))
            .then((states: boolean[]) => {
                accountData.inputs = accountData.inputs.filter((input, i) => !states[i])
                return accountData
            })
            .asCallback(callback)
    }
}
