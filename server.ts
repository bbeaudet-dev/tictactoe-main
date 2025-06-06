import express from 'express'
import cors from 'cors'
import { initialGameState, move, type GameState } from './src/game/game.ts'
import { gamesTable } from './src/db/schema.ts'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { eq } from 'drizzle-orm'
import { PORT, SERVER_URL } from './src/utils/constants.ts'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const app = express()
const server = createServer(app)
const io = new Server(server)

const _dirname = dirname(fileURLToPath(import.meta.url))

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is not set')
const client = postgres(url, { ssl: { rejectUnauthorized: false } })
const db = drizzle(client)

// TEST
app.get('/', (_req, res) => {
    res.sendFile(join(_dirname, 'index.html'))
})

// GET all games
app.get('/all', async (_req, res) => {
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

// POST new game
app.post('/new', async (_req, res) => {
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
        console.log('Game saved to database:', result[0])
        res.json(result[0].id)
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
        const game = result[0] as unknown as GameState
        const updatedGame = move(game, cellIndex as any)
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

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    })
})

// app.listen(PORT, () => console.log(`Server running on ${SERVER_URL}`))

server.listen(PORT, () => {
    console.log(`Server running at ${SERVER_URL}`)
})