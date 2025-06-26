'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card'
import { Badge } from '~~/components/ui/badge'
import { Trophy, Medal, Award } from 'lucide-react'
import { useScaffoldContract } from '~~/hooks/scaffold-stark/useScaffoldContract'
import { getAllUsers } from '~~/lib/api'

const ranks = {
    TamedBeast: { name: 'Tamed Beast', minSolves: 0, color: 'bg-gray-400 text-gray-900' },
    ObedientFighter: { name: 'Obedient Fighter', minSolves: 10, color: 'bg-green-500 text-white' },
    Headliner: { name: 'Headliner', minSolves: 50, color: 'bg-blue-500 text-white' },
    Gifters: { name: 'Gifters', minSolves: 100, color: 'bg-yellow-500 text-yellow-900' },
    Shinuchi: { name: 'Shinuchi', minSolves: 300, color: 'bg-orange-500 text-white' },
    FlyingSix: { name: 'Flying Six', minSolves: 600, color: 'bg-red-500 text-white' },
    AllStar: { name: 'All Star', minSolves: 1000, color: 'bg-purple-600 text-white' },
    LeadPerformer: { name: 'Lead Performer', minSolves: 2000, color: 'bg-pink-600 text-white' },
} as const

type RankKey = keyof typeof ranks

function getRank(solves: number) {
    const entries = Object.entries(ranks) as [RankKey, (typeof ranks)[RankKey]][]
    const eligible = entries.filter(([_, v]) => solves >= v.minSolves)
    const highest = eligible[eligible.length - 1]
    return highest ? highest[1] : ranks.TamedBeast
}

function getRankIcon(position: number) {
    switch (position) {
        case 1:
            return <Trophy className="h-6 w-6 text-yellow-500" />
        case 2:
            return <Medal className="h-6 w-6 text-gray-400" />
        case 3:
            return <Award className="h-6 w-6 text-orange-500" />
        default:
            return (
                <span className="flex h-6 w-6 items-center justify-center font-bold text-gray-600">
                    #{position}
                </span>
            )
    }
}

export default function LeaderboardPage() {
    const [users, setUsers] = useState<
        { address: string; username: string; solves: number; rankName: string; rankColor: string }[]
    >([])

    const { data: pirateNFT } = useScaffoldContract({ contractName: 'PirateNFT' })

    useEffect(() => {
        const loadLeaderboard = async () => {
            const userList = (await getAllUsers()) || []

            const enriched = await Promise.all(
                userList.map(async (user: { address: string; username: string }) => {
                    let solves = 0
                    try {
                        const tokenId = await pirateNFT?.get_token_id_of_player(user.address)
                        solves = Number(await pirateNFT?.get_solved_count(tokenId))
                    } catch (err) {
                        console.warn(`Failed to fetch data for ${user.address}`, err)
                    }

                    const rank = getRank(solves)

                    return {
                        address: user.address,
                        username: user.username,
                        solves,
                        rankName: rank.name,
                        rankColor: rank.color,
                    }
                })
            )

            // Sort by solve count descending
            enriched.sort((a, b) => b.solves - a.solves)

            setUsers(enriched)
        }

        if (pirateNFT) {
            loadLeaderboard()
        }
    }, [pirateNFT])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 text-center">
                    <div className="floating-animation mb-4 inline-block">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-2xl shadow-lg">
                            🏴‍☠️
                        </div>
                    </div>
                    <h1 className="mb-2 text-4xl font-bold text-gray-800">Kibi Dango Rankings</h1>
                    <p className="text-lg text-gray-600">
                        The fiercest puzzle-solving pirates in the Animal Kingdom crew!
                    </p>
                </div>

                {/* Top 3 */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {users.slice(0, 3).map((user, index) => (
                        <Card
                            key={user.address}
                            className={`border-4 shadow-xl ${
                                index === 0
                                    ? 'transform border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 md:order-2 md:scale-110'
                                    : index === 1
                                      ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 md:order-1'
                                      : 'border-orange-300 bg-gradient-to-br from-orange-50 to-red-50 md:order-3'
                            }`}
                        >
                            <CardContent className="p-6 text-center">
                                <div className="mb-4">{getRankIcon(index + 1)}</div>
                                <h3 className="mb-2 text-lg font-bold text-gray-800">
                                    {user.username}
                                </h3>
                                <Badge className={`${user.rankColor} mb-3`}>{user.rankName}</Badge>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">{user.solves}</span> puzzles
                                        conquered
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Full leaderboard */}
                <Card className="border-2 border-blue-200 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <CardTitle className="text-2xl">Grand Line Rankings</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Placement
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Username
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Address
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Pirate Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Puzzles Solved
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.map((user, index) => (
                                        <tr key={user.address}>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center">
                                                    {getRankIcon(index + 1)}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.username}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.address.slice(0, 10)}...
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <Badge className={user.rankColor}>
                                                    {user.rankName}
                                                </Badge>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                                                {user.solves}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
