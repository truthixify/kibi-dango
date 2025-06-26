import { GoogleGenAI } from '@google/genai'
import { hash, stark, shortString } from 'starknet'

export async function generateCryptoPuzzle() {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    })
    const config = {
        thinkingConfig: {
            thinkingBudget: -1,
        },
        responseMimeType: 'text/plain',
    }
    const model = 'gemini-2.5-flash'
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: process.env.PROMPT,
                },
            ],
        },
        {
            role: 'user',
            parts: [
                {
                    text: `INSERT_INPUT_HERE`,
                },
            ],
        },
    ]

    const response = await ai.models.generateContent({
        model,
        config,
        contents,
    })

    if (!response) {
        throw new Error('No response from AI')
    }
    console.log(response.text)

    const jsonResponse = response.text
        ?.trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/, '')

    console.log('Parsed AI response:', jsonResponse)

    let json
    try {
        json = JSON.parse(jsonResponse || '')
    } catch (err) {
        throw new Error('Malformed AI response (invalid JSON)')
    }

    const { question, solution, hint } = json

    if (
        !question ||
        !solution ||
        !hint ||
        typeof question !== 'string' ||
        typeof solution !== 'string' ||
        typeof hint !== 'string' ||
        solution.includes(' ')
    ) {
        throw new Error('Invalid puzzle format from AI')
    }

    const solutionField = shortString.encodeShortString(solution.toLowerCase())
    const salt = stark.randomAddress()
    const solutionHash = hash.computePoseidonHashOnElements([BigInt(solutionField), BigInt(salt)])

    return {
        question,
        solution: solutionField,
        solutionHash,
        salt,
        hint,
    }
}
