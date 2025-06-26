'use client'

import type React from 'react'
import { useState, useCallback } from 'react'
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
import { useScaffoldContract } from '~~/hooks/scaffold-stark/useScaffoldContract'
import { createPuzzle } from '~~/lib/api'
import { useAccount } from '~~/hooks/useAccount'
import { cairo, CairoCustomEnum, hash, stark } from 'starknet'

export default function CreatePage() {
    const [question, setQuestion] = useState('')
    const [hint, setHint] = useState('')
    const [bountyAmount, setBountyAmount] = useState(0)
    const [solution, setSolution] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const { data: puzzleGame } = useScaffoldContract({ contractName: 'PuzzleGame' })
    const { address } = useAccount()

    const MIN_BOUNTY_AMOUNT = {
        easy: 3000,
        medium: 5000,
        hard: 7000,
        expert: 7000,
    }

    const validateBountyAmount = useCallback(() => {
        if (!difficulty) return true
        const minBounty = MIN_BOUNTY_AMOUNT[difficulty as keyof typeof MIN_BOUNTY_AMOUNT]
        return bountyAmount >= minBounty
    }, [bountyAmount, difficulty])

    const handleCreatePuzzle = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            setError(null)
            setSuccess(false)
            setIsSubmitting(true)

            if (!address) {
                setError('Please connect your wallet to create a puzzle')
                setIsSubmitting(false)
                return
            }

            if (!puzzleGame) {
                setError('Puzzle game contract not available')
                setIsSubmitting(false)
                return
            }

            if (!validateBountyAmount()) {
                setError(
                    `Bounty amount must be at least ${MIN_BOUNTY_AMOUNT[difficulty as keyof typeof MIN_BOUNTY_AMOUNT]} $KIBI for ${difficulty} puzzles`
                )
                setIsSubmitting(false)
                return
            }

            try {
                const salt = cairo.felt(stark.randomAddress())
                const puzzleId = cairo.felt(stark.randomAddress())
                const solutionHash = hash.computePoseidonHashOnElements([
                    cairo.felt(solution.toLowerCase()),
                    cairo.felt(salt),
                ])

                const difficultyLevel = new CairoCustomEnum({
                    [difficulty.charAt(0).toUpperCase() + difficulty.slice(1)]: {},
                })
                const tx = await puzzleGame.create_puzzle(
                    puzzleId,
                    BigInt(solutionHash),
                    difficultyLevel,
                    BigInt(bountyAmount)
                )

                await tx.wait()

                const newPuzzle = await createPuzzle(
                    puzzleId,
                    question,
                    hint,
                    solutionHash,
                    salt,
                    bountyAmount,
                    address
                )

                setSuccess(true)
                setQuestion('')
                setHint('')
                setBountyAmount(0)
                setSolution('')
                setDifficulty('')
            } catch (error: any) {
                console.error('Failed to create puzzle:', error)
                setError(error.message || 'Failed to create puzzle. Please try again.')
            } finally {
                setIsSubmitting(false)
            }
        },
        [
            address,
            puzzleGame,
            question,
            hint,
            bountyAmount,
            solution,
            difficulty,
            validateBountyAmount,
        ]
    )

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
                                {/* {error && (
                                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
                                        {error}
                                    </div>
                                )} */}
                                {success && (
                                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
                                        Puzzle created successfully!
                                    </div>
                                )}
                                <form onSubmit={handleCreatePuzzle} className="space-y-6">
                                    <div>
                                        <label className="mb-2 block text-lg font-medium text-gray-700">
                                            Puzzle Question
                                        </label>
                                        <Textarea
                                            value={question}
                                            onChange={e => setQuestion(e.target.value)}
                                            placeholder="Write your puzzle riddle here... Make it challenging but fair!"
                                            className="min-h-32 border-2 border-green-200 text-gray-800 focus:border-green-400"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-lg font-medium text-gray-700">
                                                Solution (Single Word)
                                            </label>
                                            <Input
                                                type="text"
                                                value={solution}
                                                onChange={e =>
                                                    setSolution(e.target.value.toLowerCase())
                                                }
                                                placeholder="STARKNET"
                                                className="h-16 border-2 border-green-200 text-center text-gray-800 focus:border-green-400"
                                                required
                                                disabled={isSubmitting}
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
                                                disabled={isSubmitting}
                                            >
                                                <SelectTrigger className="h-16 border-2 border-green-200 text-lg focus:border-green-400">
                                                    <SelectValue placeholder="Select difficulty" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="easy">
                                                        🟢 Easy ({'>'}= 3000 $KIBI)
                                                    </SelectItem>
                                                    <SelectItem value="medium">
                                                        🟡 Medium ({'>'}= 5000 $KIBI)
                                                    </SelectItem>
                                                    <SelectItem value="hard">
                                                        🔴 Hard ({'>'}= 7000 $KIBI)
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
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-lg font-medium text-gray-700">
                                            Solver Reward
                                        </label>
                                        <Input
                                            type="number"
                                            value={bountyAmount}
                                            onChange={e => setBountyAmount(Number(e.target.value))}
                                            placeholder={`Enter reward in $KIBI (min ${difficulty ? MIN_BOUNTY_AMOUNT[difficulty as keyof typeof MIN_BOUNTY_AMOUNT] : 3000})`}
                                            className="h-16 w-full rounded-lg border-2 border-green-200 text-center text-gray-800 focus:border-green-400"
                                            required
                                            min={
                                                difficulty
                                                    ? MIN_BOUNTY_AMOUNT[
                                                          difficulty as keyof typeof MIN_BOUNTY_AMOUNT
                                                      ]
                                                    : 3000
                                            }
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-16 w-full bg-gradient-to-r from-green-500 to-blue-500 text-lg font-bold text-white shadow-lg hover:from-green-600 hover:to-blue-600"
                                        disabled={
                                            isSubmitting ||
                                            !question ||
                                            !solution ||
                                            !difficulty ||
                                            !bountyAmount ||
                                            !validateBountyAmount()
                                        }
                                    >
                                        {isSubmitting ? 'Publishing...' : 'Publish Puzzle 🚀'}
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
                                    Solver Rewards
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between rounded border border-yellow-200 bg-white p-2">
                                        <span className="text-sm font-medium">Easy Puzzle</span>
                                        <Badge className="bg-green-400 text-green-900">
                                            Minimum of 3000 $KIBI/solve
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between rounded border border-yellow-200 bg-white p-2">
                                        <span className="text-sm font-medium">Medium Puzzle</span>
                                        <Badge className="bg-yellow-400 text-yellow-900">
                                            Minimum of 5000 $KIBI/solve
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between rounded border border-yellow-200 bg-white p-2">
                                        <span className="text-sm font-medium">Hard Puzzle</span>
                                        <Badge className="bg-orange-400 text-orange-900">
                                            Minimum of 7000 $KIBI/solve
                                        </Badge>
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-gray-600">
                                    You have the freedom to set your own rewards, but make sure they
                                    are fair and enticing for pirates to solve your puzzles!
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
