import { useRef, useState } from 'react'
import { NetworkOptions } from './NetworkOptions'
import CopyToClipboard from 'react-copy-to-clipboard'
import { createPortal } from 'react-dom'
import {
    ArrowLeftEndOnRectangleIcon,
    ArrowTopRightOnSquareIcon,
    ArrowsRightLeftIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    DocumentDuplicateIcon,
    QrCodeIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline'
import { useLocalStorage } from 'usehooks-ts'
import { BlockieAvatar, isENS } from '~~/components/scaffold-stark'
import { useOutsideClick } from '~~/hooks/scaffold-stark'
import { BurnerConnector, burnerAccounts } from '@scaffold-stark/stark-burner'
import { getTargetNetworks, notification } from '~~/utils/scaffold-stark'
import { Address } from '@starknet-react/chains'
import { useDisconnect, useNetwork, useConnect } from '@starknet-react/core'
import { getStarknetPFPIfExists } from '~~/utils/profile'
import { useScaffoldStarkProfile } from '~~/hooks/scaffold-stark/useScaffoldStarkProfile'
import { useTheme } from 'next-themes'
import { default as NextImage } from 'next/image'

const allowedNetworks = getTargetNetworks()

type AddressInfoDropdownProps = {
    address: Address
    blockExplorerAddressLink: string | undefined
    displayName: string
    ensAvatar?: string
}

export const AddressInfoDropdown = ({
    address,
    ensAvatar,
    displayName,
    blockExplorerAddressLink,
}: AddressInfoDropdownProps) => {
    const { disconnect } = useDisconnect()
    const [addressCopied, setAddressCopied] = useState(false)
    const { data: profile } = useScaffoldStarkProfile(address)
    const { chain } = useNetwork()
    const [showBurnerAccounts, setShowBurnerAccounts] = useState(false)
    const [selectingNetwork, setSelectingNetwork] = useState(false)
    const { connectors, connect } = useConnect()
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === 'dark'
    const dropdownRef = useRef<HTMLDetailsElement>(null)
    const closeDropdown = () => {
        setSelectingNetwork(false)
        dropdownRef.current?.removeAttribute('open')
    }

    useOutsideClick(dropdownRef, closeDropdown)

    function handleConnectBurner(e: React.MouseEvent<HTMLButtonElement>, ix: number) {
        const connector = connectors.find(it => it.id == 'burner-wallet')
        if (connector && connector instanceof BurnerConnector) {
            connector.burnerAccount = burnerAccounts[ix]
            connect({ connector })
            setLastConnector({ id: connector.id, ix })
            setShowBurnerAccounts(false)
        }
    }

    const [_, setLastConnector] = useLocalStorage<{ id: string; ix?: number }>(
        'lastUsedConnector',
        { id: '' },
        {
            initializeWithValue: false,
        }
    )

    const [, setWasDisconnectedManually] = useLocalStorage<boolean>(
        'wasDisconnectedManually',
        false,
        {
            initializeWithValue: false,
        }
    )

    const handleDisconnect = () => {
        try {
            disconnect()
            localStorage.removeItem('lastUsedConnector')
            localStorage.removeItem('lastConnectionTime')
            setWasDisconnectedManually(true)
            window.dispatchEvent(new Event('manualDisconnect'))
            notification.success('Disconnect successfully!')
        } catch (err) {
            console.log(err)
            notification.success('Disconnect failure!')
        }
    }
    return (
        <>
            <details ref={dropdownRef} className="dropdown dropdown-end leading-3">
                <summary
                    tabIndex={0}
                    className="dropdown-toggle btn btn-sm !h-auto gap-0 border border-[#5c4fe5] bg-transparent px-2 py-[0.35rem]"
                >
                    <div className="hidden [@media(min-width:412px)]:block">
                        {getStarknetPFPIfExists(profile?.profilePicture) ? (
                            <NextImage
                                src={profile?.profilePicture || ''}
                                alt="Profile Picture"
                                className="rounded-full"
                                width={30}
                                height={30}
                            />
                        ) : (
                            <BlockieAvatar address={address} size={28} ensImage={ensAvatar} />
                        )}
                    </div>
                    <span className="ml-2 mr-2 text-sm">
                        {isENS(displayName)
                            ? displayName
                            : profile?.name || address?.slice(0, 6) + '...' + address?.slice(-4)}
                    </span>
                    <ChevronDownIcon className="ml-2 hidden h-6 w-4 sm:ml-0 sm:block" />
                </summary>
                <ul
                    tabIndex={0}
                    className={`menu dropdown-content z-[2] mt-2 gap-1 rounded-[5px] border border-[#5c4fe5] bg-base-100 p-2`}
                >
                    <NetworkOptions hidden={!selectingNetwork} />
                    <li className={selectingNetwork ? 'hidden' : ''}>
                        {addressCopied ? (
                            <div className="btn-sm flex gap-3 !rounded-xl py-3">
                                <CheckCircleIcon
                                    className="ml-2 h-6 w-4 cursor-pointer text-xl font-normal sm:ml-0"
                                    aria-hidden="true"
                                />
                                <span className="whitespace-nowrap">Copy address</span>
                            </div>
                        ) : (
                            //@ts-ignore
                            <CopyToClipboard
                                text={address}
                                onCopy={() => {
                                    setAddressCopied(true)
                                    setTimeout(() => {
                                        setAddressCopied(false)
                                    }, 800)
                                }}
                            >
                                <div className="btn-sm flex gap-3 !rounded-xl py-3">
                                    <DocumentDuplicateIcon
                                        className="ml-2 h-6 w-4 cursor-pointer text-xl font-normal sm:ml-0"
                                        aria-hidden="true"
                                    />
                                    <span className="whitespace-nowrap">Copy address</span>
                                </div>
                            </CopyToClipboard>
                        )}
                    </li>
                    <li className={selectingNetwork ? 'hidden' : ''}>
                        <label
                            htmlFor="qrcode-modal"
                            className="btn-sm flex gap-3 !rounded-xl py-3"
                        >
                            <QrCodeIcon className="ml-2 h-6 w-4 sm:ml-0" />
                            <span className="whitespace-nowrap">View QR Code</span>
                        </label>
                    </li>
                    {chain.network != 'devnet' ? (
                        <li className={selectingNetwork ? 'hidden' : ''}>
                            <button
                                className="menu-item btn-sm flex gap-3 !rounded-xl py-3"
                                type="button"
                            >
                                <ArrowTopRightOnSquareIcon className="ml-2 h-6 w-4 sm:ml-0" />
                                <a
                                    target="_blank"
                                    href={blockExplorerAddressLink}
                                    rel="noopener noreferrer"
                                    className="whitespace-nowrap"
                                >
                                    View on Block Explorer
                                </a>
                            </button>
                        </li>
                    ) : null}

                    {chain.network == 'devnet' ? (
                        <li className={selectingNetwork ? 'hidden' : ''}>
                            <button
                                className="menu-item btn-sm flex gap-3 !rounded-xl py-3"
                                type="button"
                                onClick={() => {
                                    setShowBurnerAccounts(true)
                                }}
                            >
                                <UserCircleIcon className="ml-2 h-6 w-4 sm:ml-0" />
                                <span className="whitespace-nowrap">Switch Account</span>
                            </button>
                        </li>
                    ) : null}

                    {showBurnerAccounts &&
                        createPortal(
                            <>
                                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
                                    <div className="relative mx-auto my-6 w-auto max-w-5xl">
                                        <div className="relative mx-auto w-full rounded-lg border border-[#4f4ab7] bg-base-100 shadow-lg outline-none focus:outline-none md:max-h-[30rem] md:max-w-[25rem]">
                                            <div className="flex items-start justify-between rounded-t p-4 pt-8">
                                                <div className="flex w-11/12 items-center justify-center">
                                                    <h2 className="m-0 text-center text-lg text-neutral">
                                                        Choose Account
                                                    </h2>
                                                </div>
                                                <button
                                                    className="flex h-8 w-8 place-content-end items-center justify-center rounded-full"
                                                    onClick={() => setShowBurnerAccounts(false)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="m6.4 18.308l-.708-.708l5.6-5.6l-5.6-5.6l.708-.708l5.6 5.6l5.6-5.6l.708.708l-5.6 5.6l5.6 5.6l-.708.708l-5.6-5.6z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="mx-8 flex flex-col items-center justify-center gap-3 pb-10 pt-8">
                                                <div className="flex h-[300px] w-full flex-col gap-2 overflow-y-auto">
                                                    {burnerAccounts.map((burnerAcc, ix) => (
                                                        // eslint-disable-next-line react/jsx-key
                                                        <div
                                                            key={burnerAcc.publicKey}
                                                            className="flex w-full flex-col"
                                                        >
                                                            <button
                                                                className={`${
                                                                    isDarkMode
                                                                        ? 'border-[#385183] hover:bg-[#385183]'
                                                                        : 'hover:bg-gradient-light'
                                                                } flex items-center gap-4 rounded-md border py-[8px] pl-[10px] pr-16 text-neutral`}
                                                                onClick={e =>
                                                                    handleConnectBurner(e, ix)
                                                                }
                                                            >
                                                                <BlockieAvatar
                                                                    address={
                                                                        burnerAcc.accountAddress
                                                                    }
                                                                    size={35}
                                                                ></BlockieAvatar>
                                                                {`${burnerAcc.accountAddress.slice(
                                                                    0,
                                                                    6
                                                                )}...${burnerAcc.accountAddress.slice(-4)}`}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="fixed inset-0 z-40 backdrop-blur"></div>
                            </>,
                            document.body
                        )}

                    {/* TODO: reinstate if needed */}
                    {/* {allowedNetworks.length > 1 ? (
            <li className={selectingNetwork ? "hidden" : ""}>
              <button
                className="btn-sm !rounded-xl flex gap-3 py-3"
                type="button"
                onClick={() => {
                  setSelectingNetwork(true);
                }}
              >
                <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" />{" "}
                <span>Switch Network</span>
              </button>
            </li>
          ) : null} */}
                    <li className={selectingNetwork ? 'hidden' : ''}>
                        <button
                            className="menu-item btn-sm flex gap-3 !rounded-xl py-3 text-secondary-content"
                            type="button"
                            onClick={handleDisconnect}
                        >
                            <ArrowLeftEndOnRectangleIcon className="ml-2 h-6 w-4 sm:ml-0" />{' '}
                            <span>Disconnect</span>
                        </button>
                    </li>
                </ul>
            </details>
        </>
    )
}
