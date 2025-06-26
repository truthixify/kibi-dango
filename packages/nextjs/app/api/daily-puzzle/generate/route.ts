import { GoogleGenAI } from '@google/genai'
import { hash, shortString, cairo, stark } from 'starknet'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const address = searchParams.get('address')

        if (!address) {
            return Response.json({ error: 'User address is required' }, { status: 400 })
        }

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

        if (!response || !response.text) {
            throw new Error('No response from AI')
        }

        const jsonResponse = response.text
            .trim()
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```$/, '')
        console.log('Parsed AI response:', jsonResponse)

        let parsed
        try {
            parsed = JSON.parse(jsonResponse)
        } catch {
            throw new Error('Malformed AI response (invalid JSON)')
        }

        const { question, solution, hint } = parsed

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

        const salt = cairo.felt(stark.randomAddress()) // Convert to felt252 format
        const encoded = cairo.felt(solution.toLowerCase())
        const solutionHash = cairo.felt(hash.computePoseidonHashOnElements([encoded, salt]))

        return Response.json(
            {
                puzzle: {
                    question,
                    hint,
                    salt,
                    solutionHash,
                    date: new Date().toISOString().split('T')[0],
                },
            },
            { status: 200 }
        )
    } catch (err) {
        return Response.json(
            { success: false, error: err instanceof Error ? err.message : String(err) },
            { status: 500 }
        )
    }
}
