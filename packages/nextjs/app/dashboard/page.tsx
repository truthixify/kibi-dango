'use client'

import { useEffect, useState } from 'react'
import { Award, Coins, Star, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card'
import { Progress } from '~~/components/ui/progress'
import { useScaffoldContract } from '~~/hooks/scaffold-stark/useScaffoldContract'
import { useAccount } from '~~/hooks/useAccount'
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

function getNextRankProgress(solves: number) {
    for (let i = rankThresholds.length - 1; i >= 0; i--) {
        if (solves >= rankThresholds[i].min) {
            const current = rankThresholds[i]
            const next = rankThresholds[i + 1]

            if (!next) {
                return { current: current.name, next: null, progress: 1, remaining: 0 }
            }

            const progress = (solves - current.min) / (next.min - current.min)
            return {
                current: current.name,
                next: next.name,
                progress: Math.min(progress, 1),
                remaining: next.min - solves,
            }
        }
    }

    return {
        current: 'TamedBeast',
        next: 'ObedientFighter',
        progress: solves / 10,
        remaining: 10 - solves,
    }
}

export default function DashboardPage() {
    const { address } = useAccount()
    const { data: pirateNFT } = useScaffoldContract({ contractName: 'PirateNFT' })
    const { data: puzzleGame } = useScaffoldContract({ contractName: 'PuzzleGame' })

    const [solveCount, setSolveCount] = useState(0)
    const [currentRank, setCurrentRank] = useState<keyof typeof ranks>('TamedBeast')
    const [kibiEarned, setKibiEarned] = useState<number>(0)
    const [nextRankProgress, setNextRankProgress] = useState<{
        current: string
        next: string | null
        progress: number
        remaining: number
    } | null>(null)
    const [nftImageUrl, setNftImageUrl] = useState<string>('')

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

                const progress = getNextRankProgress(userSolveCount)
                setNextRankProgress(progress)
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            }
        }

        fetchData()
    }, [address, pirateNFT])

    const currentRankData = ranks[currentRank]

    return (
        <div className="minimal-container py-8">
            <div className="fade-in mx-auto max-w-5xl">
                <div className="mb-8 text-center">
                    <h1 className="text-heading mb-2 text-3xl">My Pirate Path</h1>
                    <p className="text-body">
                        Solve puzzles, earn kibi tokens, and rise through the ranks!
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <Card className="minimal-card hover-lift">
                        <CardHeader className="border-b border-gray-200 bg-gray-50">
                            <CardTitle className="text-heading flex items-center gap-2 text-xl">
                                <Award className="h-5 w-5 text-primary" />
                                {currentRankData.name} Pirate
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl text-4xl">
                                    <Image
                                        src={nftImageUrl || getRankImageUrl(currentRank)}
                                        alt={`${currentRankData.name} Rank`}
                                        width={100}
                                        height={100}
                                        className="h-full w-full rounded-2xl object-cover shadow-md"
                                    />
                                </div>
                                <div className="inline-block rounded-full bg-warning px-3 py-1 text-sm font-medium text-white">
                                    {currentRankData.name}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-subheading">Kibi Quests Completed:</span>
                                    <span className="text-heading text-xl font-semibold">
                                        {solveCount}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-subheading">$KIBI earned:</span>
                                    <div className="flex items-center gap-2">
                                        <Coins className="h-4 w-4 text-warning" />
                                        <span className="text-heading text-xl font-semibold">
                                            {kibiEarned}
                                        </span>
                                    </div>
                                </div>

                                {nextRankProgress && (
                                    <div className="pt-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-subheading">
                                                Progress to{' '}
                                                {ranks[nextRankProgress.next as keyof typeof ranks]
                                                    ?.name || 'Ultimate Performer'}
                                                :
                                            </span>
                                            <span className="text-caption">
                                                {Math.round(nextRankProgress.progress * 100)}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={nextRankProgress.progress * 100}
                                            className="h-2"
                                        />
                                        <p className="text-caption mt-1">
                                            {nextRankProgress.remaining} more quests to tame for
                                            your next promotion!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="minimal-card">
                        <CardHeader>
                            <CardTitle className="text-heading flex items-center gap-2 text-lg">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                Pirate Rank Progression
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 p-4">
                            {Object.entries(ranks).map(([key, rank]) => (
                                <div key={key} className="flex items-center gap-3">
                                    <div
                                        className={`h-3 w-3 rounded-full ${solveCount >= rank.minSolves ? rank.color : 'bg-gray-300'}`}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`text-sm font-medium ${key === currentRank ? 'text-primary' : solveCount >= rank.minSolves ? 'text-gray-900' : 'text-gray-500'}`}
                                            >
                                                {rank.name}
                                            </span>
                                            <span className="text-caption text-xs">
                                                {rank.minSolves} solves
                                            </span>
                                        </div>
                                        {key === currentRank && (
                                            <div className="mt-1 inline-block rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                                                Your Crew
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function Achievement({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning text-xs text-white">
                {icon}
            </div>
            <div>
                <h4 className="text-subheading text-sm font-medium">{title}</h4>
                <p className="text-caption text-xs">{desc}</p>
            </div>
        </div>
    )
}
