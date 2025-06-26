'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '~~/components/ui/card'
import { Loader } from 'lucide-react'
import { getAllPuzzles } from '~~/lib/api'

interface Puzzle {
    id: string
    puzzleId: string
    question: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    hint: string
    creator: string
    createdAt: string
    solved: boolean
}

export default function AllPuzzlesPage() {
    const [puzzles, setPuzzles] = useState<Puzzle[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPuzzles = async () => {
            try {
                const puzzles = await getAllPuzzles()
                setPuzzles(puzzles.filter((puzzle: any) => !puzzle.solved))
            } catch (err) {
                console.error('Failed to load puzzles:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchPuzzles()
    }, [])

    return (
        <div className="minimal-container py-10">
            <h1 className="text-heading mb-6 text-center text-3xl">🍡 Puzzle Marketplace</h1>
            <p className="text-muted mb-10 text-center">
                Pick a pirate's challenge and earn $KIBI for solving!
            </p>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : puzzles.length === 0 ? (
                <p className="text-subheading text-center">No puzzles have been posted yet.</p>
            ) : (
                <div className="m-4 grid grid-cols-1 gap-6 rounded-lg bg-base-100 shadow-md md:grid-cols-2 lg:grid-cols-3">
                    {puzzles.map(puzzle => (
                        <Link
                            key={puzzle.puzzleId}
                            href={`/puzzles/${puzzle.puzzleId}`}
                            className="no-underline"
                        >
                            <Card className="hover-lift cursor-pointer transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-xl">{puzzle.question}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted text-sm">
                                        🎯 Difficulty: {puzzle.difficulty}
                                    </p>
                                    <p className="text-muted text-sm">💡 Hint: {puzzle.hint}</p>
                                    <p className="mt-2 text-xs text-gray-500">
                                        🧑‍💻 Posted by {puzzle.creator}... on{' '}
                                        {new Date(puzzle.createdAt).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
