export async function getUserByAddress(address: string) {
    try {
        const res = await fetch(`/api/user/${address}`)
        if (!res.ok) throw new Error('Failed to fetch user')
        const resJson = await res.json()
        return resJson.user || null
    } catch (error) {
        console.error('getUserByAddress error:', error)
        return null
    }
}

export async function registerUser(address: string, username: string) {
    try {
        const res = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address, username }),
        })

        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || 'Failed to register user')
        }

        const reJson = await res.json()
        return reJson.user || null
    } catch (error) {
        console.error('registerUser error:', error)
        throw error
    }
}

export const getAllUsers = async () => {
    try {
        const res = await fetch('/api/user')
        if (!res.ok) throw new Error('Failed to fetch users')
        const resJson = await res.json()
        return resJson.users || []
    } catch (error) {
        console.error('getAllUsers error:', error)
        throw error
    }
}

export async function getAIDailyPuzzle(address: string) {
    try {
        const res = await fetch(`/api/daily-puzzle?address=${address}`)
        if (!res.ok) throw new Error('Failed to fetch daily puzzle')
        const resJson = await res.json()
        return resJson.puzzle || null
    } catch (error) {
        console.error('getDailyPuzzle error:', error)
        throw error
    }
}

export async function createAIDailyPuzzle(
    puzzleId: string,
    question: string,
    salt: string,
    hint: string,
    solutionHash: string,
    address: string
) {
    try {
        const res = await fetch('/api/daily-puzzle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ solutionHash, puzzleId, question, salt, hint, address }),
        })

        const resJson = await res.json()
        return resJson.puzzle || null
    } catch (error) {
        console.error('createPuzzle error:', error)
        throw error
    }
}

export async function updateAIDailyPuzzle(address: string) {
    try {
        const res = await fetch('/api/daily-puzzle', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address }),
        })

        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || 'Failed to update puzzle')
        }
        const reJson = await res.json()
        return reJson.puzzle || null
    } catch (error) {
        console.error('updateAIDailyPuzzle error:', error)
        throw error
    }
}

export const generateAIPuzzle = async (address: string) => {
    try {
        const res = await fetch(`/api/daily-puzzle/generate?address=${address}`)
        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || 'Failed to generate puzzle')
        }

        return data.puzzle
    } catch (err) {
        console.error('Puzzle generation failed:', err)
        return null
    }
}

export const getPuzzle = async (puzzleId: string) => {
    try {
        const res = await fetch(`/api/puzzles/${puzzleId}`)
        if (!res.ok) throw new Error('Failed to fetch puzzle')
        const resJson = await res.json()
        return resJson.puzzle || null
    } catch (error) {
        console.error('getPuzzle error:', error)
        throw error
    }
}

export const createPuzzle = async (
    puzzleId: string,
    question: string,
    hint: string,
    solutionHash: string,
    salt: string,
    rewardAmount: number,
    creator: string,
    difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy'
) => {
    try {
        const res = await fetch('/api/puzzles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                puzzleId,
                question,
                hint,
                solutionHash,
                rewardAmount,
                creator,
                salt,
                difficulty,
            }),
        })

        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || 'Failed to create puzzle')
        }

        return await res.json()
    } catch (error) {
        console.error('createPuzzle error:', error)
        throw error
    }
}

export const updatePuzzle = async (puzzleId: string, solver: string, solved: boolean) => {
    try {
        const res = await fetch('/api/puzzles', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ puzzleId, solver, solved }),
        })

        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || 'Failed to update puzzle')
        }

        return await res.json()
    } catch (error) {
        console.error('updatePuzzle error:', error)
        throw error
    }
}

export const getAllPuzzles = async () => {
    try {
        const res = await fetch('/api/puzzles/')
        if (!res.ok) throw new Error('Failed to fetch puzzles')
        const resJson = await res.json()
        return resJson.puzzles || []
    } catch (error) {
        console.error('getAllPuzzles error:', error)
        throw error
    }
}

export const getASinglePuzzle = async (puzzleId: string) => {
    try {
        const res = await fetch(`/api/puzzles/${puzzleId}`)
        if (!res.ok) throw new Error('Failed to fetch puzzle')
        const resJson = await res.json()
        return resJson.puzzle || null
    } catch (error) {
        console.error('getASinglePuzzle error:', error)
        throw error
    }
}

export const markPuzzleSolved = async (solver: string, puzzleId: string) => {
    try {
        const res = await fetch(`/api/puzzles/${puzzleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ solver, puzzleId }),
        })

        if (!res.ok) {
            throw new Error('Failed to mark puzzle as solved')
        }

        const resJson = await res.json()
        return resJson.puzzle || null
    } catch (error) {
        console.error('markPuzzleSolved error:', error)
        throw error
    }
}
