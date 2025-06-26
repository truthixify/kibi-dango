import { connectDB } from '~~/lib/mongo-db'
import Puzzle from './model'
import User from '../user/model'

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

        const { question, hint, solutionHash, rewardAmount, creator, puzzleId, salt, difficulty } =
            await req.json()

        if (
            !question ||
            !hint ||
            !solutionHash ||
            !rewardAmount ||
            !creator ||
            !puzzleId ||
            !salt ||
            (difficulty && !['Easy', 'Medium', 'Hard'].includes(difficulty))
        ) {
            return Response.json({ error: 'All fields are required' }, { status: 400 })
        }

        if (rewardAmount <= 0) {
            return Response.json({ error: 'Reward amount must be greater than 0' }, { status: 400 })
        }

        const user = await User.findOne({ address: creator.toLowerCase() })

        if (!user) {
            return Response.json({ error: 'User not found with this address' }, { status: 404 })
        }

        const puzzle = new Puzzle({
            hint,
            solutionHash,
            rewardAmount,
            creator: user.username,
            puzzleId,
            question,
            salt,
            difficulty: difficulty || 'Easy',
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

        const { puzzleId, solver, solved } = await req.json()

        if (!puzzleId || typeof solved !== 'boolean' || !solver) {
            return Response.json(
                { error: 'puzzleId, solver, and solved status are required' },
                { status: 400 }
            )
        }

        const puzzle = await Puzzle.findOneAndUpdate(
            { puzzleId },
            { $set: { solved, solver } },
            { new: true }
        )

        if (!puzzle) {
            return Response.json({ error: 'Puzzle not found' }, { status: 404 })
        }

        return Response.json({ success: true, puzzle })
    } catch (err) {
        return Response.json({ error: err instanceof Error ? err.message : err }, { status: 500 })
    }
}
