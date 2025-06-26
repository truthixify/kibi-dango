'use client'

import { useAccount } from '~~/hooks/useAccount'
import { RegistrationModal } from './registration-modal'
import { useEffect, useState } from 'react'
import { getUserByAddress } from '~~/lib/api'
import { CustomConnectButton } from './scaffold-stark/CustomConnectButton'

export const Main = ({ children }: { children: React.ReactNode }) => {
    const [isUserRegistered, setIsUserRegistered] = useState<boolean | null>(null)
    const [showModal, setShowModal] = useState(false)
    const { address, isConnected } = useAccount()

    useEffect(() => {
        const fetchUser = async () => {
            if (!address) return
            try {
                const user = await getUserByAddress(address)
                const registered = !!user
                setIsUserRegistered(registered)
                setShowModal(!registered)
            } catch (err) {
                console.error('Error fetching user:', err)
                setIsUserRegistered(false)
                setShowModal(true)
            }
        }

        fetchUser()
    }, [address])

    const handleRegistered = () => {
        setIsUserRegistered(true)
        setShowModal(false)
    }

    // Wallet not connected
    if (!isConnected) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="mb-4 text-2xl font-semibold">Connect your wallet</h2>
                    <p className="mb-6 text-gray-600">
                        Please connect your wallet to play the puzzle.
                    </p>
                    <CustomConnectButton />
                </div>
            </div>
        )
    }

    // Still loading user info
    if (isUserRegistered === null) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        )
    }

    return (
        <div className="fade-in pt-16 transition-all duration-300 lg:ml-80">
            <RegistrationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onRegistered={handleRegistered}
            />
            {isUserRegistered && children}
        </div>
    )
}
