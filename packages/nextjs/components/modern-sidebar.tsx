'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coins, Home, Trophy, PlusCircle, User, Menu, X } from 'lucide-react'

export function ModernSidebar() {
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
        { href: '/', icon: Home, label: 'Daily Puzzle', subtitle: 'Solve & Earn' },
        {
            href: '/dashboard',
            icon: User,
            label: 'My Companion',
            subtitle: 'Beast Pirates',
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
            label: 'Create Puzzle',
            subtitle: 'Share & Challenge',
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
                className="modern-card shadow-medium modern-hover soft-glow fixed left-4 top-4 z-50 p-3 lg:hidden"
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
                    className="modern-backdrop fixed inset-0 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-40 h-full w-80 transform bg-gradient-to-b from-[#2a2d66] to-[#1e2147] transition-all duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } shadow-strong border-r border-[#F4C430]/20 lg:translate-x-0`}
            >
                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="grid-pattern h-full w-full"></div>
                </div>

                {/* Sidebar Content */}
                <div className="smooth-fade-in relative z-10 flex h-full flex-col">
                    {/* Header */}
                    <div className="border-b border-[#F4C430]/20 p-6">
                        <div className="mb-4 flex items-center space-x-3">
                            <div className="shadow-medium soft-glow flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#F4C430] to-[#e6b800]">
                                <span className="text-2xl">🍡</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold leading-tight text-[#F4C430]">
                                    Otama's Adventure
                                </h1>
                                <p className="text-sm font-medium text-[#F9C5D5]">
                                    Kibi Dango Quest
                                </p>
                            </div>
                        </div>

                        {/* KIBI Balance */}
                        <div className="glass-card border-accent p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Coins className="gentle-float h-5 w-5 text-[#F4C430]" />
                                    <span className="font-semibold text-[#F5F5F5]">$KIBI</span>
                                </div>
                                <span className="accent-text text-lg font-bold text-[#F4C430]">
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
                                        className={`group relative rounded-xl p-4 transition-all duration-300 ${
                                            isActive
                                                ? 'glass-card shadow-medium soft-glow border-accent'
                                                : 'bg-light hover:bg-medium modern-hover'
                                        }`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`rounded-lg p-2 transition-all duration-300 ${
                                                    isActive
                                                        ? 'shadow-soft bg-accent text-[#2A2D66]'
                                                        : 'bg-medium text-[#F9C5D5] group-hover:bg-accent group-hover:text-[#2A2D66] group-hover:text-[#F5F5F5]'
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
                                                    className={`text-sm transition-colors duration-300 ${
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
                                            <div className="shadow-soft soft-glow absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 transform rounded-l-full bg-[#F4C430]"></div>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-[#F4C430]/20 p-4">
                        {/* Otama Character */}
                        <div className="glass-card border-soft mb-4 p-4">
                            <div className="flex items-center space-x-3">
                                <div className="gentle-float text-3xl">👧</div>
                                <div>
                                    <p className="text-sm font-medium text-[#F9C5D5]">
                                        Otama says:
                                    </p>
                                    <p className="text-xs text-[#F5F5F5]">
                                        "Keep solving puzzles and help more friends!"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* App Version */}
                        <div className="text-center">
                            <div className="glass-card inline-block border-accent p-3">
                                <div className="shadow-soft flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F4C430] to-[#8B5FBF]">
                                    <span className="text-sm font-bold text-[#2A2D66]">v1</span>
                                </div>
                            </div>
                            <p className="mt-2 text-xs font-medium text-[#F9C5D5]">
                                Puzzle Adventure
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
