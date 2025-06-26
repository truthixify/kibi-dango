'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { StarknetConfig, starkscan } from '@starknet-react/core'
import { Header } from '~~/components/Header'
import { Footer } from '~~/components/Footer'
import { ProgressBar } from '~~/components/scaffold-stark/ProgressBar'
import { appChains, connectors } from '~~/services/web3/connectors'
import provider from '~~/services/web3/provider'

const ScaffoldStarkApp = ({ children }: { children: React.ReactNode }) => {
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === 'dark'
    return (
        <>
            <div className="bg-main relative flex min-h-screen flex-col">
                {isDarkMode ? (
                    <>
                        <div className="circle-gradient-dark h-[330px] w-[330px]"></div>
                        <div className="circle-gradient-blue-dark h-[330px] w-[330px]"></div>
                    </>
                ) : (
                    <>
                        <div className="circle-gradient h-[330px] w-[330px]"></div>
                        <div className="circle-gradient-blue h-[630px] w-[330px]"></div>
                    </>
                )}
                <Header />
                <main className="relative flex flex-1 flex-col">{children}</main>
                <Footer />
            </div>
            <Toaster />
        </>
    )
}

export const ScaffoldStarkAppWithProviders = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <StarknetConfig
            chains={appChains}
            provider={provider}
            connectors={connectors}
            explorer={starkscan}
        >
            <ProgressBar />
            <ScaffoldStarkApp>{children}</ScaffoldStarkApp>
        </StarknetConfig>
    )
}
