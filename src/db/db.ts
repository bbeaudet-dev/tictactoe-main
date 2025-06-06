import express from 'express'
import cors from 'cors'
import { initialGameState, move, type Game } from '../game/game.ts'
import { gamesTable } from './schema'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { eq } from 'drizzle-orm'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

const url = process.env.DATABASE_URL
if (!url) {
    throw new Error('DATABASE_URL is not set')
}

const client = postgres(url, { ssl: { rejectUnauthorized: false } })
const db = drizzle(client)

// GET all games
app.get('/game/all', async (req, res) => {
    console.log('Getting all games...')
    try {
        const games = await db.select().from(gamesTable)
        console.log('Found games:', games)
        res.json(games)
    } catch (error) {
        console.error('Error getting games:', error)
        res.status(500).json({ error: 'Failed to get games' })
    }
})

// GET game by id
app.get('/game/:id', async (req, res) => {
    const id = req.params.id
    console.log('Getting game by id:', id)
    try {
        const result = await db.select()
            .from(gamesTable)
            .where(eq(gamesTable.id, id))
        if (result.length === 0) {
            console.log('Game not found')
            return res.status(404).json({ error: 'Failed to get game' })
        }
        console.log('Found game:', result[0])
        res.json(result[0])
    } catch (error) {
        console.error('Error getting game:', error)
        res.status(500).json({ error: 'Failed to get game' })
    }
})

// GET new game (create new game)
app.get('/game', async (req, res) => {
    console.log('Creating new game...')
    try {
        const newGame = initialGameState()
        console.log('New game created:', newGame)
        const result = await db.insert(gamesTable).values({
            id: newGame.id,
            board: newGame.board,
            currentPlayer: newGame.currentPlayer,
            endState: newGame.endState,
        }).returning()

        console.log('Game saved to database:', result[0]) // Add debug log
        res.json(result[0])
    } catch (error) {
        console.error('Error creating game:', error)
        res.status(500).json({ error: 'Failed to create game' })
    }
})

// POST new move (make move in a game)
app.post('/move', async (req, res) => {
    console.log('Move initiated:', req.body)
    const cellIndex = req.body.cellIndex
    const gameId = req.body.gameId
    try {
        const result = await db.select()
            .from(gamesTable)
            .where(eq(gamesTable.id, gameId))
        if (result.length === 0) {
            console.log('Game not found')
            return res.status(404).json({ error: 'Game not found' })
        }
        const game = result[0]
        const updatedGame = move(game, cellIndex)
        const savedGame = await db.update(gamesTable)
            .set({
                board: updatedGame.board,
                currentPlayer: updatedGame.currentPlayer,
                endState: updatedGame.endState,
            })
            .where(eq(gamesTable.id, gameId))
            .returning()
        console.log('Move saved:', savedGame[0])
        res.json(savedGame[0])
    } catch (error) {
        console.error('Error making move:', error)
        res.status(500).json({ error: 'Failed to make move' })
    }
})

app.listen(port, () => console.log(`Server running on port ${port}`))
