import { Schema, model, models } from "mongoose";

const dailyPuzzleSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    date: {
      type: String,
      required: true, // Format: YYYY-MM-DD
    },
  },
  { timestamps: true },
);

const DailyPuzzle =
  models.DailyPuzzle || model("DailyPuzzle", dailyPuzzleSchema);

export default DailyPuzzle;
