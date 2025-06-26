'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coins, Home, Trophy, PlusCircle, User, Menu, X } from 'lucide-react'

export function NinjaSidebar() {
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
        { href: '/', icon: Home, label: 'Shadow Puzzle', subtitle: '影の謎' },
        {
            href: '/dashboard',
            icon: User,
            label: 'Ninja Companion',
            subtitle: '忍者の仲間',
        },
        {
            href: '/leaderboard',
            icon: Trophy,
            label: 'Honor Scroll',
            subtitle: '名誉の巻物',
        },
        {
            href: '/create',
            icon: PlusCircle,
            label: 'Forge Puzzle',
            subtitle: '謎を鍛える',
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
                className="ninja-card stealth-hover ninja-glow fixed left-4 top-4 z-50 rounded-full p-3 shadow-lg lg:hidden"
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-[#F4C430]" />
                ) : (
                    <Menu className="h-6 w-6 text-[#F4C430]" />
                )}
            </button>

            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="stealth-backdrop fixed inset-0 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`ninja-shadow-dark fixed left-0 top-0 z-40 h-full w-80 transform transition-all duration-500 ease-out ${
                    isOpen ? 'translate-x-0 skew-x-0' : '-translate-x-full skew-x-[-5deg]'
                } ninja-border border-r-2 border-[#F4C430]/30 shadow-2xl lg:translate-x-0 lg:skew-x-0`}
            >
                {/* Ninja Pattern Overlay */}
                <div className="absolute inset-0 opacity-20">
                    <div className="shuriken-pattern h-full w-full"></div>
                </div>

                {/* Stealth Gradient Overlay */}
                <div className="ninja-mist absolute inset-0"></div>

                {/* Sidebar Content */}
                <div className="ninja-slide-in relative z-10 flex h-full flex-col">
                    {/* Header */}
                    <div className="ninja-border-small border-b-2 border-[#F4C430]/30 p-6">
                        <div className="mb-4 flex items-center space-x-3">
                            <div className="ninja-card ninja-glow shuriken-spin flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
                                <span className="text-2xl">🥷</span>
                            </div>
                            <div>
                                <h1 className="stealth-text text-lg font-bold leading-tight text-[#F4C430]">
                                    Ninja Otama
                                </h1>
                                <p className="japanese-ninja-text text-sm font-medium text-[#F9C5D5]">
                                    忍者お玉
                                </p>
                            </div>
                        </div>

                        {/* KIBI Balance */}
                        <div className="ninja-card blade-slash rounded-lg border-2 border-[#F4C430]/40 p-3 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Coins className="ninja-float h-5 w-5 text-[#F4C430]" />
                                    <span className="stealth-text font-semibold text-[#F5F5F5]">
                                        $KIBI
                                    </span>
                                </div>
                                <span className="stealth-text text-lg font-bold text-[#F4C430]">
                                    1,247
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 p-4">
                        {navItems.map((item, index) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => isMobile && setIsOpen(false)}
                                >
                                    <div
                                        className={`ninja-border-small shadow-strike group relative rounded-lg p-4 transition-all duration-300 ${
                                            isActive
                                                ? 'ninja-card ninja-glow border-l-4 border-[#F4C430] shadow-lg'
                                                : 'ninja-shadow-light hover:ninja-shadow-medium stealth-hover'
                                        }`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {/* Sharp corner decorations */}
                                        <div className="absolute right-1 top-1 h-3 w-3 border-r-2 border-t-2 border-[#F4C430]/60"></div>
                                        <div className="absolute bottom-1 left-1 h-3 w-3 border-b-2 border-l-2 border-[#F4C430]/60"></div>

                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`ninja-border-small rounded-lg p-2 transition-all duration-300 ${
                                                    isActive
                                                        ? 'ninja-glow text-[#F4C430] shadow-md'
                                                        : 'ninja-shadow-medium group-hover:ninja-glow text-[#F9C5D5] group-hover:text-[#F5F5F5]'
                                                }`}
                                            >
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div
                                                    className={`stealth-text font-semibold transition-colors duration-300 ${
                                                        isActive
                                                            ? 'text-[#F4C430]'
                                                            : 'text-[#F5F5F5] group-hover:text-[#F9C5D5]'
                                                    }`}
                                                >
                                                    {item.label}
                                                </div>
                                                <div
                                                    className={`japanese-ninja-text text-sm transition-colors duration-300 ${
                                                        isActive
                                                            ? 'text-[#F9C5D5]'
                                                            : 'text-[#F9C5D5]/70 group-hover:text-[#F9C5D5]'
                                                    }`}
                                                >
                                                    {item.subtitle}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Active Indicator - Kunai */}
                                        {isActive && (
                                            <div className="ninja-border-small ninja-glow absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 transform bg-[#F4C430] shadow-lg"></div>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="ninja-border-small border-t-2 border-[#F4C430]/30 p-4">
                        {/* Otama Character */}
                        <div className="ninja-card smoke-effect mb-4 rounded-lg border-2 border-[#F9C5D5]/30 p-4 backdrop-blur-sm">
                            <div className="flex items-center space-x-3">
                                <div className="ninja-float text-3xl">🥷</div>
                                <div>
                                    <p className="stealth-text text-sm font-medium text-[#F9C5D5]">
                                        Ninja Otama whispers:
                                    </p>
                                    <p className="japanese-ninja-text text-xs text-[#F5F5F5]">
                                        "Strike from the shadows with wisdom!"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Traditional Seal */}
                        <div className="text-center">
                            <div className="ninja-card ninja-glow inline-block rounded-full border-2 border-[#F4C430]/50 p-3 backdrop-blur-sm">
                                <div className="ninja-border-small flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F4C430] to-[#8B5FBF] shadow-md">
                                    <span className="text-sm font-bold text-[#2A2D66]">忍</span>
                                </div>
                            </div>
                            <p className="japanese-ninja-text stealth-text mt-2 text-xs font-medium text-[#F9C5D5]">
                                Ninja Seal
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
