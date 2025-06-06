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

// // get all games
// app.get('/game/all', async (req, res) => {
//     console.log('Creating new game...')
//     try{
//         const games = await db.select().from(gamesTable)
//         res.json(games)
//     } catch (error) {
//         console.error('Error getting games:',error)
//         res.status(500).json({error: 'Failed to get games'})
//     }
// })

// // get game by id
// app.get('/game/:id', (req, res) => {
//     const id = req.params.id
//     const game = games.get(id)
//     res.json(game)
// })

// create new game
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

// // make move
// app.post('/move', (req, res) => {
//     const cellIndex = req.body.cellIndex
//     const gameId = req.body.gameId
//     let game = games.get(gameId)
//     if (game === undefined) {
//         throw new Error("You didn't initialize the game!")
//     }
//     game = move(game, cellIndex)
//     games.set(game.id, game)
//     res.json(game)
//     console.log('Move made on ', game)
// })

app.listen(port, () => console.log(`Server running on port ${port}`))
