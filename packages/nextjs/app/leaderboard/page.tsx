'use client'

import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card'
import { Badge } from '~~/components/ui/badge'
import { Trophy, Medal, Award, Coins } from 'lucide-react'

export default function LeaderboardPage() {
    const leaderboardData = [
        {
            rank: 1,
            username: 'PirateKing_Luffy',
            solves: 156,
            kibi: 7800,
            pirateRank: 'Yonko',
            avatar: '👑',
        },
        {
            rank: 2,
            username: 'SwordMaster_Zoro',
            solves: 142,
            kibi: 7100,
            pirateRank: 'Yonko',
            avatar: '⚔️',
        },
        {
            rank: 3,
            username: 'Navigator_Nami',
            solves: 138,
            kibi: 6900,
            pirateRank: 'Yonko',
            avatar: '🗺️',
        },
        {
            rank: 4,
            username: 'Sniper_Usopp',
            solves: 89,
            kibi: 4450,
            pirateRank: 'Calamity',
            avatar: '🎯',
        },
        {
            rank: 5,
            username: 'Chef_Sanji',
            solves: 76,
            kibi: 3800,
            pirateRank: 'Calamity',
            avatar: '👨‍🍳',
        },
        {
            rank: 6,
            username: 'Doctor_Chopper',
            solves: 65,
            kibi: 3250,
            pirateRank: 'Calamity',
            avatar: '🦌',
        },
        {
            rank: 7,
            username: 'Archaeologist_Robin',
            solves: 58,
            kibi: 2900,
            pirateRank: 'All-Star',
            avatar: '📚',
        },
        {
            rank: 8,
            username: 'Shipwright_Franky',
            solves: 52,
            kibi: 2600,
            pirateRank: 'All-Star',
            avatar: '🔧',
        },
        {
            rank: 9,
            username: 'Musician_Brook',
            solves: 47,
            kibi: 2350,
            pirateRank: 'All-Star',
            avatar: '🎵',
        },
        {
            rank: 10,
            username: 'Helmsman_Jinbe',
            solves: 43,
            kibi: 2150,
            pirateRank: 'All-Star',
            avatar: '🌊',
        },
    ]

    const getRankColor = (rank: string) => {
        switch (rank) {
            case 'Yonko':
                return 'bg-yellow-400 text-yellow-900'
            case 'Calamity':
                return 'bg-red-400 text-red-900'
            case 'All-Star':
                return 'bg-purple-400 text-purple-900'
            case 'Headliner':
                return 'bg-blue-400 text-blue-900'
            default:
                return 'bg-gray-400 text-gray-900'
        }
    }

    const getRankIcon = (position: number) => {
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="floating-animation mb-4 inline-block">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-2xl shadow-lg">
                            🏆
                        </div>
                    </div>
                    <h1 className="mb-2 text-4xl font-bold text-gray-800">Pirate Leaderboard</h1>
                    <p className="text-lg text-gray-600">
                        See how your puzzle-solving skills stack up against other pirates!
                    </p>
                </div>

                {/* Top 3 Podium */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {leaderboardData.slice(0, 3).map((player, index) => (
                        <Card
                            key={player.username}
                            className={`border-4 shadow-xl ${
                                index === 0
                                    ? 'transform border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 md:order-2 md:scale-110'
                                    : index === 1
                                      ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 md:order-1'
                                      : 'border-orange-300 bg-gradient-to-br from-orange-50 to-red-50 md:order-3'
                            }`}
                        >
                            <CardContent className="p-6 text-center">
                                <div className="mb-4">{getRankIcon(player.rank)}</div>
                                <div className="mb-2 text-4xl">{player.avatar}</div>
                                <h3 className="mb-2 text-lg font-bold text-gray-800">
                                    {player.username}
                                </h3>
                                <Badge className={`${getRankColor(player.pirateRank)} mb-3`}>
                                    {player.pirateRank}
                                </Badge>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">{player.solves}</span>{' '}
                                        solves
                                    </p>
                                    <p className="flex items-center justify-center gap-1 text-sm text-gray-600">
                                        <Coins className="h-4 w-4 text-yellow-500" />
                                        <span className="font-semibold">
                                            {player.kibi.toLocaleString()}
                                        </span>{' '}
                                        $KIBI
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Full Leaderboard */}
                <Card className="border-2 border-blue-200 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <CardTitle className="text-2xl">Full Rankings</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Rank
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Pirate
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Rank
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Solves
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            $KIBI
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {leaderboardData.map((player, index) => (
                                        <tr
                                            key={player.username}
                                            className={`hover:bg-gray-50 ${
                                                player.username === 'YourPirateName'
                                                    ? 'border-l-4 border-blue-400 bg-blue-50'
                                                    : ''
                                            }`}
                                        >
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center">
                                                    {getRankIcon(player.rank)}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="mr-3 text-2xl">
                                                        {player.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {player.username}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <Badge
                                                    className={`${getRankColor(player.pirateRank)}`}
                                                >
                                                    {player.pirateRank}
                                                </Badge>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                                                {player.solves}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center text-sm font-semibold text-gray-900">
                                                    <Coins className="mr-1 h-4 w-4 text-yellow-500" />
                                                    {player.kibi.toLocaleString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Floating Beast Pirates */}
                <div className="fixed bottom-4 right-4 space-y-2">
                    <div className="floating-animation text-2xl">🐺</div>
                    <div className="floating-animation text-2xl" style={{ animationDelay: '0.5s' }}>
                        🦏
                    </div>
                    <div className="floating-animation text-2xl" style={{ animationDelay: '1s' }}>
                        🐘
                    </div>
                </div>
            </div>
        </div>
    )
}
