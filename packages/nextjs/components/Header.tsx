'use client'

import React, { useCallback, useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon, BugAntIcon } from '@heroicons/react/24/outline'
import { useOutsideClick } from '~~/hooks/scaffold-stark'
import { CustomConnectButton } from '~~/components/scaffold-stark/CustomConnectButton'
import { useTheme } from 'next-themes'
import { useTargetNetwork } from '~~/hooks/scaffold-stark/useTargetNetwork'
import { devnet } from '@starknet-react/chains'
import { SwitchTheme } from './SwitchTheme'
import { useAccount, useNetwork, useProvider } from '@starknet-react/core'
import { BlockIdentifier } from 'starknet'

type HeaderMenuLink = {
    label: string
    href: string
    icon?: React.ReactNode
}

export const menuLinks: HeaderMenuLink[] = [
    {
        label: 'Home',
        href: '/',
    },
    {
        label: 'Debug Contracts',
        href: '/debug',
        icon: <BugAntIcon className="h-4 w-4" />,
    },
]

export const HeaderMenuLinks = () => {
    const pathname = usePathname()
    const { theme } = useTheme()
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        setIsDark(theme === 'dark')
    }, [theme])
    return (
        <>
            {menuLinks.map(({ label, href, icon }) => {
                const isActive = pathname === href
                return (
                    <li key={href}>
                        <Link
                            href={href}
                            passHref
                            className={`${
                                isActive
                                    ? '!bg-gradient-nav !text-white shadow-md active:bg-gradient-nav'
                                    : ''
                            } grid grid-flow-col gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-gradient-nav hover:text-white`}
                        >
                            {icon}
                            <span>{label}</span>
                        </Link>
                    </li>
                )
            })}
        </>
    )
}

/**
 * Site header
 */
export const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const burgerMenuRef = useRef<HTMLDivElement>(null)

    useOutsideClick(
        burgerMenuRef,
        useCallback(() => setIsDrawerOpen(false), [])
    )

    const { targetNetwork } = useTargetNetwork()
    const isLocalNetwork = targetNetwork.network === devnet.network

    const { provider } = useProvider()
    const { address, status, chainId } = useAccount()
    const { chain } = useNetwork()
    const [isDeployed, setIsDeployed] = useState(true)

    useEffect(() => {
        if (
            status === 'connected' &&
            address &&
            chainId === targetNetwork.id &&
            chain.network === targetNetwork.network
        ) {
            provider
                .getClassHashAt(address)
                .then(classHash => {
                    if (classHash) setIsDeployed(true)
                    else setIsDeployed(false)
                })
                .catch(e => {
                    console.error('contract check', e)
                    if (e.toString().includes('Contract not found')) {
                        setIsDeployed(false)
                    }
                })
        }
    }, [status, address, provider, chainId, targetNetwork.id, targetNetwork.network, chain.network])

    return (
        <div className="navbar top-0 z-20 min-h-0 flex-shrink-0 justify-between px-0 sm:px-2 lg:static">
            <div className="navbar-end mr-2 mt-2 flex-grow gap-4">
                {status === 'connected' && !isDeployed ? (
                    <span className="bg-[#8a45fc] p-1 text-[9px] text-white">
                        Wallet Not Deployed
                    </span>
                ) : null}
                <CustomConnectButton />
                {/* <FaucetButton /> */}
                <SwitchTheme
                    className={`pointer-events-auto ${isLocalNetwork ? 'mb-1 lg:mb-0' : ''}`}
                />
            </div>
        </div>
    )
}
