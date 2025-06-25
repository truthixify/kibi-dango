import { connectDB } from "~~/lib/mongo-db";
import DailyPuzzle from "./model";
import User from "../user/model";
import { generateCryptoPuzzle } from "~~/lib/generate-puzzle";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return Response.json(
        { error: "User address is required" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ address });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const today = new Date().toISOString().split("T")[0];

    let daily = await DailyPuzzle.findOne({ user: user._id, date: today });

    if (!daily) {
      const aiPuzzleData = await generateCryptoPuzzle();

      if (!aiPuzzleData) {
        throw new Error("Failed to generate puzzle data from AI service.");
      }

      daily = new DailyPuzzle({
        user: user._id,
        question: aiPuzzleData.question,
        salt: aiPuzzleData.salt,
        solutionHash: aiPuzzleData.solutionHash,
        hint: aiPuzzleData.hint,
        date: today,
      });

      await daily.save();
    }

    return Response.json(
      {
        puzzle: {
          question: daily.question,
          hint: daily.hint,
          salt: daily.salt,
          solutionHash: daily.solutionHash,
          date: daily.date,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { success: false, error: err instanceof Error ? err.message : err },
      { status: 500 },
    );
  }
}
