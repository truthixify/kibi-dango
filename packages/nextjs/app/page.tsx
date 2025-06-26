'use client'

import type React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '~~/components/ui/button'
import { Input } from '~~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card'
import { MinimalLoader } from '~~/components/minimal-loader'
import { MinimalSuccess } from '~~/components/minimal-success'
import { MinimalFailure } from '~~/components/minimal-failure'
import { useAccount } from '~~/hooks/useAccount'
import { RegistrationModal } from '~~/components/registration-modal'
import { createAIDailyPuzzle, generateAIPuzzle, getAIDailyPuzzle, getUserByAddress } from '~~/lib/api'
import { useScaffoldContract } from '~~/hooks/scaffold-stark/useScaffoldContract'
import { CairoCustomEnum, shortString, cairo } from 'starknet'
import { generateCryptoPuzzle } from '~~/lib/generate-puzzle'
import { useScaffoldEventHistory } from '~~/hooks/scaffold-stark/useScaffoldEventHistory'
import { useBlockNumber, useProvider } from '@starknet-react/core'

interface DailyPuzzle {
    puzzleId: string
    question: string
    salt: string
    solutionHash: string
    hint: string
}

export default function PuzzlePage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showFailure, setShowFailure] = useState(false)
    const [showRegistration, setShowRegistration] = useState(false)
    const [dailyPuzzle, setDailyPuzzle] = useState<DailyPuzzle | null>(null)
    const [solutionHash, setSolutionHash] = useState<string | null>(null)
    const [solution, setSolution] = useState<string>('')
    const { address, isConnected, account } = useAccount()
    const { data: blockNumber } = useBlockNumber()
    const { provider } = useProvider()
    const { data: puzzleGame } = useScaffoldContract({ contractName: 'PuzzleGame' })
    const { data: PuzzleCreatedEvent } = useScaffoldEventHistory({
        contractName: 'PuzzleGame',
        eventName: 'contracts::events::puzzle_game_events::PuzzleCreated',
        fromBlock: blockNumber ? BigInt(blockNumber) : 0n,
        watch: true,
        filters: {
            solution_commitment: solutionHash,
        },
    })

    const handleCreateDailyPuzzle = async () => {
        setIsSubmitting(true)
        if (!address || dailyPuzzle) return

        try {
            // Generate a new puzzle using the AI service
            const puzzle = await generateAIPuzzle(address)
            setSolutionHash(puzzle?.solutionHash)

            const difficulty_level = new CairoCustomEnum({ AI: {} })
            // Create the puzzle on-chain
            const tx = await puzzleGame?.create_puzzle(
                BigInt(puzzle?.solutionHash),
                difficulty_level,
                BigInt(1000),
            )
            // Get puzzle ID from the transaction event
            const puzzleId = PuzzleCreatedEvent[0].parsedArgs.puzzle_id.toString();

            // Put the puzzle data into the database
            const newPuzzle = await createAIDailyPuzzle(
                puzzleId,
                puzzle?.question,
                puzzle?.salt,
                puzzle?.hint,
                puzzle?.solutionHash,
                address,
            )
            // Set the daily puzzle state with the new puzzle data
            const dailyPuzzleData: DailyPuzzle = {
                puzzleId: newPuzzle.puzzleId,
                question: newPuzzle.question,
                salt: newPuzzle.salt,
                solutionHash: newPuzzle.solutionHash,
                hint: newPuzzle.hint,
            }

            setDailyPuzzle(dailyPuzzleData)
            setIsSubmitting(false)
            setShowSuccess(true)
        } catch (error) {
            setIsSubmitting(false)
            setShowFailure(true)

            console.error('Failed to fetch daily puzzle:', error)
        } finally {
            setShowSuccess(false)
            setShowFailure(false)   
        }

    }

    const handleSubmitDailyPuzzle = async (e: any) => {
        e.preventDefault()

        if (!solution) {
            // setShowFailure(true)
            return
        }

        // setIsSubmitting(true)
        if (!address || !dailyPuzzle) return
        console.log(dailyPuzzle, solution)
        console.log(cairo.felt(solution.toLowerCase()))

        try {
            // Submit the puzzle on-chain
            const tx = await puzzleGame?.submit_solution(
                2,
                // BigInt(dailyPuzzle?.puzzleId),
                cairo.felt(solution.toLowerCase()),
                BigInt(dailyPuzzle?.salt),
            )
            console.log('Transaction submitted:', tx)
            
        } catch (error) {
            console.error('Failed to fetch submit puzzle:', error)
        } finally { 
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            if (!address) return
            const user = await getUserByAddress(address)
            if (!user) setShowRegistration(true)
        }

        const fetchDailyPuzzle = async () => {
            if (!address) return
            try {
                const puzzle: DailyPuzzle = await getAIDailyPuzzle(address)
                if (puzzle) setDailyPuzzle(puzzle)
            } catch (error) {
                console.error('Failed to fetch daily puzzle:', error)
                setIsSubmitting(false)
            } finally {
                setIsSubmitting(false)
            }
        }

        fetchUser()
        fetchDailyPuzzle()
    }, [address])

    return (
        <div className="minimal-container py-8 lg:py-12">
            {isConnected && (
                <RegistrationModal
                    isOpen={showRegistration}
                    onClose={() => setShowRegistration(false)}
                />
            )}
            <div className="fade-in mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                        <span className="text-xl text-white">🧩</span>
                    </div>
                    <h1 className="text-heading mb-2 text-3xl">Daily Puzzle</h1>
                    <p className="text-body">Solve today's challenge and earn tokens</p>
                </div>

                {/* Generate Puzzle Button — only if not generated */}
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

                {/* Puzzle Card */}
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

                            <form onSubmit={(e) => handleSubmitDailyPuzzle(e)} className="space-y-4">
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
                                            // disabled={!answer || isSubmitting}
                                            className="minimal-button minimal-button-primary h-12 px-6 font-medium"
                                        >
                                            {isSubmitting ? 'Checking...' : 'Submit'}
                                        </Button>
                                    </div>
                                </div>
                            </form>

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
            {isSubmitting && <MinimalLoader />}
            {showSuccess && <MinimalSuccess />}
            {showFailure && <MinimalFailure />}
        </div>
    )
}
