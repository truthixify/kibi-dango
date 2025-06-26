'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '~~/components/ui/button'
import { Input } from '~~/components/ui/input'
import { Textarea } from '~~/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~~/components/ui/select'
import { Badge } from '~~/components/ui/badge'
import { PlusCircle, Lightbulb, Gift } from 'lucide-react'

export default function CreatePage() {
    const [puzzleText, setPuzzleText] = useState('')
    const [answer, setAnswer] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [reward, setReward] = useState('')
    const [hint, setHint] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle puzzle submission
        console.log({ puzzleText, answer, difficulty, reward, hint })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="floating-animation mb-4 inline-block">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-2xl shadow-lg">
                            ✨
                        </div>
                    </div>
                    <h1 className="mb-2 text-4xl font-bold text-gray-800">
                        Create Your Own Puzzle
                    </h1>
                    <p className="text-lg text-gray-600">
                        Help Otama create new challenges for fellow pirates!
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-4 border-green-200 bg-gradient-to-br from-green-50 to-blue-50 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <PlusCircle className="h-6 w-6" />
                                    Puzzle Creator
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="mb-2 block text-lg font-medium text-gray-700">
                                            Puzzle Question
                                        </label>
                                        <Textarea
                                            value={puzzleText}
                                            onChange={e => setPuzzleText(e.target.value)}
                                            placeholder="Write your puzzle riddle here... Make it challenging but fair!"
                                            className="min-h-32 border-2 border-green-200 text-gray-800 focus:border-green-400"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-lg font-medium text-gray-700">
                                                Answer (Single Letter)
                                            </label>
                                            <Input
                                                type="text"
                                                value={answer}
                                                onChange={e =>
                                                    setAnswer(
                                                        e.target.value.slice(0, 1).toUpperCase()
                                                    )
                                                }
                                                placeholder="A"
                                                className="h-16 border-2 border-green-200 text-center text-2xl font-bold text-gray-800 focus:border-green-400"
                                                maxLength={1}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-lg font-medium text-gray-700">
                                                Difficulty
                                            </label>
                                            <Select
                                                value={difficulty}
                                                onValueChange={setDifficulty}
                                                required
                                            >
                                                <SelectTrigger className="h-16 border-2 border-green-200 text-lg focus:border-green-400">
                                                    <SelectValue placeholder="Select difficulty" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="easy">
                                                        🟢 Easy (10 $KIBI)
                                                    </SelectItem>
                                                    <SelectItem value="medium">
                                                        🟡 Medium (25 $KIBI)
                                                    </SelectItem>
                                                    <SelectItem value="hard">
                                                        🔴 Hard (50 $KIBI)
                                                    </SelectItem>
                                                    <SelectItem value="expert">
                                                        ⚫ Expert (100 $KIBI)
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-lg font-medium text-gray-700">
                                            Hint (Optional)
                                        </label>
                                        <Input
                                            type="text"
                                            value={hint}
                                            onChange={e => setHint(e.target.value)}
                                            placeholder="Give pirates a helpful hint..."
                                            className="border-2 border-green-200 text-gray-800 focus:border-green-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-lg font-medium text-gray-700">
                                            Creator Reward
                                        </label>
                                        <Select value={reward} onValueChange={setReward} required>
                                            <SelectTrigger className="border-2 border-green-200 focus:border-green-400">
                                                <SelectValue placeholder="Select your reward" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5">5 $KIBI per solve</SelectItem>
                                                <SelectItem value="10">
                                                    10 $KIBI per solve
                                                </SelectItem>
                                                <SelectItem value="15">
                                                    15 $KIBI per solve
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-16 w-full bg-gradient-to-r from-green-500 to-blue-500 text-lg font-bold text-white shadow-lg hover:from-green-600 hover:to-blue-600"
                                        disabled={!puzzleText || !answer || !difficulty || !reward}
                                    >
                                        Publish Puzzle 🚀
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Otama's Tips */}
                        <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-red-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl text-pink-800">
                                    <Lightbulb className="h-5 w-5" />
                                    Otama's Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 rounded-lg border border-pink-200 bg-white p-3">
                                        <div className="text-2xl">👧</div>
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                "Remember, keep your puzzle fun but fair! Pirates
                                                should be able to solve it with some thinking."
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-lg border border-pink-200 bg-white p-3">
                                        <div className="text-2xl">🍡</div>
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                "Make sure your riddle has a clear connection to the
                                                answer. No trick questions!"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-lg border border-pink-200 bg-white p-3">
                                        <div className="text-2xl">⚡</div>
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                "Test your puzzle with friends first. If they can't
                                                solve it, maybe it's too hard!"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rewards Info */}
                        <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl text-yellow-800">
                                    <Gift className="h-5 w-5" />
                                    Creator Rewards
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between rounded border border-yellow-200 bg-white p-2">
                                        <span className="text-sm font-medium">Easy Puzzle</span>
                                        <Badge className="bg-green-400 text-green-900">
                                            5 $KIBI/solve
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between rounded border border-yellow-200 bg-white p-2">
                                        <span className="text-sm font-medium">Medium Puzzle</span>
                                        <Badge className="bg-yellow-400 text-yellow-900">
                                            10 $KIBI/solve
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between rounded border border-yellow-200 bg-white p-2">
                                        <span className="text-sm font-medium">Hard Puzzle</span>
                                        <Badge className="bg-orange-400 text-orange-900">
                                            15 $KIBI/solve
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between rounded border border-yellow-200 bg-white p-2">
                                        <span className="text-sm font-medium">Expert Puzzle</span>
                                        <Badge className="bg-red-400 text-red-900">
                                            20 $KIBI/solve
                                        </Badge>
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-gray-600">
                                    You earn rewards every time someone solves your puzzle!
                                </p>
                            </CardContent>
                        </Card>

                        {/* Recent Puzzles */}
                        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                            <CardHeader>
                                <CardTitle className="text-xl text-blue-800">
                                    Your Recent Puzzles
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="rounded border border-blue-200 bg-white p-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">
                                                Crypto Origins
                                            </span>
                                            <Badge variant="secondary">12 solves</Badge>
                                        </div>
                                        <p className="text-xs text-gray-600">+60 $KIBI earned</p>
                                    </div>
                                    <div className="rounded border border-blue-200 bg-white p-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">
                                                Blockchain Basics
                                            </span>
                                            <Badge variant="secondary">8 solves</Badge>
                                        </div>
                                        <p className="text-xs text-gray-600">+40 $KIBI earned</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
