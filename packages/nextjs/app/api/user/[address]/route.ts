import { connectDB } from '~~/lib/mongo-db'
import User from '../model'

export async function GET(_req: Request, { params }: { params: { address: string } }) {
    try {
        await connectDB()

        const { address } = await params

        if (!address) {
            return Response.json({ error: 'Address is required' }, { status: 400 })
        }

        const user = await User.findOne({ address: address.toLowerCase() })

        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 })
        }

        return Response.json({ user }, { status: 200 })
    } catch (err) {
        return Response.json(
            { success: false, error: err instanceof Error ? err.message : err },
            { status: 500 }
        )
    }
}
