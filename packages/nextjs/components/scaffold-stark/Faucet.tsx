'use client'

import { useEffect, useState } from 'react'
import { Address as AddressType, devnet } from '@starknet-react/chains'
import { BanknotesIcon } from '@heroicons/react/24/outline'
import { Address, AddressInput, StarkInput } from '~~/components/scaffold-stark'
import { useNetwork, useProvider } from '@starknet-react/core'
import { mintStrk } from '~~/services/web3/faucet'
import { notification } from '~~/utils/scaffold-stark'
import GenericModal from './CustomConnectButton/GenericModal'

/**
 * Faucet modal which lets you send STRK to any address.
 */
export const Faucet = () => {
    const faucetAddress: AddressType =
        '0x78662e7352d062084b0010068b99288486c2d8b914f6e2a55ce945f8792c8b1'

    const [loading, setLoading] = useState(false)
    const [inputAddress, setInputAddress] = useState<AddressType>()
    const [sendValue, setSendValue] = useState('')

    const { chain: ConnectedChain } = useNetwork()
    const { provider: publicClient } = useProvider()

    useEffect(() => {
        const checkChain = async () => {
            try {
                const providerInfo = await publicClient.getBlock()
            } catch (error) {
                console.error('⚡️ ~ file: Faucet.tsx:checkChain ~ error', error)
                notification.error(
                    <>
                        <p className="mb-1 mt-0 font-bold">Cannot connect to local provider</p>
                        <p className="m-0">
                            - Did you forget to run{' '}
                            <code className="bg-base-300 text-base font-bold italic">
                                yarn chain
                            </code>{' '}
                            ?
                        </p>
                        <p className="mt-1 break-normal">
                            - Or you can change{' '}
                            <code className="bg-base-300 text-base font-bold italic">
                                targetNetwork
                            </code>{' '}
                            in{' '}
                            <code className="bg-base-300 text-base font-bold italic">
                                scaffold.config.ts
                            </code>
                        </p>
                    </>,
                    {
                        duration: 5000,
                    }
                )
            }
        }
        checkChain().then()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sendSTRK = async () => {
        if (!faucetAddress || !inputAddress) {
            return
        }

        const res = await mintStrk(inputAddress, sendValue)
        if (!res.new_balance) {
            setLoading(false)
            notification.error(`${res}`)
            return
        }
        setLoading(false)
        setInputAddress(undefined)
        setSendValue('')
        notification.success('STRK sent successfully!')
    }

    // Render only on local chain
    if (ConnectedChain?.id !== devnet.id) {
        return null
    }

    return (
        <div>
            <label
                htmlFor="faucet-modal"
                className="btn btn-sm gap-1 border border-[#32BAC4] font-normal shadow-none"
            >
                <BanknotesIcon className="h-4 w-4 text-[#32BAC4]" />
                <span>Faucet</span>
            </label>
            <input type="checkbox" id="faucet-modal" className="modal-toggle" />
            <GenericModal modalId="faucet-modal">
                <>
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Local Faucet</h3>
                        <label htmlFor="faucet-modal" className="btn btn-circle btn-ghost btn-sm">
                            ✕
                        </label>
                    </div>
                    <div className="flex flex-col gap-8">
                        <AddressInput
                            placeholder="Destination Address"
                            value={inputAddress ?? ''}
                            onChange={value => setInputAddress(value as AddressType)}
                        />
                        <StarkInput
                            placeholder="Amount to send"
                            value={sendValue}
                            onChange={value => setSendValue(value)}
                        />
                    </div>
                    <button
                        className="bg-btn-wallet btn btn-sm h-10 cursor-pointer rounded-[4px] border border-[#4f4ab7] px-2 hover:bg-[#385183]"
                        onClick={sendSTRK}
                        disabled={loading}
                    >
                        {!loading ? (
                            <BanknotesIcon className="h-6 w-6" />
                        ) : (
                            <span className="loading loading-spinner loading-sm"></span>
                        )}
                        <span>Send</span>
                    </button>
                </>
            </GenericModal>
        </div>
    )
}
