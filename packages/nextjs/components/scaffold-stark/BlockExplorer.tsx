'use client'

import { Address as AddressType, mainnet } from '@starknet-react/chains'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useNetwork } from '@starknet-react/core'
import Image from 'next/image'
import GenericModal from './CustomConnectButton/GenericModal'
import { useTheme } from 'next-themes'

export const BlockExplorer = () => {
    const { chain: ConnectedChain } = useNetwork()

    const blockExplorers = [
        {
            name: 'Starkscan',
            img: '/sn-symbol-gradient.png',
            link: 'https://starkscan.co/',
        },
        {
            name: 'Voyager',
            img: '/voyager-icon.svg',
            link: 'https://voyager.online/',
        },
    ]

    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === 'dark'

    // Render only on mainnet chain
    if (ConnectedChain?.id !== mainnet.id) {
        return null
    }

    return (
        <div>
            <label
                htmlFor="blockexplorer-modal"
                className="btn btn-sm gap-1 border border-[#32BAC4] font-normal shadow-none"
            >
                <MagnifyingGlassIcon className="h-4 w-4 text-[#32BAC4]" />
                <span>Block Explorer</span>
            </label>
            <input type="checkbox" id="blockexplorer-modal" className="modal-toggle" />
            <GenericModal modalId="blockexplorer-modal">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Mainnet Block Explorers</h3>
                        <label
                            htmlFor="blockexplorer-modal"
                            className="btn btn-circle btn-ghost btn-sm"
                        >
                            ✕
                        </label>
                    </div>
                    <div className="flex flex-col space-y-2">
                        {blockExplorers.length &&
                            blockExplorers.map((blockexplorer, id) => (
                                <a
                                    href={blockexplorer.link}
                                    target="_blank"
                                    className={`flex h-10 items-center gap-3 rounded-[4px] px-4 transition-all ${
                                        isDarkMode
                                            ? 'border-gray-700 hover:bg-[#385183]'
                                            : 'border-gray-200 hover:bg-slate-200'
                                    } border`}
                                    key={id}
                                >
                                    <div className="relative flex h-6 w-6">
                                        <Image
                                            alt={blockexplorer.name}
                                            className="cursor-pointer"
                                            fill
                                            sizes="1.5rem"
                                            src={blockexplorer.img}
                                        />
                                    </div>
                                    <p className="m-0 text-sm">{blockexplorer.name}</p>
                                </a>
                            ))}
                    </div>
                </div>
            </GenericModal>
        </div>
    )
}
