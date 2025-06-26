import { Connector, useConnect } from '@starknet-react/core'
import { useRef, useState } from 'react'
import Wallet from '~~/components/scaffold-stark/CustomConnectButton/Wallet'
import { useLocalStorage } from 'usehooks-ts'
import { BurnerConnector, burnerAccounts } from '@scaffold-stark/stark-burner'
import { useTheme } from 'next-themes'
import { BlockieAvatar } from '../BlockieAvatar'
import GenericModal from './GenericModal'
import { LAST_CONNECTED_TIME_LOCALSTORAGE_KEY } from '~~/utils/Constants'

const loader = ({ src }: { src: string }) => src

const ConnectModal = () => {
    const modalRef = useRef<HTMLInputElement>(null)
    const [isBurnerWallet, setIsBurnerWallet] = useState(false)
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === 'dark'
    const { connectors, connect } = useConnect()
    const [, setLastConnector] = useLocalStorage<{ id: string; ix?: number }>('lastUsedConnector', {
        id: '',
    })
    const [, setLastConnectionTime] = useLocalStorage<number>(
        LAST_CONNECTED_TIME_LOCALSTORAGE_KEY,
        0
    )
    const [, setWasDisconnectedManually] = useLocalStorage<boolean>(
        'wasDisconnectedManually',
        false
    )

    const handleCloseModal = () => {
        if (modalRef.current) modalRef.current.checked = false
    }

    function handleConnectWallet(e: React.MouseEvent<HTMLButtonElement>, connector: Connector) {
        if (connector.id === 'burner-wallet') {
            setIsBurnerWallet(true)
            return
        }
        setWasDisconnectedManually(false)
        connect({ connector })
        setLastConnector({ id: connector.id })
        setLastConnectionTime(Date.now())
        handleCloseModal()
    }

    function handleConnectBurner(e: React.MouseEvent<HTMLButtonElement>, ix: number) {
        const connector = connectors.find(it => it.id == 'burner-wallet')
        if (connector && connector instanceof BurnerConnector) {
            connector.burnerAccount = burnerAccounts[ix]
            setWasDisconnectedManually(false)
            connect({ connector })
            setLastConnector({ id: connector.id, ix })
            setLastConnectionTime(Date.now())
            handleCloseModal()
        }
    }

    return (
        <div>
            <label
                htmlFor="connect-modal"
                className="bg-btn-wallet btn-sm cursor-pointer rounded-[18px] px-8 py-3 font-bold"
            >
                <span>Connect</span>
            </label>
            <input ref={modalRef} type="checkbox" id="connect-modal" className="modal-toggle" />
            <GenericModal modalId="connect-modal">
                <>
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">
                            {isBurnerWallet ? 'Choose account' : 'Connect a Wallet'}
                        </h3>
                        <label
                            onClick={() => setIsBurnerWallet(false)}
                            htmlFor="connect-modal"
                            className="btn btn-circle btn-ghost btn-sm cursor-pointer"
                        >
                            ✕
                        </label>
                    </div>
                    <div className="flex flex-1 flex-col lg:grid">
                        <div className="flex w-full flex-col gap-4 px-8 py-10">
                            {!isBurnerWallet ? (
                                connectors.map((connector, index) => (
                                    <Wallet
                                        key={connector.id || index}
                                        connector={connector}
                                        loader={loader}
                                        handleConnectWallet={handleConnectWallet}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col justify-end gap-3 pb-[20px]">
                                    <div className="flex h-[300px] w-full flex-col gap-2 overflow-y-auto">
                                        {burnerAccounts.map((burnerAcc, ix) => (
                                            <div
                                                key={burnerAcc.publicKey}
                                                className="flex w-full flex-col"
                                            >
                                                <button
                                                    className={`flex items-center gap-4 rounded-md border py-[8px] pl-[10px] pr-16 text-neutral hover:bg-gradient-modal ${isDarkMode ? 'border-[#385183]' : ''}`}
                                                    onClick={e => handleConnectBurner(e, ix)}
                                                >
                                                    <BlockieAvatar
                                                        address={burnerAcc.accountAddress}
                                                        size={35}
                                                    />
                                                    {`${burnerAcc.accountAddress.slice(0, 6)}...${burnerAcc.accountAddress.slice(-4)}`}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            </GenericModal>
        </div>
    )
}

export default ConnectModal
