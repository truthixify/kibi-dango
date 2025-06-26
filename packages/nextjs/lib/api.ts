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

        return await res.json()
    } catch (error) {
        console.error('registerUser error:', error)
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