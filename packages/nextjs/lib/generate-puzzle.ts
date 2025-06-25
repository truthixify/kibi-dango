import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { hash, stark, shortString } from "starknet";

type AIPuzzle = {
  prompt: string;
  solution: string;
  solutionHash: string;
  salt: string;
  hint: string;
};

const genai = new GoogleGenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCryptoPuzzle() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    responseMimeType: "text/plain",
  };
  const model = "gemini-2.5-flash";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `You are a master puzzle crafter specializing in blockchain and cryptography concepts. Your goal is to create original, clever, and intellectually stimulating puzzles designed for crypto enthusiasts.

Guidelines:
- Each puzzle should reference a specific concept, process, or term from the world of cryptography or blockchain.
- Ensure puzzles are diverse. Explore topics such as hashing, consensus mechanisms, zero-knowledge proofs, smart contracts, DeFi, digital signatures, tokenomics, wallets, NFTs, privacy protocols, oracles, L2 scaling, etc.
- Avoid repeating the same ideas (e.g., mining, Merkle trees) too often.
- Use analogies, wordplay, or metaphors to make puzzles interesting, while still solvable by someone with basic crypto knowledge.
- Each puzzle must focus on a **single-word answer** (no spaces, ideally a technical term or jargon).
- Solutions should be factual and unambiguous.

Your output **must** be a valid JSON object with the following keys:
- "question": A short, clever crypto-themed puzzle or riddle.
- "solution": The one-word correct answer (no spaces).
- "hint": A helpful clue that nudges the player toward the right idea.

Example:
{
  "question": "I'm the silent proof that lets you convince others without revealing your secret. What am I?",
  "solution": "zkp",
  "hint": "Used in privacy-preserving systems like Tornado Cash or Zcash."
}`,
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });

  if (!response) {
    throw new Error("No response from AI");
  }

  const jsonResponse = response.text
    ?.trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/, "");

  let json;
  try {
    json = JSON.parse(jsonResponse || "");
  } catch (err) {
    throw new Error("Malformed AI response (invalid JSON)");
  }

  const { question, solution, hint } = json;

  if (
    !question ||
    !solution ||
    !hint ||
    typeof question !== "string" ||
    typeof solution !== "string" ||
    typeof hint !== "string" ||
    solution.includes(" ")
  ) {
    throw new Error("Invalid puzzle format from AI");
  }

  const solutionField = shortString.encodeShortString(solution.toLowerCase());
  const salt = stark.randomAddress();
  const solutionHash = hash.computePoseidonHashOnElements([
    BigInt(solutionField),
    BigInt(salt),
  ]);

  return {
    question,
    solution: solutionField,
    solutionHash,
    salt,
    hint,
  };
}
