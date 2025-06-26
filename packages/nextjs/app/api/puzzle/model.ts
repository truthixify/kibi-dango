import { Schema, model, models } from 'mongoose'

const puzzleSchema = new Schema(
    {
        puzzleId: {
            type: String,
            required: true,
            unique: true,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        hint: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
            required: true,
        },
        solutionHash: {
            type: String,
            required: true,
        },
        rewardAmount: {
            type: Number,
            required: true,
            validate: {
                validator: (v: number) => v > 0,
                message: 'Reward amount must be greater than 0',
            },
        },
        solved: {
            type: Boolean,
            default: false,
        },
        solver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    { timestamps: true }
)

const Puzzle = models.Puzzle || model('Puzzle', puzzleSchema)
export default Puzzle
