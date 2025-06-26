'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '~~/components/ui/button'
import { Coins, Home, Trophy, PlusCircle, User } from 'lucide-react'

export function Navigation() {
    const pathname = usePathname()

    const navItems = [
        { href: '/', icon: Home, label: 'Puzzle' },
        { href: '/dashboard', icon: User, label: 'Pirate' },
        { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
        { href: '/create', icon: PlusCircle, label: 'Create' },
    ]

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 border-b-4 border-yellow-600 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                            <span className="text-lg">🍡</span>
                        </div>
                        <h1 className="hidden text-lg font-bold text-white sm:block">
                            Otama's Puzzle Adventure
                        </h1>
                    </div>

                    <div className="flex items-center space-x-1 sm:space-x-2">
                        {navItems.map(item => (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={`text-white hover:bg-white/20 ${pathname === item.href ? 'bg-white/30' : ''}`}
                                >
                                    <item.icon className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-2 text-white">
                        <Coins className="h-5 w-5 text-yellow-200" />
                        <span className="font-bold">1,247 $KIBI</span>
                    </div>
                </div>
            </div>
        </nav>
    )
}
