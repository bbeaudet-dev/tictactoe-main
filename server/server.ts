import express from 'express'
import cors from 'cors'
import { initialGameState, move, type Game } from '../src/game/game.ts'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

// Map<id, Game>
const games = new Map<string, Game>()

// get all games
app.get('/game/all', (req, res) => {
    console.log('"games list: ", games')
    res.json([...games])
})

// get game by id
app.get('/game/:id', (req, res) => {
    const id = req.params.id
    const game = games.get(id)
    res.json(game)
})

// create new game
app.get('/game', (req, res) => {
    const initializedGame: Game = initialGameState()
    games.set(initializedGame.id, initializedGame)
    res.json(initializedGame)
    console.log('Game created')
})

// make move
app.post('/move', (req, res) => {
    const cellIndex = req.body.cellIndex
    const gameId = req.body.gameId
    let game = games.get(gameId)
    if (game === undefined) {
        throw new Error("You didn't initialize the game!")
    }
    game = move(game, cellIndex)
    games.set(game.id, game)
    res.json(game)
    console.log('Move made on ', game)
})

app.listen(port, () => console.log(`Server running on port ${port}`))