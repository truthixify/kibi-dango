import { connectDB } from '~~/lib/mongo-db'
import Puzzle from './model'

export async function GET() {
    try {
        await connectDB()
        const puzzles = await Puzzle.find()
        return Response.json({ success: true, puzzles })
    } catch (err) {
        return Response.json(
            { success: false, error: err instanceof Error ? err.message : err },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        await connectDB()
        const { hint, solutionHash, rewardAmount, creator, puzzleId } = await req.json()

        if (!hint || !solutionHash || !rewardAmount || !creator || !puzzleId) {
            return Response.json({ error: 'All fields are required' }, { status: 400 })
        }

        if (rewardAmount <= 0) {
            return Response.json({ error: 'Reward amount must be greater than 0' }, { status: 400 })
        }

        const puzzle = new Puzzle({
            hint,
            solutionHash,
            rewardAmount,
            creator,
            puzzleId,
        })
        await puzzle.save()

        return Response.json({ success: true, puzzle })
    } catch (err) {
        return Response.json({ error: err instanceof Error ? err.message : err }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB()
        const { puzzleId, hint } = await req.json()

        const puzzle = await Puzzle.findOneAndUpdate({ puzzleId }, { hint }, { new: true })
        if (!puzzle) return Response.json({ error: 'Puzzle not found' }, { status: 404 })

        return Response.json({ success: true, puzzle })
    } catch (err) {
        return Response.json({ error: err instanceof Error ? err.message : err }, { status: 500 })
    }
}
