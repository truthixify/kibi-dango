import { connectDB } from '~~/lib/mongo-db'
import DailyPuzzle from './model'
import User from '../user/model'

export async function POST(req: Request) {
    try {
        await connectDB()
        const body = await req.json()
        const { puzzleId, address, question, hint, salt, solutionHash } = body

        if (!puzzleId || !address || !question || !hint || !salt || !solutionHash) {
            return Response.json(
                {
                    error: 'Missing required fields: puzzleId, address, question, hint, salt, solutionHash',
                },
                { status: 400 }
            )
        }

        const user = await User.findOne({ address })
        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 })
        }

        const today = new Date().toISOString().split('T')[0]

        // Check if a puzzle already exists for today
        const existing = await DailyPuzzle.findOne({ user: user._id, date: today })
        if (existing) {
            return Response.json({ error: 'Puzzle for today already exists' }, { status: 409 })
        }

        const newPuzzle = new DailyPuzzle({
            user: user._id,
            puzzleId,
            question,
            hint,
            salt,
            solutionHash,
            date: today,
        })

        await newPuzzle.save()

        return Response.json({ success: true, puzzle: newPuzzle }, { status: 201 })
    } catch (err) {
        return Response.json(
            { success: false, error: err instanceof Error ? err.message : err },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    try {
        await connectDB()

        const { searchParams } = new URL(req.url)
        const address = searchParams.get('address')

        if (!address) {
            return Response.json({ error: 'User address is required' }, { status: 400 })
        }

        const user = await User.findOne({ address })
        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 })
        }

        const today = new Date().toISOString().split('T')[0]

        const daily = await DailyPuzzle.findOne({ user: user._id, date: today })
        if (!daily) {
            return Response.json({ error: 'Puzzle not found for today' }, { status: 404 })
        }

        return Response.json(
            {
                puzzle: {
                    puzzleId: daily.puzzleId,
                    question: daily.question,
                    hint: daily.hint,
                    salt: daily.salt,
                    solutionHash: daily.solutionHash,
                    date: daily.date,
                    solved: daily.solved,
                },
            },
            { status: 200 }
        )
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

        const body = await req.json()
        const { address } = body

        if (!address) {
            return Response.json({ error: 'User address is required' }, { status: 400 })
        }

        const user = await User.findOne({ address })
        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 })
        }

        const today = new Date().toISOString().split('T')[0]

        const updatedPuzzle = await DailyPuzzle.findOneAndUpdate(
            { user: user._id, date: today },
            { solved: true },
            { new: true }
        )

        if (!updatedPuzzle) {
            return Response.json({ error: 'No puzzle found for today' }, { status: 404 })
        }

        return Response.json({ success: true, puzzle: updatedPuzzle }, { status: 200 })
    } catch (err) {
        return Response.json(
            { success: false, error: err instanceof Error ? err.message : err },
            { status: 500 }
        )
    }
}
