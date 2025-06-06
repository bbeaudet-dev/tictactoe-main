import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { CellIndex, GameState } from '../../game/game.ts'
import './GameView.css'
import { SERVER_URL } from '../../utils/constants.ts'

function GameView() {
    const { gameId } = useParams()
    const [gameState, setGameState] = useState<GameState | null>(null)

    useEffect(() => {
        if (gameId) {
            fetch(`${SERVER_URL}/game/${gameId}`)
                .then(res => res.json())
                .then(res => setGameState(res))
        }
    }, [gameId])

    const cellClick = (cellIndex: CellIndex) => {
        if (gameState?.endState) return
        fetch(`${SERVER_URL}/move`, {
            method: "POST",
            body: JSON.stringify({ cellIndex: cellIndex, gameId: gameState?.id }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => setGameState(res))
    }

    return (
        <>
            <GameBoard />
            <Messages />
        </>
    )


    function GameBoard() {
        const isLoading = !gameState
        return (
            <div className="game-board">
                {isLoading && "Loading..."}
                {!isLoading &&
                    <>
                        <div className="board-row">
                            <div onClick={() => cellClick(0)} className={`cell ${gameState.board[0]?.toLowerCase() || ''}`} >{gameState.board[0]}</div>
                            <div onClick={() => cellClick(1)} className={`cell ${gameState.board[1]?.toLowerCase() || ''}`} >{gameState.board[1]}</div>
                            <div onClick={() => cellClick(2)} className={`cell ${gameState.board[2]?.toLowerCase() || ''}`} >{gameState.board[2]}</div>
                        </div>
                        <div className="board-row">
                            <div onClick={() => cellClick(3)} className={`cell ${gameState.board[3]?.toLowerCase() || ''}`} >{gameState.board[3]}</div>
                            <div onClick={() => cellClick(4)} className={`cell ${gameState.board[4]?.toLowerCase() || ''}`} >{gameState.board[4]}</div>
                            <div onClick={() => cellClick(5)} className={`cell ${gameState.board[5]?.toLowerCase() || ''}`} >{gameState.board[5]}</div>
                        </div>
                        <div className="board-row">
                            <div onClick={() => cellClick(6)} className={`cell ${gameState.board[6]?.toLowerCase() || ''}`} >{gameState.board[6]}</div>
                            <div onClick={() => cellClick(7)} className={`cell ${gameState.board[7]?.toLowerCase() || ''}`} >{gameState.board[7]}</div>
                            <div onClick={() => cellClick(8)} className={`cell ${gameState.board[8]?.toLowerCase() || ''}`} >{gameState.board[8]}</div>
                        </div>
                    </>}
            </div >
        )
    }

    function Messages() {
        return (
            <>
                {gameState?.endState && <div>{gameState.endState}</div>}
                <p>Current game ID: {gameState?.id}</p>
            </>
        )
    }

}

export default GameView
