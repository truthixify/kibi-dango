'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coins, Home, Trophy, PlusCircle, User, Menu, X } from 'lucide-react'

export function JapaneseSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024)
            if (window.innerWidth >= 1024) {
                setIsOpen(true)
            } else {
                setIsOpen(false)
            }
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    const navItems = [
        { href: '/', icon: Home, label: 'Daily Puzzle', subtitle: '今日の謎' },
        {
            href: '/dashboard',
            icon: User,
            label: 'Pirate Companion',
            subtitle: '海賊の仲間',
        },
        {
            href: '/leaderboard',
            icon: Trophy,
            label: 'Honor Board',
            subtitle: '名誉の板',
        },
        {
            href: '/create',
            icon: PlusCircle,
            label: 'Create Puzzle',
            subtitle: '謎を作る',
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
                className="wano-kibi kibi-glow fixed left-4 top-4 z-50 rounded-full p-3 text-[#2A2D66] shadow-lg transition-all duration-300 hover:shadow-xl lg:hidden"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-[#2A2D66]/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`wano-kimono fixed left-0 top-0 z-40 h-full w-80 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } border-r-4 border-[#F4C430]/30 shadow-2xl lg:translate-x-0`}
            >
                {/* Traditional Pattern Overlay */}
                <div className="absolute inset-0 opacity-20">
                    <div className="seigaiha-pattern h-full w-full"></div>
                </div>

                {/* Kimono Texture Overlay */}
                <div className="kimono-texture absolute inset-0 opacity-30"></div>

                {/* Sidebar Content */}
                <div className="relative z-10 flex h-full flex-col">
                    {/* Header */}
                    <div className="border-b-2 border-[#F4C430]/30 p-6">
                        <div className="mb-4 flex items-center space-x-3">
                            <div className="wano-kibi kibi-glow flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
                                <span className="text-2xl">🍡</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold leading-tight text-[#F5F5F5]">
                                    Otama's Adventure
                                </h1>
                                <p className="japanese-text text-sm font-medium text-[#F9C5D5]">
                                    お玉の冒険
                                </p>
                            </div>
                        </div>

                        {/* KIBI Balance */}
                        <div className="rounded-lg border-2 border-[#F4C430]/40 bg-[#2A2D66]/60 p-3 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Coins className="h-5 w-5 text-[#F4C430]" />
                                    <span className="font-semibold text-[#F5F5F5]">$KIBI</span>
                                </div>
                                <span className="text-lg font-bold text-[#F4C430]">1,247</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 p-4">
                        {navItems.map(item => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => isMobile && setIsOpen(false)}
                                >
                                    <div
                                        className={`wano-corners group relative rounded-lg p-4 transition-all duration-300 ${
                                            isActive
                                                ? 'border-l-4 border-[#F4C430] bg-gradient-to-r from-[#F4C430]/20 to-[#F9C5D5]/20 shadow-lg'
                                                : 'hover:bg-[#F5F5F5]/10 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`rounded-lg p-2 transition-all duration-300 ${
                                                    isActive
                                                        ? 'bg-[#F4C430]/30 text-[#F4C430] shadow-md'
                                                        : 'bg-[#F5F5F5]/20 text-[#F9C5D5] group-hover:bg-[#F5F5F5]/30 group-hover:text-[#F5F5F5]'
                                                }`}
                                            >
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div
                                                    className={`font-semibold transition-colors duration-300 ${
                                                        isActive
                                                            ? 'text-[#F4C430]'
                                                            : 'text-[#F5F5F5] group-hover:text-[#F9C5D5]'
                                                    }`}
                                                >
                                                    {item.label}
                                                </div>
                                                <div
                                                    className={`japanese-text text-sm transition-colors duration-300 ${
                                                        isActive
                                                            ? 'text-[#F9C5D5]'
                                                            : 'text-[#F9C5D5]/70 group-hover:text-[#F9C5D5]'
                                                    }`}
                                                >
                                                    {item.subtitle}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Active Indicator */}
                                        {isActive && (
                                            <div className="kibi-glow absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 transform rounded-l-full bg-[#F4C430] shadow-lg"></div>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="border-t-2 border-[#F4C430]/30 p-4">
                        {/* Otama Character */}
                        <div className="mb-4 rounded-lg border-2 border-[#F9C5D5]/30 bg-gradient-to-r from-[#F9C5D5]/20 to-[#8B5FBF]/20 p-4 backdrop-blur-sm">
                            <div className="flex items-center space-x-3">
                                <div className="sakura-float text-3xl">👧</div>
                                <div>
                                    <p className="text-sm font-medium text-[#F9C5D5]">
                                        Otama says:
                                    </p>
                                    <p className="text-xs text-[#F5F5F5]">
                                        "The power of kibi dango brings peace to Wano!"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Traditional Seal */}
                        <div className="text-center">
                            <div className="inline-block rounded-full border-2 border-[#F4C430]/50 bg-[#2A2D66]/60 p-3 backdrop-blur-sm">
                                <div className="wano-kibi flex h-8 w-8 items-center justify-center rounded-full shadow-md">
                                    <span className="text-sm font-bold text-[#2A2D66]">玉</span>
                                </div>
                            </div>
                            <p className="japanese-text mt-2 text-xs font-medium text-[#F9C5D5]">
                                Otama's Seal
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
