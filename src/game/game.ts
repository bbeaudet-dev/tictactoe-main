export type Cell = Player | null
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
export type Player = 'O' | 'X'
export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type EndState = 'X' | 'O' | 'tie' | undefined

export type GameState = {
    id: string
    board: Board,
    currentPlayer: Player,
    endState?: EndState,
}
export const initialGameState = (): GameState => {
    return {
        id: crypto.randomUUID(),
        board: [null, null, null, null, null, null, null, null, null],
        currentPlayer: 'X',
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


const playerWins = (game: GameState, player: Player) => {
    return winningStates.some((winState) => winState.every((cellIndex) => game.board[cellIndex] === player))
}
const xWins = (game: GameState) => playerWins(game, 'X')
const oWins = (game: GameState) => playerWins(game, 'O')

export function calculateEndState(game: GameState): EndState {
    if (xWins(game)) return 'X'
    if (oWins(game)) return 'O'
    if (game.board.every((cell) => cell !== null)) return 'tie'
    return undefined
}

// accepts the current state of the game, and the index where the user is trying to make a move
export function move(game: GameState, position: CellIndex): GameState {
    if (game.board[position] != null) {
        console.log('that move is already taken!')
        return game
    }
    // make a copy of the game, so I can safely edit and mess around with it.
    // plausible nextGame state
    const nextGame = structuredClone(game)
    nextGame.board[position] = game.currentPlayer
    nextGame.currentPlayer = nextGame.currentPlayer === 'X' ? 'O' : 'X'
    nextGame.endState = calculateEndState(nextGame)
    return nextGame
}
