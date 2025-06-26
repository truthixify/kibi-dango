'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coins, Home, Trophy, PlusCircle, User, Menu, X } from 'lucide-react'
import { useAccount } from '~~/hooks/useAccount'
import { getUserByAddress } from '~~/lib/api' // make sure path matches
import { useScaffoldContract } from '~~/hooks/scaffold-stark/useScaffoldContract'
import Image from 'next/image'

const baseUrl =
    'https://gateway.pinata.cloud/ipfs/bafybeicgkefinig2amq6wbgftzy7kfkz44ssdlg2ckuimxuahjxufqrpzu/'

const ranks = {
    TamedBeast: { name: 'Tamed Beast', minSolves: 0, color: 'bg-gray-400' },
    ObedientFighter: { name: 'Obedient Fighter', minSolves: 10, color: 'bg-green-500' },
    Headliner: { name: 'Headliner', minSolves: 50, color: 'bg-blue-500' },
    Gifters: { name: 'Gifters', minSolves: 100, color: 'bg-yellow-500' },
    Shinuchi: { name: 'Shinuchi', minSolves: 300, color: 'bg-orange-500' },
    FlyingSix: { name: 'Flying Six', minSolves: 600, color: 'bg-red-500' },
    AllStar: { name: 'All Star', minSolves: 1000, color: 'bg-purple-600' },
    LeadPerformer: { name: 'Lead Performer', minSolves: 2000, color: 'bg-pink-600' },
} as const

type RankKey = keyof typeof ranks

function getRankImageUrl(rank: RankKey): string {
    const filename =
        rank
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '') + '.png'

    return `${baseUrl}${filename}`
}

const rankThresholds = Object.entries(ranks).map(([key, val]) => ({
    name: key,
    min: val.minSolves,
}))

function getRankFromSolves(solves: number): keyof typeof ranks {
    for (let i = rankThresholds.length - 1; i >= 0; i--) {
        if (solves >= rankThresholds[i].min) return rankThresholds[i].name as keyof typeof ranks
    }
    return 'TamedBeast'
}

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [userName, setUserName] = useState<string | null>(null)
    const pathname = usePathname()
    const { data: puzzleGame } = useScaffoldContract({
        contractName: 'PuzzleGame',
    })
    const { address } = useAccount()
    const { data: pirateNFT } = useScaffoldContract({ contractName: 'PirateNFT' })

    const [solveCount, setSolveCount] = useState(0)
    const [currentRank, setCurrentRank] = useState<keyof typeof ranks>('TamedBeast')
    const [kibiEarned, setKibiEarned] = useState<number>(0)
    const [nftImageUrl, setNftImageUrl] = useState<string>('')

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
        if (!address || !pirateNFT || !puzzleGame) return

        const fetchData = async () => {
            try {
                const tokenId = await pirateNFT.get_token_id_of_player(address)
                const kibiEarned = await puzzleGame.get_kibi_earned(address)
                setKibiEarned(Number(kibiEarned))
                const userSolveCount = Number(await pirateNFT.get_solved_count(tokenId))
                setSolveCount(userSolveCount)

                const rank = getRankFromSolves(userSolveCount)
                setCurrentRank(rank)
                setNftImageUrl(getRankImageUrl(rank))
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            }
        }

        const fetchUser = async () => {
            const user = await getUserByAddress(address)
            if (user) setUserName(user.username)
        }

        fetchData()
        fetchUser()
    }, [address, pirateNFT, puzzleGame])

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
                                    <Image
                                        src={nftImageUrl || getRankImageUrl(currentRank)}
                                        alt={`${currentRank} Rank`}
                                        width={100}
                                        height={100}
                                        className="h-10 w-10 rounded-lg object-cover shadow-md"
                                    />
                            <div>
                                <h1 className="text-heading text-lg font-semibold">
                                    {userName ? userName : 'Puzzle Adventure'}
                                </h1>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Coins className="h-4 w-4 text-warning" />
                                    <span className="text-subheading text-sm">Kibi Earned</span>
                                </div>
                                <span className="text-heading font-semibold">
                                    {kibiEarned !== null ? kibiEarned : '--'}
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
                                    <p className="text-subheading text-sm">Solves Count: {solveCount}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success">
                                    <span className="text-xs font-bold text-white">{'--'}</span>
                                </div>
                                <div>
                                    <p className="text-subheading text-sm">Current Rank: {currentRank}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
