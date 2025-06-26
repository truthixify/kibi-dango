'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coins, Home, Trophy, PlusCircle, User, Menu, X } from 'lucide-react'
import { CustomConnectButton } from './scaffold-stark/CustomConnectButton'
import { useAccount } from '~~/hooks/useAccount'
import { getUserByAddress } from '~~/lib/api' // make sure path matches

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [userName, setUserName] = useState<string | null>(null)
    const pathname = usePathname()
    const { address } = useAccount()

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024)
            setIsOpen(window.innerWidth >= 1024)
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    useEffect(() => {
        if (!address) return
        const fetchUser = async () => {
            const user = await getUserByAddress(address)
            if (user) setUserName(user.username)
        }
        fetchUser()
    }, [address])

    const navItems = [
        {
            href: '/',
            icon: Home,
            label: 'Daily Puzzle',
            subtitle: "Today's Challenge",
        },
        {
            href: '/dashboard',
            icon: User,
            label: 'My Progress',
            subtitle: 'Stats & Rank',
        },
        {
            href: '/leaderboard',
            icon: Trophy,
            label: 'Leaderboard',
            subtitle: 'Top Players',
        },
        {
            href: '/create',
            icon: PlusCircle,
            label: 'Create',
            subtitle: 'Make Puzzle',
        },
    ]

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-4 lg:hidden ${isOpen ? 'left-80 -translate-x-14' : 'left-4'} shadow-minimal hover-lift z-50 rounded-lg border border-gray-200 bg-white p-3`}
            >
                {isOpen ? (
                    <X className="h-5 w-5 text-gray-600" />
                ) : (
                    <Menu className="h-5 w-5 text-gray-600" />
                )}
            </button>

            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="backdrop-minimal fixed inset-0 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-40 h-full w-80 transform bg-white transition-all duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } border-r border-gray-200 lg:translate-x-0`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="border-b border-gray-200 p-6">
                        <div className="mb-4 flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                <span className="text-lg font-semibold text-white">P</span>
                            </div>
                            <div>
                                <h1 className="text-heading text-lg font-semibold text-red-900">
                                    {userName ? userName : 'Puzzle Adventure'}
                                </h1>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Coins className="h-4 w-4 text-warning" />
                                    <span className="text-subheading text-sm">Tokens</span>
                                </div>
                                <span className="text-heading font-semibold">
                                    {/* Replace with actual token balance when available */}
                                    {'--'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 p-4">
                        {navItems.map(item => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => isMobile && setIsOpen(false)}
                                >
                                    <div
                                        className={`group rounded-lg p-3 transition-colors ${
                                            isActive
                                                ? 'bg-primary text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`rounded p-1.5 ${isActive ? 'bg-white/20' : 'bg-gray-200 group-hover:bg-gray-300'}`}
                                            >
                                                <item.icon
                                                    className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-600'}`}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div
                                                    className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}
                                                >
                                                    {item.label}
                                                </div>
                                                <div
                                                    className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}
                                                >
                                                    {item.subtitle}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <div className="flex items-center space-x-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success">
                                    <span className="text-xs font-bold text-white">{'--'}</span>
                                </div>
                                <div>
                                    <p className="text-subheading text-sm">Day Streak</p>
                                </div>
                            </div>
                        </div>

                        {address && <CustomConnectButton />}
                    </div>
                </div>
            </aside>
        </>
    )
}
