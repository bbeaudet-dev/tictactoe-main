import { describe, it, expect } from 'vitest'
import { initialGameState, move, type Game, type CellIndex } from './game'

describe('Tic Tac Toe Game', () => {
    describe('initialGameState', () => {
        it('should return a game with an empty board and x as the current player', () => {
            const game = initialGameState()

            expect(game.board).toEqual([null, null, null, null, null, null, null, null, null])
            expect(game.currentPlayer).toBe('x')
            expect(game.endState).toBeUndefined()
        })
    })

    describe('move', () => {
        it('should place the current player marker on the board', () => {
            const game = initialGameState()
            const nextGame = move(game, 4) // Center position

            expect(nextGame.board[4]).toBe('x')
        })

        it('should switch players after a move', () => {
            const game = initialGameState()
            const nextGame = move(game, 0)

            expect(nextGame.currentPlayer).toBe('o')
        })

        it('should not change the game state if the position is already taken', () => {
            const game = initialGameState()
            const gameAfterFirstMove = move(game, 0)
            const gameAfterInvalidMove = move(gameAfterFirstMove, 0)

            expect(gameAfterInvalidMove).toEqual(gameAfterFirstMove)
        })

        it('should detect a horizontal win for x', () => {
            let game = initialGameState()
            // X plays top row
            game = move(game, 0) // X at top-left
            game = move(game, 3) // O at middle-left
            game = move(game, 1) // X at top-middle
            game = move(game, 4) // O at center
            game = move(game, 2) // X at top-right

            expect(game.endState).toBe('x')
        })

        it('should detect a vertical win for o', () => {
            let game = initialGameState()
            // O wins on first column
            game = move(game, 1) // X at top-middle
            game = move(game, 0) // O at top-left
            game = move(game, 2) // X at top-right
            game = move(game, 3) // O at middle-left
            game = move(game, 8) // X at bottom-right
            game = move(game, 6) // O at bottom-left

            expect(game.endState).toBe('o')
        })

        it('should detect a diagonal win', () => {
            let game = initialGameState()
            // X wins on diagonal
            game = move(game, 0) // X at top-left
            game = move(game, 1) // O at top-middle
            game = move(game, 4) // X at center
            game = move(game, 2) // O at top-right
            game = move(game, 8) // X at bottom-right

            expect(game.endState).toBe('x')
        })

        it('should detect a tie', () => {
            let game = initialGameState()
            // Create a tie scenario
            // X | O | X
            // O | X | X
            // O | X | O
            game = move(game, 0) // X at top-left
            game = move(game, 1) // O at top-middle
            game = move(game, 2) // X at top-right
            game = move(game, 3) // O at middle-left
            game = move(game, 4) // X at center
            game = move(game, 6) // O at bottom-left
            game = move(game, 5) // X at middle-right
            game = move(game, 8) // O at bottom-right
            game = move(game, 7) // X at bottom-middle

            expect(game.endState).toBe('tie')
        })

        it('should not have an end state for an ongoing game', () => {
            let game = initialGameState()
            game = move(game, 0) // X at top-left
            game = move(game, 4) // O at center

            expect(game.endState).toBeUndefined()
        })
    })
})
