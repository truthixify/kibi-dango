import { connectDB } from '~~/lib/mongo-db'
import Puzzle from '../model'
import User from '../../user/model'

export async function GET(req: Request, { params }: { params: { puzzleId: string } }) {
    try {
        await connectDB()
        const { puzzleId } = await params

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
        const { puzzleId, solver } = await req.json()

        if (!puzzleId || !solver) {
            return Response.json(
                { error: 'Puzzle ID, solver, and solved status are required' },
                { status: 400 }
            )
        }

        const user = await User.findOne({ address: solver.toLowerCase() })

        if (!user) {
            return Response.json({ error: 'User not found with this address' }, { status: 404 })
        }

        const updatedPuzzle = await Puzzle.findOneAndUpdate(
            { puzzleId },
            { $set: { solver: user.username, solved: true } },
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
