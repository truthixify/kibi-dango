import { connectDB } from '~~/lib/mongo-db'
import User from './model'

export async function GET() {
    try {
        await connectDB()
        const users = await User.find()
        return Response.json({ success: true, users })
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
        const { address, username } = await req.json()

        if (!address || !username) {
            return Response.json({ error: 'Address and username are required' }, { status: 400 })
        }

        const exists = await User.findOne({ username })
        if (exists) {
            return Response.json({ error: 'Username already taken' }, { status: 409 })
        }

        const user = new User({ address, username })
        await user.save()

        return Response.json({ success: true, user })
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
        const { username } = await req.json()

        if (!username) {
            return Response.json({ error: 'Address and username are required' }, { status: 400 })
        }

        const user = await User.findOneAndUpdate({ username }, { new: true })
        if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

        return Response.json({ success: true, user })
    } catch (err) {
        return Response.json({ error: err instanceof Error ? err.message : err }, { status: 500 })
    }
}
