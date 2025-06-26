'use client'

import type React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '~~/components/ui/button'
import { Input } from '~~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card'
import { Loader } from '~~/components/loader'
import { Success } from '~~/components/success'
import { Failure } from '~~/components/failure'
import { useAccount } from '~~/hooks/useAccount'
import {
    createAIDailyPuzzle,
    generateAIPuzzle,
    getAIDailyPuzzle,
    updateAIDailyPuzzle,
} from '~~/lib/api'
import { useScaffoldContract } from '~~/hooks/scaffold-stark/useScaffoldContract'
import { CairoCustomEnum, cairo, stark } from 'starknet'

interface DailyPuzzle {
    puzzleId: string
    question: string
    salt: string
    solutionHash: string
    hint: string
    solved?: boolean
}

export default function DailyPuzzlePage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showFailure, setShowFailure] = useState(false)
    const [dailyPuzzle, setDailyPuzzle] = useState<DailyPuzzle | null>(null)
    const [solutionHash, setSolutionHash] = useState<string | null>(null)
    const [solution, setSolution] = useState<string>('')
    const [isCreatingPuzzle, setIsCreatingPuzzle] = useState(false)
    const [isSubmittingSolution, setIsSubmittingSolution] = useState(false)
    const [isLoadingPuzzle, setIsLoadingPuzzle] = useState(true)
    const { address, isConnected } = useAccount()
    const { data: puzzleGame } = useScaffoldContract({ contractName: 'PuzzleGame' })

    const handleCreateDailyPuzzle = async () => {
        setIsCreatingPuzzle(true)
        if (!address || dailyPuzzle) return

        try {
            const puzzle = await generateAIPuzzle(address)
            setSolutionHash(puzzle?.solutionHash)
            const puzzleId = cairo.felt(stark.randomAddress())

            const difficulty_level = new CairoCustomEnum({ AI: {} })
            const tx = await puzzleGame?.create_puzzle(
                puzzleId,
                BigInt(puzzle?.solutionHash),
                difficulty_level,
                BigInt(1000)
            )

            const newPuzzle = await createAIDailyPuzzle(
                puzzleId,
                puzzle?.question,
                puzzle?.salt,
                puzzle?.hint,
                puzzle?.solutionHash,
                address
            )

            const dailyPuzzleData: DailyPuzzle = {
                puzzleId: newPuzzle.puzzleId,
                question: newPuzzle.question,
                salt: newPuzzle.salt,
                solutionHash: newPuzzle.solutionHash,
                hint: newPuzzle.hint,
            }

            setDailyPuzzle(dailyPuzzleData)
            setShowSuccess(true)
        } catch (error) {
            setShowFailure(true)
            console.error('Failed to create daily puzzle:', error)
        } finally {
            setIsCreatingPuzzle(false)
        }
    }

    const handleSubmitDailyPuzzle = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!solution || !address || !dailyPuzzle) return
        setIsSubmittingSolution(true)

        try {
            const tx = await puzzleGame?.submit_solution(
                BigInt(dailyPuzzle?.puzzleId),
                cairo.felt(solution.toLowerCase()),
                BigInt(dailyPuzzle?.salt)
            )

            if (tx) {
                const updatedPuzzle = await updateAIDailyPuzzle(address)
                if (updatedPuzzle) {
                    setDailyPuzzle(updatedPuzzle)
                    setShowSuccess(true)
                }
            }
            console.log('Transaction submitted:', tx)
        } catch (error) {
            setShowFailure(true)
            console.error('Failed to submit puzzle solution:', error)
        } finally {
            setIsSubmittingSolution(false)
        }
    }

    useEffect(() => {
        const fetchDailyPuzzle = async () => {
            if (!address) return

            try {
                const puzzle: DailyPuzzle = await getAIDailyPuzzle(address)
                if (puzzle) {
                    setDailyPuzzle({
                        ...puzzle,
                        solved: puzzle.solved ?? false,
                    })
                }
            } catch (error) {
                console.error('Failed to fetch daily puzzle:', error)
            } finally {
                setIsSubmitting(false)
                setIsLoadingPuzzle(false)
            }
        }

        fetchDailyPuzzle()
    }, [address])

    return (
        <div className="minimal-container py-8 lg:py-12">
            <div className="fade-in mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                        <span className="text-xl text-white">🧩</span>
                    </div>
                    <h1 className="text-heading mb-2 text-3xl">Daily Puzzle</h1>
                    <p className="text-body">Solve today's challenge and earn tokens</p>
                </div>

                {!dailyPuzzle && (
                    <div className="mb-6 text-center">
                        <Button
                            className="minimal-button"
                            onClick={handleCreateDailyPuzzle}
                            disabled={!puzzleGame || isSubmitting}
                        >
                            Generate Today’s Puzzle
                        </Button>
                    </div>
                )}

                {dailyPuzzle && (
                    <Card className="minimal-card hover-lift mb-8">
                        <CardHeader className="border-b border-gray-200 bg-gray-50">
                            <CardTitle className="text-heading flex items-center gap-2 text-xl">
                                <span>📅</span>
                                Today's Puzzle -{' '}
                                {new Date().toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="mb-6 rounded-r-lg border-l-4 border-primary bg-blue-50 p-4">
                                <h3 className="text-subheading mb-3 text-lg">Today's Challenge</h3>
                                <p className="text-body leading-relaxed">{dailyPuzzle.question}</p>
                            </div>

                            {dailyPuzzle.solved ? (
                                <div className="mt-6 text-center font-semibold text-green-600">
                                    ✅ You've already solved today's puzzle!
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitDailyPuzzle} className="space-y-4">
                                    <div>
                                        <label className="text-subheading mb-2 block text-sm font-medium">
                                            Your Solution:
                                        </label>
                                        <div className="flex gap-3">
                                            <Input
                                                type="text"
                                                value={solution}
                                                onChange={e => setSolution(e.target.value.trim())}
                                                placeholder="Enter solution..."
                                                className="minimal-input focus-minimal h-12 text-center text-xl font-semibold"
                                            />
                                            <Button
                                                type="submit"
                                                className="minimal-button minimal-button-primary h-12 px-6 font-medium"
                                            >
                                                {isSubmitting ? 'Checking...' : 'Submit'}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Hint */}
                            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-warning">
                                        <span className="text-xs text-white">💡</span>
                                    </div>
                                    <div>
                                        <h4 className="text-subheading mb-1 text-sm font-medium">
                                            Hint
                                        </h4>
                                        <p className="text-body text-sm">{dailyPuzzle.hint}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Modals */}
            {isCreatingPuzzle && (
                <Loader
                    title="Creating Puzzle..."
                    description="Please wait while Otama is creating puzzle"
                />
            )}
            {isSubmittingSolution && (
                <Loader
                    title="Submitting Solution..."
                    description="Otama is verifying your solution, maybe you'll get a kibi dango, who knows"
                />
            )}
            {isLoadingPuzzle && (
                <Loader
                    title="Loading Daily Puzzle..."
                    description="Please wait while your daily puzzle is loading"
                />
            )}
            {showSuccess && (
                <Success
                    text="Great job! You solved today's puzzle."
                    earning={1000}
                    onClose={() => setShowSuccess(false)}
                />
            )}
            {showFailure && (
                <Failure hint={dailyPuzzle?.hint || ''} onClose={() => setShowFailure(false)} />
            )}
        </div>
    )
}
