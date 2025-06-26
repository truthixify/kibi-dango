'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '~~/components/ui/button'
import { Input } from '~~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card'
import { Loader } from '~~/components/loader'
import { Success } from '~~/components/success'
import { Failure } from '~~/components/failure'
import { useAccount } from '~~/hooks/useAccount'
import { useScaffoldContract } from '~~/hooks/scaffold-stark/useScaffoldContract'
import { getASinglePuzzle, markPuzzleSolved } from '~~/lib/api'
import { cairo } from 'starknet'
import { useEffectOnce } from 'react-use'
import { useParams } from 'next/navigation'

interface Puzzle {
    puzzleId: string
    question: string
    salt: string
    solutionHash: string
    hint: string
    solved?: boolean
    rewardAmount: number
}

export default function PuzzleDetailPage() {
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
    const [solution, setSolution] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showFailure, setShowFailure] = useState(false)
    const [loading, setLoading] = useState(true)

    const { address } = useAccount()
    const { data: puzzleGame } = useScaffoldContract({ contractName: 'PuzzleGame' })

    const params = useParams()
    const puzzleId = params?.puzzleId as string

    useEffectOnce(() => {
        const fetchPuzzle = async () => {
            if (!puzzleId) return
            try {
                const puzzle = await getASinglePuzzle(puzzleId)
                setPuzzle(puzzle)
            } catch (err) {
                console.error('Error loading puzzle:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchPuzzle()
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!puzzle || !solution || !address) return
        setIsSubmitting(true)

        try {
            const tx = await puzzleGame?.submit_solution(
                BigInt(puzzle.puzzleId),
                cairo.felt(solution.toLowerCase()),
                BigInt(puzzle.salt)
            )
            if (tx) {
                await markPuzzleSolved(address, puzzle.puzzleId)
                setPuzzle({ ...puzzle, solved: true })
                setShowSuccess(true)
            }
        } catch (err) {
            console.error('Submission failed:', err)
            setShowFailure(true)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <Loader title="Loading Puzzle" description="Please wait while we fetch the puzzle..." />
        )
    }

    if (!puzzle) {
        return <div className="mt-12 text-center text-gray-500">Puzzle not found</div>
    }

    return (
        <div className="minimal-container py-8 lg:py-12">
            <div className="fade-in mx-auto max-w-3xl">
                <Card className="minimal-card hover-lift mb-8">
                    <CardHeader className="border-b border-gray-200 bg-gray-50">
                        <CardTitle className="text-heading flex items-center gap-2 text-xl">
                            <span>🧠</span> Puzzle Challenge
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="mb-6 rounded-r-lg border-l-4 border-primary bg-blue-50 p-4">
                            <h3 className="text-subheading mb-3 text-lg">Challenge</h3>
                            <p className="text-body leading-relaxed">{puzzle.question}</p>
                        </div>

                        {puzzle.solved ? (
                            <div className="mt-6 text-center font-semibold text-green-600">
                                ✅ Puzzle already solved!
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <label className="text-subheading block text-sm font-medium">
                                    Your Answer
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
                                        className="minimal-button minimal-button-primary h-12 px-6"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </div>
                            </form>
                        )}

                        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-warning">
                                    <span className="text-xs text-white">💡</span>
                                </div>
                                <div>
                                    <h4 className="text-subheading mb-1 text-sm font-medium">
                                        Hint
                                    </h4>
                                    <p className="text-body text-sm">{puzzle.hint}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {showSuccess && (
                <Success
                    text="Great job! You solved today's puzzle."
                    earning={puzzle.rewardAmount}
                    onClose={() => setShowSuccess(false)}
                />
            )}
            {showFailure && (
                <Failure hint={puzzle?.hint || ''} onClose={() => setShowFailure(false)} />
            )}
        </div>
    )
}
