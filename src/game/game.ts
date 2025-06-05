export type Cell = Player | null
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
export type Player = 'o' | 'x'
export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type EndState = 'x' | 'o' | 'tie' | undefined

export type Game = {
    id: string
    board: Board,
    currentPlayer: Player,
    endState?: EndState,
}
export const initialGameState = (): Game => {
    return {
        id: crypto.randomUUID(),
        board: [null, null, null, null, null, null, null, null, null],
        currentPlayer: 'x',
    }
}

const winningStates: CellIndex[][] = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal from top-left to bottom-right
    [2, 4, 6]  // diagonal from top-right to bottom-left
]


const playerWins = (game: Game, player: Player) => {
    return winningStates.some((winState) => winState.every((cellIndex) => game.board[cellIndex] === player))
}
const xWins = (game: Game) => playerWins(game, 'x')
const oWins = (game: Game) => playerWins(game, 'o')

export function calculateEndState(game: Game): EndState {
    if (xWins(game)) return 'x'
    if (oWins(game)) return 'o'
    if (game.board.every((cell) => cell !== null)) return 'tie'
    return undefined
}

// accepts the current state of the game, and the index where the user is trying to make a move
export function move(game: Game, position: CellIndex): Game {
    if (game.board[position] != null) {
        console.log('that move is already taken!')
        return game
    }
    // make a copy of the game, so I can safely edit and mess around with it.
    // plausible nextGame state
    const nextGame = structuredClone(game)
    nextGame.board[position] = game.currentPlayer
    nextGame.currentPlayer = nextGame.currentPlayer === 'x' ? 'o' : 'x'
    nextGame.endState = calculateEndState(nextGame)
    return nextGame
}
