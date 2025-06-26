'use client'

import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card'
import { Button } from '~~/components/ui/button'
import { Progress } from '~~/components/ui/progress'
import { Coins, Star, TrendingUp, Award } from 'lucide-react'

export default function DashboardPage() {
    const currentRank = 'Advanced'
    const solveCount = 42
    const tokenBalance = 1247
    const nextRankProgress = 75

    const ranks = [
        { name: 'Beginner', minSolves: 0, color: 'bg-gray-400' },
        { name: 'Novice', minSolves: 10, color: 'bg-primary' },
        { name: 'Advanced', minSolves: 25, color: 'bg-warning' },
        { name: 'Expert', minSolves: 50, color: 'bg-success' },
        { name: 'Master', minSolves: 100, color: 'bg-error' },
    ]

    return (
        <div className="minimal-container py-8">
            <div className="fade-in mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-heading mb-2 text-3xl">My Progress</h1>
                    <p className="text-body">Track your puzzle-solving journey</p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Progress Card */}
                    <Card className="minimal-card hover-lift">
                        <CardHeader className="border-b border-gray-200 bg-gray-50">
                            <CardTitle className="text-heading flex items-center gap-2 text-xl">
                                <Award className="h-5 w-5 text-primary" />
                                {currentRank} Player
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-4xl">
                                    🏆
                                </div>
                                <div className="inline-block rounded-full bg-warning px-3 py-1 text-sm font-medium text-white">
                                    {currentRank} Rank
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-subheading">Puzzles Solved:</span>
                                    <span className="text-heading text-xl font-semibold">
                                        {solveCount}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-subheading">Token Balance:</span>
                                    <div className="flex items-center gap-2">
                                        <Coins className="h-4 w-4 text-warning" />
                                        <span className="text-heading text-xl font-semibold">
                                            {tokenBalance.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-subheading">Progress to Expert:</span>
                                        <span className="text-caption">{nextRankProgress}%</span>
                                    </div>
                                    <Progress value={nextRankProgress} className="h-2" />
                                    <p className="text-caption mt-1">
                                        {50 - solveCount} more solves needed!
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats and Actions */}
                    <div className="space-y-6">
                        {/* Recent Achievements */}
                        <Card className="minimal-card border-success">
                            <CardHeader>
                                <CardTitle className="text-heading flex items-center gap-2 text-lg">
                                    <Star className="h-4 w-4 text-success" />
                                    Recent Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning">
                                            <span className="text-xs text-white">🔥</span>
                                        </div>
                                        <div>
                                            <h4 className="text-subheading text-sm font-medium">
                                                7-Day Streak!
                                            </h4>
                                            <p className="text-caption text-xs">
                                                Solved puzzles for 7 days straight
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                                            <span className="text-xs text-white">⚡</span>
                                        </div>
                                        <div>
                                            <h4 className="text-subheading text-sm font-medium">
                                                Advanced Rank!
                                            </h4>
                                            <p className="text-caption text-xs">
                                                Reached 25 puzzle solves
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success">
                                            <span className="text-xs text-white">🧩</span>
                                        </div>
                                        <div>
                                            <h4 className="text-subheading text-sm font-medium">
                                                Puzzle Master
                                            </h4>
                                            <p className="text-caption text-xs">
                                                Solved 10 crypto riddles
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rank Progression */}
                        <Card className="minimal-card">
                            <CardHeader>
                                <CardTitle className="text-heading flex items-center gap-2 text-lg">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    Rank Progression
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    {ranks.map(rank => (
                                        <div key={rank.name} className="flex items-center gap-3">
                                            <div
                                                className={`h-3 w-3 rounded-full ${solveCount >= rank.minSolves ? rank.color : 'bg-gray-300'}`}
                                            ></div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span
                                                        className={`text-sm font-medium ${
                                                            rank.name === currentRank
                                                                ? 'text-primary'
                                                                : solveCount >= rank.minSolves
                                                                  ? 'text-gray-900'
                                                                  : 'text-gray-500'
                                                        }`}
                                                    >
                                                        {rank.name}
                                                    </span>
                                                    <span className="text-caption text-xs">
                                                        {rank.minSolves} solves
                                                    </span>
                                                </div>
                                                {rank.name === currentRank && (
                                                    <div className="mt-1 inline-block rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                                                        Current
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="minimal-card">
                            <CardHeader>
                                <CardTitle className="text-heading text-lg">
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button className="minimal-button minimal-button-primary text-sm">
                                        Today's Puzzle
                                    </Button>
                                    <Button className="minimal-button minimal-button-secondary text-sm">
                                        Leaderboard
                                    </Button>
                                    <Button className="minimal-button minimal-button-secondary text-sm">
                                        Create Puzzle
                                    </Button>
                                    <Button className="minimal-button minimal-button-secondary text-sm">
                                        View History
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
