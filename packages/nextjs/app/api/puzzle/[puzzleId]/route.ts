import { connectDB } from '~~/lib/mongo-db'
import Puzzle from '../model'

export async function GET(req: Request) {
    try {
        await connectDB()
        const { searchParams } = new URL(req.url)
        const puzzleId = searchParams.get('puzzleId')

        if (!puzzleId) {
            return Response.json({ error: 'Puzzle ID is required' }, { status: 400 })
        }

        const puzzle = await Puzzle.findOne({ puzzleId })

        if (!puzzle) {
            return Response.json({ error: 'Puzzle not found' }, { status: 404 })
        }

        return Response.json({ success: true, puzzle })
    } catch (err) {
        return Response.json(
            { success: false, error: err instanceof Error ? err.message : err },
            { status: 500 }
        )
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB()
        const { puzzleId, solver, solved } = await req.json()

        if (!puzzleId || !solver || typeof solved !== 'boolean') {
            return Response.json(
                { error: 'Puzzle ID, solver, and solved status are required' },
                { status: 400 }
            )
        }

        const updatedPuzzle = await Puzzle.findOneAndUpdate(
            { puzzleId },
            { $set: { solver, solved } },
            { new: true }
        )

        if (!updatedPuzzle) {
            return Response.json({ error: 'Puzzle not found' }, { status: 404 })
        }

        return Response.json({ success: true, puzzle: updatedPuzzle })
    } catch (err) {
        return Response.json({ error: err instanceof Error ? err.message : err }, { status: 500 })
    }
}
